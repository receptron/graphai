import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface ShellCommandParams {
  command: string;
  cwd?: string;
  timeout?: number;
  env?: Record<string, string>;
}

export const shellCommandAgent = async ({ params }: { params: ShellCommandParams }) => {
  assert(!!params.command, "shellCommandAgent: params.command is UNDEFINED!");

  const { stdout, stderr } = await execAsync(params.command, {
    cwd: params.cwd,
    timeout: params.timeout,
    env: { ...process.env, ...params.env },
  });

  return { stdout, stderr };
};

const shellCommandAgentInfo: AgentFunctionInfo = {
  name: "shellCommandAgent",
  agent: shellCommandAgent,
  mock: shellCommandAgent,
  params: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "Shell command to execute",
      },
      cwd: {
        type: "string",
        description: "Working directory",
      },
      timeout: {
        type: "number",
        description: "Timeout in milliseconds",
      },
      env: {
        type: "object",
        description: "Environment variables",
      },
    },
    required: ["command"],
  },
  output: {
    type: "object",
    properties: {
      stdout: {
        type: "string",
        description: "Standard output",
      },
      stderr: {
        type: "string",
        description: "Standard error output",
      },
    },
  },
  samples: [
    {
      inputs: {},
      params: { command: "echo 'Hello World'" },
      result: {
        stdout: "Hello World\n",
        stderr: "",
      },
    },
  ],
  description: "Execute shell commands",
  category: ["test"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  cacheType: "pureAgent",
  license: "MIT",
};

export default shellCommandAgentInfo;
