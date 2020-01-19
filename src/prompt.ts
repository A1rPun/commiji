'use strict';
const childProcess = require('child_process');
const inquirer = require('inquirer');
const util = require('util');
const { types, extraTypes, specials } = require('./emoji.ts');

const exec = util.promisify(childProcess.exec);
const getTypeEntries = () => [...Object.entries(types), ...Object.entries(extraTypes)];
const getEmojis = type => (~Object.keys(extraTypes).indexOf(type) ? extraTypes[type] : types[type]);

async function getType(type, noSpecials = false) {
  if (type) {
    return type;
  }
  let choices = [
    ...Object.keys(types),
    new inquirer.Separator(),
    ...Object.keys(extraTypes),
    new inquirer.Separator(),
  ];
  if (!noSpecials) {
    choices = [...choices, ...Object.keys(specials), new inquirer.Separator()];
  }
  const { inputType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'inputType',
      message: 'Type of change?',

      choices,
    },
  ]);
  return inputType;
}

async function getRandomEmoji(emojis, getFirst = false) {
  const [randomType, randomEmojis] = emojis[Math.floor(Math.random() * emojis.length)];
  return [await getEmoji(randomEmojis, getFirst), randomType];
}

async function getEmoji(emojis, getFirst = false) {
  if (getFirst) {
    return emojis[0];
  }

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

async function getTitle(title) {
  if (title) {
    return title;
  }
  const { inputTitle } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputTitle',
      message: 'Which title?',
    },
  ]);
  return inputTitle || '';
}

async function getScope(scope) {
  if (scope) {
    return scope;
  }

  const { inputScope } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputScope',
      message: 'Which scope?',
    },
  ]);
  return inputScope || '';
}

async function getBreaking(dobreak, nobreak) {
  if (dobreak || nobreak) {
    return !!dobreak;
  }

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

async function getCommitMessage(type, emoji, title, scope, breaking) {
  const separator = breaking ? '!:' : ':';
  const pass = type === specials.none || type === specials.random;
  const outputs = [];

  if (!pass) {
    outputs.push(`:${emoji.name}: ${type}${scope ? `(${scope})` : ''}${separator} ${title}`);
  }
  outputs.push(`:${emoji.name}: ${title}`);

  if (!pass) {
    outputs.push(`${emoji.ascii} ${type}${scope ? `(${scope})` : ''}${separator} ${title}`);
  }
  outputs.push(`${emoji.ascii} ${title}`);

  const { inputMessage } = await inquirer.prompt([
    {
      type: 'list',
      name: 'inputMessage',
      message: 'Which result?',
      choices: outputs,
    },
  ]);
  return inputMessage || '';
}

function listAllEmojis() {
  console.log(
    [...Object.entries(types), ...Object.entries(extraTypes)].reduce(
      (acc, [key, value]) =>
        acc +
        value
          .map(x => `${x.ascii} -> ${key} :${x.name}:${x.label ? ` -> ${x.label}` : ''}`)
          .join('\n') +
        '\n',
      ''
    )
  );
}

function listAllTypes() {
  console.log(
    [...Object.keys(types), ...Object.keys(extraTypes), ...Object.keys(specials)].join(', ')
  );
}

async function getCommit(ttype, title, scope, dobreak, nobreak) {
  let type = await getType(ttype);
  let emoji;

  if (type === specials.random || type === specials.none) {
    let emojis = getTypeEntries();

    if (!ttype && type === specials.none) {
      emoji = await getEmoji(emojis.map(([_, value]) => value).flat());
    } else {
      [emoji, type] = await getRandomEmoji(emojis, true);
    }
  } else {
    emoji = await getEmoji(getEmojis(type), !!ttype);
  }

  title = await getTitle(title);
  scope = await getScope(scope);
  const breaking = await getBreaking(dobreak, nobreak);
  return getCommitMessage(type, emoji, title, scope, breaking);
}

async function filterCommits(type, commits) {
  type = await getType(type, true);
  const emojis = getEmojis(type).flatMap(x => [x.name, x.ascii]);
  emojis.push(type);
  return commits.filter(commit => emojis.some(x => ~commit.indexOf(x))).join('\n');
}

async function findCommit(type) {
  const { stdout, stderr } = await exec('git log --pretty=format:"%h %s"');

  if (stderr) {
    console.log(stderr);
  } else {
    const result = await filterCommits(type, stdout.split('\n'));
    console.log(result);
  }
}

module.exports = async function(options) {
  if (options.list) {
    return listAllEmojis();
  } else if (options.types) {
    return listAllTypes();
  } else if (options.find) {
    return findCommit(options.type);
  }
  const commit = await getCommit(
    options.type,
    options.title,
    options.scope,
    options.break,
    options.nobreak
  );
  console.log(commit);

  const { stdout, stderr } = await exec(`git commit -m "${commit}"`);
  if (stderr) {
    console.log(stderr);
  } else {
    console.log('Committing done!');
  }
};
