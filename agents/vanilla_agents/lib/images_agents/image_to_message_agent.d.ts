import { AgentFunction, AgentFunctionInfo } from "graphai";
type Content = {
    type: string;
    image_url: {
        url: string;
        detail?: string;
    };
} | {
    type: string;
    text: string;
};
export declare const images2messageAgent: AgentFunction<{
    imageType: string;
    detail?: string;
}, {
    message: {
        role: "user";
        content: Content[];
    };
}, {
    array: string[];
    prompt?: string;
}>;
declare const images2messageAgentInfo: AgentFunctionInfo;
export default images2messageAgentInfo;
