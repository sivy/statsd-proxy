var STATSD_HOST = '198.61.212.175';
var STATSD_PORT = 8125;

var SERVE_HOST = '0.0.0.0'
var SERVE_PORT = 8082


var http = require('http'),
fs = require('fs'),
qs = require('querystring');
sdc = require('statsd-client'),
SDC = new sdc({
    host: STATSD_HOST, port: STATSD_PORT});

function dt(){
    d = new Date();
    return [d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()].join('-') + ' ' + [
		d.getHours(),
		d.getMinutes()].join(':');
}

console.log(dt() + ' statsd-proxy starting; statsd is ' + STATSD_HOST + ':' + STATSD_PORT + '...');

http.createServer(function (req, res) {
    var end = function () {
	res.setHeader("Content-Type", "application/json");
	res.end();
    };

    body_data = '';

    req.on('data', function(chunk) {
	body_data += chunk;
    });

    req.on('end', function(){

	data = qs.parse(body_data);

	if (data.b === undefined || data.t === undefined || data.v === undefined) {
	    return end();
	}

	console.info(dt() + ' statsd-proxy: ' + data.b + ':' +
		     data.t + '|' + data.v + ' (' + req.connection.remoteAddress + ')');

	switch (data.t) {
	case 'c':
            SDC.increment(data.b, data.v);
            break;
	case 't':
            SDC.timing(data.b, data.v);
            break;
	case 'g':
            SDC.gauge(data.b, data.v);
            break;
	}
	SDC.increment('statsd-proxy.requests');
	end();
    });


}).listen(SERVE_PORT, SERVE_HOST);
