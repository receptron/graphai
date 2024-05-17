import test from "node:test";
import assert from "node:assert";

const objectJoin = (innerData: any) => {
  const ret: any = [];
  Object.keys(innerData).forEach((key: any) => {
    if (Object.keys(innerData[key]).length === 0) {
      ret.push(key)
    } else {
      const hoge = objectJoin(innerData[key]) 
      if (Array.isArray(hoge)) {
        hoge.forEach((tmp: any) => {
          if (Array.isArray(tmp)) {
            const arr = [key, ...tmp]
            ret.push(arr)
          } else {
            const arr = [key, tmp]
            ret.push(arr)
          }
        });
      } else {
        const arr = [key, ...hoge]
        ret.push(arr)
      }
    }
  });
  return ret;
};


const debugResultKey = (agentId: string, result: any) => {
  const inner = debugResultKeyInner(result);
  const res = {};
  const hoge = objectJoin({[agentId]: inner});
  return (hoge.map((a: string[]) => {
    if (Array.isArray(a)) {
      return a.join(".")
    }
    return a;
  })).map((a: string) => ":" + a);
};

const debugResultKeyInner = (result: any) => {
  if (typeof result === "string") {
    return {};
  }
  if (Array.isArray(result)) {
    return Array.from(result.keys()).reduce((tmp: any, index: any) => {
      tmp["$" + index] = debugResultKeyInner(result[index]);
      return tmp;
    }, {});
  }
  return Object.keys(result).reduce((tmp: any, key: any) => {
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
  // console.log(res)
  assert.deepStrictEqual(res, [":agentABC.data.$0", ":agentABC.data.$1", ":agentABC.data2.hoge", ":agentABC.data2.foo.bar.boo"]);
});


// { data: { '$0': {}, '$1': {} }, data2: { hoge: {}, foo: {} } }
[
  "data.$0",
  "data.$1",
  "data2.hoge",
  "data2.foo",

  ]
