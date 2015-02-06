'use strict';

var assignProperties = require('./lib/assign-properties');

function makeCtor() {

}

function CoreObject(options) {
  this.init(options);
}

CoreObject.prototype.constructor = CoreObject;
CoreObject.__instanceMixin__ = {};
CoreObject.__protoMixin__ = {};

CoreObject.prototype.init = function(options) {
  if (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  }
};

CoreObject.extend = function(options) {
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
    
  Class.__protoMixin__ = {};
  Class.__instanceMixin__ = {};
  Class.__proto__ = CoreObject;


  Class.prototype = Object.create(this.prototype);
  Class.prototype.constructor = Class;
  if (options) assignProperties(Class, options);
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
