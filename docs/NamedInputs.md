

### Change from `inputs: []` array to `inputs: {}` object (dictionary)

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


22/sep/2024