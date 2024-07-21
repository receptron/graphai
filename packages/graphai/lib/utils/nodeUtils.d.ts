import { DataSource } from "../type";
export declare const inputs2dataSources: (inputs: string[], graphVersion: number) => Record<string, DataSource>;
export declare const namedInputs2dataSources: (inputs: Record<string, any>, graphVersion: number) => Record<string, DataSource | DataSource[]>;
