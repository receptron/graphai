import { cleanResult } from "../../src/result";

import test from "node:test";
import assert from "node:assert";

test("test clean result empty array", async () => {
  const data = { a: [], b: [1, 2] };
  const expect = { a: [], b: [1, 2] };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result value", async () => {
  const data = { a: undefined, b: null, c: 1, d: false, e: true, f: "1", g: "", h: {}, i: [], j: 0, k: -1 } as any;
  const expect = { c: 1, d: false, e: true, f: "1", g: "", j: 0, k: -1, h: {}, i: [] };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result object value", async () => {
  const data = { data: { a: undefined, b: null, c: 1, d: false, e: true, f: "1", g: "", h: {}, i: [] } } as any;
  const expect = { data: { c: 1, d: false, e: true, f: "1", g: "", h: {}, i: [] } };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result array value", async () => {
  const data = { array: [undefined, null, 1, false, true, "1", "", {}, []] } as any;
  const expect = { array: [1, false, true, "1", "", {}, []] };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result deep", async () => {
  const data = { array: [{ array: [[], [undefined, null], { data: {} }], data: { array: [] } }] } as any;
  const expect = {
    array: [
      {
        array: [
          [],
          [],
          {
            data: {},
          },
        ],
        data: {
          array: [],
        },
      },
    ],
  };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});

test("test clean result deep", async () => {
  const data = {
    array: [
      { array: [[], [undefined, null, false], { data: { data: { a: 1, b: [], c: [null, undefined], d: false } } }], data: { array: [null, 2, undefined] } },
    ],
  } as any;
  const expect = {
    array: [
      {
        array: [
          [],
          [false],
          {
            data: {
              data: {
                a: 1,
                b: [],
                c: [],
                d: false,
              },
            },
          },
        ],
        data: {
          array: [2],
        },
      },
    ],
  };

  const result = cleanResult(data);
  assert.deepStrictEqual(result, expect);
});
