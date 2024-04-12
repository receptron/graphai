import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter some input: ', (answer) => {
  console.log(`You entered: ${answer}`);
  rl.close();
});
