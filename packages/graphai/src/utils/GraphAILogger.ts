type LogLevel = "debug" | "info" | "log" | "warn" | "error";
type LoggerFunction = (level: LogLevel, ...args: any[]) => void;

const enabledLevels: Record<LogLevel, boolean> = {
  debug: true,
  info: true,
  log: true,
  warn: true,
  error: true,
};

let customLogger: LoggerFunction | null = null;

function setLevelEnabled(level: LogLevel, enabled: boolean) {
  enabledLevels[level] = enabled;
}

function setLogger(logger: LoggerFunction) {
  customLogger = logger;
}

function output(level: LogLevel, ...args: any[]) {
  if (!enabledLevels[level]) return;
  if (customLogger) {
    customLogger(level, ...args);
  } else {
    (console[level] || console.log)(...args);
  }
}

function debug(...args: any[]) {
  output("debug", ...args);
}
function info(...args: any[]) {
  output("info", ...args);
}
function log(...args: any[]) {
  output("log", ...args);
}
function warn(...args: any[]) {
  output("warn", ...args);
}
function error(...args: any[]) {
  output("error", ...args);
}

export const GraphAILogger = {
  setLevelEnabled,
  setLogger,
  debug,
  info,
  log,
  warn,
  error,
  LogLevel,
  LoggerFunction,
};
