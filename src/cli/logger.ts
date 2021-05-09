import { Transform } from 'stream';

import chalk from 'chalk';

import {
  Logger,
} from './definitions';

import {
  compose2,
} from '../util/functional';

// TODO make my custom prompt also use this stream in cli/index.ts
class LoggerStream extends Transform {
  // eslint-disable-next-line no-underscore-dangle, class-methods-use-this
  _transform(data: any, encoding: any, cb: any) {
    cb(null, data.toString().replace(/\n\n+/mg, '\n\n'));
  }
}

const createLogger = (): Logger => {
  // This custom stream transforms what would
  // normally be written to stdout by
  // making sure that never more than 2 consecutive
  // white lines are output.
  //
  // It's a bit hackish but it works reasonably well.
  // Was also a good opportunity to learn.
  const stream = new LoggerStream();
  stream.pipe(process.stdout);

  const log = (str: string) => stream.write(`${str}\n`);

  return {
    normal: log,
    warning: compose2(chalk.yellow, log),
    error: compose2(chalk.red, log),
    success: compose2(chalk.green, log),
  };
};

export default createLogger;
