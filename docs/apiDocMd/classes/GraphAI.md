[**graphai**](../README.md)

***

[graphai](../globals.md) / GraphAI

# Class: GraphAI

Defined in: [packages/graphai/src/graphai.ts:31](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L31)

## Constructors

### new GraphAI()

> **new GraphAI**(`graphData`, `agentFunctionInfoDictionary`, `options`): [`GraphAI`](GraphAI.md)

Defined in: [packages/graphai/src/graphai.ts:125](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L125)

#### Parameters

##### graphData

[`GraphData`](../type-aliases/GraphData.md)

##### agentFunctionInfoDictionary

[`AgentFunctionInfoDictionary`](../type-aliases/AgentFunctionInfoDictionary.md)

##### options

`GraphOptions` = `...`

#### Returns

[`GraphAI`](GraphAI.md)

## Properties

### agentFilters

> `readonly` **agentFilters**: [`AgentFilterInfo`](../type-aliases/AgentFilterInfo.md)[]

Defined in: [packages/graphai/src/graphai.ts:41](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L41)

***

### agentFunctionInfoDictionary

> `readonly` **agentFunctionInfoDictionary**: [`AgentFunctionInfoDictionary`](../type-aliases/AgentFunctionInfoDictionary.md)

Defined in: [packages/graphai/src/graphai.ts:39](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L39)

***

### bypassAgentIds

> `readonly` **bypassAgentIds**: `string`[]

Defined in: [packages/graphai/src/graphai.ts:37](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L37)

***

### callbacks

> **callbacks**: [`CallbackFunction`](../type-aliases/CallbackFunction.md)[] = `[]`

Defined in: [packages/graphai/src/graphai.ts:48](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L48)

***

### config?

> `readonly` `optional` **config**: [`ConfigDataDictionary`](../type-aliases/ConfigDataDictionary.md) = `{}`

Defined in: [packages/graphai/src/graphai.ts:38](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L38)

***

### graphId

> `readonly` **graphId**: `string`

Defined in: [packages/graphai/src/graphai.ts:33](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L33)

***

### graphLoader?

> `readonly` `optional` **graphLoader**: [`GraphDataLoader`](../type-aliases/GraphDataLoader.md)

Defined in: [packages/graphai/src/graphai.ts:44](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L44)

***

### nodes

> **nodes**: `GraphNodes`

Defined in: [packages/graphai/src/graphai.ts:46](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L46)

***

### onLogCallback

> **onLogCallback**: [`CallbackFunction`](../type-aliases/CallbackFunction.md)

Defined in: [packages/graphai/src/graphai.ts:47](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L47)

***

### propFunctions

> `readonly` **propFunctions**: `PropFunction`[]

Defined in: [packages/graphai/src/graphai.ts:43](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L43)

***

### retryLimit?

> `readonly` `optional` **retryLimit**: `number`

Defined in: [packages/graphai/src/graphai.ts:42](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L42)

***

### taskManager

> `readonly` **taskManager**: `TaskManager`

Defined in: [packages/graphai/src/graphai.ts:40](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L40)

***

### verbose

> **verbose**: `boolean`

Defined in: [packages/graphai/src/graphai.ts:49](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L49)

***

### version

> `readonly` **version**: `number`

Defined in: [packages/graphai/src/graphai.ts:32](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L32)

## Methods

### abort()

> **abort**(): `void`

Defined in: [packages/graphai/src/graphai.ts:281](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L281)

#### Returns

`void`

***

### appendLog()

> **appendLog**(`log`): `void`

Defined in: [packages/graphai/src/graphai.ts:359](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L359)

#### Parameters

##### log

[`TransactionLog`](TransactionLog.md)

#### Returns

`void`

***

### asString()

> **asString**(): `string`

Defined in: [packages/graphai/src/graphai.ts:184](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L184)

#### Returns

`string`

***

### clearCallbacks()

> **clearCallbacks**(): `void`

Defined in: [packages/graphai/src/graphai.ts:374](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L374)

#### Returns

`void`

***

### errors()

> **errors**(): `Record`\<`string`, `Error`\>

Defined in: [packages/graphai/src/graphai.ts:204](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L204)

#### Returns

`Record`\<`string`, `Error`\>

***

### getAgentFunctionInfo()

> **getAgentFunctionInfo**(`agentId`?): [`AgentFunctionInfo`](../type-aliases/AgentFunctionInfo.md) \| \{ `agent`: () => `Promise`\<`null`\>; `cacheType`: `undefined`; `hasGraphData`: `boolean`; `inputs`: `null`; \}

Defined in: [packages/graphai/src/graphai.ts:166](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L166)

#### Parameters

##### agentId?

`string`

#### Returns

[`AgentFunctionInfo`](../type-aliases/AgentFunctionInfo.md) \| \{ `agent`: () => `Promise`\<`null`\>; `cacheType`: `undefined`; `hasGraphData`: `boolean`; `inputs`: `null`; \}

