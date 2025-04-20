# In the design of namedInputs and agent response data, we define the template data types.

## array and the data(item)

```
{
  array: [],
  item: "a",
  items: [],
}
```

## text

```
{
  text: "123",
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
  buffer: Buffer(node buffer or npm buffer)
}
```

## file read stream
{
  inputStream: fs.ReadStream
}

## llm message

Message is the format of data passed to the LLM history.

```
{
  message: {
    role: "user",
    content: "123"
  }
}
```

## file

```
{
 file: string(file name)
 dir: string(the dir name/path)
 baseDir: string(base directory name/path)
 path: string(file or dir path)
}
```

## typeInfo

```
{
  type: string,
  inputType: string,
  outputType: string,
  dataType: string,
}
```

### meaningful parameters

search query / wikipedia or serper

```
{
  query: string,
  queries: string[]
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

- `dataObjectMergeTemplateAgent`: `{array}`
- `totalAgent`: `{array}`
- `dataSumTemplateAgent`: `{array}`
- `sleep`: `{array}`
- `slashGPT`: `{array}`
- `stringEmbeddingsAgent`: `{array, item}`
- `mergeNodeIdAgent`: `{array}`

---

## Change `inputs[0]` to an object

- `copyAgent`: `inputs[0]` -> object
- `copy2ArrayAgent`: `inputs[0]` -> object

---

## Assign a new name when passing the `inputs[]` array

- `wikipedia`: `{query}`

---

## Return the object as is

- `bypassAgent`: object (returns as is)

---

## Specification Changes

- `jsonParserAgent`:
  - Discontinue `params.stringify`
  - `{data}` -> stringify
  - `{text}` -> parse
