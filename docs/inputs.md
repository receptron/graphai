# In the design of namedInputs and agent response data, we define the template data types.

## array

```
{
  array: [],
  item: "a"
}
```

```
{
  array: [],
  items: "a"
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

### meaningful parameters
wikipedia
{
  query: text
}

tokenBoundStrings
{
  chunks: string[]
}

