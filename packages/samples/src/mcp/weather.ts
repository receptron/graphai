import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";
import dotenv from "dotenv";
dotenv.config();

import {
    CallToolResultSchema,
    ListResourcesResultSchema,
    ListToolsResultSchema,
    ReadResourceResultSchema,
  } from "@modelcontextprotocol/sdk/types.js";
  
  import { Client } from "@modelcontextprotocol/sdk/client/index.js";
  import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
  
  const main = async () => {
    
    const transport = new StdioClientTransport({
      command: "/Users/satoshi/git/ai/mpc/weather-server/build/index.js",
    });
    
    const client = new Client({
      name: "weather-client",
      version: "1.0.0",
    }, {
      capabilities: {}
    });
  
    await client.connect(transport);
    
    // List available resources
    const resources = await client.request(
      { method: "resources/list" },
      ListResourcesResultSchema
    );
  
  //      console.log(resources);

    // Read a specific resource
    /*
    const resourceContent = await client.request(
      {
        method: "resources/read",
        params: {
          uri: "weather://San Francisco/current"
        }
      },
      ReadResourceResultSchema
    );
    console.log(resourceContent);
    */
    const resourceContent = await client.request(
      {
        method: "tools/call",
        params: {
          name: "get_forecast",
          arguments: {
            city: "kumamoto"
          }
        }
      },
      CallToolResultSchema,
    );
// console.log(resourceContent);

    const graph_data = {
      version: 0.5,
      nodes: {
        request: {
          value: "Tell me the weather in Kona tomorrow"
        },
        tools: {
          agent: async () => { 
            const result = await client.request(
              { method: "tools/list" },
              ListToolsResultSchema,
            );
            const tool = result.tools[0];
            return [{
              type: "function",
              function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema
              }
            }];
          },
          isResult: true,
        },
        llm_prompt: {
          console: {
            before: true,
          },
          agent: "openAIAgent",
          isResult: true,
          inputs: { tools: ":tools", prompt: ":request" },
        },
        tool_call: {
          agent: async (input: any) => {
            const tool = input.tool;
            console.log("***", tool.arguments);
            const resourceContent = await client.request(
              {
                method: "tools/call",
                params: {
                  name: tool.name,
                  arguments: tool.arguments
                }
              },
              CallToolResultSchema,
            );
            return resourceContent.content;
          },
          isResult: true,
          inputs: { tool: ":llm_prompt.tool" },
        },
        messagesWithToolRes: {
          // Appends that message to the messages.
          agent: "pushAgent",
          isResult: true,
          inputs: {
            array: ":llm_prompt.messages",
            item: {
              role: "tool",
              tool_call_id: ":llm_prompt.tool.id",
              name: ":llm_prompt.tool.name",
              content: ":tool_call",
            },
          },
        },
        debug: {
          agent: "copyAgent",
          params: {
            namedInput: "debug"
          },
          //isResult: true,
          inputs: {
            debug: ":messagesWithToolRes.array.$2"
          }
        },
        llm_post_call: {
          agent: "openAIAgent",
          isResult: true,
          inputs: {
            messages: ":messagesWithToolRes.array"
          }
        }
      }
    };

    const graph = new GraphAI(graph_data, { ...agents });
    const results = await graph.run();
    console.log(results);
    client.close();
  };
  
  main();