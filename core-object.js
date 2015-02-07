'use strict';

var assignProperties = require('./lib/assign-properties');

function preparePrototype(a,b) {
  var obj = {};
  for(var key in a) {
    obj[key] = a[key] 
  }
  for(var key in b) {
    obj[key] = b[key] 
  }
  return obj;
}

function makeCtor() {

  function Class() {
    var length = arguments.length;
    var constructor = this.constructor;

    if (!constructor.wasApplied) {
      for (var key in constructor.__protoMixin__) {
        constructor.prototype[key] = constructor.__protoMixin__[key];
      }
      constructor.wasApplied = true;
    }

    for (var key in constructor.__instanceMixin__) {
      this[key] = constructor.__instanceMixin__[key];
    }

    if (length === 0) {
      this.init();
    } else if (length === 1) {
      this.init(arguments[0]);
    } else {
      this.init.apply(this, arguments);
    }
  }

  Class.__instanceMixin__ = {};
  Class.__protoMixin__ = {};
  
  Class.prototype.constructor = Class;

  return Class;
}

function CoreObject(options) {
  this.init(options);
}

CoreObject.prototype.init = function(options) {
  if (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  }
};

CoreObject.extend = function(options) {
  var constructor = this;
  var Class = makeCtor();
  if (options) assignProperties(Class, options);
  var proto = preparePrototype(constructor.prototype, options);
  Class.prototype = Object.create(proto);
  Class.__proto__ = constructor;
  return Class;
};

CoreObject.reopen = function(options) {
  if (this.wasApplied) {
    throw Error('Cannot reopen class');
  }

  if (options) {
    assignProperties(this, options);
  }
};
/* global define:true module:true window: true */
if (typeof define === 'function' && define['amd'])      { define(function() { return CoreObject; }); } 
if (typeof module !== 'undefined' && module['exports']) { module['exports'] = CoreObject; } 
if (typeof window !== 'undefined')                      { window['CoreObject'] = CoreObject; }
