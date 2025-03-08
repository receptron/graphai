# GraphAI チュートリアル

## Hello World

[GraphAI](https://github.com/receptron/graphai) は、プログラミングの知識がなくても、GraphAIという宣言的な言語でデータフローを記述することで、AIアプリケーションを構築できるオープンソースプロジェクトです。

以下がGraphAIの「Hello World」の例です。

```YAML
version: 0.5
nodes:
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      prompt: Explain ML's transformer in 100 words.
  output:
    agent: copyAgent
    params:
      namedKey: text
    console:
      after: true
    inputs:
      text: :llm.text

```

このプログラムには2つのノードがあります：

1. **llm**：このノードは「openAIAgent」を実行するノードで、OpenAIの Chat Completion APIを呼びます。入力として「Explain ML's transformer in 100 words.」（ユーザープロンプト）を受け取り、Chat Completion APIの実行結果を返します。
2. **output**：このノードは**llm**ノードの出力を入力として受け取り、コンソールに出力します。

注目すべき点として、**llm**ノードは必要な入力がすべて開始時に利用可能なため即座に実行されますが、**output**は**llm**ノードからのデータが利用可能になった時点で実行されます。

## インストール

以下のコマンドでGraphAIのCLIクライアントをインストールすることで、試すことができます。

```
npm i -g  @receptron/graphai_cli
```

次に、現在のディレクトリにOPENAI_API_KEYを含む.envファイルを作成します。

```
OPENAI_API_KEY=sk-...
```

その後、YAMLファイル（例：「hello.yaml」）を準備し、以下のコマンドを実行します。

```
graphai hello.yaml
```

多くのGraphAI YAMLファイルのサンプルは[Graphai Samples](https://github.com/receptron/graphai_samples)で入手可能です。

## ComputedノードとStaticノード

GraphAIには、*Computedノード*と*Staticノード*の2種類のノードがあります。

Computedノードは特定の計算を実行する*エージェント*に関連付けられています。前の例の両方のノードは*Computedノード*です。

Staticノードは、プログラミング言語における*変数*のように、値を保持する場所です。

以下の例は前と同じ操作を実行しますが、「Explain ML's transformer in 100 words」という値を保持する**prompt**という*Staticノード*を使用しています。

```YAML
version: 0.5
nodes:
  prompt:
    value: Explain ML's transformer in 100 words.
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      prompt: :prompt
  output:
    agent: copyAgent
    params:
      namedKey: text
    console:
      after: true
    inputs:
      text: :llm.text

```

## ループ

データフロー図は設計上、循環を含まないようになっていますが、loop、nested、if/unless、mapなどのいくつかの制御フロー機能を追加しています。

以下は**loop**を使用した簡単なアプリケーションの例です。

```YAML
version: 0.5
loop:
  while: :fruits
nodes:
  fruits:
    value:
      - apple
      - lemomn
      - banana
    update: :shift.array
  result:
    value: []
    update: :reducer.array
    isResult: true
  shift:
    agent: shiftAgent
    inputs:
      array: :fruits
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      prompt: What is the typical color of ${:shift.item}? Just answer the color.
  reducer:
    agent: pushAgent
    inputs:
      array: :result
      item: :llm.text

```

1. **fruits**：このStaticノードは最初にフルーツのリストを保持し、各反復後に**shift**ノードの配列プロパティで更新されます。
2. **result**：このStaticノードは空の配列から始まり、各反復後に**reducer**ノードの値で更新されます。
3. **shift**：このノードは**fruits**ノードの値から最初の項目を取り出し、残りの配列と項目をプロパティとして出力します。
4. **llm**：このComputedノードは、shiftノードの出力からitemプロパティを使用して「What is the typical color of ${:shift.item}? Just answer the color.」というテンプレートでプロンプトを生成し、gpt-4oに渡して結果を得ます。
5. **reducer**：このノードは**llm**ノードの出力の内容を**result**ノードの値に追加します。

配列の各項目は順番に処理されることに注意してください。同時に処理するには、以下のマッピングのセクションを参照してください。

## マッピング

以下は**map**を使用した簡単なアプリケーションの例です。

```YAML
version: 0.5
nodes:
  fruits:
    value:
      - apple
      - lemomn
      - banana
  map:
    agent: mapAgent
    inputs:
      rows: :fruits
    isResult: true
    graph:
      nodes:
        llm:
          agent: openAIAgent
          params:
            model: gpt-4o
          inputs:
            prompt: What is the typical color of ${:row}? Just answer the color.
        result:
          agent: copyAgent
          params:
            namedKey: item
          inputs:
            item: :llm.text
          isResult: true

```

1. **fruits**：このStaticノードはフルーツのリストを保持します。
2. **map**：このノードは**mapAgent**に関連付けられており、**fruits**ノードの値の各項目に対してネストされたグラフを実行し、結合された結果を出力することでマッピングを実行します。
3. **llm**：このComputedノードは、**fruits**ノードの値からitemプロパティを使用して「What is the typical color of ${:row}? Just answer the color.」というテンプレートでプロンプトを生成し、gpt-4oに渡して結果を得ます。
4. **result**：このノードは**llm**ノードの出力からcontent プロパティを取得します。

配列の各項目は同時に処理されることに注意してください。

## チャットボット

以下は、ユーザーが「/bye」と入力するまでLLMと会話できるチャットボットアプリケーションです。

```YAML
version: 0.5
loop:
  while: :continue
nodes:
  continue:
    value: true
    update: :checkInput.result
  messages:
    value: []
    update: :llm.messages
    isResult: true
  userInput:
    agent: textInputAgent
    params:
      message: "You:"
      required: true
  checkInput:
    agent: compareAgent
    inputs:
      array:
        - :userInput.text
        - "!="
        - /bye
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      messages: :messages
      prompt: :userInput.text
  output:
    agent: stringTemplateAgent
    console:
      after: true
    inputs:
      text: "\e[32mAgent\e[0m: ${:llm.text}"

```

1. ユーザーは「You:」というプロンプトでメッセージの入力を求められます。
2. `userInput`がユーザーの入力を取得します。
3. `checkInput`が入力が「/bye」かどうかを評価します。もしそうなら、`continue`が`false`に設定され、ループが停止します。
4. `llm`は更新されたメッセージの配列を使用してAIモデルからの応答を生成します。
5. `output`はAIエージェントの応答をフォーマットしてコンソールに出力します。
6. `reducer`はAIエージェントの応答をメッセージの配列に追加します。
7. `continue`が`true`である限り、ループは継続します。

## 天気：Function Callとネストされたグラフ

以下は、OpenAIのFunction Call機能とネストされたグラフを使用する例です。

```YAML
version: 0.5
loop:
  while: :continue
nodes:
  continue:
    value: true
    update: :checkInput.result
  messages:
    value:
      - role: system
        content: You are a meteorologist. Use getWeather API, only when the user ask for
          the weather information.
    update: :reducer.array.$0
    isResult: true
  userInput:
    agent: textInputAgent
    params:
      message: "Location:"
  checkInput:
    agent: compareAgent
    inputs:
      array:
        - :userInput.text
        - "!="
        - /bye
  llmCall:
    agent: openAIAgent
    params:
      tools:
        - type: function
          function:
            name: getWeather
            description: get weather information of the specified location
            parameters:
              type: object
              properties:
                latitude:
                  type: number
                  description: The latitude of the location.
                longitude:
                  type: number
                  description: The longitude of the location.
              required:
                - latitude
                - longitude
      model: gpt-4o
    inputs:
      messages: :messages
      prompt: :userInput.text
    if: :checkInput
  output:
    agent: stringTemplateAgent
    inputs:
      text: "Weather: ${:llmCall.text}"
    console:
      after: true
    if: :llmCall.text
  messagesWithFirstRes:
    agent: pushAgent
    inputs:
      array: :messages
      items:
        - :userInput.message
        - :llmCall.message
  tool_calls:
    agent: nestedAgent
    inputs:
      parent_messages: :messagesWithFirstRes.array
      parent_tool: :llmCall.tool
    if: :llmCall.tool
    graph:
      nodes:
        outputFetching:
          agent: stringTemplateAgent
          inputs:
            text: "... fetching weather info: ${:parent_tool.arguments.latitude},
              ${:parent_tool.arguments.longitude}"
          console:
            after: true
        fetchPoints:
          agent: fetchAgent
          inputs:
            url: https://api.weather.gov/points/${:parent_tool.arguments.latitude},${:parent_tool.arguments.longitude}
            headers:
              User-Agent: (receptron.org)
        fetchForecast:
          agent: fetchAgent
          params:
            type: text
          inputs:
            url: :fetchPoints.properties.forecast
            headers:
              User-Agent: (receptron.org)
          unless: :fetchPoints.onError
        extractError:
          agent: stringTemplateAgent
          inputs:
            text: "${:fetchPoints.onError.error.title}:
              ${:fetchPoints.onError.error.detail}"
          if: :fetchPoints.onError
        responseText:
          agent: copyAgent
          anyInput: true
          inputs:
            array:
              - :fetchForecast
              - :extractError
        messagesWithToolRes:
          agent: pushAgent
          inputs:
            array: :parent_messages
            item:
              role: tool
              tool_call_id: :parent_tool.id
              name: :parent_tool.name
              content: :responseText.array.$0
        llmCall:
          agent: openAIAgent
          inputs:
            messages: :messagesWithToolRes.array
          params:
            model: gpt-4o
        output:
          agent: stringTemplateAgent
          inputs:
            text: "Weather: ${:llmCall.text}"
          console:
            after: true
        messagesWithSecondRes:
          agent: pushAgent
          inputs:
            array: :messagesWithToolRes.array
            item: :llmCall.message
          isResult: true
  no_tool_calls:
    agent: copyAgent
    unless: :llmCall.tool
    inputs:
      result: :messagesWithFirstRes.array
  reducer:
    agent: copyAgent
    anyInput: true
    inputs:
      array:
        - :no_tool_calls.result
        - :tool_calls.messagesWithSecondRes.array

```

1. **ループ実行**：`continue`ノードで指定された条件がfalseになるまでグラフは継続的にループします。
2. **ユーザー入力プロンプト**：システムはユーザーに位置情報の入力を求めます。
3. **ユーザー入力処理**：会話を継続すべきかどうかを判断するために入力がチェックされます。
4. **メッセージ構築**：ユーザー入力が処理され、会話に追加されます。
5. **LLM呼び出し**：システムは会話に基づいて応答を生成するためにAIモデルを呼び出します。
6. **ツール呼び出し**：AI応答にツール呼び出し（例：天気データの取得）が含まれている場合、ネストされたグラフがツール呼び出しを処理し、必要な情報を取得します。
7. **出力生成**：取得した天気情報を含む最終的な応答がフォーマットされ、コンソールに出力されます。

## 動的グラフ生成

LLMにGraphAI yamlを動的に生成させて実行することも可能です。これはコードインタープリターと同等の機能です。

以下に例を示します（Markdownパーサーが埋め込まれたjsonタグで混乱するため、ここにコードを貼り付けることはできません）：

[https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml](https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml)

このサンプルアプリケーションは、サンプルのGraphAIグラフ（[reception.yaml](https://github.com/receptron/graphai/blob/main/packages/samples/data/reception.json)、ユーザーから名前、生年月日、性別を取得するもの）に基づいて新しいGraphAIグラフを生成し、実行します。生成されたアプリは代わりに名前、住所、電話番号を取得します。

## インメモリRAG

このサンプルアプリケーションは、Wikipediaの記事をチャンクに分割し、それらのチャンクの埋め込みベクトルを取得、コサイン類似度に基づいて適切なプロンプトを作成することで、インメモリRAGを実現します。

```YAML
version: 0.5
nodes:
  source:
    value:
      name: Sam Bankman-Fried
      topic: sentence by the court
      query: describe the final sentence by the court for Sam Bank-Fried
  wikipedia:
    console:
      before: ...fetching data from wikkpedia
    agent: wikipediaAgent
    inputs:
      query: :source.name
    params:
      lang: en
  chunks:
    console:
      before: ...splitting the article into chunks
    agent: stringSplitterAgent
    inputs:
      text: :wikipedia.content
  chunkEmbeddings:
    console:
      before: ...fetching embeddings for chunks
    agent: stringEmbeddingsAgent
    inputs:
      array: :chunks.contents
  topicEmbedding:
    console:
      before: ...fetching embedding for the topic
    agent: stringEmbeddingsAgent
    inputs:
      item: :source.topic
  similarities:
    agent: dotProductAgent
    inputs:
      matrix: :chunkEmbeddings
      vector: :topicEmbedding.$0
  sortedChunks:
    agent: sortByValuesAgent
    inputs:
      array: :chunks.contents
      values: :similarities
  referenceText:
    agent: tokenBoundStringsAgent
    inputs:
      chunks: :sortedChunks
    params:
      limit: 5000
  prompt:
    agent: stringTemplateAgent
    inputs:
      prompt: :source.query
      text: :referenceText.content
    params:
      template: |-
        Using the following document, ${text}

        ${prompt}
  RagQuery:
    console:
      before: ...performing the RAG query
    agent: openAIAgent
    inputs:
      prompt: :prompt
    params:
      model: gpt-4o
  OneShotQuery:
    agent: openAIAgent
    inputs:
      prompt: :source.query
    params:
      model: gpt-4o
  RagResult:
    agent: copyAgent
    inputs:
      result: :RagQuery.text
    isResult: true
  OneShotResult:
    agent: copyAgent
    inputs:
      result: :OneShotQuery.text
    isResult: true

```
