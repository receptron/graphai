# Async/Awaitは万能ではない

async/awaitパターンは、C#、C++、Dart、Kotlin、Rust、Python、TypeScript/JavaScriptやSwiftなど、多くのプログラミング言語の機能となっています。これにより、非同期でノンブロッキングな関数を、通常の同期関数と同様の方法で構造化できるようになりました。

これは非常に便利ですが、複数の非同期タスクを同時に実行するには適していません。

例えば、以下のTypeScriptコードでは、TaskAとTaskBは独立しているにもかかわらず、順次実行されます。

```typescript
const TaskRunner = async () => {
  const a = await TaskA();
  const b = await TaskB();
  const c = await TaskC(a, b);
};
```

TaskAとTaskBを同時に実行するには、Promise.allを使用する必要があります。

```typescript
const TaskRunner = async () => {
  const [a, b] = await Promise.all(TaskA(), TaskB());
  const c = await TaskC(a, b);
};
```

この手法は単純なケースでは問題ありませんが、以下のような複雑なケースでは難しくなります（経験豊富なTypeScript開発者の方は、先を読む前に完全な最適化を試してみてください）：

```typescript
const TaskRunner = async () => {
  const a = await TaskA();
  const b = await TaskB();
  const c = await TaskC();
  const d = await TaskD(a, b);
  const e = await TaskE(b, c);
  return TaskF(d, e);
};
```

このクイズをXやその他の開発者フォーラムで試してみたところ、経験豊富な開発者でも多くの人が以下のような回答を出しました：

```typescript
const TaskRunner = async () => {
  const [a, b, c] = await Promise.all([TaskA(), TaskB(), TaskC()]);
  const [d, e] = await Promise.all([TaskD(a, b), TaskE(b, c)]);
  return TaskF(d, e);
};
```

元のコードよりもはるかに良いパフォーマンスを発揮しますが、これは最適ではありません。TaskDは必要ないにもかかわらずTaskCを待つ必要があり、TaskEは必要ないにもかかわらずTaskAを待つ必要があります。

この問題を指摘したところ、ある開発者は、TaskDとTaskEの両方がTaskBの完了を待つ必要があることに気付き、以下の回答を出しました：

```typescript
const TaskRunner = async () => {
  const promiseA = TaskA();
  const promiseC = TaskC();
  const b = await TaskB();
  const AthenD = async () => {
    const a = await promiseA;
    return TaskD(a, b);
  };
  const CthenE = async () => {
    const c = await promiseC;
    return TaskE(b, c);
  };
  const [d, e] = await Promise.all([AthenD(), CthenE()]);
  return TaskF(d, e);
};
```

これは完全に最適化されていますが、このスタイルのコードは非常に読みにくく、スケールしません。数十の非同期タスクがある場合、最適なコードを書くことは不可能です。

この問題を解決するために、タスクを非循環データフローグラフのノードとして扱い、それらの間の依存関係を記述する「データフロープログラミング」を提案します。

![](/images/nodes.png)

データフロープログラミングスタイルでは、コードは以下のようになります：

```typescript
import { computed } from "@receptron/graphai_lite";

const ExecuteAtoF = async () => {
  const nodeA = computed([], TaskA);
  const nodeB = computed([], TaskB);
  const nodeC = computed([], TaskC);
  const nodeD = computed([nodeA, nodeB], TaskD);
  const nodeE = computed([nodeB, nodeC], TaskE);
  const nodeF = computed([nodeD, nodeE], TaskF);
  return nodeF;
};
```

`computed()`は、Promise.allの薄いラッパー（[@receptron/graphai_lite](https://github.com/receptron/graphai/tree/main/packages/lite#readme)で定義）で、入力ノードの配列と非同期関数から「計算ノード」を作成します。

`const nodeD = computed([nodeA, nodeB], TaskD);`は、`nodeD`が`taskD`を表すノードであり、`nodeA`と`nodeB`からのデータを必要とすることを示しています。

このスタイルでは、実行順序を指定する必要はありません。ノード間のデータ依存関係を指定するだけで、システムが自動的に適切な順序を把握し、独立したタスクを同時に実行します。
