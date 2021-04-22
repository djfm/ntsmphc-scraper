/* eslint-env mocha */

import chai from 'chai';
import humanDuration from '../humanDuration.js';

chai.should();

describe('The humanDuration function converts second to human-readable durations', () => {
  it('says no time at all for 0', () => {
    humanDuration(0).should.equal('no time at all');
  });

  const cases = [
    [1, '1 second'],
    [2, '2 seconds'],
    [60, '1 minute'],
    [65, '1 minute and 5 seconds'],
    [3730, '1 hour, 2 minutes and 10 seconds'],
    [700000, '1 week, 1 day, 2 hours, 26 minutes and 40 seconds'],
  ];

  for (const [input, expected] of cases) {
    it(`Should translate ${input} to: "${expected}".`, () => {
      humanDuration(input).should.equal(expected);
    });
  }
});
