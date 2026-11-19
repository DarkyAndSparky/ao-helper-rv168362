package obfusHelpers;

import org.jetbrains.annotations.NotNull;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;

/**
 * Converts obfuscated log into normal by restoring class names of stack trace classes.
 *
 * @author andrey.kuprishov
 */
public class LogConvertor {
  public static void main(@NotNull String[] args) {
    final ConvertorArgs convertorArgs = new ConvertorArgs();
    final CmdLineParser parser = new CmdLineParser(convertorArgs);

    if (args.length == 0) {
      System.out.println("Usage:");
      parser.printUsage(System.out);
    }

    try {
      parser.parseArgument(args);
    } catch (CmdLineException e) {
      System.err.println(e.getMessage());
      return;
    }

    final LogRestorer restorer = new LogRestorer(
        convertorArgs.changeLogFileName, convertorArgs.jarDir);

    if (!convertorArgs.logFileName.isEmpty()) {
      restorer.parse(convertorArgs.logFileName, convertorArgs.lags);
    }
    if (!convertorArgs.newClassName.isEmpty()) {
      System.out.println(restorer.getOldClassName(convertorArgs.newClassName));
    }
    restorer.close();
  }
}
