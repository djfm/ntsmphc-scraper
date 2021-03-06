export const TagTypes = [
  'date',
  'set',
  'map',
  'array',
  'object',
  'scalar',
  'regexp',
] as const;

type Tag = {
  type: typeof TagTypes[number];
  value: Array<Tag> | object | string | number | null;
};

const isTag = (maybeTag: any): maybeTag is Tag =>
  (typeof maybeTag === 'object') &&
  Object.prototype.hasOwnProperty.call(maybeTag, 'type') &&
  TagTypes.includes(maybeTag.type);

export const preSerialize = (input: any): Tag => {
  if (typeof input === 'object') {
    if (input === null) {
      return {
        type: 'object',
        value: null,
      };
    }

    if (input instanceof Map) {
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

    if (input instanceof Set) {
      return {
        type: 'set',
        value: [...input.values()].map(preSerialize),
      };
    }

    if (input instanceof Date) {
      return {
        type: 'date',
        value: input.getTime(),
      };
    }

    if (input instanceof RegExp) {
      return {
        type: 'regexp',
        value: {
          source: input.source,
          flags: input.flags,
        },
      };
    }

    const typesNotHandled = [
      WeakMap,
      WeakSet,
      Function,
    ];

    for (const T of typesNotHandled) {
      if (input instanceof T) {
        const t = T.prototype.constructor.name;
        throw new Error(`I don't think type ${t} can be serialized generically.`);
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

  if (tag.type === 'set') {
    return new Set((tag.value as any[]).map(unPack));
  }

  if (tag.type === 'date') {
    if (typeof tag.value !== 'number') {
      throw new Error('date should be stored as time, i.e. a number');
    }
    return new Date(tag.value);
  }

  if (tag.type === 'regexp') {
    const value = tag.value as {
      source: string,
      flags: string,
    };
    return new RegExp(value.source, value.flags);
  }

  throw new Error('If code execution reaches here, then I messed up.');
};

export const deserialize = (input: string) => {
  const parsed = JSON.parse(input) as Tag;
  return unPack(parsed);
};
