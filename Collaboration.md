## Collaboration

Step 1. Install git, node and yarn

Step 2. Clone the project and install necessary node modules

```
git clone git@github.com:receptron/graphai.git
yarn install
```

Step 3. Set the environment variable OPENAI_API_KEY to your own key (=sk-...)

You need to set ANTHROPIC_API_KEY as well, if you want to use Claude.

Step 4. Run the test script

Run the test

```
npm run test
```

Step 5. Run one of sample scripts

```
cd packages/samples/
npm run sample ./src/tools/home.ts 
```

Step 6. Write some code and send pull requests

- Please run "yarn run format" before sending your pull request.
- Please do not include any build files (files under /lib) to your pull reuquest.

Key principles:

1. Keep the core (Node and GraphAI classes) small and simple.
2. Enhance the platform by adding 'agents' (plug ins).
3. Simple but effective test scripts make it easy to maintain.
