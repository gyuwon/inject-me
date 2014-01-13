/**
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 Yi Gyuwon <gyuwon@live.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/* jshint node: true, laxcomma: true */

var signature = require('function-signature');

var IoC = function () {

  var self = this
    , registry = {}
    , cache = {};

  /**
   * Register a dependency object or a dependency resolver.
   *
   * Parameters
   * - name: The name of dependency.
   * - dependency: A dependency object or a dependency resolver that is associated with 'name'.
   */
  self.bind = function (name, dependency) {
    registry[name] = dependency;
  };

  var sig = function (fn) {
    var s = cache[fn];
    if (!s) {
      s = signature(fn);
      cache[fn] = s;
    }
    return s;
  };

  /**
   * Returns the dependency object that is associated with 'nane'.
   *
   * Parameters
   * - name: The name of dependency.
   *
   * Returns: The dependency object that is associated with 'name'.
   */
  self.get = function (name) {
    var dependency = registry[name];
    if (typeof dependency === 'function') {
      var fn = dependency, s = sig(fn), params = {}, i;
      for (i in s.params) {
        var p = s.params[i];
        if (p.name === name) {
          continue;
        }
        var d = self.get(p.name);
        if (d) {
          params[p.name] = d;
        }
      }
      if (fn.name.match(/^[A-Z]/)) {
        dependency = signature.create(fn, s, params);
      }
      else {
        dependency = signature.invoke(null, fn, s, params);
      }
    }
    return dependency;
  };

  var getParams = function (s, defaults, keepDefaults) {
    var params = {}, i;
    if (!defaults) {
      defaults = {};
    }
    for (i in defaults) {
      params[i] = defaults[i];
    }
    for (i in s.params) {
      var p = s.params[i];
      if (keepDefaults === true && defaults[p.name]) {
        continue;
      }
      var d = self.get(p.name);
      if (d) {
        params[p.name] = d;
      }
    }
    return params;
  };

  /**
   * Call the specified function with dependencies.
   *
   * Parameters
   * - $this: The value of this provided for the call to fn.
   * - fn: The function to create a new instance.
   * - defaults: A set of default arguments.
   * - keepDetaults: The value that indicates whether keep default arguments rather than dependencies.
   *
   * Returns: The return value of 'fn' or a new instance of it.
   */
  self.call = function ($this, fn, defaults, keepDefaults) {
    if (typeof fn !== 'function') {
      throw new Error("The parameter 'fn' is not a function.");
    }
    var s = sig(fn), params = getParams(s, defaults, keepDefaults);
    return signature.invoke($this, fn, s, params);
  };

  /**
   * Create a new instance of the specified function with dependencies.
   *
   * Parameters
   * - fn: The function to create a new instance.
   * - defaults: A set of default arguments.
   * - keepDetaults: The value that indicates whether keep default arguments rather than dependencies.
   *
   * Returns: The return value of 'fn' or a new instance of it.
   */
  self.inject = function (fn, defaults, keepDefaults) {
    if (typeof fn !== 'function') {
      throw new Error("The parameter 'fn' is not a function.");
    }
    var s = sig(fn), params = getParams(s, defaults, keepDefaults);
    return signature.create(fn, s, params);
  };

};

module.exports = new IoC();
