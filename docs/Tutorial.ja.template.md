# GraphAI チュートリアル

## Hello World

[GraphAI](https://github.com/receptron/graphai) は、プログラミングの知識がなくても、GraphAIという宣言的な言語でデータフローを記述することで、AIアプリケーションを構築できるオープンソースプロジェクトです。

以下がGraphAIの「Hello World」の例です。

```YAML
${packages/samples/graph_data/openai/simple.yaml}
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

Computedノードは特定のプログラムを実行する*エージェント*に関連付けられています。前の例の両方のノードは*Computedノード*です。

Staticノードは、プログラミング言語における*変数*のように、値を保持する場所です。

以下の例は前と同じ操作を実行しますが、「Explain ML's transformer in 100 words」という値を保持する**prompt**という*Staticノード*を使用しています。

```YAML
${packages/samples/graph_data/openai/simple2.yaml}
```

## loop(ループ)

GraphAIのデータフローは仕様上、循環を含まない（一度呼んだNodeを再度呼ばない)ようになっていますが、loop、nested、if/unless、map(mapreduceの機能の)などのいくつかの制御フロー機能を追加しています。

以下は**loop**を使用した簡単なアプリケーションの例です。

```YAML
${packages/samples/graph_data/openai/loop.yaml}
```

1. **fruits**：このStaticノードは最初にフルーツのリストを保持し、各反復後に**shift**ノードのarrayプロパティで更新されます。(`update: :shift.array`)
2. **result**：このStaticノードは空の配列から始まり、各反復後に**reducer**ノードのarrayプロパティ値で更新されます。
3. **shift**：このノードは**fruits**ノードの値から配列の１つ目の値を取り出し、残りの配列と共に`{ array, iten }`項目をプロパティとして出力します。
4. **llm**：このComputedノードは、shiftノードの出力からitemプロパティを使用して「What is the typical color of ${:shift.item}? Just answer the color.」というテンプレートでプロンプトを生成し、gpt-4oに渡して結果を得ます。
5. **reducer**：このノードは**result**ノードの入れるに、**llm**ノードの結果`{text}`を追加します。

配列の各項目は順番に処理されることに注意してください。**fruits**ノードの配列が空になるまで反復(loop)します。
同時に処理するには、以下のマッピングのセクションを参照してください。

## マッピング

以下は**map**を使用した簡単なアプリケーションの例です。

```YAML
${packages/samples/graph_data/openai/map.yaml}
```

1. **fruits**：このStaticノードはフルーツのリストを保持します。
2. **map**：このノードは**mapAgent**に関連付けられており、**fruits**ノードの値の各項目に対してネストされたグラフを実行し、結合された結果を出力することでマッピングを実行します。
3. **llm**：このComputedノードは、**fruits**ノードの値からitemプロパティを使用して「What is the typical color of ${:row}? Just answer the color.」というテンプレートでプロンプトを生成し、gpt-4oに渡して結果を得ます。
4. **result**：このノードは**llm**ノードの出力からcontent プロパティを取得します。

配列の各項目は同時に処理されることに注意してください。

## チャットボット

以下は、ユーザーが「/bye」と入力するまでLLMと会話できるチャットボットアプリケーションです。

```YAML
${packages/samples/graph_data/openai/chat.yaml}
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
${packages/samples/graph_data/openai/weather.yaml}
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
${packages/samples/graph_data/openai/wikipedia_rag.yaml}
```
