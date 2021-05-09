import chalk from 'chalk';

import {
  Wizard,
  Prompt,
  Logger,
} from './definitions';

export const runWizard = async (wizard: Wizard, ask: Prompt, log: Logger) => {
  const looksGood = () => log.success(`${chalk.bold('✔')} looks good!\n\n`);

  for (const [q, question] of wizard.questions.entries()) {
    const questionString = [
      ...question.question,
      `\n${chalk.underline('your answer')}: `,
    ].join('\n');

    log.normal(chalk.bold(`# Setting ${q + 1} of ${wizard.questions.length}:\n`));

    // eslint-disable-next-line no-labels
    validation:
    while (!wizard.storageMap.has(question.varName)) {
      // eslint-disable-next-line no-await-in-loop
      const reply = await ask(questionString);

      for (const validator of question.validators) {
        if (!validator.validate(reply)) {
          log.normal('\n');
          log.warning(validator.explainError(reply));
          log.normal('\n');
          // eslint-disable-next-line no-continue, no-labels
          continue validation;
        }
      }

      looksGood();
      wizard.storageMap.set(question.varName, question.converter(reply));
    }
  }
};

export default runWizard;
