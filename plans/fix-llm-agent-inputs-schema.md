# fix: LLM エージェントの inputs schema と実装の食い違いを解消する

issue: https://github.com/receptron/graphai/issues/1351

## 問題

各 LLM エージェントは分割代入を 2 つに分けている。

```ts
const { verbose, system, ... } = { ...params, ...namedInputs };
const { apiKey, stream, dataStream, forWeb, model } = { ...params, ...(config || {}) };
```

2 つ目は `namedInputs` を読まない。接続・認証・転送の設定をグラフのデータフローから
差し替えさせない切り分けとしては妥当だが、`inputs` schema がその一部を宣言しているため、
**宣言されているのに無視されるキー**が生まれている。

`namedinput_validator_agent_filter` は ajv で `inputs` schema を検証するだけなので、
宣言されたキーは「正しい」と肯定される。エラーも警告も出ず、`model` は fallback で動き続ける。

確認した挙動（`src` を直接実行）:

| 書き方 | リクエストに乗る model |
|---|---|
| `inputs: { model: "gpt-4o-mini" }` | `gpt-4o`（fallback） |
| `params: { model: "gpt-4o-mini" }` | `gpt-4o-mini` |
| `inputs: { params: { model: ":m" } }` | `gpt-4o-mini` |

`inputs: { apiKey: ... }` も同様に無視され、`Missing credentials` で落ちる。

## 現状の inputs schema（変更前）

| エージェント | apiKey | baseURL | apiVersion | stream | model |
|---|---|---|---|---|---|
| anthropic | - | - | - | - | あり |
| gemini | - | - | - | - | あり |
| groq | - | - | - | あり | あり |
| openai_fetch | あり | あり | - | あり | あり |
| openai | あり | あり | あり | あり | あり |

anthropic / gemini は既に接続・認証系を `inputs` に載せていない。ここへ揃える。

## 方針

三層を「誰がいつ決める値か」で分ける。動的な側が勝つ。

| 層 | 制御する人 | 例 |
|---|---|---|
| `config` | GraphAI を組み込むアプリ | API キー、エンドポイント |
| `params` | グラフの作者 | そのノードで使うモデルとオプション |
| `inputs` | 実行時のデータフロー | 他ノードが計算した値 |

優先順位は `inputs` > `params` > `config`。

1. `model` は三層すべてから読む。1 つ目の分割代入を
   `{ ...(config || {}), ...params, ...namedInputs }` に揃え、`model` をそこへ移す。
   Config 型に `model` が無かった anthropic / gemini / groq / openai_fetch / openai_image は追加する。
2. 接続・認証・転送の設定（`apiKey` / `baseURL` / `apiVersion` / `stream` / `dataStream` / `forWeb`）は
   `config` と `params` だけから読む。2 つ目の分割代入を `{ ...(config || {}), ...params }` に揃える。
   これまで anthropic / gemini / groq / openai_fetch / openai_image は `config` が `params` に勝っていたので
   **挙動が変わる**。
3. `inputs` schema から `apiKey` / `baseURL` / `apiVersion` / `stream` を外す。
   `params` schema 側（openai / openai_fetch のみ定義あり）には残す。
4. `llm_agents/README.md` に三層の使い分けを書く（これまでどこにも書かれていなかった）。
5. 自動生成の `docs/agentDocs/` を再生成する。

`inputs: { params: { ... } }` は core（`packages/graphai/src/node.ts`）が `params` へ合流させる
経路で、今回は触らない。`tools_agent` はこの経路でモデルを切り替えている。

## 型の変更

- `GroqParams` から `& { model: string }` を外す。`config` からもモデルを渡せるようにするため。
  groq には fallback が無いので、API キーと同じ形で `assert` を足して実行時に検出する。
- `GroqInputs` に `model?: string` を追加（`inputs` schema が宣言しているのに型に無かった）。

## 対象外

- `replicate_agent` / `slashgpt_agent` は `config` を受け取らない形なので触らない。

## 検証

- 各エージェントに `tests/test_model_resolution.ts` を追加し、`model` を
  `inputs` / `params` / `config` の各経路と優先順位で確認する。
  `fetch` を差し替えて、実際にリクエストへ乗ったモデル名を見る。
- `apiKey` を `inputs` に置いても届かないことを確認する。
- 変更前のソースに対して走らせ、意図した項目が赤になることを確認する。
- `yarn format` → 各パッケージの `yarn eslint` / `yarn build` → ルートの `yarn test`。
