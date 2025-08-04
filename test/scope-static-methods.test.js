import { expect } from 'chai';
import Scope from '../Scope.js';

describe('Scope - Static Methods', () => {
  describe('getIdentifiers()', () => {
    it('extracts identifiers from function', () => {
      function example(a, b) {
        const x = a + b;
        return x;
      }
      const ids = Scope.getIdentifiers(example);
      expect(ids).to.include.members(['a', 'b', 'x']);
    });

    it('handles anonymous function input', () => {
      const ids = Scope.getIdentifiers(function(c, d) { return c * d; });
      expect(ids).to.include.members(['c', 'd']);
    });

    it('throws on invalid code', () => {
      expect(() => Scope.getIdentifiers('let @!@')).to.throw(SyntaxError);
    });

    it('throws on non-string non-function', () => {
      expect(() => Scope.getIdentifiers(42)).to.throw(TypeError);
    });
  });

  describe('isScopeEval()', () => {
    it('returns true for valid scope eval', () => {
      const fn = eval(Scope.initScopeEval());
      expect(Scope.isScopeEval(fn)).to.be.true;
    });

    it('returns false for non-matching function', () => {
      expect(Scope.isScopeEval(() => {})).to.be.false;
    });
  });

  describe('isValidVariableName()', () => {
    it('accepts valid names', () => {
      expect(Scope.isValidVariableName('a')).to.be.true;
      expect(Scope.isValidVariableName('_valid')).to.be.true;
      expect(Scope.isValidVariableName('$alsoValid')).to.be.true;
    });

    it('rejects invalid names', () => {
      expect(Scope.isValidVariableName('123bad')).to.be.false;
      expect(Scope.isValidVariableName('a-b')).to.be.false;
      expect(Scope.isValidVariableName('a b')).to.be.false;
    });
  });
});
