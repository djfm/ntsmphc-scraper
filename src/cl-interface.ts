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

type Option = {
  primaryName: string;
  description: string;
  aliases: string[];
  default?: string;
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
    aliases: ['d', '$2'],
    requiresValue: true,
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
  logError('Corn Nuts!!\n');
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

  log(`The options for the ${chalk.underline(subject)} action are:`);

  for (const option of actionForHelp.options) {
    const optDesc = `${option.primaryName} ${option.valueFriendlyName}`;
    log(`--${optDesc.padEnd(25)}`);
    log(`  # ${option.description}\n`);
  }
}
