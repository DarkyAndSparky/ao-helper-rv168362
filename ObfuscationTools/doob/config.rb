$config = {

  # input path where compiled jars and vendor/* leaves
  :inPath => 'E:\\ao',

  # output path where obfuscated jars will be placed
  :outPath => 'C:\\warez\\dev\\java\\zelix\\eval\\tests\\jars',

  # where to save changelogs of obfuscator
  :changeLogPath => 'changeLogs',

  # where to save created scripts
  :scriptPath => 'scripts',

  # where to log obfuscation
  :logPath => 'logs',

  # where to run obfuscator from
  :runPath => 'zkm',

  # command line to run obfuscator (script file name will be appended)
  :run     => 'java -Xmx1536m -Xms1024m -jar ZKM.jar -v',
}
require './config-jars.rb'
