const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const FuncA = async () => {
  await sleep(50);  
  return { A: true };
};

export const FuncB = async () => {
  await sleep(150);
  return { B: true };
};

export const FuncC = async () => {
  await sleep(100);
  return { C: true };
};

export const FuncD = async (a: any, b: any) => {
  await sleep(50);
  return { D: true, ...a, ...b };
}

export const FuncE = async (b: any, c: any) => {
  await sleep(100);
  return { E: true, ...b, ...c };
}

export const FuncF = async (d: any, e: any) => {
  await sleep(100);
  return { F: true, ...d, ...e };
}
