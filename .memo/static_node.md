
static nodeのデータの扱いと流れ

- graph dataのvalueをnode.valueにsetする
- updateがある場合は、loop時に結果を使って更新

GraphAI初期化

  graphai.constructorで、createNodeでnode.valueがセットされる
    - nodeインスタンスにstatic nodeとしてvalueを入れる
    - (initializeGraphAIでもcreateNodeは呼ばれる.これはloopの更新処理)

  option
    - injectValueで更新
    - node.value, node,resultを更新

  initializeStaticNodes
    - node.valueがundefinedでない場合に、injectValueする(これはvalueをvalueにいれるので、実態はstatusの変更、node.resultのセット、ログ、キューの処理)
    - TODO: injectValueはキューの管理もしている。余計のinjectValueを呼ぶのは問題ない？(run以前に同じkeyでinjectValueを呼びなど）
    - ここで結果として、this.resultがセットされる(これによってrun時のデータチェックでresultを確認することができる)

  - run で result  or updateがundefinedならエラー（resultはinjectValueで更新される)

Loop時

  - processLoopIfNecessary
    - updateStaticNodesで結果とupdateで、前の結果を更新(判定用)
    - loop判定 okの場合
      - initializeGraphAI(コンストラクタと同じ処理)
        - createNodes
        - initializeStaticNodes
      - updateStaticNodes
        - node.updateがある場合に、前の結果を使ってinjectする

---
 memo
  graphdataでvalue undefineは許容される(validation errorにはならない)
    run時にresult, updateでチェック(initializeStaticNodesでvalue -> resultにコピーされる)

  graphDataからnode.valueにデータをコピーするのはコンストラクタのみ
  なので、injectValueした値(node.value)が、loop時に初期値に使われる

  run で result  or updateのデータチェックはloop時にはチェックされない

  injectValueは,node.value, node.resultの更新、statusの更新、ログとキュー処理される。つまりapiとしてはstatic nodeの結果をセットする扱い。それを安易に外から使って良い？

  node.valueの更新と、結果をセットするapiは分けたほうがわかりやすいかも。ただ、そうすると、result前提部分は変更が必要


 初期状態をundefinedにして、loop時(update)でセットするケースもあるので、安易に変更できなそう。
 