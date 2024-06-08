const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export type PromiseResult = {
  A?: boolean;
  B?: boolean;
  C?: boolean;
  D?: boolean;
  E?: boolean;
};

export const FuncA = async () => {
  await sleep(50);
  return { A: true };
};

export const FuncB = async () => {
  await sleep(100);
  return { B: true };
};

export const FuncC = async () => {
  await sleep(150);
  return { C: true };
};

export const FuncD = async (a: PromiseResult, b: PromiseResult) => {
  await sleep(100);
  return { D: true, ...a, ...b };
};

export const FuncE = async (b: PromiseResult, c: PromiseResult) => {
  await sleep(50);
  return { E: true, ...b, ...c };
};

export const FuncF = async (d: PromiseResult, e: PromiseResult) => {
  await sleep(100);
  return { F: true, ...d, ...e };
};
