import * as readline from 'readline';

const getUserInput = async (question: string) : Promise<string> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const runAgent = async (query: string) => {
  console.log("query=", query);
};

const main = async () => {
  const query = await getUserInput('Please enter your question: ');    
  await runAgent(query);
  console.log("COMPLETE 1");
};

main();