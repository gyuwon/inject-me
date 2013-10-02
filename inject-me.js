/*
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

var signature = require('function-signature');

var IoC = new (function () {

    var self = this;
    var registry = {};

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
            var fn = dependency;
            var sig = signature(fn);
            var params = {};
            for (var i in sig.params) {
                var p = sig.params[i];
                if (p.name === name) {
                    continue;
                }
                var d = self.get(p.name);
                if (d) {
                    params[p.name] = d;
                }
            }
            return signature.invoke(null, fn, sig, params);
        } else {
            return dependency;
        }
    };

    /**
     * Create a new instance of specified function with dependencies.
     *
     * Parameters
     * - fn: The function to create a new instance.
     *
     * Returns: A new instance of 'fn'.
     */
    self.inject = function (fn) {
        if (typeof fn !== 'function') {
            throw new Error("The parameter 'fn' is not a function.");
        }
        var sig = signature(fn);
        var params = {};
        for (var i in sig.params) {
            var p = sig.params[i];
            var d = self.get(p.name);
            if (d) {
                params[p.name] = d;
            }
        }
        return signature.create(fn, sig, params);
    };

})();

module.exports = IoC;
