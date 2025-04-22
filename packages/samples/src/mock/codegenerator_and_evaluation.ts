import { GraphAI } from "graphai";
import * as vanilla_agents from "@graphai/vanilla";

const main = async () => {
  const graphData = {
    version: 0.5,
    nodes: {
      argmentsAndReturnPair: {
        value: [[1, 1],[2, 4],[3 , 9]],
      },
      codeGenerator: {
        agent: "copyAgent",
        inputs: {
          // TODO: code generate using llm
          code: "a * a;", // for node evan
        },
        isResult: true,
      },
      evalAgent: {
        agent: "mapAgent",
        inputs: {
          rows: ":argmentsAndReturnPair",
          codeGenerator: ":codeGenerator"
        },
        isResult: true,
        graph: {
          nodes: {
            codeRunner: {
              inputs: {
                code: "const a = ${:row.$0}; ${:codeGenerator.code} ",
              },
              agent: (inputs: {code: string}) => {
                return {
                  result: eval(inputs.code)
                };
              },
              isResult: true,
            },
            compareAgent: {
              agent: "compareAgent",
              inputs: { array: [":codeRunner.result", "==", ":row.$1"] },
              isResult: true,
            },
            // TODO: After this, evaluate all the results.
            //       Improve it so that objects and arrays can also be evaluated.
          },
        }
      }
      
    },
  };
  const graphAI = new GraphAI(graphData, vanilla_agents);
  const res = await graphAI.run();
  
  console.log(JSON.stringify(res, null, 2));
};

main();
