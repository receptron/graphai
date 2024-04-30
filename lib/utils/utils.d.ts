import { DataSource, ResultData } from "../type";
export declare const sleep: (milliseconds: number) => Promise<unknown>;
export declare const parseNodeName: (inputNodeId: any) => DataSource;
export declare function assert(condition: boolean, message: string, isWarn?: boolean): asserts condition;
export declare const isObject: (x: unknown) => boolean;
export declare const getDataFromSource: (result: ResultData | undefined, source: DataSource) => ResultData | undefined;
export declare const strIntentionalError = "Intentional Error for Debugging";
