export const computed = async (nodes: any, func: any) => {
  const results = await Promise.all(nodes);
  return func(...results);
};

export class Logger {
  public verbose: boolean;
  constructor(options: Record<string, any>) {
    this.verbose = options.verbose ?? false;
  }

  public async computed(nodes: any, func: any) {
    const results = await Promise.all(nodes);
    return func(...results);
  }
}
