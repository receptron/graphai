# wikipediaAgent

## Package
[@graphai/service_agents](https://www.npmjs.com/package/@graphai/service_agents)
## Source
[https://github.com/receptron/graphai/blob/main/agents/service_agents/src/wikipedia_agent.ts](https://github.com/receptron/graphai/blob/main/agents/service_agents/src/wikipedia_agent.ts)

## Description

Retrieves data from wikipedia

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "query": {
      "type": "string"
    }
  },
  "required": [
    "query"
  ]
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.content",
  ":agentId.ns",
  ":agentId.title",
  ":agentId.pageid"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "query": "steve jobs"
}

```

#### params

```json

{"lang":"ja"}

```

#### result

```json

{
  "content": "スティーブ・ジョブズ（英語: Steve Jobs、1955年2月24日 - 2011年10月5日）は、アメリカ合衆国の起業家、実業家、工業デザイナー。正式な氏名はスティーブン・ポール・ジョブズ（英語: Steven Paul Jobs）。アメリカ国家技術賞、大統領自由勲章を受賞している。\nAppleの共同創業者の一人であり、同社のCEOを務め、一切の妥協を許さないカリスマ的変革者として知られる。NeXTやピクサー・アニメーション・スタジオの創業者でもあり、ウォルト・ディズニー・カンパニーなどの役員を歴任した。AppleⅡなどによりパーソナルコンピュータ（パソコン）の概念を市場に普及させ、iPodとiTunes及びiTunes Storeによって音楽業界に変革をもたらし、iPhoneおよびiPadを世に送り出したと評された。\n\n\n== 略歴 ==\n1976年、ジョブズは友人のスティーブ・ウォズニアックが自作したマイクロコンピュータ「Apple I」を販売するために起業することを決意し、同年4月1日にウォズニアックおよびロナルド・ウェインとの共同で「Apple Computer Company（アップルコンピュータ・カンパニー）」を創業した。Apple Computer（以下Apple）が1977年に発売した「Apple II」は商業的な大成功を収め、パーソナルコンピュータという概念を世間一般に浸透させた。Appleはシリコンバレーを代表する企業に急成長を遂げ、ジョブズは1980年12月のApple IPO時に2億5,600万ドルもの個人資産を手にし、1982年2月には『タイム』誌の表紙を飾るなど若くして著名な起業家となった。\nその後、ジョブズは先進的なGUIやマウスを持つコンピュータ「Macintosh」の開発を主導した。1984年に発表されたMacintoshはマスコミから絶賛され当初は売れ行きも良く、ジョブズの名声を高めたが、発売から数カ月後には深刻な販売不振に陥り、Apple社内でのジョブズの地位を危ういものにした。1985年5月、ジョブズはCEOのジョン・スカリーによって全ての業務から解任されて閑職へと追いやられ、同年9月にはAppleを去った。\nApple退職後、ジョブズはルーカスフィルムのコンピュータ・アニメーション部門を1,000万ドルで買収し、ピクサー・アニメーション・スタジオを設立した。また、自ら創立したNeXT Computerで、NeXTワークステーション（NeXTcube, NeXTstation）とオペレーティングシステム（OS）NEXTSTEPを開発を指揮・主導した。\n1996年、業績不振に陥っていたAppleにNeXTを売却すると同時に復帰、1997年には、iCEO（暫定CEO、Interim CEOの略）となる。同年には、不倶戴天のライバルとさえされていたマイクロソフトとの提携と、同社からの支援を得ることに成功し、また社内ではリストラを進めてAppleの業績を向上させた。\n\n2000年、正式にCEOに就任。2001年から2003年にかけてMacのOSをNeXTの技術を基盤としたMac OS Xへと切り替える。その後はiPod・iPhone・iPad、Appleの業務範囲を従来のパソコンからデジタル家電とメディア配信事業へと拡大させた。一方で、2003年には膵臓がんと診断された。\nCEOに就任して以来、基本給与として年1ドルしか受け取っていなかったことで有名であり（実質的には無給与であるが、この1ドルという額は、居住地のカリフォルニア州法により、社会保障番号を受けるために給与証明が必要なことによる）、このため「世界でもっとも給与の安い最高経営責任者」と呼ばれた。しかし、無報酬ではなくAppleから莫大なストックオプションやビジネスジェット機などを得ている。2006年にピクサーをディズニーが74億ドルで買収したことにより、ピクサー株の50%を保有するジョブズはディズニーの個人筆頭株主となり同社の役員に就任したが、ディズニーからの役員報酬は辞退していた。\n2011年10月5日、膵臓がんにより死去。56歳没。\n2012年2月11日、第54回グラミー賞で、特別功労賞の一つ「トラスティーズ賞」が授与された。2022年7月7日にはアメリカ合衆国で文民に贈られる最高位の勲章である大統領自由勲章を追贈された。",
  "ns": 0,
  "title": "スティーブ・ジョブズ",
  "pageid": 43967
}

```

## Author

Receptron

## Repository

https://github.com/receptron/graphai

## License

MIT

