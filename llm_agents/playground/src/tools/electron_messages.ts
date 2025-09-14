export const messages = [
  {
    role: "system",
    content:
      "Always reply in Japanese, regardless of the language of the user's input or previous conversation.  If the user's message is in a different language, translate it into Japanese before replying.\n<use_parallel_tool_calls>\nFor maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.\n</use_parallel_tool_calls>",
    time: 1757814254043,
  },
  {
    role: "user",
    content: "https://community.arm.com/arm-community-blogs/b/ai-blog/posts/get-ready-for-sme",
    time: 1757814254043,
  },
  {
    role: "assistant",
    content: "ウェブサイトを開いて内容を確認いたします。",
    tool_calls: [
      {
        id: "toolu_01YTXjqvrfdv8owCdZQDnXWV",
        type: "function",
        function: {
          name: "puppeteerAgent--openUrl",
          arguments: '{"url":"https://community.arm.com/arm-community-blogs/b/ai-blog/posts/get-ready-for-sme"}',
        },
      },
    ],
    time: 1757814254043,
  },
  {
    extra: {
      agent: "puppeteerAgent",
      arg: {
        url: "https://community.arm.com/arm-community-blogs/b/ai-blog/posts/get-ready-for-sme",
      },
      func: "openUrl",
    },
    role: "tool",
    content:
      "Generative AI applications for mobile devices have evolved beyond traditional chatbots and virtual assistants, now offering advanced intelligent capabilities. Current features range from sound generation to image captioning, mathematical reasoning, and summarization across text, audio, video, and group chats, among other capabilities. In the future, developers can use SME2 for advanced image processing, multi-modal AI, and interactive NPC speech in games.\nArm has introduced Scalable Matrix Extension 2 (SME2), a set of advanced instructions in the Armv9 architecture to accelerate matrix multiplications common in AI workloads across a wide range of domains. SME2 enables these complex workloads to run directly on power-efficient mobile devices.\nAnd the very best part is that developers do not need to change a single line of code to take advantage of SME2 in their models or applications. Arm has ensured the seamless integration of SME2 into leading AI frameworks and runtimes in the ecosystem through KleidiAI. These integrations mean that SME2 should already be embedded within the software stack for developers, provided their apps use the supported frameworks and runtimes.\nSME2 will accelerate the use cases of tomorrow \nAccelerating AI workloads on Android with XNNPack  \nThe first AI inference library to support SME2 is XNNPack, a neural network inference solution that is widely used to accelerate a wide range of machine learning (ML) frameworks from PyTorch & ExecuTorch, to MediaPipe and TensorFlow Lite on Arm. Together, Arm and Google accelerated Int4 matrix multiplications in the Gemma 3 model using Int8 outer product instructions, achieving a 6x speedup in chatbot response times with SME2 enabled.   \nGemma 3 also can begin text summarization of a four-paragraph page (around 800 words) in under one second, with SME2 on a single CPU core. Read the full SME2 optimization analysis in this blog post. The post discusses how it works and how these results are the culmination of one year of optimizing XNNPack, enabling developers to unlock seamless and transparent AI performance.   \nLearn more about SME2 from Arm experts \nWe are thrilled to be at WeAreDevelopers World Congress 2025 in Berlin, Germany this week, introducing SME2 to one of the world’s leading events for developers and AI innovators. Join Gian Marco Iodice this Thursday July 10th at 2:10PM local time (CEST) on Stage 1 as he shares and in-depth overview of SME2 technology and how developers can take advantage of it right away.   \nIf you would like to get hands-on accelerating AI application on mobile devices, join us for a 2-hour workshop Mobile AI on Arm: AI Text and Audio Generation Entirely on Device Thursday July 10th 1:00PM -3:00PM local time. In this two-part workshop you will: \nGenerate Audio with Stable Audio Open Small on LiteRT \nBuild an Android Chat App with Llama, ExecuTorch, and XNNPACK \nIf you are not at WeAreDevelopers this week, no worries, we have a fantastic audio generation Code-Along and Expert Q&A planned for next month: \n Register here\nGet started developing with SME2 today! \nWhile next-generation Android mobile devices capable of SME2 acceleration are on the horizon, there is no need to wait. With SME2 already available across the latest iOS devices, developers can start building AI applications on top of a wide range of AI frameworks and runtime libraries that have native support for SME2. \n \nThe SME2-enhanced performance in your applications will then be portable across Arm-based platforms from iOS and iPadOS to MacOS and Android.   \nCheck out our new Arm Developer Launchpad for SME2, a one-stop-shop with all of the information and developer resources you need to learn more about SME2, accelerated AI use cases, and hand-on code examples & tutorials to explore the performance  \nAnd if you are ready to get see the performance benefits of SME2 first-hand, you can get started today on Apple M4-based device or iPhone16 devices with this learning path on accelerating matrix multiplication with SME2.   \nGet started building the next generation AI apps of tomorrow, today!",
    tool_call_id: "toolu_01YTXjqvrfdv8owCdZQDnXWV",
    time: 1757814254043,
  },
  {
    role: "assistant",
    content:
      "このArmのブログ記事は、**Scalable Matrix Extension 2 (SME2)** という新しい技術について紹介しています。以下に主要なポイントをまとめます：\n\n## SME2とは\n- **Armv9アーキテクチャ**の一部として導入された拡張命令セット\n- AI/MLワークロードでよく使われる**行列演算を高速化**\n- **モバイルデバイス**で直接AI処理を効率的に実行可能\n\n## 主な特徴\n1. **コード変更不要**：開発者は既存のコードを変更せずにSME2の恩恵を受けられる\n2. **フレームワーク統合**：KleidiAIを通じて主要なAIフレームワークに統合済み\n3. **大幅な性能向上**：Gemma 3モデルでチャットボット応答時間が**6倍高速化**\n\n## 実用例\n- **XNNPack**（最初にSME2対応したAI推論ライブラリ）\n- 800語程度のテキスト要約が**1秒以内**で完了\n- PyTorch、TensorFlow Lite、MediaPipeなどで利用可能\n\n## 対応デバイス\n- **iPhone 16**およびApple **M4**ベースデバイスで既に利用可能\n- Android端末でも今後対応予定\n- iOS、iPadOS、macOS、Androidで**ポータブル**\n\nこの技術により、モバイルデバイス上でより高度なAI機能（画像処理、マルチモーダルAI、ゲーム内NPCの音声生成など）が実現できるようになります。",
    time: 1757814254043,
  },
  {
    role: "user",
    content: "スライドにして！",
    time: 1757814254043,
  },
  {
    role: "assistant",
    content: "ArmのSME2技術についてプレゼンテーションスライドを作成いたします。",
    tool_calls: [
      {
        id: "toolu_01HPj2ioD5oHJtdpRZnaBhRi",
        type: "function",
        function: {
          name: "mulmoVisionAgent--createSectionDividerSlide",
          arguments:
            '{"heading":"Arm SME2技術","subheading":"モバイルAIの次世代を切り開く革新的な拡張命令セット","talkTrack":"本日は、Armが開発した革新的なSME2技術について、その概要と実用性についてご紹介いたします。"}',
        },
      },
    ],
    time: 1757814254043,
  },
  {
    extra: {
      agent: "mulmoVisionAgent",
      arg: {
        heading: "Arm SME2技術",
        subheading: "モバイルAIの次世代を切り開く革新的な拡張命令セット",
        talkTrack: "本日は、Armが開発した革新的なSME2技術について、その概要と実用性についてご紹介いたします。",
      },
      func: "createSectionDividerSlide",
    },
    role: "tool",
    content: "Successfully created",
    tool_call_id: "toolu_01HPj2ioD5oHJtdpRZnaBhRi",
    time: 1757814254043,
  },
  {
    role: "user",
    content: "続けて",
    time: 1757814254043,
  },
  {
    role: "assistant",
    content: "",
    tool_calls: [
      {
        id: "toolu_01JDmos3GsDGxsDcwSuHEzTX",
        type: "function",
        function: {
          name: "mulmoVisionAgent--createAgendaSlide",
          arguments:
            '{"title":"本日のアジェンダ","items":["SME2技術の概要","主要な特徴とメリット","実用例と性能向上","対応デバイスとフレームワーク","開発者向けリソース","今後の展望"],"talkTrack":"今回のプレゼンテーションでは、SME2技術の基本概念から実際の活用方法まで、包括的にご説明いたします。"}',
        },
      },
    ],
    time: 1757814254043,
  },
  {
    extra: {
      agent: "mulmoVisionAgent",
      arg: {
        title: "本日のアジェンダ",
        items: ["SME2技術の概要", "主要な特徴とメリット", "実用例と性能向上", "対応デバイスとフレームワーク", "開発者向けリソース", "今後の展望"],
        talkTrack: "今回のプレゼンテーションでは、SME2技術の基本概念から実際の活用方法まで、包括的にご説明いたします。",
      },
      func: "createAgendaSlide",
    },
    role: "tool",
    content: "Successfully created",
    tool_call_id: "toolu_01JDmos3GsDGxsDcwSuHEzTX",
    time: 1757814254043,
  },
  {
    role: "assistant",
    content: "",
    time: 1757814254043,
  },
];
