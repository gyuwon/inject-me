# inject-me

Simple IoC framework for Javascript.

## Installation

    $ npm install inject-me
    
## Usage

    var IoC = require('inject-me');

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

    // Define the controller type that depends on 'Service'.
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
    };

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
