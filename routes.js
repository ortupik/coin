var envvar = require('envvar');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var plaid = require('plaid');
var fs = require('fs');
var Mustache = require('mustache');
var nodeExcel = require('excel-export');


var APP_PORT = envvar.number('APP_PORT', 8000);
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID', "5ae4067825f307001011929e");
var PLAID_SECRET = envvar.string('PLAID_SECRET', "36998b7b32cac48003b2b82428bd4f");
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY', "6c7238b0df7ef29d123d21de8dc312");
var PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');


var csrf_guid = "shdfshdjhsfddfdfdasaahdfhs";
var account_kit_api_version = 'v1.0';
var app_id = '194447517843683';
var app_secret = '6c9fdb68b38e19050e2b919166045b11';
var me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
var token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token';

var operations = require('./server/operations');
var path = require('path');
var formidable = require('formidable');
var nodestatic = require('node-static');
var nodemailer = require("nodemailer");
var Guid = require('guid');
var express = require('express');
 
// start session for an http request - response
// this will define a session property to the request object

module.exports = function (app, io, address) {


    // We store the access_token in memory - in production, store it in a secure
// persistent data store
    var ACCESS_TOKEN = null;
    var PUBLIC_TOKEN = null;
    var ITEM_ID = null;

// Initialize the Plaid client
    var client = new plaid.Client(
            PLAID_CLIENT_ID,
            PLAID_SECRET,
            PLAID_PUBLIC_KEY,
            plaid.environments[PLAID_ENV]
            );


    app.get('/add_bank_account', function (request, response, next) {
        response.render('add_bank_account.html', {
            PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
            PLAID_ENV: PLAID_ENV,
        });
    });

    app.post('/get_access_token', function (request, response, next) {
        PUBLIC_TOKEN = request.body.public_token;
        client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
            if (error != null) {
                var msg = 'Could not exchange public_token!';
                console.log(msg + '\n' + error);
                return response.json({
                    error: msg
                });
            }
            ACCESS_TOKEN = tokenResponse.access_token;
            ITEM_ID = tokenResponse.item_id;
            console.log('Access Token: ' + ACCESS_TOKEN);
            console.log('Item ID: ' + ITEM_ID);
            response.json({
                'error': false
            });
        });
    });

    app.get('/accounts', function (request, response, next) {
        // Retrieve high-level account information and account and routing numbers
        // for each account associated with the Item.
        client.getAuth(ACCESS_TOKEN, function (error, authResponse) {
            if (error != null) {
                var msg = 'Unable to pull accounts from the Plaid API.';
                console.log(msg + '\n' + error);
                return response.json({
                    error: msg
                });
            }

            console.log(authResponse.accounts);
            response.json({
                error: false,
                accounts: authResponse.accounts,
                numbers: authResponse.numbers,
            });
        });
    });

    app.post('/item', function (request, response, next) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        client.getItem(ACCESS_TOKEN, function (error, itemResponse) {
            if (error != null) {
                console.log(JSON.stringify(error));
                return response.json({
                    error: error
                });
            }

            // Also pull information about the institution
            client.getInstitutionById(itemResponse.item.institution_id, function (err, instRes) {
                if (err != null) {
                    var msg = 'Unable to pull institution information from the Plaid API.';
                    console.log(msg + '\n' + error);
                    return response.json({
                        error: msg
                    });
                } else {
                    response.json({
                        item: itemResponse.item,
                        institution: instRes.institution,
                    });
                }
            });
        });
    });

    app.post('/transactions', function (request, response, next) {
        // Pull transactions for the Item for the last 30 days
        var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
        var endDate = moment().format('YYYY-MM-DD');
        client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
            count: 250,
            offset: 0,
        }, function (error, transactionsResponse) {
            if (error != null) {
                console.log(JSON.stringify(error));
                return response.json({
                    error: error
                });
            }
            console.log('pulled ' + transactionsResponse.transactions.length + ' transactions');
            response.json(transactionsResponse);
        });
    });
    app.get('/', function (req, res) {
      
        res.render('index');
    });
    app.get('/admin', function (req, res) {
        res.render('admin');
    });
  
    app.get('/admin_login', function (req, res) {
        res.render('admin_login');
    });
    app.get('/register', function (req, res) {
        res.render('register');
    });
    app.get('/confirm_email', function (req, res) {
        res.render('confirm_email');
    });
    app.get('/exportData', function (req, res) {
        var conf = {};
        conf.stylesXmlFile = "styles.xml";
        conf.name = "mysheet";
        
        conf.cols = []; 
         
        var headers = ["Email","photo","Country","State","F.Name","M.Name","L.Name","City","DOB","Zip","ID Type","Address","Occupation","Unit","Time Created","Setup 2FA","Verified Idenity","Uploaded Photo","Completed"];
        
       
       operations.getAllUsers({}, function (result) {
           for(var i = 0; i < headers.length; i++){
            conf.cols.push({
                caption:headers[i],
                type: 'string',
                beforeCellWrite:function(){
		return function(row, cellData, eOpt){
          		
                if (cellData === null){
                  eOpt.cellType = 'string';
                  return ' - ';
                } else
                  return (cellData );
		} 
		}()
            });
        }
           var allData = result.data;
           var newData = [];
           for(var i = 0; i < allData.length; i++){
                   var obj = allData[i];
                    var arr = Object.values(obj);
                    var newArray = [];
                     for(var j = 1; j < arr.length; j++){
                        if(j !== 16 && j !== 18 ){ 
                        //    console.log("j "+j+" data: "+arr[j]);
                            newArray.push(arr[j]);
                        }
                    }
                     newData.push(newArray);
           }
           conf.rows =  newData;
           // console.log(conf.rows);
           
               var eResult = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Data.xlsx");
                res.end(eResult, 'binary');
                console.log("Exported")
        });
       
     
    });
    function loadLogin() {
        return fs.readFileSync('views/setup_2fa.html').toString();
    }
    app.get('/setup_2fa', function (req, res) {
        var view = {
            appId: app_id,
            csrf: csrf_guid,
            version: account_kit_api_version,
        };
        console.log(view);
        console.log("hey login");
        var html = Mustache.to_html(loadLogin(), view);
        res.send(html);
    });


    app.get('/upload_docs', function (req, res) {
        res.render('upload_docs');
    });
    app.get('/complete', function (req, res) {
        res.render('complete');
    });
    app.get('/verify_identity', function (req, res) {
        res.render('verify_identity');
    });
    app.get('/privacy_policy', function (req, res) {
        res.render('privacy_policy');
    });

    function loadLoginSuccess() {
        return fs.readFileSync('views/success.html').toString();
    }

    app.post('/success', function (request, response) {
        console.log("hey success");
        // CSRF check
        if (request.body.csrf === csrf_guid) {
            var app_access_token = ['AA', app_id, app_secret].join('|');
            var params = {
                grant_type: 'authorization_code',
                code: request.body.code,
                access_token: app_access_token
            };

            // exchange tokens
            var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
            Request.get({url: token_exchange_url, json: true}, function (err, resp, respBody) {
                var view = {
                    user_access_token: respBody.access_token,
                    expires_at: respBody.expires_at,
                    user_id: respBody.id,
                };

                // get account details at /me endpoint
                var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
                Request.get({url: me_endpoint_url, json: true}, function (err, resp, respBody) {
                    // send login_success.html
                    if (respBody.phone) {
                        view.phone_num = respBody.phone.number;
                    } else if (respBody.email) {
                        view.email_addr = respBody.email.address;
                    }
                    var html = Mustache.to_html(loadLoginSuccess(), view);
                    response.send(html);
                });
            });
        }
        else {
            // login failed
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end("Something went wrong. :( ");
        }
    });

    //put this data in function later

    app.post('/uploads', function (req, res) {

        var data = req.body;
        console.log(data)
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = path.join(__dirname, '/public/photos/');

        form.on('file', function (field, file) {
            console.log("uploaded profile image " + file.name);
             var filename = file.name;
             user_id = filename.split(":")[0];
             filename = filename.split(":")[1];
             
             var userData = {
                 user_id:user_id,
                 path:filename
             }
             
             console.log(userData);
             operations.updatePath(userData, function (result) {
                console.log(result);
            });
             fs.rename(file.path, path.join(form.uploadDir, filename), function(err){
                 if(err){
                        console.log("Error renaming file:", err );
                          res.end('error');
                 }else{
                     console.log("Success uploading image!");
                       res.end('success');
                 }
             
            });
        });
      
        // parse the incoming request containing the form data
        form.parse(req);
    });

    app.post('/login_user', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.loginUser(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
     app.post('/login_admin', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.loginAdmin(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/getUserStats', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.getUserStats(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/getAllUsers', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.getAllUsers(data, function (result) {
          //  console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/checkActivation', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.checkActivationCode(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/sendMail',function(req,res){
          var data = req.body;
         //data.activation_code = randomStr(7);
         console.log(data);
         
          var activationData = {
                activation_code: data.activation_code,
                email: data.email,
                username: data.username
            }
            console.log("Sending Mail" );
            console.log(activationData);
             sendEmail(activationData);
            res.status(200).send(activationData);
    });
     app.post('/sendReviewEmail',function(req,res){
          var data = req.body;
          sendReviewEmail(data);
          console.log("Sending MAil")
          res.status(200).send(data);
    });
    
    app.post('/register_user', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        data.activation_code = randomStr(7);

        operations.registerUser(data, function (result) {  
            var activationData = {
                activation_code: data.activation_code,
                email: data.email,
                username: data.username
            }
                        
          //  sendEmail(activationData);
          //  console.log(result);
            if (result.success == 1) {
                console.log(activationData);
            }
             res.status(200).send(result);
        });
    });
    app.post('/faAuth', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.faAuth(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/verify_identity', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.verifyIdentity(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/complete', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data); 
       // sendReviewEmail(data);
        operations.complete(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/addBankAccount', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.addBankAccount(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });
    app.post('/uploadDocsAct', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        console.log(data);
        operations.uploadDocsAct(data, function (result) {
            console.log(result);
            res.status(200).send(result);
        });
    });

    function randomStr(m) {
        var m = m || 9;
        s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < m; i++) {
            s += r.charAt(Math.floor(Math.random() * r.length));
        }
        return s;
    }
    

    function sendEmail(data) {

        var email = data.email;

        var transporter = nodemailer.createTransport({
            service: 'Godaddy',
            host: "smtpout.secureserver.net",  
            secure: false,
            port: 25,
            auth: {
                user: 'noreply@coinacropolis.com',
                pass: 'y?JzrN2s[r'
            }
        });
        var mailOptions = {
            from: 'noreply@coinacropolis.com',
            to: email,
            subject: 'Activation Code',
            html: "Dear <b>" + data.username + ",</b><p> Thank you for registering with Coinacroplis.</p> <p>To Complete Registration, Please Enter this activation Code <b>" + data.activation_code+"</b></p>"
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
     function sendReviewEmail(data) {

        var email = data.email;

      var transporter = nodemailer.createTransport({
            service: 'Godaddy',
            host: "smtpout.secureserver.net",  
            secure: false,
            port: 25,
            auth: {
                user: 'noreply@coinacropolis.com',
                pass: 'y?JzrN2s[r'
            }
        });

         var text =  "<h2>Verification Information Under Review</h2>"+
                    "Dear <b>"+data.username+",</b>"+
                   "<p>Your identity verification is currently under review by our compliance team. Coinacropolis is currently experiencing extremely high volume and there maybe delays.</p>"+
                    "<p>We will contact you via email if any additional documentation is required.</p>"+
                    "<p>Please Note you will not be able to trade until this process is complete. If you feel you have received this message in error, please contact us.</p>" ;
        var mailOptions = {
            from: 'noreply@coinacropolis.com',
            to: email,
            subject: 'Coinacropolis',
            html:text                                             
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                socket.emit("sendMail", info);
                console.log('Email sent: ' + info.response);
            }
        });
    }

};