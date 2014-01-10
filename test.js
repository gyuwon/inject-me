/* jshint node: true */
/* global describe, it */

var should = require('should');
var IoC = require('./inject-me');

describe('bind', function () {

    it("should register a dependency object", function () {
        // Setup
        var value = Math.random();

        // Exercise
        IoC.bind('MyService', { value: value});
        var service = IoC.get('MyService');

        // Verification
        should.exist(service);
        service.should.have.property('value', value);
    });

    it("should register a dependency resolver function", function () {
        // Setup
        var value = Math.random();

        // Exercise
        IoC.bind('MyService', function () { return { value: value }; });
        var service = IoC.get('MyService');

        // Verification
        should.exist(service);
        service.should.have.property('value', value);
    });

});

describe('get', function () {

    it('should inject dependencies to dependency resolvers', function () {
        // Setup
        var items = [Math.random(), Math.random()];
        IoC.bind('Repository', function () {
            return {
                findAll: function () {
                    return items;
                }
            };
        });
        IoC.bind('Service', function (Repository) {
            var repo = Repository;
            return {
                getItems: function () {
                    return repo.findAll();
                }
            };
        });

        // Exercise
        var service = IoC.get('Service');
        var result = service.getItems();

        // Verification
        should.exist(result);
        result.should.have.property('length', items.length);
    });

});

describe('inject', function () {

    it('should inject dependencies to new object', function () {
        // Setup
        var items = [Math.random(), Math.random()];
        IoC.bind('Repository', function () {
            return {
                findAll: function () {
                    return items;
                }
            };
        });
        IoC.bind('Service', function (Repository) {
            var repo = Repository;
            return {
                getItems: function () {
                    return repo.findAll();
                }
            };
        });
        var Controller = function (Service) {
            var self = this;
            self.service = Service;
            this.index = function () {
                return self.service.getItems();
            };
        };

        // Exercise
        var controller = IoC.inject(Controller);
        var result = controller.index();

        // Verification
        should.exist(result);
        result.should.have.property('length', items.length);
    });

});
