# jade4php [![Build Status](https://secure.travis-ci.org/kurohara/jade4php.png?branch=master)](http://travis-ci.org/kurohara/jade4php)

The modifier module for jade template engine.  
This project has created by rewriting the 'jade-php' project to  
# change the API.  
# support new feature I personally require.

The idea of modifying the functionality of the Jade template engine is incorporated from 'jade-php'.  

## Getting Started
Install the module with: `npm install kurohara/jade4php`

```javascript
var jade = require('jade');
var jade4php = require('jade4php');
jade4php.init(jade); // apply modifier.
...

// just use jade.
var fn = jade.compileFile(filepath, options);
var phptext = fn(locals);
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 kurohara  
Licensed under the MIT license.
