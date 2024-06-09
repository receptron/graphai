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

export type ConductorOptions = {
  verbose?: boolean;
  recordInputs?: boolean;
  recordOutput?: boolean;
  name?: string;
};

export class Conductor {
  public options: ConductorOptions;
  public startTime: number;
  public logs: Array<LogData> = [];
  public result: Record<string, any> = {};
  constructor(options: ConductorOptions) {
    this.options = options;
    this.startTime = Date.now();
  }

  public async computed(nodes: Array<any>, func: any, options: ConductorOptions = { name: "no name" }) {
    const inputs = await Promise.all(nodes);
    const startTime = Date.now();
    const logStart: any = {
      name: options.name,
      time: Date.now(),
      state: NodeState.Executing,
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
      state: NodeState.Completed,
    };
    logEnd.duration = logEnd.time - startTime;
    if (recordOutput) {
      logStart.output = output;
    }
    this.logs.push(logEnd);
    if (verbose) {
      console.log(`completed: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${logEnd.duration}ms`);
    }
    return output;
  }
}
