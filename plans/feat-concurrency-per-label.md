# feat: concurrency per label (#1304)

## User Prompt

> 現在の GraphAI では `concurrency` は全体の同時実行数だけだが、特定 LLM/外部 API ごとに並列上限を設定したい（レート制限対策）。
>
> agent 単位 / agent + model 単位 / または node に label を付けて label 単位、で制御したい。
>
> 例:
> ```yaml
> concurrency:
>   global: 20
>   labels:
>     openai: 3
>     vertex: 5
> ```
>
> aging / weight / RPM(token bucket) はそれぞれ別チケット (#1311, #1312, #1313) に切り出した。
>
> このチケットでは **concurrency per label のみ** を実装。HoL (head-of-line) skip 方式 = キュー先頭から走査して global 枠 AND label 枠の空いている最初のタスクを dequeue する。priority は既存実装のまま使う。

## Goal

`TaskManager` を拡張し、グラフ全体の concurrency 上限に加えて label ごとの上限も同時に守れるようにする。後方互換は完全に維持（既存の `concurrency: number` 形式とラベルなしノードはそのまま動く）。

## Schema

### GraphData.concurrency 拡張

```typescript
type ConcurrencyConfig =
  | number                                          // 旧形式（global のみ）
  | { global: number; labels?: Record<string, number> };

type GraphData = {
  // ...
  concurrency?: ConcurrencyConfig;
};
```

### ComputedNodeData

```typescript
type ComputedNodeData = {
  // ... 既存フィールド
  label?: string; // optional. 未指定なら label 制限の対象外
};
```

## TaskManager の変更点

### 内部状態

```typescript
private globalLimit: number;
private labelLimits: Map<string, number>;        // label -> max
private runningByLabel: Map<string, number>;     // label -> current running count
// runningNodes: Set<ComputedNode> は維持（global の running 数把握用）
```

### dequeueTaskIfPossible（HoL skip）

1. global 枠 (`runningNodes.size < globalLimit`) を確認
2. キューを先頭（最高 priority）から走査
3. 各タスクの label について `labelLimits` を確認
   - label 未指定 or label が `labelLimits` にない → global 枠だけで判断
   - label に上限あり → `runningByLabel.get(label) < labelLimits.get(label)` も満たす必要
4. 最初に条件を満たしたタスクを `splice` で取り出し実行
5. 該当なしなら何もしない（次の onComplete を待つ）

### addTask / onComplete

- `addTask`: 既存の priority 降順 splice はそのまま
- 実行開始時に `runningByLabel` をインクリメント
- `onComplete` で `runningByLabel` をデクリメント

### prepareForNesting / restoreAfterNesting

- 現状は `concurrency++` していた → `globalLimit++` に変更
- label 側はいじらない（nested graph の deadlock 回避は global 枠だけで足りる）

## Validators

- `validators/graph_data_validator.ts`: `concurrency` が number または `{ global: number, labels?: Record<string, number> }` のいずれかであることを検証
- 各値は正の整数

## ファイル変更

| ファイル | 変更内容 |
|---|---|
| `packages/graphai/src/type.ts` | `ComputedNodeData.label` 追加、`GraphData.concurrency` を union 型に |
| `packages/graphai/src/task_manager.ts` | 上記の通り拡張 |
| `packages/graphai/src/graphai.ts` | TaskManager コンストラクタへ新形式を渡す箇所の修正 |
| `packages/graphai/src/node.ts` | `ComputedNode` から label を読み出して TaskManager に渡す |
| `packages/graphai/src/validators/graph_data_validator.ts` | concurrency の検証拡張 |
| `packages/graphai/tests/units/test_task_manager.ts` | 新規。HoL skip / label limit / 後方互換のユニットテスト |
| `packages/graphai/tests/validators/test_validator_graph_data.ts` | concurrency バリデーションのテスト追加 |

## 後方互換

- `concurrency: number` のまま動く（内部で `{ global: N, labels: {} }` に正規化）
- label を持たないノードは現状とまったく同じ動作
- `prepareForNesting()` の挙動は不変

## Validation

- `yarn format`
- `yarn eslint`（既存の untracked ファイルのエラーは除く）
- `yarn build`
- `yarn test`（特に `packages/graphai`）

## Out of scope (followups)

- #1311: aging（HoL skip のスターベーション保険）
- #1312: weight（タスク重みベースの concurrency）
- #1313: RPM/TPM レート制限（token bucket）
