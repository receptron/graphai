import { test } from 'node:test';
import { assert } from 'node:assert';
import { shellCommandAgent } from '../../src/test_agents/shell_command_agent';

test('shellCommandAgent basic echo test', async () => {
  const result = await shellCommandAgent({
    params: {
      command: 'echo "Hello World!"'
    }
  });
  
  assert.strictEqual(result.stdout.trim(), 'Hello World!');
  assert.strictEqual(result.stderr, '');
});

test('shellCommandAgent with working directory', async () => {
  const result = await shellCommandAgent({
    params: {
      command: 'pwd',
      cwd: '/tmp'
    }
  });
  
  assert.strictEqual(result.stdout.trim(), '/tmp');
});

test('shellCommandAgent with environment variables', async () => {
  const result = await shellCommandAgent({
    params: {
      command: 'echo $TEST_VAR',
      env: { TEST_VAR: 'test value' }
    }
  });
  
  assert.strictEqual(result.stdout.trim(), 'test value');
});

test('shellCommandAgent with timeout', async () => {
  await assert.rejects(
    async () => {
      await shellCommandAgent({
        params: {
          command: 'sleep 2',
          timeout: 1000  // 1秒でタイムアウト
        }
      });
    },
    /Timed out/
  );
});

test('shellCommandAgent with invalid command', async () => {
  await assert.rejects(
    async () => {
      await shellCommandAgent({
        params: {
          command: 'invalid_command_that_does_not_exist'
        }
      });
    }
  );
});