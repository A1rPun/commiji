const {
  getType,
  getEmoji,
  getTitle,
  getScope,
  getBreaking,
  getMessage,
} = require('./../../src/prompts.ts');

const defaultInquirerAnswer = 'test';
jest.mock('inquirer', () => {
  return {
    prompt: x => ({ [x[0].name]: 'test' }),
    Separator: jest.fn(),
  };
});

describe('Test prompts', () => {
  it('Prompt for a type', async () => {
    const type = await getType();
    expect(type).toBe(defaultInquirerAnswer);
  });

  it('Prompt for an emoji', async () => {
    const emoji = await getEmoji();
    expect(emoji).toBe(defaultInquirerAnswer);
  });

  it('Prompt for a commit title', async () => {
    const title = await getTitle();
    expect(title).toBe(defaultInquirerAnswer);
  });

  it('Prompt for a scope', async () => {
    const scope = await getScope();
    expect(scope).toBe(defaultInquirerAnswer);
  });

  it('Prompt for a breaking change', async () => {
    const breaking = await getBreaking();
    expect(breaking).toBe(defaultInquirerAnswer);
  });

  it('Prompt for a message', async () => {
    const message = await getMessage();
    expect(message).toBe(defaultInquirerAnswer);
  });
});
