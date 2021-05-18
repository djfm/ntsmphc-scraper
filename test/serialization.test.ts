import {
  serialize,
  deserialize,
  TagTypes,
} from '../src/util/serialization';

const pickAtRandom = (array: readonly any[]) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const randInt = (maxExcluded: number) => Math.floor(maxExcluded * Math.random());

const reduceComplexity = (complexity: number) =>
  complexity / 2;

const isZeroComplexity = (complexity: number) =>
  complexity < 1;

const randomString = (length: number) => {
  if (length <= 0) {
    return '';
  }

  const char = pickAtRandom([...'0123456789abcdef']);

  return `${char}${randomString(length - 1)}`;
};

const generateRandomWeirdObject = (complexity: number) => {
  if (isZeroComplexity(complexity)) {
    return undefined;
  }

  const nextC8y = reduceComplexity(complexity);

  const tagType = pickAtRandom(TagTypes);

  const maybeRound = pickAtRandom([
    (x: number) => x,
    (x: number) => Math.round(x),
  ]);

  switch (tagType) {
    case 'object': {
      const obj = {};

      const genKey = () => (Math.random() < 0.5 ?
        randomString(16) :
        maybeRound(Math.random() * 1000));

      for (let i = 0; i < nextC8y; i += 1) {
        const key = genKey();
        obj[key] = generateRandomWeirdObject(nextC8y);
      }

      return obj;
    }

    case 'array': {
      const arr = new Array(Math.floor(complexity));
      for (let i = 0; i < complexity; i += 1) {
        arr[i] = generateRandomWeirdObject(nextC8y);
      }
      return arr;
    }

    case 'set': {
      const set = new Set();
      for (let i = 0; i < complexity; i += 1) {
        set.add(generateRandomWeirdObject(nextC8y));
      }
      return set;
    }

    case 'map': {
      const map = new Map();
      for (let i = 0; i < complexity; i += 1) {
        map.set(
          generateRandomWeirdObject(nextC8y),
          generateRandomWeirdObject(nextC8y),
        );
      }
      return map;
    }

    case 'regexp': {
      const flag = pickAtRandom(['g', 'i', 'm', 'u']);
      const nCaptureGroups = Math.floor(4 * Math.random());
      const bits = [];
      for (let c = 0; c < nCaptureGroups; c += 1) {
        bits.push(randomString(randInt(5)));
        bits.push(`(${randomString(1 + randInt(5))})`);
      }
      const source = bits.join('');
      return new RegExp(source, flag);
    }

    case 'date': {
      return new Date(Date.now() + Math.random() * Date.now());
    }

    case 'scalar': {
      const which = Math.floor(4 * Math.random());
      if (which === 0) {
        return undefined;
      }

      if (which === 1) {
        // I know, not really a scalar...
        return null;
      }

      if (which === 2) {
        return randomString(complexity);
      }

      return maybeRound((100 * Math.random() * complexity));
    }

    default: {
      return undefined;
    }
  }
};

const roundTrip = (testValue: any) => deserialize(serialize(testValue));

describe('The serialization lib serializes data to text and back.', () => {
  describe('It serializes / deserializes scalars.', () => {
    const scalars = [1, 2, false, true, 'hello', undefined];

    for (const scalar of scalars) {
      // eslint-disable-next-line no-loop-func
      test(`a "${typeof scalar}": ${scalar}`, () => {
        expect(roundTrip(scalar)).toEqual(scalar);
      });
    }
  });

  describe('It serializes / deserializes objects', () => {
    const objects = [
      null,
      {},
      { hello: 'world' },
      [],
      [1, null],
      [1, null, 'a', {}],
      [1, null, 'a', { hello: ['world'] }],
      new Map([['a', 'A'], ['b', 'B']]),
      new Set([1, 2, 3]),
      new Date(Date.now()),
      /te(st)$/mgi,
    ];

    for (const [id, object] of objects.entries()) {
      // eslint-disable-next-line no-loop-func
      test(`the object #${id}`, () => {
        expect(roundTrip(object)).toEqual(object);
      });
    }
  });

  describe('It serializes / deserializes random weird objects', () => {
    const nRuns = 50;
    const complexity = 20;

    for (let run = 0; run < nRuns; run += 1) {
      const testSubject = generateRandomWeirdObject(complexity);
      const serialized = serialize(testSubject);
      const len = serialized.length;
      // eslint-disable-next-line no-loop-func
      test(`the object of run ${run}, with serialized length of ${len} chars`, () => {
        expect(deserialize(serialized)).toEqual(testSubject);
      });
    }
  });
});
