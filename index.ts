#!/usr/bin/env node
'use strict';
const meow = require('meow');
const commiji = require('./src/commiji.ts');

const cli = meow(
  `
	🇨​ 🇴 ​🇲 ​🇲 ​🇮 ​🇯 ​🇮​

	Synopsis
	  $ commitemoji <option>

	Description
	  --help, -h  Show this help
	  --version, -v  Show version
	  --list, -l  List emoji's
	  --types, -y  List commit types
    --find, -f  Find commits
	  --type, -t  Provide answer for commit type
	  --title, -c  Provide answer for commit title
	  --scope, -s  Provide answer for scope
	  --dobreak, -b  Provide answer with breaking change
	  --nobreak, -n  Provide answer with non breaking change

  Examples
    Basic usage
    $ commitemoji

    Answer with options
    $ commitemoji --type fix --title "Test commit" --scope example -nobreak

    Shorter version
    $ commitemoji -c "Test commit" -s example -n

    List all available emoji's
    $ commitemoji -l

    List all available commit types
    $ commitemoji -y
`,
  {
    flags: {
      version: {
        alias: 'v',
      },
      help: {
        alias: 'h',
      },
      list: {
        type: 'boolean',
        alias: 'l',
      },
      types: {
        type: 'boolean',
        alias: 'y',
      },
      find: {
        type: 'boolean',
        alias: 'f',
      },
      type: {
        type: 'string',
        alias: 't',
      },
      title: {
        type: 'string',
        alias: 'c',
      },
      scope: {
        type: 'string',
        alias: 's',
      },
      dobreak: {
        type: 'boolean',
        alias: 'b',
      },
      nobreak: {
        type: 'boolean',
        alias: 'n',
      },
    },
  }
);

async function main() {
  const output = await commiji(cli.flags);
  if (output) console.log(output);
}
main();
