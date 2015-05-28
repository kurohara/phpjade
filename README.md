# phpjade

The modifier module for Jade template engine.  
This project has created by rewriting the ['jade-php'](https://github.com/viniwrubleski/jade-php)project, to  
1. change the API.  
2. support new feature I personally require.

## Getting Started
Install the module with: `npm install phpjade`

```javascript
var jade = require('jade');
var phpjade = require('phpjade');
phpjade.init(jade); // apply modifier.
...

// just use jade.
var fn = jade.compileFile(filepath, options);
var phptext = fn(locals);
```

## Documentation
### API
#### init(jade)
Attach this modifier to Jade template engine.  

#### restore()
Remove this modifier from Jade template engine.

### Options(passed as options for jade API)
#### usestrip
Set this option to true to support 'nameless' attributes.  

```javascript
var jade = require('jade');
var phpjade = require('phpjade');
phpjade.init(jade);
var fn = jade.compileFile(filepath, { usestring:true });

```

### Modified syntax
The following syntax sample is formatted as if pretty print option is set.

#### attribute as php expression with escape.

```
tag(attr=php_function())
```

```html
<tag attr="<?php echo htmlspecialchars(php_function(), ENT_QUOTES, 'UTF-8'); ?>"></tag>
```

#### attribute as php expression without escape.

```
tag(attr!=php_function())
```

```html
<tag attr="<?php echo php_function(); ?>"></tag>
```

#### attribute as php expression without echo.

```
tag(attr!=-php_function())
```

```
<tag attr="<?php php_function(); ?>"></tag>
```

#### nameless attribute

```
tag(__=php_function())
```

```html
<tag <?php php_function(); ?> ></tag>
```
_____________

```
tag(__=php_function(), ___=php_function2())
```

```html
<tag <?php php_function(); ?> <?php php_function2(); ?> ></tag>
```

#### codes
```
tag
  - php_code
```

```html
<tag><?php php_code ;?></tag>
```

#### php filter

```
:php
  /* some php codes comes here */
  call_php_function();
html
```

```
<?php
/* some php codes comes here */
call_php_function();
?>
<html>
</html>
```

## Examples
```
html
  body
    - testfunc();
    div(__=some_php_function())
      | test
    - foreach ($this->list as $list):
      li!= $list
    - endforeach

```

```html
<html>
  <body>
    <?php testfunc(); ?>
    <div <?php some_php_function(); ?> >test</div>
    <?php foreach ($this->list as $list): ?>
      <li><?php echo $list; ?></li>
    <?php endforeach; ?>
  </body>
</html>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
1.0.0 May 20 2015

## License
Copyright (c) 2015 Hiroyoshi Kurohara  
Licensed under the MIT license.
