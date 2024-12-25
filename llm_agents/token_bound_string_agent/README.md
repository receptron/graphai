
# @graphai/token_bound_string_agent

This agent generate a reference string from a sorted array of strings, adding one by one until the token count exceeds the specified limit.

### Install

```sh
yarn add @graphai/llm_utils
```


### Parameters

```
  limit?: number; // specifies the maximum token count. The default is 5000.
```  

### Inputs

```
  chunks: Array<string>; // array of string sorted by relevance.
```


### Result

```
  { content: string, tokenCount: number, endIndex: number } // reference text
```
