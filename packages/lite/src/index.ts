export const computed = async (nodes: any, func: any) => {
  const inputs = await Promise.all(nodes);
  return func(...inputs);
};

export type LoggerOptions = {
  verbose?: boolean;
  recordInputs?: boolean;
  recordOutput?: boolean;
  name?: string;
};

export class Logger {
  public options: LoggerOptions;
  public startTime: number;
  public logs: Array<Record<string, any>> = [];
  public result: Record<string, any> = {};
  constructor(options: LoggerOptions) {
    this.options = options;
    this.startTime = Date.now();
  }

  public async computed(nodes: any, func: any, options: LoggerOptions = { name: "no name" }) {
    const inputs = await Promise.all(nodes);
    const startTime = Date.now();
    const logStart: any = {
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
    const logEnd: any = {
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
