[**graphai**](../README.md)

***

[graphai](../globals.md) / AgentFilterFunction

# Type Alias: AgentFilterFunction()\<ParamsType, ResultType, NamedInputDataType\>

> **AgentFilterFunction**\<`ParamsType`, `ResultType`, `NamedInputDataType`\>: (`context`, `agent`) => `Promise`\<[`ResultData`](ResultData.md)\<`ResultType`\>\>

Defined in: [packages/graphai/src/type.ts:137](https://github.com/kawamataryo/graphai/blob/dd469fabd8a117a70d995bd5597c959177f9738c/packages/graphai/src/type.ts#L137)

## Type Parameters

• **ParamsType** = [`DefaultParamsType`](DefaultParamsType.md)

• **ResultType** = [`DefaultResultData`](DefaultResultData.md)

• **NamedInputDataType** = [`DefaultInputData`](DefaultInputData.md)

## Parameters

### context

[`AgentFunctionContext`](AgentFunctionContext.md)\<`ParamsType`, `NamedInputDataType`\>

### agent

[`AgentFunction`](AgentFunction.md)

## Returns

`Promise`\<[`ResultData`](ResultData.md)\<`ResultType`\>\>
