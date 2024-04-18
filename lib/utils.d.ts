export declare const parseNodeName: (name: string) => {
    sourceNodeId: string;
    propId?: undefined;
} | {
    sourceNodeId: string;
    propId: string;
};
