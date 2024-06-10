[![npm version](https://img.shields.io/npm/v/@hheimerd/safe-json-stringify.svg)](https://www.npmjs.com/package/@hheimerd/safe-json-stringify)

# Safe JSON Stringify


A TypeScript utility for safely serializing objects to JSON, handling circular references gracefully.

## Features

Handles Circular References: Automatically replaces circular references with a placeholder string [Circular].
Custom Replacer Function: Allows for custom transformations on values during serialization.
Custom Indentation: Supports custom indentation for pretty-printing the JSON string.
Installation
To install the package, you can use npm or yarn:

```sh
npm install safe-json-stringify
```

or

```sh
yarn add safe-json-stringify
```

## Usage

Import the safeJsonStringify function into your project and use it to serialize objects to JSON:

```typescript
import {safeJsonStringify} from 'safe-json-stringify';

const obj = {
    name: 'John',
    circularRef: null,
};
obj.circularRef = obj;

const jsonString = safeJsonStringify(obj);
console.log(jsonString); // {"name":"John","circularRef":"[Circular]"}
```

## Cook book

### Do not serialize classes

```typescript
const replacer = (key: string, value: unknown) => {
    if (value && typeof value === 'object' && Object.getPrototypeOf !== Object.prototype) {
        return;
    }
    return value;
};

const jsonString = safeJsonStringify(obj, replacer);
```

### Custom circular value

```typescript
const replacer = (key: string, value: unknown) => {
    if (value === '[Circular]') {
        return '[CustomCircular]';
    }
    return value;
};

const jsonString = safeJsonStringify(obj, replacer);
```

### Max depth

```typescript

// lvl 0
const obj = {
    // lvl 1
    field: {
        // lvl 2
        value: 'value'
    }
}

const replacer = (key: string, value: unknown, depth: number) => {
    if (depth > 10) {
        return;
    }

    return value;
};

const jsonString = safeJsonStringify(obj, replacer);
```

## License

This project is licensed under the [MIT License](./LICENSE).
