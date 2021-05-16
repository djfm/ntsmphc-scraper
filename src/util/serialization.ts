// TODO Unit-test all this shit

type Tag = {
  type: 'map' | 'array' | 'object' | 'scalar';
  value: Array<Tag> | object | string | number;
  mapKeyExample?: any,
  mapValueExample?: any,
};

export const preSerialize = (input: any): Tag => {
  if (typeof input === 'object') {
    if (input === null) {
      return {
        type: 'object',
        value: null,
      };
    }

    if (input instanceof Map) {
      // we cannot do black sorcery if the map is empty, sorry
      if (input.size === 0) {
        return {
          type: 'scalar',
          value: null,
        };
      }

      const [mapKeyExample, mapValueExample] = input.entries().next().value;

      return {
        type: 'map',
        value: [...input.entries()].map(
          ([key, value]) => [preSerialize(key), preSerialize(value)],
        ),
        mapKeyExample: preSerialize(mapKeyExample),
        mapValueExample: preSerialize(mapValueExample),
      };
    }

    if (input instanceof Array) {
      return {
        type: 'array',
        value: input.map(preSerialize),
      };
    }

    const typesNotHandled = [
      Set,
      WeakMap,
      WeakSet,
      Date,
      Function,
    ];

    for (const T of typesNotHandled) {
      if (input instanceof T) {
        const t = T.prototype.constructor.name;
        throw new Error(`Type ${t} is not handled (yet?) by my quick and dirty serialization lib`);
      }
    }

    const preSerializedObject = {};
    for (const [key, value] of Object.entries(input)) {
      preSerializedObject[key] = preSerialize(value);
    }

    return {
      type: 'object',
      value: preSerializedObject,
    };
  }

  return {
    type: 'scalar',
    value: input,
  };
};

const isTag = (maybeTag: any): maybeTag is Tag =>
  (typeof maybeTag === 'object') && Object.prototype.hasOwnProperty.call(maybeTag, 'type');

export const serialize = (input: any): string =>
  JSON.stringify(preSerialize(input));

const unPack = (maybeTag: any) => {
  if (!isTag(maybeTag)) {
    return maybeTag;
  }

  const tag: Tag = maybeTag;

  if (tag.type === 'scalar') {
    return tag.value;
  }

  if (tag.type === 'object') {
    if (tag.value === null) {
      return null;
    }

    const object = {};

    for (const [key, value] of Object.entries(tag.value)) {
      object[key] = unPack(value);
    }

    return object;
  }

  if (tag.type === 'array') {
    return (tag.value as Tag[]).map(unPack);
  }

  if (tag.type === 'map') {
    const keyExample = unPack(tag.mapKeyExample);
    const valueExample = unPack(tag.mapValueExample);

    const packedMap = tag.value as Map<typeof keyExample, typeof valueExample>;

    const unPacked = new Map<typeof keyExample, typeof valueExample>();

    for (const [key, value] of packedMap.entries()) {
      unPacked.set(unPack(key), unPack(value));
    }

    return unPacked;
  }

  throw new Error('We should never get there.');
};

export const deserialize = (input: string) => {
  const parsed = JSON.parse(input) as Tag;
  return unPack(parsed);
};
