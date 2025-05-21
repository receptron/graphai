# Named Inputs in GraphAI

GraphAI has moved from array-based inputs to named inputs to improve code readability and maintainability. This document explains the new input format and how to migrate from the old format.

## Old Format (Deprecated)

The old format used array-based inputs:

```yaml
inputs:
  - :someNode.output
  - value: "some static value"
```

## New Format

The new format uses named inputs:

```yaml
inputs:
  data: :someNode.output
  staticValue: "some static value"
```

## Migration Guide

### Basic Input

Old format:
```yaml
inputs:
  - :someNode.output
```

New format:
```yaml
inputs:
  data: :someNode.output
```

### Multiple Inputs

Old format:
```yaml
inputs:
  - :firstNode.output
  - :secondNode.output
```

New format:
```yaml
inputs:
  array: [:firstNode.output, :secondNode.output]
```

### Static Values

Old format:
```yaml
inputs:
  - role: user
  - content: "Hello"
```

New format:
```yaml
inputs:
  role: "user"
  content: "Hello"
```

## Example

```yaml
# Old
agent: stringTemplateAgent
params:
  template: "Hello, ${0}!"
inputs:
  - :name.value

# New
agent: stringTemplateAgent
params:
  template: "Hello, ${name}!"
inputs:
  name: :name.value
```
