include Java

FileInputStream     = Java::java.io.FileInputStream
FileOutputStream    = Java::java.io.FileOutputStream
BufferedInputStream = Java::java.io.BufferedInputStream
ZipOutputStream     = Java::java.util.zip.ZipOutputStream
ZipEntry = Java::java.util.zip.ZipEntry
JarFile = java.util.jar.JarFile

class JarMaker
  def initialize
    @buf = Java::byte[4096].new
  end

  def storeDir(dir, baseName)
    
    Dir.new(dir).each { |fileName|
      if File.directory?(dir + fileName)
        # avoid packing special dirs
        if fileName != '.' && fileName != '..'
          # store dir
          entry = ZipEntry.new(baseName + fileName + '/')
          @zos.putNextEntry(entry)
          storeDir(dir + fileName + '/', baseName + fileName + '/')
        end
      else
        # avoid packing destination
        if File.expand_path(dir + fileName) != @jarName
          # store file
          entry = ZipEntry.new(baseName + fileName)
          @zos.putNextEntry(entry)

          bis = BufferedInputStream.new(FileInputStream.new(dir + fileName))
          
          while true
            got = bis.read(@buf)
            if got > 0
              @zos.write(@buf, 0, got)
            else
              break
            end
          end

          bis.close()
        end
      end
    }
  end

  def makeJar(dir, jarName)
    @jarName = File.expand_path(jarName)

    @fos = FileOutputStream.new(jarName)
    @zos = ZipOutputStream.new(@fos)

    storeDir(dir, '')

    @zos.close
  end
end

def addTailingSlash(dir)
  if dir !~ /\/$/ && dir !~ /\\$/
    dir += '/'
  end
  dir
end

def extractSars(jarName, destDir)
  if !File.exists?(jarName)
    puts "File #{jarName} not found, .sar files were not extracted"
    return
  end

  puts "Extracting .sar from #{jarName}"

  destDir = addTailingSlash(destDir)

  buf = Java::byte[4096].new

  jar = JarFile.new(jarName)
  jar.entries.each { |entry|
    if !entry.isDirectory && entry.name =~ /\.sar$/
      puts "  extracting #{entry.name}"
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
