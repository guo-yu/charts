## ![logo](http://ww3.sinaimg.cn/large/61ff0de3gw1ee4zefbts3j201901bgld.jpg) Charts ![npm](https://badge.fury.io/js/charts.png)

a chart generator service for easy embed collections of charts in emails

![screenshot](http://ww2.sinaimg.cn/large/61ff0de3gw1eed5hfdxv7j20l10h0t9x.jpg)

### Installation
````
$ [sudo] npm install charts -g
````

### Useage
just run charts as a service
```
$ charts
```
run chart server on selected port [9999]
```
$ charts 9999
```
then embed your chart image like this, which your will get this img ![line](http://ww3.sinaimg.cn/large/61ff0de3gw1ee4xjmifz1j201h00q3y9.jpg)
```html
<img src="http://localhost:3001/sparkline/300x100/1,4,4,7,5,9,10,10,10,10,10,100,20,12" />
```
Was that easy? We'll take a look at this very href.

```
http://localhost:3001/sparkline/300x100/1,4,4,7,5,9,10,10,10,10,10,100,20,12
http://{{host}}/{{solution or solution shorthand}}/{{width}}x{{height}}/{{data}}
```
**TIPS:** `1x1` means auto-width and auto-height

### Write your solutions

Chart is made to be working with as many client charts solutions as you like. using Theme module, Chart is able to load solutions as a NPM module. So feel free to write your solutions.

Use seed project (the default solution of [jquery Sparklines](https://github.com/turingou/charts-theme-sparkline)) of Charts are recommended:

```
$ git clone https://github.com/turingou/charts.git
$ cd charts
$ mkdir node_modules/charts-theme-mime
$ cd node_modules/charts-theme-mime
$ charts init
$ vi index.jade
```
then start the dev server

```
$ node ../../bin/cli
```

then open `http://localhost:3001/mime/300x300/{{yourData}}?preview=true` you will see the result

### Theme Structure

Charts using [Theme](https://github.com/turingou/theme) module to support multiple solutions in the backend. All solutions should follow Theme Module Structure:

- charts-theme-mime
    - index.jade (or index.html) your chart html page
    - package.json (define your `view engine` and `static` path)
    - static (it contains your libs and scripts)

### Example
````javascript
var Charts = require('charts');
var chart = new Charts();
var data = {
    width: 300,
    height: 300,
    data: {
        x: [1,2,3,4,5],
        y: [10,20,30,40,50]
    }
};

chart.render('charts-theme-mysolution', data, function(err, html){
    if (err) return console.log(err)
    console.log(html);
});

chart.capture( 'http://localhost:3001/mysolution/300x300/{{yourData}}', data, function(err, shot) {
    console.log(shot);
});
````

### API

#### chart#render 
#### chart#capture

check this file: `index.js`

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2014 turing &lt;o.u.turing@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor](https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/doctor.png)
built upon love by [docor](https://github.com/turingou/docor.git) v0.1.3