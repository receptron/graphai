# fix: docs README.html 404 in apiDocMd / agentDocs (#1324)

## User Prompt

> 公式ドキュメントを読んでいる時に気づきましたが、ReadMeが404になっているようです：
> - https://graphai.info/docs/apiDocMd/README.html
> - https://graphai.info/docs/agentDocs/README.html

(後続コメントで実際の URL は `/docs/` プレフィックスなし、`https://graphai.info/apiDocMd/README.html` 等であることを確認)

## Root cause

`docs/.vitepress/config.mts:46` の `srcExclude` で `"**/README.md"` を指定しているため、すべての `README.md` が VitePress のビルドから除外されている。

しかし、typedoc が生成した `apiDocMd/` 配下の各 `.md` は先頭にパンくずリンクとして `[**graphai**](README.md)` (または `(../README.md)`) を含んでおり、ライブサイトでクリックすると 404 になる。

## Fix

`"**/README.md"` を、開発者向けで非公開にしておきたい 2 つの README に限定する：

```diff
 srcExclude: [
   ...,
-  "**/README.md",
+  "./README.md",
+  "./examples/tutorial/README.md",
   ...
 ],
```

これにより、以下のような状態になる：

| ファイル | 公開可否 | ビルド後 URL |
|---|---|---|
| `docs/README.md` | 非公開（開発者向け） | (excluded) |
| `docs/examples/tutorial/README.md` | 非公開 | (excluded) |
| `docs/apiDocMd/README.md` | **公開** | `/apiDocMd/README.html` |
| `docs/agentDocs/README.md` | **公開** | `/agentDocs/README.html` |

## Validation

- `cd docs && yarn install` (もし未インストール)
- `cd docs && yarn build` (または vitepress build) → `.vitepress/dist/apiDocMd/README.html` と `.vitepress/dist/agentDocs/README.html` の存在を確認
- 念のため `.vitepress/dist/README.html` が **存在しない** ことも確認（dev-only README の除外が効いている）

## Out of scope

- パンくずリンクの destination を `globals.html` に書き換える方向の修正（typedoc 出力に手を入れる必要があり、生成のたびに巻き戻る）
- VitePress nav に README ページを追加する話（既存ナビ構造を維持）
