var path = require('path'),
    Theme = require('theme'),
    sys = require('../package'),
    page = require('webpage').create();

var Charts = function(params) {
    this.theme = params.theme || 'chartjs';
    this.data = params.data || {};
    this.url = params.url || 'http://localhost:' + sys.port;
    this.themes = new Theme(path.reslove(__dirname, '../'))
}

Charts.prototype.render = function(callback, d) {
    var data = d || this.data;
    this.themes.render(this.theme + '/index', data, callback)
};

Charts.prototype.capture = function(url, callback) {
    var target = url || this.url;
    page.open(target, function(status) {
        if (status !== 'success') {
            callback(new Error(status));
            return phantom.exit();
        }
        var publics = path.reslove(__dirname, '../', sys.public);
        var filename = md5(target) + '.png';
        var screenshot = path.join(publics, filename);
        page.render(screenshot);
        callback(null, filename, screenshot);
        return phantom.exit();
    });
}

exports = module.exports = Charts;