export type PromiseResult<T> = T;
export type NodePromise<T> = Promise<PromiseResult<T>>;

export const computed = async <T>(nodes: NodePromise<T>[], func: (...arg: PromiseResult<T>[]) => NodePromise<T>) => {
  const inputs = await Promise.all(nodes);
  return func(...inputs);
};

export type LoggerOptions = {
  verbose?: boolean;
  recordInputs?: boolean;
  recordOutput?: boolean;
  name?: string;
};

type LogData<T> = {
  name?: string;
  time: number;
  state: string;
  duration?: number;
  inputs?: T[];
  output?: T;
};

export class Logger<T> {
  public options: LoggerOptions;
  public startTime: number;
  public logs: Array<LogData<T>> = [];
  public result: Record<string, T> = {};

  constructor(options: LoggerOptions) {
    this.options = options;
    this.startTime = Date.now();
  }

  public async computed(nodes:  NodePromise<T>[], func: (...arg: PromiseResult<T>[]) => NodePromise<T>, options: LoggerOptions = { name: "no name" }) {
    const inputs = await Promise.all(nodes);
    const startTime = Date.now();
    const logStart: LogData<T> = {
      name: options.name,
      time: Date.now(),
      state: "started",
    };
    const { verbose, recordInputs, recordOutput } = { ...this.options, ...options };

    if (recordInputs) {
      logStart.inputs = inputs;
    }
    this.logs.push(logStart);
    if (verbose) {
      console.log(`starting: ${logStart.name} at ${logStart.time - this.startTime}`);
    }
    const output = await func(...inputs);
    const logEnd: LogData<T> = {
      name: options.name,
      time: Date.now(),
      state: "completed",
    };
    logEnd.duration = logEnd.time - startTime;
    if (recordOutput) {
      logStart.output = output;
    }
    this.logs.push(logEnd);
    if (verbose) {
      console.log(`complted: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${logEnd.duration}ms`);
    }
    return output;
  }
}
