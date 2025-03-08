[**graphai**](../README.md)

***

[graphai](../globals.md) / AgentFilterFunction

# Type Alias: AgentFilterFunction()\<ParamsType, ResultType, NamedInputDataType\>

> **AgentFilterFunction**\<`ParamsType`, `ResultType`, `NamedInputDataType`\>: (`context`, `agent`) => `Promise`\<[`ResultData`](ResultData.md)\<`ResultType`\>\>

Defined in: [packages/graphai/src/type.ts:137](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/type.ts#L137)

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
