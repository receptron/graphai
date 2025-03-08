[**graphai**](../README.md)

***

[graphai](../globals.md) / AgentFunction

# Type Alias: AgentFunction()\<ParamsType, ResultType, NamedInputDataType, ConfigType\>

> **AgentFunction**\<`ParamsType`, `ResultType`, `NamedInputDataType`, `ConfigType`\>: (`context`) => `Promise`\<[`ResultData`](ResultData.md)\<`ResultType`\>\>

Defined in: [packages/graphai/src/type.ts:130](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/type.ts#L130)

## Type Parameters

• **ParamsType** = [`DefaultParamsType`](DefaultParamsType.md)

• **ResultType** = [`DefaultResultData`](DefaultResultData.md)

• **NamedInputDataType** = [`DefaultInputData`](DefaultInputData.md)

• **ConfigType** = [`DefaultConfigData`](DefaultConfigData.md)

## Parameters

### context

[`AgentFunctionContext`](AgentFunctionContext.md)\<`ParamsType`, `NamedInputDataType`, `ConfigType`\>

## Returns

`Promise`\<[`ResultData`](ResultData.md)\<`ResultType`\>\>
