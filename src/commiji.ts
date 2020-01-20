'use strict';
const childProcess = require('child_process');
const util = require('util');
const { types, extraTypes, specials } = require('./emojis.ts');
const { getType, getEmoji, getTitle, getScope, getBreaking, getMessage } = require('./prompts.ts');

const exec = util.promisify(childProcess.exec);
const getTypeEntries = () => [...Object.entries(types), ...Object.entries(extraTypes)];
const getEmojis = type => (~Object.keys(extraTypes).indexOf(type) ? extraTypes[type] : types[type]);

async function getOptionEmoji(emojis, getFirst = false) {
  return getFirst
    ? emojis[0]
    : await getEmoji(
        emojis.map(x => ({
          name: `${x.ascii} ${x.name}${x.label ? ` ${x.label}` : ''}`,
          value: x,
          short: x.ascii,
        }))
      );
}

async function getEmojiByType(type, optionType) {
  let emoji;
  if (type === specials.random || type === specials.all) {
    let emojis = getTypeEntries();

    if (!optionType && type === specials.all) {
      emoji = await getOptionEmoji(emojis.map(([_, value]) => value).flat());
    } else {
      [emoji, type] = await getRandomEmoji(emojis, true);
    }
  } else {
    emoji = await getOptionEmoji(getEmojis(type), !!optionType);
  }
  return emoji;
}

async function getCommitMessage(type, emoji, title, scope, breaking) {
  const separator = breaking ? '!:' : ':';
  const pass = type === specials.all || type === specials.random;
  const outputs = [];

  if (!pass) {
    outputs.push(`:${emoji.name}: ${type}${scope ? `(${scope})` : ''}${separator} ${title}`);
  }
  outputs.push(`:${emoji.name}: ${title}`);

  if (!pass) {
    outputs.push(`${emoji.ascii} ${type}${scope ? `(${scope})` : ''}${separator} ${title}`);
  }
  outputs.push(`${emoji.ascii} ${title}`);

  return getMessage(outputs);
}

function listAllEmojis() {
  return [...Object.entries(types), ...Object.entries(extraTypes)].reduce(
    (acc, [key, value]) =>
      acc +
      value
        .map(x => `${x.ascii} -> ${key} :${x.name}:${x.label ? ` -> ${x.label}` : ''}`)
        .join('\n') +
      '\n',
    ''
  );
}

function listAllTypes() {
  return [...Object.keys(types), ...Object.keys(extraTypes), ...Object.keys(specials)].join(', ');
}

async function getRandomEmoji(emojis, getFirst = false) {
  const [randomType, randomEmojis] = emojis[Math.floor(Math.random() * emojis.length)];
  return [await getOptionEmoji(randomEmojis, getFirst), randomType];
}

async function filterCommits(type, commits) {
  let filters = [];

  if (type === specials.all) {
    filters = getTypeEntries().flatMap(([_, value]) => value);
    type = 'all types';
  } else if (type === specials.random) {
    const emojis = getTypeEntries();
    [type, filters] = emojis[Math.floor(Math.random() * emojis.length)];
  } else {
    filters = getEmojis(type);
  }
  filters = filters.flatMap(x => [`:${x.name}:`, x.ascii]);
  console.log(`All commits containing ${type}:`);
  console.log();
  return commits.filter(commit => filters.some(x => ~commit.indexOf(x))).join('\n');
}

async function findCommit(type) {
  let stdout, stderr;
  try {
    const output = await exec('git log --pretty=format:"%h %s"');
    stdout = output.stdout;
    stderr = output.stderr;
  } catch (error) {
    stderr = error;
  }

  if (stderr) {
    console.log(stderr);
  } else {
    const result = await filterCommits(type, stdout.split('\n'));
    console.log(result);
  }
}

async function execCommit(commit) {
  let stderr;
  try {
    const output = await exec(`git commit -m "${commit}"`);
    stderr = output.stderr;
  } catch (error) {
    stderr = error;
  }

  if (stderr) {
    console.log(stderr);
  } else {
    console.log('Committing done!');
  }
}

module.exports = async function(options) {
  if (options.list) return listAllEmojis();
  else if (options.types) return listAllTypes();

  const hasType = options.type !== undefined;
  const type = hasType ? options.type : await getType();

  if (options.find) {
    findCommit(type);
    return;
  }

  const emoji = await getEmojiByType(type, hasType);
  const title = options.title === undefined ? await getTitle() : options.title;
  const scope = options.scope === undefined ? await getScope() : options.scope;
  const breaking = options.dobreak || options.nobreak ? !!options.dobreak : await getBreaking();
  const commit = await getCommitMessage(type, emoji, title, scope, breaking);
  execCommit(commit);
  return commit;
};
