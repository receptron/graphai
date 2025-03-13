# GraphAIのストリーミングについて

GraphAIでは、サーバーサイド、クライアントサイド、またはサーバー・クライアント連携を通じて、LLMプロンプトのストリーミング処理をシームレスに扱うことができます。

ここでいう「シームレス」とは、GraphAIのデフォルトのExpressミドルウェアやHTTP/ストリーミングエージェントフィルターを使用することで、サーバー・クライアント間やストリーミング処理を明示的に管理することなく操作できることを指します。

実装後は、最小限のコード修正で設定を変更するだけで、クライアントからサーバーへのプロセス移行やサーバー設定の調整が可能です。この柔軟性により、開発者はストリーミング処理の実装の複雑さを気にすることなく、ビジネスロジックに集中できます。

- ブラウザまたはNode.jsで単独実行
- ブラウザとサーバー間での協調実行：
  - GraphAIをブラウザで動作させながら、エージェントをサーバーで実行
  - ブラウザからグラフデータを投稿してサーバー上で全体を実行

これらの組み合わせにより、セットアップに関係なく透過的なストリーミングが可能です。

# ストリーミング処理の概要

1. **逐次データ送信**
   エージェントの実行中、データが生成されるたびにコールバック関数を通じてエージェントフィルターに渡されます。データを一括処理するのではなく、各データユニットを処理するためにコールバック関数が順次呼び出されます。

2. **コールバック関数内での処理**
   コールバック関数は、コンテキストから`nodeId`、`agentId`、`data`などの情報を受け取り、異なる環境ごとにデータを個別に処理します。

   - **ブラウザの場合**
     コールバック関数を通じて受け取ったデータをブラウザでリアルタイムに表示し、ライブ更新を可能にします。

   - **Express（Webサーバー）の場合**
     コールバック関数を通じて受け取ったデータを処理し、HTTPレスポンスとして返します。これにより、APIを利用するシナリオで即時のレスポンスが可能になります。

このメカニズムにより、エージェント実行中のリアルタイムなデータ処理、表示、レスポンスが可能になります。

## エージェント内でのエージェントフィルターへのデータ受け渡し

```typescript
  for await (const message of chatStream) {
    const token = message.choices[0].delta.content;
    if (filterParams && filterParams.streamTokenCallback && token) {
      filterParams.streamTokenCallback(token);
    }
  }
```

## agentFilter

この節では、`streamAgentFilterGenerator`関数を使用してストリーミング処理用の`agentFilter`を作成する方法を説明します。コールバック関数を指定することで、リアルタイムでデータを処理できる`agentFilter`を取得できます。

```typescript
export const streamAgentFilterGenerator = <T>(callback: (context: AgentFunctionContext, data: T) => void) => {
  const streamAgentFilter: AgentFilterFunction = async (context, next) => {
    if (context.debugInfo.isResult) {
      context.filterParams.streamTokenCallback = (data: T) => {
        callback(context, data);
      };
    }
    return next(context);
  };
  return streamAgentFilter;
};
```

### 使用方法

1. **コールバック関数の定義**
   `context`と`data`を引数に取るコールバック関数を作成します。この関数はエージェントがデータを受け取るたびに呼び出され、リアルタイム処理を可能にします。

```typescript
const myCallback = (context, data) => {
  console.log("受信データ:", data);
  // 必要な処理をここに実装
};
```

2. **streamAgentFilterの取得**
   コールバック関数を`streamAgentFilterGenerator`に渡して、データを逐次処理する`agentFilter`を生成します。この`agentFilter`はエージェント実行中のリアルタイムデータ処理を担当します。

```typescript
const myAgentFilter = streamAgentFilterGenerator(myCallback);
```

これで`streamAgentFilterGenerator`を使用したagentFilter処理の設定は完了です。このagentFilterをGraphAIコンストラクタの`agentFilters`パラメータに渡すことで、コールバック関数による逐次データ処理の仕組みを構築できます。

## ストリーミング処理について

### 1. GraphAIの直接使用（ブラウザ）

- エージェントフィルターを介してコールバック関数でストリーミングデータを受信
- `graphai.run()`から全体の結果を取得
- デリミタやデータ形式を考慮する必要なく、実装側でストリーミングと結果処理を制御可能

### 2. Expressの使用

- HTTPの仕組みにより、文字列が逐次送信される
- デフォルトでは、トークン（文字列）が逐次ストリーミングされ、`__END__`デリミタの後に結果（content）がJSON文字列として返される
- Expressにコールバック関数を渡すことで、トークン処理、デリミタ、コンテンツ処理をカスタマイズ可能

## Express制御

Expressは、ストリーミングサーバー、非ストリーミングサーバー、および両方をサポートするサーバーのためのミドルウェアを提供します。両方をサポートするミドルウェアを使用することで、エージェントがストリーミングをサポートしている場合でも、HTTPヘッダーを通じてストリーミング制御が可能です。

具体的な判定は、以下のHTTPヘッダーの有無で行われます：

- `Content-Type`が`text/event-stream`に設定されている

# サーバー・クライアントモデルの補足

ブラウザでGraphAIを動作させ、サーバーでエージェントを実行する場合、`streamAgentFilter`と`httpAgentFilter`を併用する必要があります。`httpAgentFilter`はブラウザでの処理をバイパスし、サーバー上でエージェントを実行します。ブラウザにエージェントが存在しない場合は、`bypassAgentIds`を使用してエージェントの検証をスキップします。

```typescript
const agentFilters = [
  {
    name: "streamAgentFilter",
    agent: streamAgentFilter,
    agentIds: streamAgents,
  },
  {
    name: "httpAgentFilter",
    agent: httpAgentFilter,
    filterParams: {
      server: {
        baseUrl: "http://localhost:8085/agents",
      },
    },
    agentIds: serverAgentIds,
  },
];
const graphai = new GraphAI(selectedGraph.value, agents, { agentFilters, bypassAgentIds: serverAgentIds });
```

## 参考ソース

- Expressコールバック関数の例：
  https://github.com/receptron/graphai-utils/blob/b302835d978ce1017c6e105898431eda28adcbd4/packages/express/src/agents.ts#L122-L135

- Expressの実装：
  https://github.com/receptron/graphai-utils/tree/main/packages/express/src

- streamAgentFilterGeneratorの実装：
  https://github.com/receptron/graphai/blob/main/packages/agent_filters/src/filters/stream.ts

- httpAgentFilterの実装（GraphAI AgentのエージェントFilterクライアント形式）：
  https://github.com/receptron/graphai/blob/main/packages/agent_filters/src/filters/http_client.ts

- 原文書（日本語）https://zenn.dev/singularity/articles/graphai-streaming
