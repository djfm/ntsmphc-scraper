type Unit = [singularForm: string, pluralForm: string];

const pluralize = (n: number, [singular, plural]: Unit) =>
  (n === 1 ? `${n} ${singular}` : `${n} ${plural}`);

const timeUnits: Unit[] = [
  ['second', 'seconds'],
  ['minute', 'minutes'],
  ['hour', 'hours'],
  ['day', 'days'],
  ['week', 'weeks'],
  ['month', 'months'],
  ['year', 'years'],
  ['lustrum', 'lustra'],
  ['decade', 'decades'],
  ['century', 'centuries'],
  ['millenium', 'millenia'],
];

const translateBiggestUnit = (
  n: number,
  [divisor, ...divisors]: number[],
  [unit, ...units]: Unit[],
  candidateDivisor: number,
  divisorsUsed: number[],
  unitsUsed: Unit[],
) => {
  const howManyUnits = n / candidateDivisor;
  if (howManyUnits >= divisor && divisors.length > 0) {
    return translateBiggestUnit(
      n,
      divisors,
      units,
      candidateDivisor * divisor,
      [candidateDivisor * divisor, ...divisorsUsed],
      [unit, ...unitsUsed],
    );
  }

  const fullUnits = Math.floor(howManyUnits);
  const remainingSubUnits = n - fullUnits * candidateDivisor;

  const [, ...unitDivisors] = divisorsUsed;

  return {
    fullUnits,
    unit,
    remainingSubUnits,
    divisorsToUse: [...unitDivisors, 1],
    unitsUsed,
  };
};

const divideTime = (
  nUnits: number,
  [divisor, ...divisors]: number[],
  [unit, ...units]: Unit[],
) => {
  const div = Math.floor(nUnits / divisor);
  const remainder = nUnits - div * divisor;
  const head = pluralize(div, unit);
  const tail = divisors.length > 0 ? divideTime(remainder, divisors, units) : [];
  return [head, ...tail];
};

// Convert a duration expressed in seconds to a human-readable
// string expressing that duration in appropriate units.
// E.g. 65 yields "1 minute and 5 seconds".
// This function is unit-tested, see the test file for more examples.
const humanDuration = (seconds: number) => {
  const divisors = [60, 60, 24, 7, 4, 12, 5, 2, 10, 10];

  if (seconds === 0) {
    return 'no time at all';
  }

  const {
    fullUnits,
    unit,
    remainingSubUnits,
    divisorsToUse,
    unitsUsed,
  } = translateBiggestUnit(seconds, divisors, timeUnits, 1, [], []);

  const rest = remainingSubUnits > 0 ? divideTime(remainingSubUnits, divisorsToUse, unitsUsed) : [];

  const resultParts = [
    pluralize(fullUnits, unit),
    ...rest,
  ];

  if (resultParts.length <= 2) {
    return resultParts.join(' and ');
  }

  const csv = resultParts.slice(0, -1).join(', ');
  const lastPart = resultParts[resultParts.length - 1];

  return `${csv} and ${lastPart}`;
};

export default humanDuration;
