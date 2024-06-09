export const computed = async (nodes: Array<any>, func: any) => {
  const inputs = await Promise.all(nodes);
  return func(...inputs);
};

export enum NodeState {
  Executing = "executing",
  Completed = "completed",
}

export type LogData = {
  name?: string;
  time: number;
  state: NodeState;
  duration?: number;
  inputs?: Array<any>;
  output?: any;
};

export interface ConductorOptions {
  verbose?: boolean;
  recordInputs?: boolean;
  recordOutput?: boolean;
};

export interface LogOptions extends ConductorOptions {
  name: string;
}

export class Conductor {
  public options: ConductorOptions;
  public startTime: number;
  public logs: Array<LogData> = [];
  public result: Record<string, any> = {};
  constructor(options: ConductorOptions) {
    this.options = options;
    this.startTime = Date.now();
  }

  public log(log: LogData, verbose: boolean | undefined) {
    this.logs.push(log);
    if (verbose) {
      if (log.duration) {
        console.log(`${log.state}: ${log.name} at ${log.time - this.startTime}, duration:${log.duration}ms`);
      } else {
        console.log(`${log.state}: ${log.name} at ${log.time - this.startTime}`);
      }
    }
  }

  public async computed(nodes: Array<any>, func: any, options: LogOptions) {
    const { verbose, recordInputs, recordOutput } = { ...this.options, ...options };
    const inputs = await Promise.all(nodes);
    const startTime = Date.now();
    const logStart: any = {
      name: options.name,
      time: Date.now(),
      state: NodeState.Executing,
    };
    if (recordInputs) {
      logStart.inputs = inputs;
    }
    this.log(logStart, verbose);

    const output = await func(...inputs);

    const time = Date.now();
    const logEnd: any = {
      name: options.name,
      time,
      state: NodeState.Completed,
      duration: time - startTime,
    };
    if (recordOutput) {
      logStart.output = output;
    }
    this.log(logEnd, verbose);

    return output;
  }
}
