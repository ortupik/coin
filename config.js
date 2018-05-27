// This file handles the configuration of the app.
// It is required by app.js

var express = require('express');
var bodyParser = require('body-parser');


module.exports = function(app, io){
    
      app.use(function(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            next();
      });
	// Set .html as the default template extension
	app.set('view engine', 'html');

	// Initialize the ejs template engine
	app.engine('html', require('ejs').renderFile);
        
          //support parsing of application/x-www-form-urlencoded post data
        app.use(bodyParser.urlencoded({ extended: true })); 

	// Tell express where it can find the templates
	app.set('views', __dirname + '/views');

	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));
        
       

};
