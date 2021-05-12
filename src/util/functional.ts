/* eslint-disable import/prefer-default-export */

// Converts an array of keys and values
// like [key1, value1, key2, value2]
// to a map like { key1 => value1, key2 => value2 }.
export const keyValueArrayToMap = (arr) => {
  const map = new Map();
  const len = arr.length;
  for (let i = 0; i < len - 1; i += 2) {
    map.set(arr[i], arr[i + 1]);
  }
  return map;
};

export function compose2 <A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a: A) => g(f(a));
}

export const objectToMap = (obj: object): Map<string, any> => {
  const map = new Map<string, any>();
  for (const key of Object.keys(obj)) {
    map.set(key, obj[key]);
  }
  return map;
};

// TODO what should we return when we get an empty array of propNames?
// current behavior is to bug, which is OK for my use case but not
// very clean.
export const hasAllOwnProperties = ([propName, ...otherPropNames]: string[]) =>
  (obj: object): boolean => {
    const hasPropName = Object.prototype.hasOwnProperty.call(obj, propName);
    if (!hasPropName) {
      return false;
    }

    if (otherPropNames.length === 0) {
      return true;
    }

    return hasAllOwnProperties(otherPropNames)(obj);
  };
