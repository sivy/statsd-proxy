statsd-proxy
============

A HTTP proxy to Statsd, written in Node, extended from [this gist](). [Statsd](http://github.com/etsy/statsd) is awesome, but sometimes you don't have the option of opening a non-HTTP port on one service to connect to your metrics server. For example, on AppEngine, we're limited to using URLFetch - a wrapper around httplib - to hit external services.

**statsd-proxy** is an HTTP proxy that takes a POST request and forwards a proper UDP request to Statsd. Some examples:

    import requests
    r = requests.post('http://mymetrics.example.net', {
    	'b': 'some.metric', # b from 'bin'
    	't': 'c', # type, c => counter, t => timer, g => guage
    	'v': n # value
    	})

On AppEngine:

	data = {
    	'b': 'some.metric', # b from 'bin'
    	't': 'c', # type, c => counter, t => timer, g => guage
    	'v': n # value
    	}
	urlfetch.fetch(url='http://mymetrics.example.net',
       payload=urllib.urlencode(data),
       method=urlfetch.POST,
       headers={
        'Content-Type': 'application/x-www-form-urlencoded'},
       follow_redirects=False,
       deadline=1)