var exeq = require('exeq');
var server = require('./server');
var sys = require('../package.json');

module.exports = function() {
  var command = process.argv[2];
  if (!command || command != 'init') return server.run(command);
  var sh = [];
  sh.push('git clone ' + sys.seed + ' .')
  return exeq(sh).run();
}