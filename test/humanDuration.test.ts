import humanDuration from '../src/humanDuration';

describe('The humanDuration function translates numbers of seconds to human-readable durations.', () => {
  test('it translates 0 as "no time at all"', () => {
    const actual = humanDuration(0);
    expect(actual).toEqual('no time at all');
  });

  type Example = [seconds: number, representation: string];

  const examples: Example[] = [
    [1, '1 second'],
    [2, '2 seconds'],
    [60, '1 minute'],
    [65, '1 minute and 5 seconds'],
    [3730, '1 hour, 2 minutes and 10 seconds'],
    [700000, '1 week, 1 day, 2 hours, 26 minutes and 40 seconds'],
  ];

  for (const [input, expected] of examples) {
    test(`it translates ${input} to: "${expected}"`, () => {
      const actual = humanDuration(input);
      expect(actual).toEqual(expected);
    });
  }
});
