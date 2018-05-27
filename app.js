// This is the main file of our chat app. It initializes a new
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'thecastle app.js' in your terminal

var express = require('express'),
app = express();

// This is needed if the app is run on heroku:

//var port =  process.env.OPENSHIFT_NODEJS_PORT || 80;   // Port 8080 if you run locally
var address =  process.env.OPENSHIFT_NODEJS_IP || "http://127.0.0.1:9000"; // Listening to localhost if you run locally
var port = process.env.PORT || 9000;

// Initialize a new socket.io object. It is bound to
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));//emit address if persist

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.

require('./config')(app, io);
require('./routes')(app, io,address);


console.log('Coinprolis is running on http://host:' + port +" address "+address);
