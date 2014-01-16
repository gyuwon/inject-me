var should = require('should');
var IoC = require('./inject-me');

describe('IoC', function () {
  var items = [Math.random(), Math.random()];

  describe('bind', function () {
    it("should register a dependency object", function () {
      // Setup
      var value = Math.random();

      // Exercise
      IoC.bind('MyService', { value: value});
      var service = IoC.get('MyService');

      // Verify
      should.exist(service);
      service.should.have.property('value', value);
    });

    it("should register a dependency resolver function", function () {
      // Setup
      var value = Math.random();

      // Exercise
      IoC.bind('MyService', function () { return { value: value }; });
      var service = IoC.get('MyService');

      // Verify
      should.exist(service);
      service.should.have.property('value', value);
    });
  });

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

  describe('get', function () {
    it('should inject dependencies to dependency resolvers', function () {
      // Setup

      // Exercise
      var service = IoC.get('Service');
      var result = service.getItems();

      // Verify
      should.exist(result);
      result.should.equal(items);
    });
  });

  describe('call', function () {
    it('should inject dependencies to new object', function () {
      // Setup
      var action = function (Service) {
        var service = Service;
        return service.getItems();
      };

      // Exercise
      var result = IoC.call(null, action);

      // Verify
      should.exist(result);
      result.should.equal(items);
    });

    it('should keep default arguments when keepDefaults is true', function () {
      // Setup
      var action = function (Service) {
        var service = Service;
        return service.getItems();
      };

      // Exercise
      var result = IoC.call(null, action, {
        Service: {
          getItems: function () {
            return [];
          }
        }
      }, true);

      // Verify
      should.exist(result);
      result.should.be.instanceof(Array).and.have.property('length', 0);
    });
  });

  describe('inject', function () {
    it('should inject dependencies to new object', function () {
      // Setup
      var Controller = function (Service) {
        var self = this;
        self.service = Service;
        self.index = function () {
          return self.service.getItems();
        };
      };

      // Exercise
      var controller = IoC.inject(Controller);
      var result = controller.index();

      // Verify
      should.exist(result);
      result.should.equal(items);
    });
  });
});
