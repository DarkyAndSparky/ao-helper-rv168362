include Java

require './config.rb'
require './tools.rb'
require './jarTools.rb'

require 'erb'

# Usage: [<in path>] [<out path>]

begin

  # redefine input and output paths
  $config[:inPath]  = ARGV[0] if ARGV.size >= 1
  $config[:outPath] = ARGV[1] if ARGV.size >= 2

  [:inPath, :changeLogPath, :scriptPath, :outPath, :logPath, :runPath].each { |key|
    $config[key] = File.expand_path($config[key])
    if $config[key] !~ /(\\|\/)$/
      $config[key] = $config[key] + '/'
    end
  }

  extractSars(addTailingSlash($config[:inPath]) + "logserverEAR.ear", $config[:inPath])
  extractSars(addTailingSlash($config[:inPath]) + "gametoolEAR.ear", $config[:inPath])

  jarSearcher = JarSearcher.new($config[:inPath], 'vendor/')

  # some jars excluded from obfuscation but still needed
  excludeJars = Hash.new
  $config[:excludedJars].split(/\s+/).each { |excludeJar|
    excludeJars[excludeJar] = true
  }

  # some jars should be skipped
  skipJars = Hash.new
  $config[:skippedJars].split(/\s+/).each { |skipJar|
    skipJars[skipJar] = true
  }

  # determine class path

  classPath = "classpath\n"
  jarSearcher.vendorJars.each { |jarName|
    classPath += "  \"#{jarName}\"\n"
  }

  obfuscateJars = Hash.new
  jarHandler = JarHandler.new

  jarSearcher.projectJars.each { |jarName|
    if !skipJars.key?(jarName)
      fullName = $config[:inPath] + jarName
      if excludeJars.key?(jarName)
        classPath += "  \"#{fullName}\"\n"
      else
        obfuscateJars[jarName] = true
        jarHandler.handleJar(fullName)
      end
    end
  }
  classPath += ";\n\n"

  # determine open list

  openList = "open\n"
  obfuscateJars.each { |jarName, dummy|
    openList += "  \"#{$config[:inPath]}#{jarName}\"\n"
  }
  openList += ";\n\n"

  nowStr = Time.now.strftime('%Y-%m-%d-%H-%M-%S')

  # prepare exclude rules

  excludeRules = readContent("templates/excludeRules.txt")

  excludeRules += getResourceClasses('templates/resourceClasses.txt')

  # exclude rules made by jars

  excluded = ''
  jarHandler.excludes.each { |excludeRule|
    excluded += " and\n" if excluded != ''
    excluded += "  " + excludeRule
  }
  excluded += ";\n\n"

  excludeRules += excluded

  tail = ERB.new(readContent("templates/tail.txt"))
  params = {
    :outChangeLog => "#{$config[:changeLogPath]}ChangeLog-#{nowStr}.txt",
    :outPath => $config[:outPath]
  }
  tail = tail.result(binding)

  scriptName = $config[:scriptPath] + "script-#{nowStr}.txt"

  File.open(scriptName, "w") { |f|
    f.write classPath
    f.write openList
    f.write excludeRules
    f.write tail
  }

  logBase = $config[:logPath] + nowStr

  runCmd = "#{$config[:run]} \"#{scriptName}\" 1>\"#{logBase}.log\" 2>\"#{logBase}.err\""

  removeJars($config[:outPath])

  curDir = File.expand_path(Dir.getwd)
  Dir.chdir($config[:runPath])
  system(runCmd)
  result = $?
  Dir.chdir(curDir)
  puts result
rescue Exception => e
  puts "Exception occured: #{e.message}"
  exit(1)
end

exit(result.to_i)
