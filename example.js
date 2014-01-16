var IoC = require('./inject-me');

// Register 'Repository' depenency.
IoC.bind('Repository', function () {
  var items = ['Ironman', 'Hulk', 'Thor'];
  return {
    findAll: function () {
      return items;
    }
  };
});

// Register 'Service' dependency that depends on 'Repository'.
IoC.bind('Service', function (Repository) {
  var repo = Repository;
  return {
    getItems: function () {
      return repo.findAll();
    }
  };
});

// Define the controller function that depends on 'Service'.
var Controller = function (Service) {
  var self = this;
  self.service = Service;
  this.index = function () {
    return self.service.getItems();
  };
};

// Create a new instance of 'Controller'
var controller = IoC.inject(Controller);

// Invoke the index action.
var items = controller.index();

// Print the result.
for (var i = 0; i < items.length; i++) {
  console.log(items[i]);
}
