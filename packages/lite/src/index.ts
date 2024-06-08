export const computed = async (nodes: any, func: any) => {
  const results = await Promise.all(nodes);
  return func(...results);
};

export class Logger {
  public verbose: boolean;
  constructor(options: Record<string, any>) {
    this.verbose = options.verbose ?? false;
  }

  public async computed(nodes: any, func: any, options: Record<string, any> = { name: 'no name' }) {
    const results = await Promise.all(nodes);
    if (this.verbose) {
      console.log(`starting: ${options.name}`)
    }
    const startTime = Date.now();
    const result = await func(...results);
    const endTime = Date.now();
    if (this.verbose) {
      console.log(`complted: ${options.name}, ${endTime - startTime}ms`)
    }
    return result;
  }
}
