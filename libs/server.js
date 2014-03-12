var url = require('url'),
    path = require('path'),
    server = require('express-scaffold'),
    charts = require('./charts'),
    sys = require('../package');

var chart = new charts();

var isNumber = function(n) {
    return n && !isNaN(parseInt(n), 10);
}

var fetchHW = function(canvas) {
    var defaults = {}
    defaults.width = 200;
    defaults.height = 200;
    if (!canvas || canvas.indexOf('x') === -1) return defaults;
    var ret = {}
    ret.width = canvas.split('x')[0];
    ret.height = canvas.split('x')[1];
    return ret;
}

var joinurl = function(base, k, v) {
    var parsed = url.parse(base);
    var key = k + '=';
    if (!parsed.query) return parsed.href + '?' + key + v;
    return parsed.href + '&' + key + v;
};

// GET => http://localhost/chartjs/{a:1,b:2} => img
// GET => http://localhost/chartjs/{a:1,b:2}?preview=ture => html
exports.run = function(port) {
    if (isNumber(port)) sys.port = port;
    new server(sys).routes(function(app) {
        app.get('/:theme/:canvas/:data', function(req, res, next) {
            if (!req.params.theme) return next(new Error('theme required'));
            if (!req.params.data) return next(new Error('data required'));

            var canvas = fetchHW(req.params.canvas);
            var params = {}
            params.data = req.params.data;
            params.width = canvas.width;
            params.height = canvas.height;
            if (req.query.type) params.type = req.query.type;
            if (req.query.delay) params.delay = req.query.delay;

            // capture 模式，返回图片地址
            if (!req.query.preview) {
                var base = path.join(app.locals.url, req.url);
                var target = joinurl(base, 'preview', true);
                return chart.capture(target, params, function(err, screenshot) {
                    if (err) return next(err);
                    return res.redirect(screenshot);
                });
            }

            // preview 模式，返回 html
            chart.render(req.params.theme, params, function(err, html) {
                if (err) return next(err);
                return res.send(html);
            });
        });
    }).run();
}