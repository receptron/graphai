import { DataSource, DataSources, NestedDataSource } from "../type";
export declare const inputs2dataSources: (inputs: string[], graphVersion: number) => Record<string, DataSource>;
export declare const namedInputs2dataSources: (inputs: Record<string, any>, graphVersion: number) => NestedDataSource;
export declare const flatDataSourceNodeIds: (sources: DataSource[] | DataSources[]) => string[];
export declare const flatDataSource: (sources: DataSource[] | DataSources[]) => DataSource[];
