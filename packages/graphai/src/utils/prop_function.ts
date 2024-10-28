import { PropFunction } from "@/type";
import { isObject } from "./utils";

export const propFunctionRegex = /^[a-zA-Z]+\([^)]*\)$/;

export const propFunction: PropFunction = (result, propId) => {
  if (Array.isArray(result)) {
    if (propId === "length()") {
      return result.length;
    }
    if (propId === "flat()") {
      return result.flat();
    }
    if (propId === "toJSON()") {
      return JSON.stringify(result);
    }
    if (propId === "isEmpty()") {
      return result.length === 0;
    }
    // array join
    const matchJoin = propId.match(/^join\(([,-]?)\)$/);
    if (matchJoin && Array.isArray(matchJoin)) {
      return result.join(matchJoin[1] ?? "");
    }
    // flat, join
  } else if (isObject(result)) {
    if (propId === "keys()") {
      return Object.keys(result);
    }
    if (propId === "values()") {
      return Object.values(result);
    }
    if (propId === "toJSON()") {
      return JSON.stringify(result);
    }
  } else if (typeof result === "string") {
    if (propId === "codeBlock()") {
      const match = ("\n" + result).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
      if (match) {
        return match[1];
      }
    }
    if (propId === "jsonParse()") {
      return JSON.parse(result);
    }
    if (propId === "toNumber()") {
      const ret = Number(result);
      if (!isNaN(ret)) {
        return ret;
      }
    }
  } else if (result !== undefined && Number.isFinite(result)) {
    if (propId === "toString()") {
      return String(result);
    }
    const regex = /^add\((-?\d+)\)$/;
    const match = propId.match(regex);
    if (match) {
      return Number(result) + Number(match[1]);
    }
  } else if (typeof result === "boolean") {
    if (propId === "not()") {
      return !result;
    }
  }
  return undefined;
};
