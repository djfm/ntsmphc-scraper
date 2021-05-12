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
