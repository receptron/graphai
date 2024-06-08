import { FuncA, FuncB, FuncC, FuncD, FuncE, FuncF, PromiseResult } from "./common";
import { computed, Logger } from "../src/index";

const Answer1 = async () => {
  const a = await FuncA();
  const b = await FuncB();
  const c = await FuncC();
  const d = await FuncD(a, b);
  const e = await FuncE(b, c);
  return FuncF(d, e);
};

const Answer3 = async () => {
  const [a, b, c] = await Promise.all([FuncA(), FuncB(), FuncC()]);
  const [d, e] = await Promise.all([FuncD(a, b), FuncE(b, c)]);
  return FuncF(d, e);
};

const Answer6 = async () => {
  const promiseA = FuncA();
  const promiseC = FuncC();
  const b = await FuncB();
  const AthenD = async () => {
    const a = await promiseA;
    return FuncD(a, b);
  };
  const CthenE = async () => {
    const c = await promiseC;
    return FuncE(b, c);
  };
  const [d, e] = await Promise.all([AthenD(), CthenE()]);
  return FuncF(d, e);
};

const Answer8 = async () => {
  const nodeA = FuncA();
  const nodeB = FuncB();
  const nodeC = FuncC();
  const nodeD = computed([nodeA, nodeB], FuncD);
  const nodeE = computed([nodeB, nodeC], FuncE);
  const nodeF = computed([nodeD, nodeE], FuncF);
  return nodeF;
};

const Answer9 = async (logger: Logger) => {
  const nodeA = logger.computed([], FuncA, { name: "nodeA" });
  const nodeB = logger.computed([], FuncB, { name: "nodeB" });
  const nodeC = logger.computed([], FuncC, { name: "nodeC" });
  const nodeD = logger.computed([nodeA, nodeB], FuncD, { name: "nodeD" });
  const nodeE = logger.computed([nodeB, nodeC], FuncE, { name: "nodeE" });
  const nodeF = logger.computed([nodeD, nodeE], FuncF, { name: "nodeF" });
  logger.results = {
    f: await nodeF
  };
};

const timer = async (p: Promise<PromiseResult>) => {
  const now = Date.now();
  const result = await p;
  return { time: Date.now() - now, ...result };
};

const main = async () => {
  console.log(await timer(Answer1()));
  console.log(await timer(Answer3()));
  console.log(await timer(Answer6()));
  console.log(await timer(Answer8()));
  const logger = new Logger({ verbose:true });
  await Answer9(logger);
  console.log(logger.logs);
  console.log(logger.results);
};

if (process.argv[1] === __filename) {
  main();
}
