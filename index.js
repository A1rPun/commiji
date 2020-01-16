#!/usr/bin/env node
'use strict';
const meow = require('meow');
const prompt = require('./src/prompt');

// String.fromCharCode(55356, 56806) + 25
const cli = meow(
  `
	🇨​ 🇴 ​🇲 ​🇲 ​🇮 ​🇹 ​ 🇪 ​🇲 ​🇴 ​🇯 ​🇮​

	Synopsis
	  $ commitemoji <option>

	Options
	  --help, -h  This help
	  --version, -v  Show version
	  --list, -l  List emoji's
	  --types, -y  List types
	  --type, -t  Set type
	  --title, -c  Set title
	  --scope, -s  Set scope
	  --break, -b  Breaking change
	  --nobreak, -n  Non breaking change

  Examples
    Basic usage
    $ commitemoji

    Answer with options
    $ commitemoji --type fix --title "Test commit" --scope example -nobreak

    Shorter version
    $ commitemoji -c "Test commit" -s example -n

    $ commitemoji -l

    $ commitemoji -y
`,
  {
    flags: {
      list: {
        type: 'boolean',
        alias: 'l',
      },
      version: {
        alias: 'v',
      },
      help: {
        alias: 'h',
      },
      types: {
        type: 'boolean',
        alias: 'y',
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
      break: {
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
prompt(cli.flags);
