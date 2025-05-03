type LogLevel = "debug" | "info" | "log" | "warn" | "error";
type LoggerFunction = (level: LogLevel, ...args: any[]) => void;
declare function setLevelEnabled(level: LogLevel, enabled: boolean): void;
declare function setLogger(logger: LoggerFunction): void;
declare function debug(...args: any[]): void;
declare function info(...args: any[]): void;
declare function log(...args: any[]): void;
declare function warn(...args: any[]): void;
declare function error(...args: any[]): void;
export declare const GraphAILogger: {
    setLevelEnabled: typeof setLevelEnabled;
    setLogger: typeof setLogger;
    debug: typeof debug;
    info: typeof info;
    log: typeof log;
    warn: typeof warn;
    error: typeof error;
};
export {};
