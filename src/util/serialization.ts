const TagTypes = [
  'map',
  'array',
  'object',
  'scalar',
] as const;

type Tag = {
  type: typeof TagTypes[number];
  value: Array<Tag> | object | string | number;
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

      return {
        type: 'map',
        value: {
          type: 'array',
          value: [...input.entries()].map(
            ([key, value]) => ({
              type: 'array',
              value: [preSerialize(key), preSerialize(value)],
            }),
          ),
        },
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
  (typeof maybeTag === 'object') &&
  Object.prototype.hasOwnProperty.call(maybeTag, 'type') &&
  TagTypes.includes(maybeTag.type);

export const serialize = (input: any): string =>
  JSON.stringify(preSerialize(input));

const unPack = (tag: Tag) => {
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
    if (!isTag(tag.value)) {
      throw new Error('Map value is not a Tag');
    }

    const entries = unPack(tag.value);

    const unPacked = new Map(entries);

    return unPacked;
  }

  throw new Error('If code execution reaches here, then I messed up.');
};

export const deserialize = (input: string) => {
  const parsed = JSON.parse(input) as Tag;
  return unPack(parsed);
};
