var fs = require('fs');
var path = require('path');
var md5 = require('MD5');
var Theme = require('theme');
var phantom = require('phantom');
var sys = require('../package');

var locals = {};
locals.sys = sys;

module.exports = Charts;

function Charts(params) {
  this.data = params && params.data || {};
  this.theme = params && params.theme || 'charts-theme-chartjs';
  this.themes = new Theme(path.resolve(__dirname, '../'), locals);
}

Charts.prototype.render = function(tpl, data, callback) {
  this.themes.render((tpl || this.theme) + '/index', data || this.data, callback)
};

Charts.prototype.capture = function(target, data, callback) {
  if (!target) return callback(new Error('url required'));
  if (!callback) return callback(new Error('callback required'));
  var delay = 100;
  var params = data || this.data;
  var publics = path.resolve(__dirname, '../', sys.public);
  var filename = md5(target) + '.png';
  var screenshot = path.join(publics, filename);
  if (target.indexOf('chartjs/') > -1) delay = 1000;
  if (params.delay) delay = parseInt(params.delay);
  if (fs.existsSync(screenshot)) return callback(null, filename, screenshot);
  return phantom.create(function(ph) {
    return ph.createPage(function(page) {
      var viewportSize = {
        top: 0,
        left: 0
      }
      viewportSize.width = parseInt(params.width)
      viewportSize.height = parseInt(params.height)
      page.set('viewportSize', viewportSize)
      page.open(target, function(status) {
        if (status !== 'success') {
          callback(new Error(status));
          return ph.exit()
        }
        // 这里有一处硬编码，如何在 phantom 里优雅的判断已经加载完成？
        setTimeout(function() {
          page.render(screenshot, function(err) {
            callback(err, filename, screenshot);
            return ph.exit();
          });
        }, delay);
      });
    });
  });
}