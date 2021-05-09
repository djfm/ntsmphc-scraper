import { join as joinPaths } from 'path';
import readline from 'readline';
import { cpus } from 'os';

import Minimist from 'minimist';
import chalk from 'chalk';

import {
  isDirectory,
  isEmptyDirectory,
} from '../util/fs-util';

import {
  isValidURL,
} from '../util/url-util';

import {
  ERR_MISSING_ACTION,
  ERR_UNKNOWN_ACTION,
  ERR_NO_HELP_TO_DISPLAY,
  ERR_OPTION_DEFINED_SEVERAL_WAYS,
  ERR_OPTION_UNDEFINED,
  ERR_NOT_A_DIRECTORY,
  ERR_DIR_NOT_EMPTY,
  Action,
  Wizard,
  Prompt,
} from './definitions';

import runWizard from './wizard';
import createLogger from './logger';

const log = createLogger();

const insist = (subject: string, body: string, ...otherStrings: string[]) => [
  `"${chalk.bold(subject)}"`,
  body,
  ...otherStrings,
].join(' ');

const bail = (errMsg: string, exitCode: number) => {
  // TODO echo $? after failure doesn't report my exit code
  log.error(`\n${chalk.underline('ERROR')}: ${errMsg}`);
  process.exit(exitCode);
};

const parsedArgv = Minimist(process.argv.slice(2));

// TODO try to auto-guess instead of hard-coding
const commandPrefix = 'yarn scrape';

const init: Action = {
  verb: 'init',
  description: 'initialize a scraping project',
  options: [{
    primaryName: 'directory',
    description: 'an empty, existing, directory where all scraping data will be stored',
    aliases: ['d', '$'],
    requiresValue: true,
    defaultValue: '.',
    valueFriendlyName: 'pathToDirectory',
  }],
};

const usage: Action = {
  verb: 'help',
  description: 'display this tool\'s usage information',
  options: [],
};

const actions: Action[] = [init, usage];

const actionsMap = new Map();

for (const action of actions) {
  actionsMap.set(action.verb, action);
}

const generateUsageString = () => {
  const verbDescriptions = actions.map(
    (action) => `- ${commandPrefix} ${chalk.underline(action.verb).padEnd(15, ' ')} - ${action.description}`,
  );

  const comments = chalk.italic([
    `In all of the above, "${chalk.bold(commandPrefix)}" represents`,
    'the command you used to get this message, without any additional arguments.',
    `It could be just "${commandPrefix}", or "node_modules/.bin/ts-node src/cli/index.ts", etc.`,
    'I\'m assuming you know how you\'re invoking this script :)',
    'It\'s a bit tricky for me to determine with certainty.',
  ].join('\n'));

  return [
    chalk.green('Usage for this tool:\n'),
    ...verbDescriptions,
    '\n',
    `For more details, run \`scape help ${chalk.underline('action')}\`, it ${chalk.italic('might')} give you further details.`,
    '\n',
    comments,
  ].join('\n');
};

const userProvidedVerb = parsedArgv._[0];

const showUsage = () => log.normal(generateUsageString());

if (!userProvidedVerb) {
  log.error([
    'Balderdash!!\n',
    'Please specify an action for me to perform.',
    'Otherwise, I dunno what to do.',
  ].join('\n'));
  showUsage();
  process.exit(ERR_MISSING_ACTION);
}

const intendedAction: Action = actions.find(({ verb }) => verb === userProvidedVerb);

if (intendedAction === undefined) {
  log.error([
    'Corn nuts!!\n',
    `Sorry but the action you specified - "${userProvidedVerb}" - is unknown to me.`,
  ].join('\n'));
  showUsage();
  process.exit(ERR_UNKNOWN_ACTION);
}

if (intendedAction.verb === 'help') {
  const maybeSubject = parsedArgv._[1];
  if (!maybeSubject) {
    showUsage();
    process.exit(0);
  }

  const actionForHelp = actionsMap.get(maybeSubject);

  if (!actionForHelp) {
    log.error([
      'Son of a monkey!!\n',
      `You're looking for help about the "${chalk.underline(maybeSubject)}" action,`,
      "but this action doesn't seem to exist.",
      'Sorry about that.',
    ].join('\n'));
    process.exit(ERR_NO_HELP_TO_DISPLAY);
  }

  const subject = maybeSubject;

  if (subject === 'help') {
    log.normal(
      chalk.italic.green(
        'Haha, if you\'re trying to get me to fall into an infinite loop, try again.\n',
      ),
    );
    showUsage();
    process.exit(0);
  }

  const headerMsg = `Ok, following is some info about the "${chalk.underline(subject)}" action.`;
  log.normal(chalk.green(headerMsg));

  if (actionForHelp.options.length === 0) {
    log.normal('Well, there are no options for this action.');
    log.normal('So you should be all set :)');
    process.exit(0);
  }

  log.normal(`\nThe options for the ${chalk.underline(subject)} action are:\n`);

  for (const option of actionForHelp.options) {
    const ovfn = chalk.italic(option.valueFriendlyName);
    const optDesc = `${option.primaryName} ${ovfn}`;
    log.normal(`--${optDesc}`);
    log.normal(`  # ${option.description}\n  #`);
    if (option.aliases.length > 0) {
      log.normal('  # the following option aliases are recognized:\n  #');
      for (const alias of option.aliases) {
        if (alias !== '$') {
          log.normal(`  #  -${alias} ${ovfn}`);
        } else {
          log.normal(`  #  ${commandPrefix} ${subject} ${chalk.underline(ovfn)}`);
        }
      }
    }
  }
}

