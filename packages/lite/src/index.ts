export const computed = async (nodes: any, func: any) => {
  const inputs = await Promise.all(nodes);
  return func(...inputs);
};

export class Logger {
  public verbose: boolean;
  public recordInputs: boolean;
  public recordOutput: boolean;
  public startTime: number;
  public logs: Array<Record<string, any>> = [];
  public result: Record<string, any> = {};
  constructor(options: Record<string, any>) {
    this.verbose = options.verbose ?? false;
    this.recordInputs = options.recordInputs ?? false;
    this.recordOutput = options.recordOutput ?? false;
    this.startTime = Date.now();
  }

  public async computed(nodes: any, func: any, options: Record<string, any> = { name: "no name" }) {
    const inputs = await Promise.all(nodes);
    const startTime = Date.now();
    const logStart: any = {
      name: options.name,
      time: Date.now(),
      state: "started",
    };
    if (this.recordInputs) {
      logStart.inputs = inputs;
    }
    this.logs.push(logStart);
    if (this.verbose) {
      console.log(`starting: ${logStart.name} at ${logStart.time - this.startTime}`);
    }
    const output = await func(...inputs);
    const logEnd:any = {
      name: options.name,
      time: Date.now(),
      state: "completed",
    };
    logEnd.duration = logEnd.time - startTime;
    if (this.recordOutput) {
      logStart.outputs = output;
    }
    this.logs.push(logEnd);
    if (this.verbose) {
      console.log(`complted: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${ logEnd.duration }ms`);
    }
    return output;
  }
}
