try {
    console.log('Loading scope-static-methods.test.js');
  
    const { expect } = require('chai');
    const Scope = require('../Scope.js');
  
    describe('Scope - Static Methods', () => {
      it('dummy test', () => {
        expect(true).to.be.true;
      });
    });
  
  } catch (e) {
    console.error('Error loading scope-static-methods.test.js:', e);
    throw e;
  }
  