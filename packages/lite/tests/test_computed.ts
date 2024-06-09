import { computed, Logger } from "../src/index";

import test from "node:test";
import assert from "node:assert";

const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
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

export const FuncD = async (a: any, b: any) => {
  await sleep(100);
  return { D: true, ...a, ...b };
};

export const FuncE = async (b: any, c: any) => {
  await sleep(50);
  return { E: true, ...b, ...c };
};

export const FuncF = async (d: any, e: any) => {
  await sleep(10);
  return { F: true, ...d, ...e };
};

export const FuncY = async (key: string, value: any) => {
  await sleep(10);
  return { [key]: value };
};

export const FuncX = async (value0: number, value1: number) => {
  await sleep(10);
  return { X: value0 < value1 };
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

test("test computed", async () => {
  const result = await Answer8();
  assert.deepStrictEqual(result, { F: true, D: true, A: true, B: true, E: true, C: true });
});

const Answer9 = async (logger: Logger) => {
  const nodeA = logger.computed([], FuncA, { name: "nodeA" });
  const nodeB = logger.computed([], FuncB, { name: "nodeB" });
  const nodeC = logger.computed([], FuncC, { name: "nodeC" });
  const nodeD = logger.computed([nodeA, nodeB], FuncD, { name: "nodeD" });
  const nodeE = logger.computed([nodeB, nodeC], FuncE, { name: "nodeE" });
  const nodeF = logger.computed([nodeD, nodeE], FuncF, { name: "nodeF" });
  logger.result = {
    f: await nodeF,
  };
};

test("test Logger.computed", async () => {
  const logger = new Logger({ });
  await Answer9(logger);
  assert.deepStrictEqual(logger.result, { f: { F: true, D: true, A: true, B: true, E: true, C: true }});
});

const Answer10 = async (logger: Logger) => {
  const nodeY = logger.computed(["Y", false], FuncY, { name: "nodeY" });
  const nodeC = logger.computed([23, 33], FuncX, { name: "nodeC" });
  const nodeD = logger.computed([{ Z:true }, nodeY], FuncD, { name: "nodeD" });
  const nodeE = logger.computed([nodeY, nodeC], FuncE, { name: "nodeE" });
  const nodeF = logger.computed([nodeD, nodeE], FuncF, { name: "nodeF" });
  logger.result = {
    f: await nodeF,
  };
};

test("test Logger.computed with literal value", async () => {
  const logger = new Logger({ });
  await Answer10(logger);
  assert.deepStrictEqual(logger.result, { f: { F: true, D: true, Z: true, Y: false, E: true, X: true }});
});
