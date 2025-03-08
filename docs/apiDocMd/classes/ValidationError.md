[**graphai**](../README.md)

***

[graphai](../globals.md) / ValidationError

# Class: ValidationError

Defined in: [packages/graphai/src/validators/common.ts:24](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/validators/common.ts#L24)

## Extends

- `Error`

## Constructors

### new ValidationError()

> **new ValidationError**(`message`): [`ValidationError`](ValidationError.md)

Defined in: [packages/graphai/src/validators/common.ts:25](https://github.com/kawamataryo/graphai/blob/e8a7b825cfe5b60039202cad9c90359642833517/packages/graphai/src/validators/common.ts#L25)

#### Parameters

##### message

`string`

#### Returns

[`ValidationError`](ValidationError.md)

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
