var path = require('path'),
    Theme = require('theme'),
    phantom = require('phantom'),
    sys = require('../package');

var defaults = {};
var locals = {};
defaults.name = 'charts-theme-chartjs';
defaults.realPath = path.join(__dirname, '../', 'node_modules', defaults.name);
defaults.static = './static';
locals.sys = sys;

var Charts = function(params) {
    this.theme = params.theme || defaults.name;
    this.data = params.data || {};
    this.themes = new Theme(path.resolve(__dirname, '../'), defaults, locals)
}

Charts.prototype.render = function(callback, d) {
    var data = d || this.data;
    this.themes.render(this.theme + '/index', data, callback)
};

Charts.prototype.capture = function(target, callback) {
    if (!target) return callback(new Error('url required'));
    if (!callback) return callback(new Error('callback required'));
    return phantom.create(function(ph) {
        return ph.createPage(function(page) {
            return page.open(target, function(status) {
                if (status !== 'success') {
                    callback(new Error(status));
                    return phantom.exit();
                }
                var publics = path.resolve(__dirname, '../', sys.public);
                var filename = md5(target) + '.png';
                var screenshot = path.join(publics, filename);
                page.render(screenshot);
                callback(null, filename, screenshot);
                return phantom.exit();
            });
        });
    });
}

exports = module.exports = Charts;