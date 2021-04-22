const pluralize = (n, [singular, plural]) => (n === 1 ? `${n} ${singular}` : `${n} ${plural}`);

const translateBiggestUnit = (
  n,
  [divisor, ...divisors],
  [unit, ...units],
  candidateDivisor,
  divisorsUsed,
  unitsUsed,
) => {
  const howManyUnits = n / candidateDivisor;
  if (howManyUnits >= divisor) {
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

const divideTime = (nUnits, [divisor, ...divisors], [unit, ...units]) => {
  const div = Math.floor(nUnits / divisor);
  const remainder = nUnits - div * divisor;
  const head = pluralize(div, unit);
  const tail = divisors.length > 0 ? divideTime(remainder, divisors, units) : [];
  return [head, ...tail];
};

export default function humanDuration(seconds) {
  const units = [
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

  const divisors = [60, 60, 24, 7, 4, 12, 5, 10, 100, 1000];

  if (seconds === 0) {
    return 'no time at all';
  }

  const {
    fullUnits,
    unit,
    remainingSubUnits,
    divisorsToUse,
    unitsUsed,
  } = translateBiggestUnit(seconds, divisors, units, 1, [], []);

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
}
