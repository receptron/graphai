import { PackageJson } from "type-fest";
export declare const getAgents: (agentKeys: string[]) => string | undefined;
export declare const getGitRep: (repository: string | {
    url: string;
}) => string;
export declare const getPackageJson: (npmRootPath: string) => PackageJson | null;
export declare const main: (npmRootPath: string) => Promise<void>;
