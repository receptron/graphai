# compareAgent

## Description

compare

## Schema

#### inputs

```json

{}

````

#### output

```json

{}

````

## Input example of the next node

```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    "abc",
    "==",
    "abc"
  ]
}

````

#### params

```json

{"value":{"true":"a","false":"b"}}

````

#### result

```json

"a"

````
### Sample1

#### inputs

```json

{
  "array": [
    "abc",
    "==",
    "abca"
  ]
}

````

#### params

```json

{"value":{"true":"a","false":"b"}}

````

#### result

```json

"b"

````
### Sample2

#### inputs

```json

{
  "array": [
    "abc",
    "==",
    "abc"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample3

#### inputs

```json

{
  "array": [
    "abc",
    "==",
    "abcd"
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample4

#### inputs

```json

{
  "array": [
    "abc",
    "!=",
    "abc"
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample5

#### inputs

```json

{
  "array": [
    "abc",
    "!=",
    "abcd"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample6

#### inputs

```json

{
  "array": [
    "10",
    ">",
    "5"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample7

#### inputs

```json

{
  "array": [
    "10",
    ">",
    "15"
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample8

#### inputs

```json

{
  "array": [
    10,
    ">",
    5
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample9

#### inputs

```json

{
  "array": [
    10,
    ">",
    15
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample10

#### inputs

```json

{
  "array": [
    "10",
    ">=",
    "5"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample11

#### inputs

```json

{
  "array": [
    "10",
    ">=",
    "10"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample12

#### inputs

```json

{
  "array": [
    "10",
    ">=",
    "19"
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample13

#### inputs

```json

{
  "array": [
    10,
    ">=",
    5
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample14

#### inputs

```json

{
  "array": [
    10,
    ">=",
    10
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample15

#### inputs

```json

{
  "array": [
    10,
    ">=",
    19
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample16

#### inputs

```json

{
  "array": [
    "10",
    "<",
    "5"
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample17

#### inputs

```json

{
  "array": [
    "10",
    "<",
    "15"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample18

#### inputs

```json

{
  "array": [
    10,
    "<",
    5
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample19

#### inputs

```json

{
  "array": [
    10,
    "<",
    15
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample20

#### inputs

```json

{
  "array": [
    "10",
    "<=",
    "5"
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample21

#### inputs

```json

{
  "array": [
    "10",
    "<=",
    "10"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample22

#### inputs

```json

{
  "array": [
    "10",
    "<=",
    "19"
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample23

#### inputs

```json

{
  "array": [
    10,
    "<=",
    5
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample24

#### inputs

```json

{
  "array": [
    10,
    "<=",
    10
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample25

#### inputs

```json

{
  "array": [
    10,
    "<=",
    19
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample26

#### inputs

```json

{
  "array": [
    true,
    "||",
    false
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample27

#### inputs

```json

{
  "array": [
    false,
    "||",
    false
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample28

#### inputs

```json

{
  "array": [
    true,
    "&&",
    false
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample29

#### inputs

```json

{
  "array": [
    true,
    "&&",
    true
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample30

#### inputs

```json

{
  "array": [
    true,
    "XOR",
    false
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample31

#### inputs

```json

{
  "array": [
    false,
    "XOR",
    true
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample32

#### inputs

```json

{
  "array": [
    false,
    "XOR",
    false
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample33

#### inputs

```json

{
  "array": [
    true,
    "XOR",
    true
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample34

#### inputs

```json

{
  "array": [
    [
      "aaa",
      "==",
      "aaa"
    ],
    "||",
    [
      "aaa",
      "==",
      "bbb"
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample35

#### inputs

```json

{
  "array": [
    [
      "aaa",
      "==",
      "aaa"
    ],
    "&&",
    [
      "aaa",
      "==",
      "bbb"
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

false

````
### Sample36

#### inputs

```json

{
  "array": [
    [
      [
        "aaa",
        "==",
        "aaa"
      ],
      "&&",
      [
        "bbb",
        "==",
        "bbb"
      ]
    ],
    "||",
    [
      "aaa",
      "&&",
      "bbb"
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

true

````
### Sample37

#### inputs

```json

{
  "array": [
    "abc",
    "abc"
  ]
}

````

#### params

```json

{"value":{"true":"a","false":"b"},"operator":"=="}

````

#### result

```json

"a"

````
### Sample38

#### inputs

```json

{
  "array": [
    "abc",
    "abca"
  ]
}

````

#### params

```json

{"value":{"true":"a","false":"b"},"operator":"=="}

````

#### result

```json

"b"

````
### Sample39

#### inputs

```json

{
  "array": [
    "abc",
    "abc"
  ]
}

````

#### params

```json

{"operator":"=="}

````

#### result

```json

true

````
### Sample40

#### inputs

```json

{
  "array": [
    "abc",
    "abcd"
  ]
}

````

#### params

```json

{"operator":"=="}

````

#### result

```json

false

````
### Sample41

#### inputs

```json

{
  "array": [
    "abc",
    "abc"
  ]
}

````

#### params

```json

{"operator":"!="}

````

#### result

```json

false

````
### Sample42

#### inputs

```json

{
  "array": [
    "abc",
    "abcd"
  ]
}

````

#### params

```json

{"operator":"!="}

````

#### result

```json

true

````
### Sample43

#### inputs

```json

{
  "array": [
    "10",
    "5"
  ]
}

````

#### params

```json

{"operator":">"}

````

#### result

```json

true

````
### Sample44

#### inputs

```json

{
  "array": [
    "10",
    "15"
  ]
}

````

#### params

```json

{"operator":">"}

````

#### result

```json

false

````
### Sample45

#### inputs

```json

{
  "array": [
    10,
    5
  ]
}

````

#### params

```json

{"operator":">"}

````

#### result

```json

true

````
### Sample46

#### inputs

```json

{
  "array": [
    10,
    15
  ]
}

````

#### params

```json

{"operator":">"}

````

#### result

```json

false

````
### Sample47

#### inputs

```json

{
  "array": [
    "10",
    "5"
  ]
}

````

#### params

```json

{"operator":">="}

````

#### result

```json

true

````
### Sample48

#### inputs

```json

{
  "array": [
    "10",
    "10"
  ]
}

````

#### params

```json

{"operator":">="}

````

#### result

```json

true

````
### Sample49

#### inputs

```json

{
  "array": [
    "10",
    "19"
  ]
}

````

#### params

```json

{"operator":">="}

````

#### result

```json

false

````
### Sample50

#### inputs

```json

{
  "array": [
    10,
    5
  ]
}

````

#### params

```json

{"operator":">="}

````

#### result

```json

true

````
### Sample51

#### inputs

```json

{
  "array": [
    10,
    10
  ]
}

````

#### params

```json

{"operator":">="}

````

#### result

```json

true

````
### Sample52

#### inputs

```json

{
  "array": [
    10,
    19
  ]
}

````

#### params

```json

{"operator":">="}

````

#### result

```json

false

````
### Sample53

#### inputs

```json

{
  "array": [
    "10",
    "5"
  ]
}

````

#### params

```json

{"operator":"<"}

````

#### result

```json

false

````
### Sample54

#### inputs

```json

{
  "array": [
    "10",
    "15"
  ]
}

````

#### params

```json

{"operator":"<"}

````

#### result

```json

true

````
### Sample55

#### inputs

```json

{
  "array": [
    10,
    5
  ]
}

````

#### params

```json

{"operator":"<"}

````

#### result

```json

false

````
### Sample56

#### inputs

```json

{
  "array": [
    10,
    15
  ]
}

````

#### params

```json

{"operator":"<"}

````

#### result

```json

true

````
### Sample57

#### inputs

```json

{
  "array": [
    true,
    false
  ]
}

````

#### params

```json

{"operator":"||"}

````

#### result

```json

true

````
### Sample58

#### inputs

```json

{
  "array": [
    false,
    false
  ]
}

````

#### params

```json

{"operator":"||"}

````

#### result

```json

false

````
### Sample59

#### inputs

```json

{
  "array": [
    true,
    false
  ]
}

````

#### params

```json

{"operator":"&&"}

````

#### result

```json

false

````
### Sample60

#### inputs

```json

{
  "array": [
    true,
    true
  ]
}

````

#### params

```json

{"operator":"&&"}

````

#### result

```json

true

````
### Sample61

#### inputs

```json

{
  "array": [
    true,
    false
  ]
}

````

#### params

```json

{"operator":"XOR"}

````

#### result

```json

true

````
### Sample62

#### inputs

```json

{
  "array": [
    false,
    true
  ]
}

````

#### params

```json

{"operator":"XOR"}

````

#### result

```json

true

````
### Sample63

#### inputs

```json

{
  "array": [
    false,
    false
  ]
}

````

#### params

```json

{"operator":"XOR"}

````

#### result

```json

false

````
### Sample64

#### inputs

```json

{
  "array": [
    true,
    true
  ]
}

````

#### params

```json

{"operator":"XOR"}

````

#### result

```json

false

````
### Sample65

#### inputs

```json

{
  "leftValue": "abc",
  "rightValue": "abc"
}

````

#### params

```json

{"value":{"true":"a","false":"b"},"operator":"=="}

````

#### result

```json

"a"

````
### Sample66

#### inputs

```json

{
  "leftValue": "abc",
  "rightValue": "abca"
}

````

#### params

```json

{"value":{"true":"a","false":"b"},"operator":"=="}

````

#### result

```json

"b"

````

## Author

Receptron

## Repository

https://github.com/receptron/graphai

## License

MIT

