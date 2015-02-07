(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var assignProperties = require('./lib/assign-properties');

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
  Class.__proto__ = CoreObject;
  Class.prototype.constructor = Class;

  return Class;
}

var CoreObject = makeCtor();

CoreObject.prototype.init = function(options) {
  if (options) {
    for (var key in options) {
      this[key] = options[key];
    }
  }
};

CoreObject.extend = function(options) {
  var Class = makeCtor();

  Class.prototype = Object.create(this.prototype);

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

},{"./lib/assign-properties":2}],2:[function(require,module,exports){
'use strict';
function giveMethodSuper(superclass, name, fn) {
  var superFn = superclass[name];

  if (typeof superFn !== 'function') {
    superFn = function() {};
  }

  // jgwhite: Compatibility hack to allow `this._super.foo`
  superFn[name] = function() {
    console.warn('DEPRECATION: Calling this._super.' + name +
                 ' is deprecated. Please use this._super(args).');
    return superFn.apply(this, arguments);
  }

  return function() {
    var previous = this._super;
    this._super = superFn;
    var ret = fn.apply(this, arguments);
    this._super = previous;
    return ret;
  };
}

var sourceAvailable = (function() {
  return this;
}).toString().indexOf('return this;') > -1;

var hasSuper;
if (sourceAvailable) {
  hasSuper = function(fn) {
    if (fn.__hasSuper === undefined) {
     return fn.__hasSuper = fn.toString().indexOf('_super') > -1;
    } else {
     return fn.__hasSuper;
    }
  }
} else {
  hasSuper = function(target, fn) {
    return true;
  };
}

function assignProperties(target, options) {
  // console.log(target.__protoMixin__, options);
  var value;
  var constructor;
  var protoMixin;
  var instanceMixin;

  for (var key in options) {
    value = options[key];
    constructor = target;
    protoMixin = constructor.__protoMixin__;
    instanceMixin = constructor.__instanceMixin__;
    if (typeof value === 'function') {
      if (hasSuper(value)) {
        protoMixin[key] = giveMethodSuper(protoMixin, key, value);
      } else {
        protoMixin[key] = value;
      } 
    } else {
      instanceMixin[key] = options[key];
    }
  }
}

module.exports = assignProperties;

},{}]},{},[1]);
