import esprima from 'esprima';
import estraverse from 'estraverse';

const functionScopeMap = new WeakMap();

export default class Scope {
  static #reservedName = `$reserved_scope_name_${Math.floor(1e9 + Math.random() * 9e9)}`;

  static init() {
    return `new globalThis.Scope(${Scope.#reservedName}=>eval(${Scope.#reservedName}))`;
  }

  static initScopeEval() {
    return `${Scope.#reservedName}=>eval(${Scope.#reservedName})`;
  }

  static getIdentifiers(code) {
    if (typeof code !== 'string' && typeof code !== 'function') {
      throw new TypeError('Expected a string or function.');
    }
    if (typeof code === 'function') {
      code = code.toString();
    }

    code = `(${code})`;

    try {
      const ast = esprima.parseScript(code, { tolerant: true });
      const identifiers = new Set();

      estraverse.traverse(ast, {
        enter(node) {
          if (node.type === 'Identifier') {
            identifiers.add(node.name);
          }
        }
      });

      return [...identifiers];
    } catch (err) {
      const e = new SyntaxError(`Invalid code: ${err.message}`);
      e.cause = err;
      throw e;
    }
  }

  static markFunctionScope(scopeEval, fn) {
    if (typeof fn !== 'function') {
      try {
        fn = scopeEval('arguments.callee');
      } catch {
        throw new TypeError('In strict mode, the function must be passed as an argument.');
      }
    }
    functionScopeMap.set(fn, scopeEval);
    return true;
  }

  static getFunctionScope(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function.');
    }
    const scopeEval = functionScopeMap.get(fn);
    if (!scopeEval) return false;
    return new Scope(scopeEval);
  }

  static isScopeEval(fn) {
    if (typeof fn !== 'function') return false;
    return fn.toString() === Scope.initScopeEval();
  }

  static generateScopeEval(scopeTemplate) {
    let keys = Reflect.ownKeys(scopeTemplate).filter(Scope.isValidVariableName);
    const scopeEval = globalThis.eval(
      `${keys.length > 0 ? 'let' : ''} ${keys.join()};
      ${Scope.#reservedName}=>eval(${Scope.#reservedName})`
    )(Scope.initScopeEval());

    keys.forEach(key => {
      scopeEval(`${Scope.#reservedName}=>${key}=${Scope.#reservedName}`)(scopeTemplate[key]);
    });

    return scopeEval;
  }

  static isValidVariableName(name) {
    try {
      esprima.parseScript(`let ${name};`);
      return true;
    } catch {
      return false;
    }
  }

  #scopeEval;
  #variablesRaw;

  constructor(arg1, arg2) {
    if (typeof arg1 === 'function') {
      this.#scopeEval = arg1;

      if (Array.isArray(arg2)) {
        this.add(arg2);
      } else if (typeof arg2 === 'function') {
        this.add(Scope.getIdentifiers(arg2));
      } else if (arg2 !== undefined) {
        throw new TypeError('Invalid input type for arg2. Expected an array or function.');
      }
    } else if (arg1 && typeof arg1 === 'object') {
      this.#scopeEval = Scope.generateScopeEval(arg1);
      this.add(Reflect.ownKeys(arg1));
    } else if (arg1 === undefined) {
      this.#scopeEval = Scope.generateScopeEval({});
    } else {
      throw new TypeError('Invalid input type. Expected a function or an object.');
    }

    this.#variablesRaw = {};
    this.variables = new Proxy(this.#variablesRaw, {
      get: (target, name) => {
        if (!Scope.isValidVariableName(name)) return undefined;
        if (name in target) return target[name];
        this.add(name);
        return this.variables[name];
      },
      set: (target, name, value) => {
        if (!Scope.isValidVariableName(name)) return false;
        if (!this.existsInScope(name)) return false;
        if (!(name in target)) this.add(name);
        target[name] = value;
        return true;
      },
      has: (target, name) => {
        if (!Scope.isValidVariableName(name)) return false;
        if (name in target) return true;
        this.add(name);
        return name in target;
      }
    });
  }

  add(input) {
    if (!input) return false;
    if (typeof input === 'string') {
      try { this.addSingle(input); } catch { return false; }
    } else {
      for (const name of input) {
        if (typeof name === 'string') {
          try { this.addSingle(name); } catch {}
        }
      }
    }
    return true;
  }

  addSingle(name) {
    if (!Scope.isValidVariableName(name)) return false;
    if (!this.existsInScope(name)) return false;

    Object.defineProperty(this.#variablesRaw, name, {
      get: this.#scopeEval.bind(globalThis, name),
      set: this.#scopeEval(`${Scope.#reservedName}=>${name}=${Scope.#reservedName}`)
    });
    return true;
  }

  set(name, value) {
    if (!Scope.isValidVariableName(name)) {
      throw new SyntaxError(`Invalid variable name: "${name}"`);
    }
    this.variables[name] = value;
  }

  get(name) {
    if (!Scope.isValidVariableName(name)) {
      throw new SyntaxError(`Invalid variable name: "${name}"`);
    }
    return this.variables[name];
  }

  has(name) {
    if (!Scope.isValidVariableName(name)) {
      return false;
    }
    return name in this.variables;
  }

  existsInScope(name) {
    if (!Scope.isValidVariableName(name)) {
      throw new SyntaxError(`Invalid variable name: "${name}"`);
    }
    try {
      this.#scopeEval(name);
      return true;
    } catch {
      return false;
    }
  }
}

globalThis.Scope = Scope;
