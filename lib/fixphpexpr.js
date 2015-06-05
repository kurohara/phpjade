/**
 * stringiy with replace of Jade's interpolation part.
 */
module.exports = function(str) {
  return editExpr(str, scanInterp(str)); 
};

/**
 * scan expression, look for Jade's interporation braces.
 */
function scanInterp(str) {
  var arr = str.split("");
  var stack = [ "none" ];
  var edits = [ ];
  stack.status = function() { return this.length > 0 ? this[this.length - 1] : "none"; };

  function check(ed) { return ed.start !== undefined; }

  var ed = {};
  var i = 0;
  arr.forEach(function(c) {
    switch (stack.status()) {
    case 'none':
      switch (c) {
      case '\\':
        stack.push('esc');
        break;
      case '#':
        stack.push('sharp');
        break;
      case '"':
        stack.push('dquoted');
        break;
      case "'":
        stack.push('squoted');
        break;
      case '}':
        if (check(ed)) {
          ed.end = i;
          edits.push(ed);
        }
        break;
      default:
        break;
      }
      break;
    case 'esc':
      stack.pop();
      break;
    case 'dquoted':
      switch (c) {
      case '\\':
        stack.push('esc');
        break;
      case '#':
        stack.push('sharp');
        break;
      case '"':
        stack.pop();
        break;
      case '}':
        if (check(ed)) {
          ed.end = i;
          edits.push(ed);
        }
        break;
      default:
        break;
      }
      break;
    case 'squoted':
      switch (c) {
      case '\\':
        stack.push('esc');
        break;
      case '#':
        stack.push('sharp');
        break;
      case "'":
        stack.pop();
        break;
      case '}':
        if (check(ed)) {
          ed.end = i;
          edits.push(ed);
        }
        break;
      default:
        break;
      }
      break;
    case 'sharp':
      if (c === '{') {
        ed = { start: i - 1 };
      }
      stack.pop();
      break;
    default:
      break;
    }
    ++i;
  });
  return edits;
}

/**
 * edit original string with replacing inteporation with JavaScript expression(simply replace #{} -> ().
 */
function editExpr(str, edits) {

  if (!edits || edits.length === 0) {
    return JSON.stringify(str);
  }
  var result = "";
  var pstart = 0;
  edits.forEach(function(e) {
    result += JSON.stringify(str.substring(pstart, e.start));
    result += '+(' + str.substring(e.start + 2, e.end) + ')+';
    pstart = e.end + 1;
  });
  result += JSON.stringify(str.substring(pstart));

  return result;
}


