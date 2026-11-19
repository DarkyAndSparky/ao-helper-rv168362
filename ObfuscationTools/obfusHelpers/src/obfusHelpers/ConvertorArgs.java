package obfusHelpers;

import org.jetbrains.annotations.NotNull;
import org.kohsuke.args4j.Option;

/**
 * Arguments for convertor.
 *
 * @author andrey.kuprishov
 */
public class ConvertorArgs {
  @NotNull
  private static final String EMPTY = "";
  @Option(name = "-c", aliases = "--changelog", usage = "ChangeLog of obfuscation", required = true)
  @NotNull
  public String changeLogFileName = EMPTY;
  @Option(name = "-j", aliases = "--jars", usage = "Directory where project jars (obfuscated, vendors) are situated", required = true)
  @NotNull
  public String jarDir = EMPTY;
  @Option(name = "-l", aliases = "--log", usage = "Name of log file to convert", required = false)
  @NotNull
  public String logFileName = EMPTY;
  @Option(name = "-d", aliases = "--lagdetector", usage = "Log of lag-detector", required = false)
  public boolean lags = false;
  @Option(name = "-n", aliases = "--newclassname", usage = "New (obfuscated) class name to know old name", required = false)
  @NotNull
  public String newClassName = EMPTY;
}
