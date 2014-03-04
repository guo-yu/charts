var server = require('express-scaffold'),
    charts = require('./charts'),
    sys = require('../package');

var isNumber = function(n) {
    return n && typeof(n) === 'number';
}

var isRemote = function(dir) {
    return dir && (dir.indexOf('http') === 0 || dir.indexOf('https') === 0);
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

// GET => http://localhost/chartjs/{a:1,b:2} => img
// GET => http://localhost/chartjs/{a:1,b:2}?preview=ture => html
exports.run = function(port) {
    if (isNumber(port)) sys.port = port;

    new server(sys).routes(function(app) {
        
        app.get('/:theme/:canvas/:data/:preview', function(req, res, next) {
            if (!req.params.theme) return next(new Error('theme required'));
            if (!req.params.data) return next(new Error('data required'));
            
            var params = {}
            var canvas = fetchHW(req.params.canvas);

            try {
                params.data = {}
                params.data.data = JSON.parse(req.params.data)
                params.data.width = canvas.width;
                params.data.height = canvas.height;
            } catch (err) {
                return next(new Error('data should be object'));
            }
            
            var chart = new charts(params);

            // 如果不是 preview 模式，重新访问这个 url
            if (!req.params.preview) {
                return chart.capture(path.join(req.url, '/preview'), function(err, img) {
                    if (err) return next(err);
                    return res.redirect(path.join(app.locals.url, img));
                });
            }

            // preview 模式，返回 html
            chart.render(function(err, html) {
                if (err) return next(err);
                return res.send(html);
            });
        });

    }).run();
}