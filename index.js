var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req, res){

	var parsedUrl = url.parse(req.url, true);
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	var decoder = new stringDecoder('UTF-8');
	var buffer = '';

	req.on('data', function(data){
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();
		var chosenHandler = typeof(router[trimmedPath]) == "undefined" ? handlers.notFound : router[trimmedPath];

		data = {
			'trimmedPath' : trimmedPath,
			'buffer': buffer,
			'method': req.method
		};

		chosenHandler(data, function(statusCode, payload){
			payload = typeof(payload) == 'object' ? payload : {};
			payload_data = {
				'data': data,
				'payload' : payload	
			}
			var payloadString = JSON.stringify(payload_data);

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
		});
	});
});

server.listen("300", function(){
	console.log("server is listening to port 300");
});


var handlers = {};

handlers.hello = function(data, callback){
	callback('200', {'message': "Welcome to the new Universe!!!"});
};


handlers.notFound = function(data, callback){
	callback('404', {'message': "You are at the wrong place"});
};

var router = {
	'hello': handlers.hello
};

