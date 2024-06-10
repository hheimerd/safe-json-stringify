import { safeJsonStringify } from './safeJsonStringify';
import { describe, it, expect } from 'vitest';

const circularValue = '[Circular]';

describe('safeJsonStringify', () => {
  it('should stringify a simple object', () => {
    const obj = {a: 1, b: 'string'};

    const result = safeJsonStringify(obj);
    expect(JSON.parse(result)).toEqual(obj);
  });

  it('should stringify a nested object', () => {
    const obj = {a: 1, b: {c: 2, d: 'string'}};

    const result = safeJsonStringify(obj);
    expect(JSON.parse(result)).toStrictEqual(obj);
  });

  it('should handle circular references', () => {
    const obj = {a: 1, b: {}};
    // circular reference
    obj.b = obj;

    const result = safeJsonStringify(obj);
    expect(JSON.parse(result)).toStrictEqual({a: 1, b: circularValue});
  });

  it('should use a custom replacer function', () => {
    const obj = {a: 1, b: 2};
    const replacer = (_: string, value: unknown) => (typeof value === 'number' ? value * 2 : value);

    const result = safeJsonStringify(obj, replacer);
    expect(JSON.parse(result)).toStrictEqual({a: 2, b: 4});
  });

  it('should use a custom replacer function with circular reference', () => {
    const obj = {a: 2, b: {}};
    // circular reference
    obj.b = obj;
    const replacer = (_: string, value: unknown) => (value === circularValue ? '[CustomCircular]' : value);

    const result = safeJsonStringify(obj, replacer);
    expect(JSON.parse(result)).toStrictEqual({a: 2, b: '[CustomCircular]'});
  });

  it('should pass depth as 3rd param to replacer fn', () => {
    const obj = {1: {2: {3: 'v'}}};
    const replacer = (key: string, value: unknown, depth: number) => {
      if (value === obj) {
        expect(depth).toBe(0);
      } else {
        expect(depth).toBe(Number(key));
      }
      return value;
    };

    const result = safeJsonStringify(obj, replacer);
    expect(JSON.parse(result)).toStrictEqual(obj);
  });

  it('should work with same object in array', () => {
    const obj = {a: 'value'};

    const result = safeJsonStringify([obj, obj]);
    expect(JSON.parse(result)).toStrictEqual([obj, obj]);
  });

  it('should work with non-obvious circular reference', () => {
    const obj1 = {obj2: {}};
    const obj2 = {obj1};
    // circular reference
    obj1.obj2 = obj2;

    const result = safeJsonStringify({
      obj1,
      obj2,
    });
    expect(JSON.parse(result)).toStrictEqual({
      obj1: {obj2: {obj1: circularValue}},
      obj2: {obj1: {obj2: circularValue}},
    });
  });

  it('should format with space', () => {
    const obj = {a: 1, b: 2};
    const space = 2;

    const result = safeJsonStringify(obj, undefined, space);
    expect(result).toBe(JSON.stringify(obj, null, space));
  });

  it('should work with non-obvious circular reference', () => {
    const obj2 = {};
    const obj1 = {obj2};

    const result = safeJsonStringify({
      obj2,
      obj1,
      obj2_2: obj2,
    });

    expect(JSON.parse(result)).toStrictEqual({
      obj1: {obj2: {}},
      obj2: {},
      obj2_2: {},
    });
  });

});
