# In the design of namedInputs and agent response data, we define the template data types.

## array and the data(item)

```
{
  array: [],
  item: "a"
}
```

## text

```
{
  text: "123",
}
```

## message

Message is the format of data passed to the LLM history.

```
{
  message: {
    role: "user",
    content: "123"
  }
}
```

## data
```
{
 data: object
}
```

## buffer
```
{
 buffer: Buffer(node buffer)
}
```


## file

```
{
 file: string(file name)
 dir: string(the dir name/path)
 baseDir: string(base directory name/path)
}
```


### meaningful parameters
wikipedia
```
{
  query: text
}
```
tokenBoundStrings

```
{
  chunks: string[]
}
```



---
### Change from `inputs: []` array to `inputs: {}` object (dictionary) 22/sep/2024

The input format has been updated from an `inputs: []` array to an `inputs: {}` object. Please update the `inputs` configuration for the following agents used in your graph data.

---

## Change `inputs: []` array to `{}` object
- `dataObjectMergeTemplateAgent`: {array}
- `totalAgent`: {array}
- `dataSumTemplateAgent`: {array}
- `sleep`: {array}
- `slashGPT`: {array}
- `stringEmbeddingsAgent`: {array, item}
- `mergeNodeIdAgent`: {array}

---

## Change `inputs[0]` to an object
- `copyAgent`: `inputs[0]` -> object
- `copy2ArrayAgent`: `inputs[0]` -> object

---

## Assign a new name when passing the `inputs[]` array
- `wikipedia`: {query}

---

## Return the object as is
- `bypassAgent`: object (returns as is)

---

## Specification Changes
- `jsonParserAgent`:
  - Discontinue `params.stringify`
  - `{data}` -> stringify
  - `{text}` -> parse
