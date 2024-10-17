import { DataSource, NestedDataSource, ResultData } from "./type";
import { GraphNodes } from "./node";
export declare const resultsOf: (sources: NestedDataSource, nodes: GraphNodes) => Record<string, ResultData>;
export declare const resultOf: (source: DataSource, nodes: GraphNodes) => ResultData;
