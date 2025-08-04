# js-scope

A powerful JavaScript library for creating, inspecting, and manipulating real or artificial scopes at runtime.

## Features

- Dynamically reflect and access local scopes
- Attach scopes to functions and retrieve them later
- Isolate code execution using scope-eval
- Extract variable identifiers from functions or code
- Support for both real and artificial scopes

## Installation

Install directly from GitHub:

```bash
npm install ActiveTutorial/js-scope
````

## Usage Example (Real Scope)

```js
import Scope from 'js-scope';

// Create a scope from a real runtime context
function run() {
  let foo = 123;
  const bar = 'hello';
  var baz = true;

  const scope = new Scope(eval(Scope.initScopeEval()));

  console.log(scope.get('foo')); // 123
  console.log(scope.has('bar')); // true

  scope.set('baz', false);
  console.log(baz); // false
  scope.variables.baz = "hi";
  console.log(baz) // "hi"
}

run();
```

## API

### Constructor

#### `new Scope(input[, source])`

* `input`:

  * A `Function` (real scope)
  * An `Object` (artificial scope)
  * Nothing (empty scope)
* `source`: (optional)

  * Array of variable names
  * Function (variables will be extracted from it)

---

### Instance Methods

* `scope.get(name)`
* `scope.set(name, value)`
* `scope.has(name)`
* `scope.existsInScope(name)`
* `scope.add(name | names[])`

---

### Static Methods

* `Scope.getIdentifiers(code)`
  → Extract identifiers from string or function

* `Scope.markFunctionScope(scopeEval, fn)`
  → Attach a scope-eval to a function

* `Scope.getFunctionScope(fn)`
  → Retrieve the scope from a previously marked function

* `Scope.isScopeEval(fn)`
  → Check if function is a raw scope-eval

* `Scope.generateScopeEval(obj)`
  → Create a new isolated scope from an object

* `Scope.isValidVariableName(name)`
  → Check if name is valid JS identifier

* `Scope.init()`
  → Returns string to init a full `Scope` object

* `Scope.initScopeEval()`
  → Returns the string form of a basic scope-eval

## Development

```bash
npm install
npm test
```

Tests use Mocha + Chai, found in the `/test` folder.

## License

MIT © [Active Tutorial](https://github.com/ActiveTutorial)