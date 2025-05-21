declare const toolsAgentInfo: {
    name: string;
    agent: (context: import("graphai").AgentFunctionContext) => Promise<import("graphai").ResultData<import("graphai").DefaultResultData> | import("@graphai/agent_utils").GraphAIOnError>;
    mock: (context: import("graphai").AgentFunctionContext) => Promise<import("graphai").ResultData<import("graphai").DefaultResultData> | import("@graphai/agent_utils").GraphAIOnError>;
    samples: {
        inputs: {
            llmAgent: string;
            tools: {
                type: string;
                function: {
                    name: string;
                    description: string;
                    parameters: {
                        type: string;
                        properties: {
                            switch: {
                                type: string;
                                description: string;
                            };
                        };
                    };
                };
            }[];
            messages: {
                role: string;
                content: string;
            }[];
            userInput: {
                text: string;
                message: {
                    role: string;
                    content: string;
                };
            };
        };
        params: {};
        result: string;
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    source: string;
    package: string;
    tools: never[];
    license: string;
    hasGraphData: boolean;
};
export default toolsAgentInfo;
