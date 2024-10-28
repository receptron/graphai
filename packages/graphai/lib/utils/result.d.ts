import { DataSource, ResultData } from "../type";
import { GraphNodes } from "../node";
export declare const resultsOf: (inputs: Record<string, any> | Array<string>, nodes: GraphNodes) => Record<string, ResultData>;
export declare const resultOf: (source: DataSource, nodes: GraphNodes) => ResultData;
export declare const cleanResultInner: (results: ResultData) => ResultData | null;
export declare const cleanResult: (results: Record<string, ResultData | undefined>) => Record<string, ResultData>;
