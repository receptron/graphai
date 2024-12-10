import { DataSource, ResultData, PropFunction } from "../type";
import { GraphNodes } from "../node";
export declare const resultsOf: (inputs: Record<string, any>, nodes: GraphNodes, propFunctions: PropFunction[], isSelfNode?: boolean) => Record<string, ResultData>;
export declare const resultOf: (source: DataSource, nodes: GraphNodes, propFunctions: PropFunction[]) => ResultData;
export declare const cleanResultInner: (results: ResultData) => ResultData | null;
export declare const cleanResult: (results: Record<string, ResultData | undefined>) => Record<string, ResultData>;
