type LogLevel = "debug" | "info" | "log" | "warn" | "error";
type LoggerFunction = (level: LogLevel, ...args: any[]) => void;

export const GraphAILogger = {
  enabledLevels: {
    debug: true,
    info: true,
    log: true,
    warn: true,
    error: true,
  } as Record<LogLevel, boolean>,

  customLogger: null as LoggerFunction | null,

  setLevelEnabled(level: LogLevel, enabled: boolean) {
    this.enabledLevels[level] = enabled;
  },

  setLogger(logger: LoggerFunction) {
    this.customLogger = logger;
  },

  debug(...args: any[]) {
    if (!this.enabledLevels.debug) return;
    this._output("debug", ...args);
  },

  info(...args: any[]) {
    if (!this.enabledLevels.info) return;
    this._output("info", ...args);
  },

  log(...args: any[]) {
    if (!this.enabledLevels.log) return;
    this._output("log", ...args);
  },

  warn(...args: any[]) {
    if (!this.enabledLevels.warn) return;
    this._output("warn", ...args);
  },

  error(...args: any[]) {
    if (!this.enabledLevels.error) return;
    this._output("error", ...args);
  },

  _output(level: LogLevel, ...args: any[]) {
    if (this.customLogger) {
      this.customLogger(level, ...args);
    } else {
      const consoleMethod = {
        debug: console.debug,
        info: console.info,
        log: console.log,
        warn: console.warn,
        error: console.error,
      }[level];

      if (consoleMethod) {
        consoleMethod(...args);
      }
    }
  },
};
