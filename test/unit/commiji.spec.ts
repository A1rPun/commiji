const commiji = require('./../../src/commiji.ts');

jest.mock('inquirer', () => {
  return {
    prompt: x => ({ [x[0].name]: 'test' }),
    Separator: jest.fn(),
  };
});
jest.mock('child_process', () => {
  return {
    exec: jest.fn(),
  };
});

function testCommitLint(output) {
  // https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
  expect(output).toMatch('build');
  expect(output).toMatch('ci');
  expect(output).toMatch('chore');
  expect(output).toMatch('docs');
  expect(output).toMatch('feat');
  expect(output).toMatch('fix');
  expect(output).toMatch('perf');
  expect(output).toMatch('refactor');
  expect(output).toMatch('revert');
  expect(output).toMatch('style');
  expect(output).toMatch('test');
}

describe('Test commiji', () => {
  it('should ask all questions when no flags are set', async () => {
    const flags = {};
    const output = await commiji(flags);
    expect(output).toBeFalsy();
  });

  it('should ask no questions when all question flags are set', async () => {
    const flags = {
      type: 'test',
      title: 'Test commit',
      scope: '',
      dobreak: true,
    };
    const output = await commiji(flags);
    expect(output).toBeFalsy();
  });

  it('should pick a random emoji for a random type', async () => {
    const flags = { type: 'random' };
    const output = await commiji(flags);
    expect(output).toBeFalsy();
  });

  it('should pick a random emoji for an all type', async () => {
    const flags = { type: 'random' };
    const output = await commiji(flags);
    expect(output).toBeFalsy();
  });

  it('should list all commitlint options', async () => {
    const flags = { list: true };
    const output = await commiji(flags);
    testCommitLint(output);
  });

  it('should list all commitlint types', async () => {
    const flags = { types: true };
    const output = await commiji(flags);
    testCommitLint(output);
  });

  it('should filter all commit on type build', async () => {
    const flags = { type: 'build', find: true };
    const output = await commiji(flags);
    expect(output).toBeFalsy();
  });
});
