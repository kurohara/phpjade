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