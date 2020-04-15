'use strict';
const assert = require('assert').strict;

describe('The truth', function() {
  it('should always be true', function() {
    assert(true, 'true should always be true');
  });
  it('should never be false', function() {
    assert(!false, 'false shoud never be true');
  });
});
