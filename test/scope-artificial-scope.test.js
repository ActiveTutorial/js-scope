import { expect } from 'chai';
import Scope from '../Scope.js';

describe('Scope - Artificial Scope', () => {
  it('should construct from object and allow access and mutation', () => {
    const scope = new Scope({ a: 1, b: 2 });

    expect(scope.get('a')).to.equal(1);
    expect(scope.get('b')).to.equal(2);

    scope.set('a', 10);
    scope.variables.b = 20;

    expect(scope.get('a')).to.equal(10);
    expect(scope.get('b')).to.equal(20);
  });

  it('should reject invalid variable names in template', () => {
    const invalid = { '1bad': 3, 'valid': 5 };
    const scope = new Scope(invalid);

    expect(scope.has('valid')).to.be.true;
    expect(scope.has('1bad')).to.be.false;
  });

  it('should support empty initialization', () => {
    const scope = new Scope();

    expect(scope).to.have.property('variables');
    expect(scope.has('x')).to.be.false;

  });

  it('add() and addSingle() should ignore or skip invalid input', () => {
    const scope = new Scope({ x: 1 });

    scope.add(['x', 'invalid name', 123, null, undefined]);

    expect(scope.has('x')).to.be.true;
    expect(scope.has('invalid name')).to.be.false;
  });
});
