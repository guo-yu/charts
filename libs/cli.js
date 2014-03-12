var exeq = require('exeq'),
    server = require('./server'),
    sys = require('../package.json');

module.exports = function() {
    var command = process.argv[2];
    if (!command || command != 'init') return server.run(command);
    return exeq([
        'git clone ' + sys.seed + ' .'
    ]).run();
}