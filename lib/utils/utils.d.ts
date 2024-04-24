import { DataSource } from "../type";
export declare const sleep: (milliseconds: number) => Promise<unknown>;
export declare const parseNodeName: (inputNodeId: string) => DataSource;
export declare function assert(condition: boolean, message: string): asserts condition;
