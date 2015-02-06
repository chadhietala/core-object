'use strict';
var assert = require('assert');
var assignProperties = require('../lib/assign-properties');

describe('assignProperties', function() {
  it('noop', function() {
    var target = {};
    var input = {};

    assignProperties(target, input);
    assert.deepEqual(target, input);
  });

  it('supports properties that do not conflict', function() {
    function Klass() {}
    Klass.__instanceMixin__ = {};
    Klass.__protoMixin__ = {};
    var input  = { a: 1, b: 2, c: []};

    assignProperties(Klass, input);
    assert.deepEqual(Klass.__instanceMixin__, input);
  });

  it('supports properties that conflict', function() {
    function Klass() {}
    Klass.__instanceMixin__ = { a: 2, c: [1]};
    Klass.__protoMixin__ = {};

    var input  = { a: 1, b: 2, c: []};

    assignProperties(Klass, input);
    assert.deepEqual(Klass.__instanceMixin__, input);
  });

  describe('super', function() {
    it('normal function', function() {
      function Klass() {}
      Klass.__instanceMixin__ = {};
      Klass.__protoMixin__ = {};
      var input = { a: function() { } };

      assignProperties(Klass, input);
      assert.deepEqual(Klass.__protoMixin__, input);
      assert.equal(Klass.__protoMixin__.a, input.a);
    });

    it('function with super but no root', function() {
      function Klass() {}
      Klass.__instanceMixin__ = {};
      Klass.__protoMixin__ = {};
      var input = {
        a: function() {
          this._super();
          return 5;
        }
      };

      assignProperties(Klass, input);
      assert.equal(Klass.__protoMixin__.a(), 5);
    });

    it('function with super with root', function() {
      function Klass() {}
      Klass.__instanceMixin__ = {};
      Klass.__protoMixin__ = {
        a: function() {
          return 1;
        }
      };

      var input = {
        a: function() {
          return this._super() + 5;
        }
      };

      assignProperties(Klass, input);
      assert.equal(Klass.__protoMixin__.a(), 6);
    });
  });

  describe('super.methodName', function() {
    it('supported with deprecation notice', function() {
      var prev = console.warn;
      var warning;

      console.warn = function(msg) {
        warning = msg;
      }

      function Klass() {}
      Klass.__instanceMixin__ = {};
      Klass.__protoMixin__ = {
        a: function() {
          return 1;
        }
      };

      var input = {
        a: function() {
          return this._super.a.apply(this) + 5;
        }
      };

      assignProperties(Klass, input);

      assert.equal(Klass.__protoMixin__.a(), 6);
      assert.equal(warning,
        'DEPRECATION: Calling this._super.a is deprecated. ' +
        'Please use this._super(args).');

      console.warn = prev;
    });
  });
});
