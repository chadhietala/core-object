'use strict';

var CoreObject = require('../core-object');
var assert     = require('assert');

describe('reopen', function() {
  it('can add new properties', function() {
    var called = false;

    var Klass = CoreObject.extend({
      init: function() {}
    });

    Klass.reopen({
      baz: function() {
        called = true;
      }
    });

    var klass = new Klass();
    klass.baz();

    assert.ok(klass.__proto__.baz);
    assert.ok(called);
  });

  it('can call super', function() {
    var called = false;

    var Klass = CoreObject.extend({
      init: function() {}
    });

    Klass.reopen({
      baz: function() {
        called = true;
      }
    });

    var klass = new Klass();
    klass.baz();
    
    assert.ok(klass.__proto__.baz);
    assert.ok(called);
  });
});
