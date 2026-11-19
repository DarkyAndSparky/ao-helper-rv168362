include Java
require 'ftools'
require './jarTools.rb'

def checkDir(dir)
  if dir !~ /\/$/ && dir !~ /\\$/
    dir += '/'
  end
  dir
end

def readRootJars(jarName)
  jars = Hash.new
  jar = java.util.jar.JarFile.new(jarName)
  jar.entries.each { |entry|
    if entry.name =~ /^([^\/]+\.\w+)$/
      jars[entry.name] = true
    end
  }
  jars
end

def unjar(jarName, destDir)
  destDir = checkDir(destDir)

  buf = Java::byte[4096].new

  jar = JarFile.new(jarName)
  jar.entries.each { |entry|
    if entry.isDirectory
      File.makedirs destDir + entry.name
    else
      from = jar.getInputStream(entry)
      to   = FileOutputStream.new(destDir + entry.name)
      begin
        while true
          got = from.read(buf)
          if got > 0
            to.write(buf, 0, got)
          else
            break
          end
        end
      rescue
        from.close
        to.close
      end
    end
  }
end

if ARGV.size != 3
  puts "Usage: <obfuscated jars directory> <original ear file> <new ear file>"
  exit 1
end

def copyFile(source, dest)
  if !File.copy(source, dest)
    raise IOError.new("Failed to copy file from '#{source}' to '#{dest}'")
  end
end

begin 
  jarDir  = ARGV[0]
  ear     = ARGV[1]
  newEar  = ARGV[2]

  jarDir = checkDir(jarDir)

  if ear =~ /gametoolEAR\.ear$/i
    puts "Copying gametoolSAR.jar to .sar"
                         
    copyFile(jarDir + 'gametoolSAR.jar', jarDir + 'gametoolSAR.sar')
  end

  tempDir = jarDir + Time.now.strftime('%Y-%m-%d-%H-%M-%S') + '/'
  File.makedirs tempDir

  puts "Reading jar names from .ear"

  jars = readRootJars(ear)

  puts "Unpacking .ear to #{tempDir}"

  unjar(ear, tempDir)

  puts "Replacing obfuscated files"

  Dir.new(jarDir).each do |name|
    if jars.key?(name)
      puts name

      copyFile(jarDir + name, tempDir + name)
    end
  end

  puts "Making new .ear file #{newEar}"

  jarrer = JarMaker.new
  jarrer.makeJar(tempDir, newEar)
rescue Exception => e
  puts "Exception occured: #{e.message}"
  exit 2
end

exit 0