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
var fn = jade.compileFile(filepath, { usestrip:true });

```

#### prefunction
Called just after compiler found php portion of text.  
Used for remove cumbersome typing from php code.  
```javascript
var jade = require('jade');
require('phpjade').init(jade);
var fn = jade.compileFile(filepath, {
           prefunction: function(input, options) {
             return input.replace(/###/, "'mythemename'");
           }
         });
```

```
html
  body
    div!=_e('hello php world!', ###)
```

```
<html>
  <body>
    <div><?php echo _e('hello php world!', 'mythemename'); ?></div>
  </body>
</html>
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

#### conjunction of php code with literal
```
div(op!=php_func('abc', "def")+"ghijk")
```

```
<div op="<?php echo php_func('abc', "def"); ?>ghijk"></div>
```

## Known bugs
### You may need to add surrounding white space to attribute part.
```
div(myattr!=$test['abc'])
```
may be mis-converted. if so, use whitespace like:
```
div(myattr!= $test['abc'] )
```
## Examples
### example - 1

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

### example - 2(using prefunction option)

* passing prefunction and data

```javascript
var jade = require('jade');
var phpjade = require('phpjade');
phpjade.init(jade);
var fn = jade.compileFile(filepath,
  {
        usestrip: true,
        pretty: true,
        prefunction: function(input/*, options*/) {
          return input.replace(/\$\$+/, "#{data.domain}");
        },
  }
);
var php = fn({data: { domain: "mytextdomain" } });
```

* Jade source

```
:php
  /**
   * @package WordPress
   * @subpackage $$
   */
html
  body
    div!=_e('This is my opinion', '$$')
    div=_test("$$")
    div
      - _test("$$")
    div(op=_test("$$"))
    div(op!=_test("$$"))
    div(op=$test)
    div(op!=$test)
    div(op="#{data.domain}")
    div(op="$$")
    div(op!=php_func('abc', "def", "ghi" + '$$')+"ghijk")

```
* produced php  

```
<?php
/**
 * @package WordPress
 * @subpackage mytextdomain
 */
?>
<html>
  <body>
    <div>
      <?php echo _e('This is my opinion', 'mytextdomain'); ?></div>
    <div>
      <?php echo htmlspecialchars(_test("mytextdomain"), ENT_QUOTES, 'UTF-8'); ?></div>
    <div>
      <?php _test("mytextdomain"); ?>
    </div>
    <div op="<?php echo htmlspecialchars(_test("mytextdomain"), ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div op="<?php echo _test("mytextdomain"); ?>"></div>
    <div op="<?php echo htmlspecialchars($test, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div op="<?php echo $test; ?>"></div>
    <div op="mytextdomain"></div>
    <div op="mytextdomain"></div>
    <div op="<?php echo php_func('abc', "def", "ghi" + 'mytextdomain'); ?>ghijk"> </div>
  </body>
</html>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 1.4.2 Jan 04 2016
    Array access expression in attribute part has supported.
    Version information about Jade that this add-on can work with has updated.
* 1.4.1 Jul 30 2015  
    Added permissive version check.
* 1.4.0 Jun 04 2015  
    Added support for more complex attributes.
* 1.3.1 Jun 02 2015  
    Fixed the bug "In the php filter block, the 'prefunction' couldn't be called".
* 1.3.0 Jun 02 2015  
    capability of calling 'prefunction' has added.  
* 1.2.0 May 28 2015  
* 1.1.1 May 25 2015  
* 1.1.0 May 21 2015  
* 1.0.0 May 20 2015  

## License
Copyright (c) 2015 Hiroyoshi Kurohara  
Licensed under the MIT license.

## Related projects
* [grunt-jade-mod](https://github.com/kurohara/grunt-jade-mod)  
Grunt task module for Jade with modifier support, phpjade can be used with this module.
* [jade-mod-cli](https://github.com/kurohara/jade-mod-cli)  
Jade cli with modifier support, phpjade can be used with this.
