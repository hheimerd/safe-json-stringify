function isObject(obj: unknown): obj is Object {
  return !!obj && typeof obj === 'object';
}

type Replacer = (this: unknown, key: string, value: unknown, depth: number) => unknown;

/**
 * Converts a value to a JSON string with circular reference resolve
 *
 * @param target object for serialization
 * @param replacer function for replace field values
 * @param space space for formating
 * @returns JSON string
 */
export function safeJsonStringify(
  target: unknown,
  replacer: Replacer = (_, v) => v,
  space?: string | number,
) {
  const parents: unknown[] = [];
  const circularValue = '[Circular]';

  function moveToCurrentParent(currentParent: unknown) {
    while (parents.length && parents.at(-1) !== currentParent) {
      parents.pop();
    }
  }

  return JSON.stringify(target, function (key, currentValue) {
    if (!isObject(currentValue)) {
      return replacer.call(this, key, currentValue, parents.length);
    }

    moveToCurrentParent(this);

    if (parents.includes(currentValue)) {
      return replacer.call(this, key, circularValue, parents.length);
    }

    parents.push(currentValue);

    return replacer.call(this, key, currentValue, parents.length - 1);
  }, space);
};
