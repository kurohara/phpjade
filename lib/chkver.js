var semver = require('semver');

var versions = require('../versions.json');

module.exports = function(name, checking) {
  var expected = versions[name];
  if (expected && semver.satisfies(checking, expected)) {
    return true;
  }

  return {expected: expected};
};

