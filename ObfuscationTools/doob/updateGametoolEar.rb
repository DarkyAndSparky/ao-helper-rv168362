include Java
require 'ftools'
require './jarTools.rb'

JarFile = java.util.jar.JarFile
FileOutputStream = java.io.FileOutputStream

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

if ARGV.size != 2
  puts "Usage: <obfuscated jars directory> <original gametoolEAR.ear>"
  exit
end

jarDir  = ARGV[0]
ear     = ARGV[1]

jarDir = checkDir(jarDir)

puts "Copying gametoolSAR.jar to .sar"
                       
File.copy(jarDir + 'gametoolSAR.jar', jarDir + 'gametoolSAR.sar')

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

    File.copy(jarDir + name, tempDir + name)
  end
end

puts "Making new .ear"

jarrer = JarMaker.new
jarrer.makeJar(tempDir, jarDir + File.basename(ear))