***

### initializeGraphAI()

> **initializeGraphAI**(): `void`

Defined in: [packages/graphai/src/graphai.ts:344](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L344)

#### Returns

`void`

***

### injectValue()

> **injectValue**(`nodeId`, `value`, `injectFrom`?): `void`

Defined in: [packages/graphai/src/graphai.ts:384](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L384)

#### Parameters

##### nodeId

`string`

##### value

[`ResultData`](../type-aliases/ResultData.md)

##### injectFrom?

`string`

#### Returns

`void`

***

### isRunning()

> **isRunning**(): `boolean`

Defined in: [packages/graphai/src/graphai.ts:300](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L300)

#### Returns

`boolean`

***

### onExecutionComplete()

> **onExecutionComplete**(`node`): `void`

Defined in: [packages/graphai/src/graphai.ts:305](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L305)

#### Parameters

##### node

`ComputedNode`

#### Returns

`void`

***

### pushQueue()

> **pushQueue**(`node`): `void`

Defined in: [packages/graphai/src/graphai.ts:239](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L239)

#### Parameters

##### node

`ComputedNode`

#### Returns

`void`

***

### pushQueueIfReadyAndRunning()

> **pushQueueIfReadyAndRunning**(`node`): `void`

Defined in: [packages/graphai/src/graphai.ts:232](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L232)

#### Parameters

##### node

`ComputedNode`

#### Returns

`void`

***

### registerCallback()

> **registerCallback**(`callback`): `void`

Defined in: [packages/graphai/src/graphai.ts:370](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L370)

#### Parameters

##### callback

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

#### Returns

`void`

***

### resetPending()

> **resetPending**(): `void`

Defined in: [packages/graphai/src/graphai.ts:291](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L291)

#### Returns

`void`

***

### resultOf()

> **resultOf**(`source`): [`ResultData`](../type-aliases/ResultData.md)

Defined in: [packages/graphai/src/graphai.ts:400](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L400)

#### Parameters

##### source

`DataSource`

#### Returns

[`ResultData`](../type-aliases/ResultData.md)

***

### results()

> **results**\<`T`\>(`all`): [`ResultDataDictionary`](../type-aliases/ResultDataDictionary.md)\<`T`\>

Defined in: [packages/graphai/src/graphai.ts:191](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L191)

#### Type Parameters

• **T** = [`DefaultResultData`](../type-aliases/DefaultResultData.md)

#### Parameters

##### all

`boolean`

#### Returns

[`ResultDataDictionary`](../type-aliases/ResultDataDictionary.md)\<`T`\>

***

### resultsOf()

> **resultsOf**(`inputs`?, `anyInput`?): `Record`\<`string`, [`ResultData`](../type-aliases/ResultData.md)\>

Defined in: [packages/graphai/src/graphai.ts:393](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L393)

#### Parameters

##### inputs?

`Record`\<`string`, `any`\>

##### anyInput?

`boolean` = `false`

#### Returns

`Record`\<`string`, [`ResultData`](../type-aliases/ResultData.md)\>

***

### run()

> **run**\<`T`\>(`all`): `Promise`\<[`ResultDataDictionary`](../type-aliases/ResultDataDictionary.md)\<`T`\>\>

Defined in: [packages/graphai/src/graphai.ts:249](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L249)

#### Type Parameters

• **T** = [`DefaultResultData`](../type-aliases/DefaultResultData.md)

#### Parameters

##### all

`boolean` = `false`

#### Returns

`Promise`\<[`ResultDataDictionary`](../type-aliases/ResultDataDictionary.md)\<`T`\>\>

***

### setLoopLog()

> **setLoopLog**(`log`): `void`

Defined in: [packages/graphai/src/graphai.ts:354](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L354)

#### Parameters

##### log

[`TransactionLog`](TransactionLog.md)

#### Returns

`void`

***

### setPreviousResults()

> **setPreviousResults**(`previousResults`): `void`

Defined in: [packages/graphai/src/graphai.ts:351](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L351)

#### Parameters

##### previousResults

[`ResultDataDictionary`](../type-aliases/ResultDataDictionary.md)\<[`DefaultResultData`](../type-aliases/DefaultResultData.md)\>

#### Returns

`void`

***

### transactionLogs()

> **transactionLogs**(): [`TransactionLog`](TransactionLog.md)[]

Defined in: [packages/graphai/src/graphai.ts:379](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L379)

#### Returns

[`TransactionLog`](TransactionLog.md)[]

***

### updateLog()

> **updateLog**(`log`): `void`

Defined in: [packages/graphai/src/graphai.ts:365](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/graphai.ts#L365)

#### Parameters

##### log

[`TransactionLog`](TransactionLog.md)

#### Returns

`void`
