$config.merge!({
  # list of jars excluded from obfuscation (but they will be in classpath)
  :excludedJars => %q{
    jetbrainsAnnotations.jar
    resourceAnnotations.jar
    masterServerApi.jar
    masterServerWeb.jar
    trove.jar
    antAgency.jar
    antLogger.jar
    antScriptGenerator.jar
    codeGeneration.jar
    gwtcommons.jar
    ideaToAnt.jar
    jdomExt.jar
    luaFramework.jar
    jbossStatistics.jar
  },

  # list of skipped jars (not used during obfuscation)
  :skippedJars => %q{
    xdbHackUtility.jar
    buildTools.jar
  	torrentServer.jar
  	torrentServer.TorrentServerMain.jar
  }
})