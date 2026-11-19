package obfusHelpers

import com.zelix.ZKMStackTraceTranslate

/**
 * Restores original classes using ZKM.
 *
 * @author andrey.kuprishov
  */
class LogRestorer {
  def translator
  def noClassDefPattern = ~/java\.lang\.NoClassDefFoundError\:\s+([^\s+]+)\s*$/

  LogRestorer(String changeLog, String jarDir) {
    def jarPattern = ~/.*\.jar$/
    def jars = []
    def searchJars = null

    searchJars = { dir ->
      dir.eachDir(searchJars)
      dir.eachFileMatch(jarPattern) { file ->
        jars << file.canonicalPath
      }
    }

    searchJars(new File(jarDir))
    
    def jarList = ""
    def pathSep = System.getProperty("path.separator")
    jars.each { jar ->
      if (jarList != "") {
        jarList += pathSep 
      }
      jarList += jar
    }

    translator = new ZKMStackTraceTranslate(changeLog,
        jarList)
  }

  String getOldClassName(newClassName) {
    return translator.getOldClassName(newClassName)
  }

  void close() {
    translator.close()
    translator = null
  }

  void handleTrace(trace) {
    def matcher = noClassDefPattern.matcher(trace[0])
    if (matcher.find()) {
      def oldName = translator.getOldClassName(matcher.group(1))
      println "Old name = " + oldName
    }

    def s = ""
    trace.each { line ->
      s = s + line + "\n"
    }
    print translator.getTranslatedStackTrace(s, true, ZKMStackTraceTranslate.FULL_PARAM_TYPES);
  }

  def startOfTracePattern = ~/^([^\s\[\,]+)(\:\s.*)$/

  void checkStartOfTrace(line) {
    def m = startOfTracePattern.matcher(line)
    if (m.find()) {
      println translator.getOldClassName(m.group(1)) + m.group(2)
    } else {
      println line
    }
  }

  void parse(String logFileName, lags) {
    def list = new File(logFileName).readLines()
    def handler = null
    def trace = []
    def beforeTrace = null

    def atPattern
    if (lags) {
      atPattern = ~/^at\s/
    } else {
      atPattern = ~/^\s+at\s/
    }

    def prev = ""

    def inTrace = { line ->
      if (line =~ atPattern) {
        trace << "    " + line
      } else {
        handleTrace(trace)
        trace = []
        prev = line
        handler = beforeTrace
      }
    }

    beforeTrace = { line ->
      if (line =~ atPattern) {
        checkStartOfTrace(prev)
        prev = ""

        trace = ["    " + line]
        handler = inTrace
      } else {
        if (!prev.isEmpty()) {
          println prev
        }
        prev = line
      }
    }                                                                

    handler = beforeTrace

    list.each { line ->
      handler(line)
    }
    
    checkStartOfTrace(prev)
    if (!trace.isEmpty()) {
      handleTrace(trace)
    }
  }
}