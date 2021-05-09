import chalk from 'chalk';

import {
  Logger,
} from './definitions';

import {
  compose2,
} from '../util/functional';

const createLogger = (): Logger => {
  const log = (str: string) => console.log(str);

  return {
    normal: log,
    warning: compose2(chalk.yellow, log),
    error: compose2(chalk.red, log),
    success: compose2(chalk.green, log),
  };
};

export default createLogger;
