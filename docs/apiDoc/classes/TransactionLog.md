[**graphai**](../README.md)

***

[graphai](../globals.md) / TransactionLog

# Class: TransactionLog

Defined in: [packages/graphai/src/transaction\_log.ts:7](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L7)

## Constructors

### new TransactionLog()

> **new TransactionLog**(`nodeId`): [`TransactionLog`](TransactionLog.md)

Defined in: [packages/graphai/src/transaction\_log.ts:25](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L25)

#### Parameters

##### nodeId

`string`

#### Returns

[`TransactionLog`](TransactionLog.md)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [packages/graphai/src/transaction\_log.ts:13](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L13)

***

### endTime?

> `optional` **endTime**: `number`

Defined in: [packages/graphai/src/transaction\_log.ts:11](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L11)

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [packages/graphai/src/transaction\_log.ts:18](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L18)

***

### injectFrom?

> `optional` **injectFrom**: `string`

Defined in: [packages/graphai/src/transaction\_log.ts:17](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L17)

***

### inputs?

> `optional` **inputs**: `string`[]

Defined in: [packages/graphai/src/transaction\_log.ts:15](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L15)

***

### inputsData?

> `optional` **inputsData**: [`ResultData`](../type-aliases/ResultData.md)[]

Defined in: [packages/graphai/src/transaction\_log.ts:16](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L16)

***

### isLoop?

> `optional` **isLoop**: `boolean`

Defined in: [packages/graphai/src/transaction\_log.ts:22](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L22)

***

### log?

> `optional` **log**: [`TransactionLog`](TransactionLog.md)[]

Defined in: [packages/graphai/src/transaction\_log.ts:24](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L24)

***

### mapIndex?

> `optional` **mapIndex**: `number`

Defined in: [packages/graphai/src/transaction\_log.ts:21](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L21)

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/graphai/src/transaction\_log.ts:8](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L8)

***

### params?

> `optional` **params**: [`DefaultParamsType`](../type-aliases/DefaultParamsType.md)

Defined in: [packages/graphai/src/transaction\_log.ts:14](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L14)

***

### repeatCount?

> `optional` **repeatCount**: `number`

Defined in: [packages/graphai/src/transaction\_log.ts:23](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L23)

***

### result?

> `optional` **result**: [`ResultData`](../type-aliases/ResultData.md)

Defined in: [packages/graphai/src/transaction\_log.ts:19](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L19)

***

### resultKeys?

> `optional` **resultKeys**: `string`[]

Defined in: [packages/graphai/src/transaction\_log.ts:20](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L20)

***

### retryCount?

> `optional` **retryCount**: `number`

Defined in: [packages/graphai/src/transaction\_log.ts:12](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L12)

***

### startTime?

> `optional` **startTime**: `number`

Defined in: [packages/graphai/src/transaction\_log.ts:10](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L10)

***

### state

> **state**: [`NodeState`](../enumerations/NodeState.md)

Defined in: [packages/graphai/src/transaction\_log.ts:9](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L9)

## Methods

### beforeAddTask()

> **beforeAddTask**(`node`, `graph`): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:73](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L73)

#### Parameters

##### node

`ComputedNode`

##### graph

[`GraphAI`](GraphAI.md)

#### Returns

`void`

***

### beforeExecute()

> **beforeExecute**(`node`, `graph`, `transactionId`, `inputs`): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:63](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L63)

#### Parameters

##### node

`ComputedNode`

##### graph

[`GraphAI`](GraphAI.md)

##### transactionId

`number`

##### inputs

[`ResultData`](../type-aliases/ResultData.md)[]

#### Returns

`void`

***

### initForComputedNode()

> **initForComputedNode**(`node`, `graph`): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:30](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L30)

#### Parameters

##### node

`ComputedNode`

##### graph

[`GraphAI`](GraphAI.md)

#### Returns

`void`

***

### onComplete()

> **onComplete**(`node`, `graph`, `localLog`): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:51](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L51)

#### Parameters

##### node

`ComputedNode`

##### graph

[`GraphAI`](GraphAI.md)

##### localLog

[`TransactionLog`](TransactionLog.md)[]

#### Returns

`void`

***

### onError()

> **onError**(`node`, `graph`, `errorMessage`): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:79](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L79)

#### Parameters

##### node

`ComputedNode`

##### graph

[`GraphAI`](GraphAI.md)

##### errorMessage

`string`

#### Returns

`void`

***

### onInjected()

> **onInjected**(`node`, `graph`, `injectFrom`?): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:36](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L36)

#### Parameters

##### node

`StaticNode`

##### graph

[`GraphAI`](GraphAI.md)

##### injectFrom?

`string`

#### Returns

`void`

***

### onSkipped()

> **onSkipped**(`node`, `graph`): `void`

Defined in: [packages/graphai/src/transaction\_log.ts:87](https://github.com/kawamataryo/graphai/blob/5c4c4325bb275f17c58187664137731b5dc52a39/packages/graphai/src/transaction_log.ts#L87)

#### Parameters

##### node

`ComputedNode`

##### graph

[`GraphAI`](GraphAI.md)

#### Returns

`void`
