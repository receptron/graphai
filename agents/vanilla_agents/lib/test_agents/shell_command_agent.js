"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shellCommandAgent = void 0;
const graphai_1 = require("graphai");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const shellCommandAgent = async ({ params }) => {
    (0, graphai_1.assert)(!!params.command, "shellCommandAgent: params.command is UNDEFINED!");
    const { stdout, stderr } = await execAsync(params.command, {
        cwd: params.cwd,
        timeout: params.timeout,
        env: { ...process.env, ...params.env }
    });
    return { stdout, stderr };
};
exports.shellCommandAgent = shellCommandAgent;
const shellCommandAgentInfo = {
    name: "shellCommandAgent",
    agent: exports.shellCommandAgent,
    mock: exports.shellCommandAgent,
    params: {
        type: "object",
        properties: {
            command: {
                type: "string",
                description: "シェルコマンド"
            },
            cwd: {
                type: "string",
                description: "作業ディレクトリ"
            },
            timeout: {
                type: "number",
                description: "タイムアウト(ms)"
            },
            env: {
                type: "object",
                description: "環境変数"
            }
        },
        required: ["command"]
    },
    output: {
        type: "object",
        properties: {
            stdout: {
                type: "string",
                description: "標準出力"
            },
            stderr: {
                type: "string",
                description: "標準エラー出力"
            }
        }
    },
    samples: [
        {
            inputs: {},
            params: { command: "echo 'Hello World'" },
            result: {
                stdout: "Hello World\n",
                stderr: ""
            }
        }
    ],
    description: "シェルコマンドを実行するエージェント",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    cacheType: "pureAgent",
    license: "MIT"
};
exports.default = shellCommandAgentInfo;