// TODO add generic --help flag support

// now we know that the action is not "help", so
// we enter real work territory

const action = intendedAction;

const optionValues = new Map();

for (const option of action.options) {
  const pn = option.primaryName;
  const argvNames = Object.keys(parsedArgv).filter((key) => key !== '_');

  if (argvNames.includes(pn)) {
    optionValues.set(pn, parsedArgv[pn]);
  }

  const tryToSetOptionValue = (value: any) => {
    if (optionValues.has(pn)) {
      log.error(`Merlin’s beard! You specified option "${pn}" too many times.`);
      log.error(`Please use only ${chalk.bold('one')} alias.`);
      process.exit(ERR_OPTION_DEFINED_SEVERAL_WAYS);
    }

    optionValues.set(pn, value);
  };

  for (const alias of option.aliases) {
    if (alias !== '$') {
      if (argvNames.includes(alias)) {
        tryToSetOptionValue(parsedArgv[alias]);
      }
    } else if (parsedArgv._.length > 1) {
      tryToSetOptionValue(parsedArgv._[1]);
    }
  }

  if (!optionValues.has(pn) && option.defaultValue !== undefined) {
    optionValues.set(pn, option.defaultValue);
  }

  if (!optionValues.has(pn)) {
    if (option.requiresValue) {
      log.error(`Cheese and rice! Value for option "${pn}" is undefined.`);
      process.exit(ERR_OPTION_UNDEFINED);
    }

    // assume the option is a boolean flag
    optionValues.set(pn, true);
  }
}

const initWizard: Wizard = {
  storageMap: new Map<string, string | number>(),
  questions: [{
    varName: 'startURL',
    question: ['Please enter the start URL, with its protocol included ("http://") or ("https://").'],
    validators: [{
      validate: isValidURL,
      explainError: (userInput) => insist(userInput, 'is not a valid URL'),
    }],
    converter: (str) => str,
  }, {
    varName: 'nParallel',
    question: [
      'Please define the number of parallel',
      'Headless-Chrome instances you would like to run.\n',
      'The more the instances, the faster the scrape.\n',
      'But both your computer and the website you are scraping',
      'need to be able to handle it.',
      `Half the number of your CPUs (you have ${cpus().length} of them)`,
      'is a good starting point.\n',
    ],
    validators: [{
      validate: (str) => !Number.isNaN(parseFloat(str)),
      explainError: (userInput) => insist(userInput, 'cannot be interpreted as a number'),
    }, {
      validate: (str) => {
        const n = parseFloat(str);
        return Math.floor(n) === n;
      },
      explainError: (userInput) => insist(userInput, 'is not an integer, or round number, whatever you call it'),
    }, {
      validate: (str) => parseFloat(str) >= 1,
      explainError: () => 'you need at least 1 instance',
    }],
    converter: (str) => parseFloat(str),
  }],
};

const main = async () => {
  // TODO add a global verbose flag to hide this message in by default
  log.normal(`Got it.\n\nRunning action "${chalk.underline(action.verb)}", with options:`);
  optionValues.forEach((value, key) => {
    log.normal(`  --${chalk.bold(key).padEnd(22)} ${chalk.italic(value)}`);
  });
  log.normal('\n');

  const rl = readline.createInterface(process.stdin, process.stdout);
  const ask: Prompt = (qStr: string) => new Promise<string>((resolve) => {
    rl.question(qStr, (response) => resolve(response));
  });

  if (action.verb === 'init') {
    const dir = optionValues.get('directory');
    const isDir = await isDirectory(dir);
    if (!isDir) {
      bail(insist(dir, 'is not a directory'), ERR_NOT_A_DIRECTORY);
    }
    const isEmpty = await isEmptyDirectory(dir);
    if (!isEmpty) {
      bail(insist(dir, 'is not an empty directory'), ERR_DIR_NOT_EMPTY);
    }

    const confPath = joinPaths(dir, 'ntsmphc-scraper.json');

    log.normal([
      "I'm gonna ask you a few questions to initialize your project.",
      `I will save all your responses to the "${confPath}" file.`,
      "You'll be able to change things later by editing this file.\n\n",
    ].join('\n'));

    await runWizard(initWizard, ask, log);
  }

  rl.close();
};

main();
