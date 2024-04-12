import * as readline from 'readline';

const getInput = async (question: string) => {
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

const runAgent = async () => {
};

const main = async () => {
  const answer = await getInput('Please enter some input: ');    
  await runAgent();
  console.log("COMPLETE 1", answer);
};

main();