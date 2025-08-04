# js-scope

A powerful JavaScript library for creating, inspecting, and manipulating isolated runtime scopes.

## Features

- Dynamically create isolated scopes with their own variables.
- Inject and extract variables safely.
- Mark functions with their original scope.
- Evaluate code with full scope control.
- Automatically detect variable identifiers from code.

## Installation

```bash
npm install js-scope
````

## Usage

```js
import Scope from 'js-scope';

// Create a new scope with predefined variables
const scope = new Scope({ x: 10, y: 20 });
console.log(scope.get('x')); // 10

// Set a variable
scope.set('z', 30);
console.log(scope.get('z')); // 30

// Check if a variable exists in the scope
console.log(scope.has('y')); // true

// Dynamically add a variable reference
scope.add('a');
scope.set('a', 100);
console.log(scope.get('a')); // 100

// Get identifiers from a function
const ids = Scope.getIdentifiers(function() {
  let foo = bar + baz;
});
console.log(ids); // ['foo', 'bar', 'baz']
```

## API

### `new Scope(input[, source])`

Create a scope.

* `input`: `Object | Function | undefined`
* `source`: `Array<string> | Function` (only used if input is a function)

---

### `scope.get(name: string) => any`

Get the value of a scoped variable.

---

### `scope.set(name: string, value: any) => void`

Set a scoped variable's value.

---

### `scope.has(name: string) => boolean`

Returns whether a variable exists in the scope proxy.

---

### `scope.existsInScope(name: string) => boolean`

Returns whether the variable actually exists in the underlying scope (not just the proxy).

---

### `scope.add(name: string | Array<string>) => boolean`

Dynamically add one or more variable names to the proxy from the actual scope.

---

### `Scope.getIdentifiers(code: Function | string) => Array<string>`

Extract identifiers from a function or code string.

---

### `Scope.markFunctionScope(scopeEval, fn) => true`

Associate a `scopeEval` function with `fn`.

---

### `Scope.getFunctionScope(fn) => Scope | false`

Retrieve the original scope of a function previously marked.

---

### `Scope.isScopeEval(fn) => boolean`

Check if a function is a `scopeEval`.

---

### `Scope.generateScopeEval(obj) => Function`

Generates a new `scopeEval` based on the provided object of values.

---

### `Scope.isValidVariableName(name: string) => boolean`

Returns `true` if the name is a valid JavaScript variable name.

---

### `Scope.init() => string`

Returns a `new Scope(...)` call as a string.

---

### `Scope.initScopeEval() => string`

Returns the raw scope-eval function string.

---

## Development

```bash
npm install
npm test
```

Test files are located in the `test/` directory and are written using Mocha and Chai.

## License

MIT © [Active Tutorial](https://github.com/ActiveTutorial)