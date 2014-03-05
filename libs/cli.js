var exeq = require('exeq'),
    server = require('./server'),
    sys = require('../package.json');

module.exports = function(port) {
    var command = process.argv[2];
    if (!command || command != 'init') return server.run(port);
    return exeq([
        'git clone ' + sys.seed + ' .'
    ]).run();
}