import { FuncA, FuncB, FuncC, FuncD, FuncE, FuncF } from './common';

const Answer1 = async () => {  
  const a = await FuncA();
  const b = await FuncB();
  const c = await FuncC();
  const d = await FuncD(a, b);
  const e = await FuncE(b, c);
  return await FuncF(d, e);
}

const timer = async (p: Promise<any>) => {
  const now = Date.now();
  const result = await p;
  return { time: Date.now() - now, ...result };
}

const main = async () => {
  console.log(await timer(Answer1()));
};

if (process.argv[1] === __filename) {
  main();
}
  