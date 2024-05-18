import test from "node:test";
import assert from "node:assert";

const objectToKeyArray = (innerData: any) => {
  const ret: string[][] = [];
  Object.keys(innerData).forEach((key: string) => {
    if (Object.keys(innerData[key]).length === 0) {
      ret.push([key])
    } else {
      objectToKeyArray(innerData[key]).forEach((tmp: string[]) => {
        ret.push([key, ...tmp])
      });
    }
  });
  return ret;
};

const debugResultKey = (agentId: string, result: any) => {
  return objectToKeyArray({[agentId]: debugResultKeyInner(result)}).map((objectKeys: string[]) => {
    return ":" + objectKeys.join(".")
  })
};

const debugResultKeyInner = (result: any) => {
  if (typeof result === "string") {
    return {};
  }
  if (Array.isArray(result)) {
    return Array.from(result.keys()).reduce((tmp: Record<string, any>, index: number) => {
      tmp["$" + String(index)] = debugResultKeyInner(result[index]);
      return tmp;
    }, {});
  }
  return Object.keys(result).reduce((tmp: Record<string, any>, key: string) => {
    tmp[key] = debugResultKeyInner(result[key]);
    return tmp;
  }, {});
};

test("test string", async () => {
  const agentId = "agentABC";
  const result = "123";
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC"]);
});

test("test object", async () => {
  const agentId = "agentABC";
  const result = { data: "123" };
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC.data"]);
});

test("test object", async () => {
  const agentId = "agentABC";
  const result = { data: [1, 2], data2: {hoge: "aa", foo: {bar: {boo: "bb"}}} };
  const res = debugResultKey(agentId, result);
  assert.deepStrictEqual(res, [":agentABC.data.$0", ":agentABC.data.$1", ":agentABC.data2.hoge", ":agentABC.data2.foo.bar.boo"]);
});


