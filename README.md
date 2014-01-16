# inject-me
inject-me is a simple IoC container for javascript.

## Installation
```
$ npm install inject-me
```

## Getting the IoC Container Instance
```javascript
var IoC = require('inject-me');
```

## Module Registration
```javascript
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
```

## Function Call
```javascript
var action = function (Service) {
  var service = Service;
  return service.getItems();
};

console.log(IoC.call(this, action));
// [ 'Ironman', 'Hulk', 'Thor' ]
```

## Function Call with Parameters
```javascript
var getItemByIndex = function (Service, index) {
  var service = Service;
  return service.getItems()[index];
};

console.log(IoC.call(this, getItemByIndex, { index: 1 }));
// 'Hulk'
```

## Object Construction
```javascript
var Controller = function (Service) {
  var service = Service;
  this.index = function () {
    return service.getItems();
  };
};

var controller = IoC.inject(Controller);

console.log(controller.index());
// [ 'Ironman', 'Hulk', 'Thor' ]
```

## Object Construction with Parameters
```javascript
var Controller = function (name, Service) {
  var service = Service;
  this.name = name;
  this.index = function () {
    return service.getItems();
  };
};

var controller = IoC.inject(Controller, { name: 'ItemsController' });

console.log(controller.name);
// 'ItemsController'
console.log(controller.index());
// [ 'Ironman', 'Hulk', 'Thor' ]
```

## License

The MIT License (MIT)

Copyright (c) 2013 Yi Gyuwon <gyuwon@live.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
