# searches jars of project and vendor jars
class JarSearcher
  attr_accessor :projectJars, :vendorJars

  def initialize(inPath, vendorSubpath)
    @projectJars = find(inPath)
    @vendorJars = findInSubdirs(inPath + vendorSubpath)
  end

  def find(inPath, ignoreSources = false)
    found = Array.new
    Dir.new(inPath).each do |name|
      if name =~ /\.[js]ar$/
        if !ignoreSources || name !~ /(\-?src|\-?sources)\.[js]ar$/
          found << name
        end
      end
    end
    found
  end

  def findInSubdirs(inPath)
    found = Array.new
    Dir.new(inPath).each do |name|
      if File.directory?(inPath + name) && name != '.' && name != '..'
        find(inPath + name, true).each { |jarName|
          found << inPath + name + '/' + jarName
        }
      end
    end
    found
  end
end

# handles jar: collects exclude rules for packages with config files and for console classes
class JarHandler
  attr_reader :excludes

  def initialize
    @excludes = Array.new
  end

  def handleConsole(jar)
    entry = jar.getEntry("locales/console_ru.properties")  
    if entry.nil?
      return
    end
    is = jar.getInputStream(entry)
    reader = java.io.BufferedReader.new(java.io.InputStreamReader.new(is))

    classes = Hash.new

    line = reader.readLine
    while !line.nil?
      if line.to_s =~ /^([a-zA-Z\.\_]+)\$name/
        classes[$1] = true
      end
      line = reader.readLine
    end

    classes.each { |name, dummy|
      # exclude fields of console class
      @excludes << "#{name} +"
    }
  end

  def handleJar(jarName)
    packages = Hash.new
    packsWithClasses = Hash.new
    jar = java.util.jar.JarFile.new(jarName)
    jar.entries.each { |entry|
      if entry.name =~ /^(.+\/)[^\/]+\.([a-zA-Z]+)$/
        if $1 != 'META-INF/'
          if $2 == 'class'
            packsWithClasses[$1] = true
          else
            package = $1
            if package !~ /\-/
              packages[package] = true
            end
          end
        end
      end
    }
    packages.each { |package, dummy|
      # gets name in format a.b.
      packName = package.gsub(/\//, '.')

      @excludes << packName

      if !packsWithClasses.key?(package)
        # no classes in this package, exclude upper-level package too
        while packName =~ /^(.*\.)\w+\.$/
          packName = $1
          @excludes << packName
          if packsWithClasses.key?(packName.gsub(/\./, '/'))
            break
          end
        end
      end
    }

    if jarName =~ /[\\\/]config\.jar$/
      handleConsole(jar)
    end
  end
end

def readContent(fileName)
  content = ''
  File.open(fileName, "r") { |f|
    f.read.each { |line|
      content += line
    }
  }
end

def removeJars(path)
  path += '/' if path !~ /(\\|\/)$/
  jars = Array.new
  Dir.new(path).each do |name|
    if name =~ /\.[js]ar$/
      jars << name
    end
  end
  jars.each { |name|
    File.delete(path + name)
  }
end

def getResourceClasses(template)
  resources = ''
  File.open(template, 'r') { |f|
    f.read.each { |line|
      line.scan(/^(.+\.)([\w\d]+)\s+$/) { |packageName, className|
        resources += "  #{packageName}^#{className} and\n"  
      }
    }
  }
  resources
end
