export const computed = async (nodes: any, func: any) => {
  const results = await Promise.all(nodes);
  return func(...results);
};

export class Logger {
  public verbose: boolean;
  public startTime: number;
  constructor(options: Record<string, any>) {
    this.verbose = options.verbose ?? false;
    this.startTime = Date.now();
  }

  public async computed(nodes: any, func: any, options: Record<string, any> = { name: 'no name' }) {
    const results = await Promise.all(nodes);
    const startTime = Date.now();
    if (this.verbose) {
      console.log(`starting: ${options.name} at ${startTime - this.startTime}`)
    }
    const result = await func(...results);
    const endTime = Date.now();
    if (this.verbose) {
      console.log(`complted: ${options.name} at ${endTime - this.startTime}, duration:${endTime - startTime}ms`)
    }
    return result;
  }
}
