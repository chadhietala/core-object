'use strict';

var assignProperties = require('./lib/assign-properties');

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
  var constructor = this;
  this.wasApplied = false;

  function Class() {
    var length = arguments.length;

    for (var pKey in this.constructor.__protoMixin__) {
      this.constructor.prototype[pKey] = this.constructor.__protoMixin__[pKey];
    }

    for (var iKey in this.constructor.__instanceMixin__) {
      this[iKey] = this.constructor.__instanceMixin__[iKey];
      this.wasApplied = true;
    }

    if (length === 0)      this.init();
    else if (length === 1) this.init(arguments[0]);
    else                   this.init.apply(this, arguments);
  }

  Class.__proto__ = CoreObject;

  Class.prototype = Object.create(constructor.prototype);
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
