[**graphai**](../README.md)

***

[graphai](../globals.md) / AgentFunctionContext

# Type Alias: AgentFunctionContext\<ParamsType, NamedInputDataType, ConfigType\>

> **AgentFunctionContext**\<`ParamsType`, `NamedInputDataType`, `ConfigType`\>: `object`

Defined in: [packages/graphai/src/type.ts:112](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/type.ts#L112)

## Type Parameters

• **ParamsType** = [`DefaultParamsType`](DefaultParamsType.md)

• **NamedInputDataType** = [`DefaultInputData`](DefaultInputData.md)

• **ConfigType** = [`DefaultConfigData`](DefaultConfigData.md)

## Type declaration

### cacheType?

> `optional` **cacheType**: `CacheTypes`

### config?

> `optional` **config**: `ConfigType`

### debugInfo

> **debugInfo**: `AgentFunctionContextDebugInfo`

### filterParams

> **filterParams**: `AgentFilterParams`

### forNestedGraph?

> `optional` **forNestedGraph**: `object`

#### forNestedGraph.agents

> **agents**: [`AgentFunctionInfoDictionary`](AgentFunctionInfoDictionary.md)

#### forNestedGraph.callbacks?

> `optional` **callbacks**: [`CallbackFunction`](CallbackFunction.md)[]

#### forNestedGraph.graphData?

> `optional` **graphData**: [`GraphData`](GraphData.md)

#### forNestedGraph.graphOptions

> **graphOptions**: `GraphOptions`

#### forNestedGraph.onLogCallback()?

> `optional` **onLogCallback**: (`log`, `isUpdate`) => `void`

##### Parameters

###### log

[`TransactionLog`](../classes/TransactionLog.md)

###### isUpdate

`boolean`

##### Returns

`void`

### inputSchema?

> `optional` **inputSchema**: `any`

### log?

> `optional` **log**: [`TransactionLog`](../classes/TransactionLog.md)[]

### namedInputs

> **namedInputs**: `NamedInputDataType`

### params

> **params**: `NodeDataParams`\<`ParamsType`\>
