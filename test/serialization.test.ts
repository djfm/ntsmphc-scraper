import {
  serialize,
  deserialize,
} from '../src/util/serialization';

const roundTrip = (testValue: any) => deserialize(serialize(testValue));

describe('The serialization lib serializes data to text and back.', () => {
  describe('It serializes / deserializes scalars.', () => {
    const scalars = [1, 2, false, true, 'hello'];
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
    ];

    for (const [id, object] of objects.entries()) {
      // eslint-disable-next-line no-loop-func
      test(`the object #${id}`, () => {
        expect(roundTrip(object)).toEqual(object);
      });
    }
  });
});
