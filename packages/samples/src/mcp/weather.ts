import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";

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
  
    console.log(resources);
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
    console.log(resourceContent);

    const graph_data = {
      version: 0.5,
      nodes: {
        tools: {
          agent: async (inputs:any) => { 
            const result = await client.request(
              { method: "tools/list" },
              ListToolsResultSchema,
            );
            return result.tools;
          },
          isResult: true,
        }
      }
    };

    const graph = new GraphAI(graph_data, { ...agents });
    const results = await graph.run();
    console.log(results);
    client.close();
  };
  
  main();