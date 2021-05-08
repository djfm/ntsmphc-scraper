// The following imports cannot be converted as default imports
// without the "esModuleInterop" flag which I don't want to set.
// Hence the `ts` warnings I can't get rid of in VSCode.
// Don't worry and don't touch it.
import * as Minimist from 'minimist';
import * as chalk from 'chalk';

const log = (text: string) => console.log(text);
const logError = (errText: string) => console.log(chalk.red(errText));

const ERR_MISSING_ACTION = 1;
const ERR_UNKNOWN_ACTION = 2;
const ERR_NO_HELP_TO_DISPLAY = 3;
const ERR_OPTION_DEFINED_SEVERAL_WAYS = 4;
const ERR_OPTION_UNDEFINED = 5;

type Option = {
  primaryName: string;
  description: string;
  aliases: string[];
  defaultValue?: string;
  requiresValue: boolean;
  valueFriendlyName?: string;
};

type Action = {
  verb: string;
  description: string;
  options: Option[];
};

const parsedArgv = Minimist(process.argv.slice(2));

const commandPrefix = 'scrape';

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
    `In all of the above, "${chalk.bold('scrape')}" represents`,
    'the command you used to get this message, without any additional arguments.',
    'It could be just "yarn cli", or "node_modules/.bin/ts-node src/cl-interface.ts", etc.',
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

const showUsage = () => log(generateUsageString());

if (!userProvidedVerb) {
  logError('Balderdash!!\n\nPlease specify an action for me to perform.\nOtherwise, I dunno what to do.\n');
  showUsage();
  process.exit(ERR_MISSING_ACTION);
}

const intendedAction: Action = actions.find(({ verb }) => verb === userProvidedVerb);

if (intendedAction === undefined) {
  logError('Corn nuts!!\n');
  logError(`Sorry but the action you specified - "${userProvidedVerb}" - is unknown to me.\n`);
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
    logError('Son of a monkey!!\n');
    logError(`You're looking for help about the "${chalk.underline(maybeSubject)}" action,`);
    logError('but this action doesn\'t seem to exist.\nSorry about that.');
    process.exit(ERR_NO_HELP_TO_DISPLAY);
  }

  const subject = maybeSubject;

  if (subject === 'help') {
    log(chalk.italic.green('Haha, if you\'re trying to get me to fall into an infinite loop, try again.\n'));
    showUsage();
    process.exit(0);
  }

  const headerMsg = `Ok, following is some info about the "${chalk.underline(subject)}" action.`;
  log(chalk.green(headerMsg));

  if (actionForHelp.options.length === 0) {
    log('Well, there are no options for this action.');
    log('So you should be all set :)');
    process.exit(0);
  }

  log(`\nThe options for the ${chalk.underline(subject)} action are:\n`);

  for (const option of actionForHelp.options) {
    const ovfn = chalk.italic(option.valueFriendlyName);
    const optDesc = `${option.primaryName} ${ovfn}`;
    log(`--${optDesc}`);
    log(`  # ${option.description}\n  #`);
    if (option.aliases.length > 0) {
      log('  # the following option aliases are recognized:\n  #');
      for (const alias of option.aliases) {
        if (alias !== '$') {
          log(`  #  -${alias} ${ovfn}`);
        } else {
          log(`  #  ${chalk.underline('scrape')} ${subject} ${ovfn}`);
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
      logError(`Merlin’s beard! You specified option "${pn}" too many times.`);
      logError(`Please use only ${chalk.bold('one')} alias.`);
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
      logError(`Cheese and rice! Value for option "${pn}" is undefined.`);
      process.exit(ERR_OPTION_UNDEFINED);
    }

    // assume the option is a boolean flag
    optionValues.set(pn, true);
  }
}

log(`Got it.\nRunning action "${chalk.underline(action.verb)}", with options:`);
optionValues.forEach((value, key) => {
  log(`  --${chalk.bold(key).padEnd(22)} ${chalk.italic(value)}`);
});
