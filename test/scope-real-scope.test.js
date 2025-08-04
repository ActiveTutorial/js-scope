import { expect } from 'chai';
import Scope from '../Scope.js';

describe('Scope - Real Scope', () => {
  it('should capture real scope and allow variable access via get/set', () => {
    function realScopeTest() {
      let a = 5;
      let b = 10;

      const scopeEval = eval(Scope.initScopeEval());
      Scope.markFunctionScope(scopeEval, realScopeTest);

      const scope = new Scope(scopeEval, ['a', 'b']);

      expect(scope.get('a')).to.equal(5);
      expect(scope.get('b')).to.equal(10);

      scope.set('a', 100);
      scope.variables.b = 200;

      expect(scope.get('a')).to.equal(100);
      expect(scope.get('b')).to.equal(200);
    }

    realScopeTest();
  });

  it('should throw error when setting/getting invalid variable names', () => {
    const scopeEval = eval(Scope.initScopeEval());
    const scope = new Scope(scopeEval, []);

    expect(() => scope.set('123abc', 1)).to.throw(SyntaxError);
    expect(() => scope.get('123abc')).to.throw(SyntaxError);
  });

  it('should fail to set unknown scope variables', () => {
    const scopeEval = eval(Scope.initScopeEval());
    const scope = new Scope(scopeEval, []);

    const success = Reflect.set(scope.variables, 'notDefined', 123);
    expect(success).to.be.false;
  });

  it('should auto-add unknown accessed variables via proxy if they exist in scope', () => {
    function test() {
      let foo = 1;
      const scopeEval = eval(Scope.initScopeEval());
      const scope = new Scope(scopeEval, ['foo']);

      expect(scope.variables.foo).to.equal(1);
    }
    test();
  });
});
