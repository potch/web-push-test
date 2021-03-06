// Standard Node libraries
var http = require('http');
var server = require('./server');

// Web Push module
var webPush = require('web-push');

server.route('get', '/', server.static('index.html', 'text/html'));
server.route('get', '/service-worker.js', server.static('service-worker.js', 'text/javascript'));
server.route('post', '/notify', (req, res) => {
  var body = '';
  // Gather up the request body
  req.on('data', function (data) {
    body += data;
  });
  req.on('end', function () {
    // Parse the request body
    var obj = JSON.parse(body);

    // Send the push notification to the Web Push endpoint
    webPush.sendNotification(obj.endpoint, 0, obj.key, obj.body)
    .then(function() {
      res.writeHead(201);
      res.end();
    }).catch(console.error.bind(console));
  });
});

var server = http.createServer(server.handler);

var port = process.env.PORT || 8080;

server.listen(port, '0.0.0.0', () => console.log("server started at " + port));
