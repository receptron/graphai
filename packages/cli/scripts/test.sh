#!/bin/sh

node lib/graphai_cli.js test_yaml/bypass.json
node lib/graphai_cli.js test_yaml/bypass2.json
node lib/graphai_cli.js test_yaml/map1.yaml
node lib/graphai_cli.js test_yaml/test_base.yml
node lib/graphai_cli.js test_yaml/test_base.yml -v
yarn run cli -l
yarn run cli -d slashGPTAgentInfo
yarn run cli -s stringEmbeddingsAgentInfo
LC_ALL=en.us yarn run cli --help
