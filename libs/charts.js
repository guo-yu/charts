var fs = require('fs'),
    path = require('path'),
    md5 = require('MD5'),
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
    var self = this;
    if (!target) return callback(new Error('url required'));
    if (!callback) return callback(new Error('callback required'));
    return phantom.create(function(ph) {
        return ph.createPage(function(page) {            
            var viewportSize = { top: 0, left: 0 }
            viewportSize.width = parseInt(self.data.width)
            viewportSize.height = parseInt(self.data.height)
            page.set('viewportSize', viewportSize)
            page.open(target, function(status) {
                if (status !== 'success') {
                    callback(new Error(status));
                    return ph.exit()
                }
                var publics = path.resolve(__dirname, '../', sys.public);
                var filename = md5(target) + '.png';
                var screenshot = path.join(publics, filename);
                // 这里有一处硬编码，如何在 phantom 里优雅的判断已经加载完成？
                setTimeout(function() {
                    page.render(screenshot, function(err) {
                        callback(err, filename, screenshot);
                        return ph.exit()
                    });
                }, 1000);
            });
        });
    });
}

exports = module.exports = Charts;
