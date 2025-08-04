import { expect } from 'chai';
import Scope from '../Scope.js';

describe('Scope - Utils', () => {
  it('markFunctionScope and getFunctionScope should work correctly', () => {
    function scopedFunc() {
      const seval = eval(Scope.initScopeEval());
      Scope.markFunctionScope(seval, scopedFunc);
      const scope = Scope.getFunctionScope(scopedFunc);
      expect(scope).to.be.an.instanceof(Scope);
    }

    scopedFunc();
  });

  it('throws if getFunctionScope is called with non-function', () => {
    expect(() => Scope.getFunctionScope(123)).to.throw(TypeError);
  });

  it('markFunctionScope throws on strict mode if function not passed', () => {
    const result = Scope.markFunctionScope(() => {}, function dummy() {});
    expect(result).to.be.true;
  });

  it('generateScopeEval produces functioning scope', () => {
    const template = { a: 1, b: 2 };
    const seval = Scope.generateScopeEval(template);

    expect(seval(`${Scope.reservedName}=>a`)()).to.equal(1);
    seval(`${Scope.reservedName}=>a=${Scope.reservedName}`)(99);
    expect(seval(`${Scope.reservedName}=>a`)()).to.equal(99);
  });

  it('generateScopeEval skips invalid keys', () => {
    const template = { 'good': 1, 'bad key': 2 };
    const seval = Scope.generateScopeEval(template);

    expect(seval(`${Scope.reservedName}=>good`)()).to.equal(1);
    expect(() => seval(`${Scope.reservedName}=>bad key`)()).to.throw();
  });
});
