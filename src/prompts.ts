const inquirer = require('inquirer');
const { types, extraTypes, specials } = require('./emojis.ts');

async function getType() {
  const { inputType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'inputType',
      message: 'Type of change?',
      choices: [
        ...Object.keys(types),
        new inquirer.Separator(),
        ...Object.keys(extraTypes),
        new inquirer.Separator(),
        ...Object.keys(specials),
        new inquirer.Separator(),
      ],
    },
  ]);
  return inputType;
}

async function getEmoji(emojis = []) {
  const { emoji } = await inquirer.prompt([
    {
      type: 'list',
      name: 'emoji',
      message: 'Which emoji?',
      choices: emojis.map(x => ({
        name: `${x.ascii} ${x.name}${x.label ? ` ${x.label}` : ''}`,
        value: x,
        short: x.ascii,
      })),
    },
  ]);
  return emoji;
}

async function getTitle() {
  const { inputTitle } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputTitle',
      message: 'Which title?',
    },
  ]);
  return inputTitle || '';
}

async function getScope() {
  const { inputScope } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputScope',
      message: 'Which scope?',
    },
  ]);
  return inputScope || '';
}

async function getBreaking() {
  const { inputBreak } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'inputBreak',
      message: 'Breaking change?',
      default: false,
    },
  ]);
  return inputBreak;
}

async function getMessage(outputs) {
  const { inputMessage } = await inquirer.prompt([
    {
      type: 'list',
      name: 'inputMessage',
      message: 'Which result?',
      choices: outputs,
    },
  ]);
  return inputMessage;
}

module.exports = {
  getType,
  getEmoji,
  getTitle,
  getScope,
  getBreaking,
  getMessage,
};
