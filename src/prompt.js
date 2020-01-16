'use strict';
const inquirer = require('inquirer');
const { types, extraTypes } = require('./emoji');
const specials = {
  random: 'random',
  none: 'none',
};

async function getType(type) {
  if (type) {
    return type; // todo check
  }
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

async function getEmoji(emojis, getFirst) {
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

function logResults(type, emoji, title, scope, breaking) {
  const separator = breaking ? '!:' : ':';
  const pass = type === specials.none || type === specials.random;

  if (!pass) {
    console.log(
      `:${emoji.name}: ${type}${scope ? `(${scope})` : ''}${separator} ${title}`
    );
  }
  console.log(`:${emoji.name}: ${title}`);

  if (!pass) {
    console.log(
      `${emoji.ascii} ${type}${scope ? `(${scope})` : ''}${separator} ${title}`
    );
  }
  console.log(`${emoji.ascii} ${title}`);

  if (breaking) {
    console.log('BREAKING CHANGE:');
  }
}

function listAllEmojis() {
  console.log(
    [...Object.entries(types), ...Object.entries(extraTypes)].reduce(
      (acc, [key, value]) =>
        acc +
        value
          .map(
            x =>
              `${x.ascii} -> ${key} :${x.name}:${
                x.label ? ` -> ${x.label}` : ''
              }`
          )
          .join('\n') +
        '\n',
      ''
    )
  );
}

function listAllTypes() {
  console.log(
    [
      ...Object.keys(types),
      ...Object.keys(extraTypes),
      ...Object.keys(specials),
    ].join(', ')
  );
}

module.exports = async function(options) {
  if (options.list) {
    return listAllEmojis();
  } else if (options.types) {
    return listAllTypes();
  }

  let type = await getType(options.type);
  let emojis = [];
  let emoji;

  if (type === specials.random) {
    emojis = [...Object.entries(types), ...Object.entries(extraTypes)];
    const aaa = emojis[Math.floor(Math.random() * emojis.length)];
    emoji = await getEmoji(aaa[1], true);
    type = aaa[0];
  } else if (type === specials.none) {
    // HEAVY TODO
    emojis = [...Object.entries(types), ...Object.entries(extraTypes)];
    const bb = !!options.type;
    if (bb) {
      const a = emojis[Math.floor(Math.random() * emojis.length)];
      emoji = await getEmoji(a[1], true);
    } else {
      emoji = await getEmoji(emojis.map(([value]) => value).flat());
    }
    type = ''; // TODO
  } else {
    if (~Object.keys(extraTypes).indexOf(type)) {
      emojis = extraTypes[type];
    } else {
      emojis = types[type];
    }
    emoji = await getEmoji(emojis, !!options.type);
  }

  const title = await getTitle(options.title);
  const scope = await getScope(options.scope);
  const breaking = await getBreaking(options.break, options.nobreak);
  logResults(type, emoji, title, scope, breaking);
};
