var mysql = require('mysql');

/*var db_config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'chowder',
    database: 'coin_database',
};*/
var db_config = {
    host: '192.169.219.235',
    user: 'username',
    password: 'password123',
    database: 'coin_database'
};
/*var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'b0a42624956480',
    password: 'e584455a',
    database: 'heroku_fe5f17b2412d0e4',
};*/

var connection;

function handleDisconnect() {

    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.
    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } else {
            console.log("Successfully connected to Db");
        }                                   // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();


function loginUser(userData, callback) {

    var query = connection.query("SELECT * FROM `user` WHERE ? AND ? ", [{password: userData.password}, {email: userData.email}], function (err, rows, fields) {
        if (!err) {
             console.log(query.sql)
            if (rows.length > 0) {
                console.log("user already  exist");
                var details = {
                    user_id: rows[0]['user_id'],
                    username: "User",
                    email: rows[0]['email'],
                    user_role: rows[0]['user_role'],
                    success: 1
                }
                callback(details);
            } else {
                console.log("user Does NOT exist");
                var details = {
                    success: 0
                }
                callback(details);
            }

        } else {
            console.log("errror in sql syntax<checkUser> " + err);
            var userDetail = {
                success: 0
            }
            callback(userDetail);
        }
        console.log(query.sql);
    });

}
function loginAdmin(userData, callback) {

    var query = connection.query("SELECT * FROM `admin` WHERE ? AND ? ", [{password: userData.password}, {email: userData.email}], function (err, rows, fields) {
        if (!err) {
             console.log(query.sql)
            if (rows.length > 0) {
                console.log("admin already  exist");
                var details = {
                    admin_id: rows[0]['admin_id'],
                    success: 1
                }
                callback(details);
            } else {
                console.log("user Does NOT exist");
                var details = {
                    success: 0
                }
                callback(details);
            }

        } else {
            console.log("errror in sql syntax<checkUser> " + err);
            var userDetail = {
                success: 0
            }
            callback(userDetail);
        }
        console.log(query.sql);
    });

}
var registerUser = function (data, callback) {

 var query = connection.query("SELECT * FROM `user` WHERE ? AND ? ", [{password: data.password}, {email: data.email}], function (err, rows, fields) {
     console.log(query.sql);
        if (!err) {
            if (rows.length > 0) {
                console.log("user already  exist");
                 callback({success:2});
            }else{
                var query2 = connection.query('INSERT INTO user SET ?', data, function (err2, result) {
                    if (!err2) {
                        var response = {
                            success: 1,
                            user_id: result.insertId,
                            username: "User",
                            activation_code:data.activation_code,
                            email: data.email
                        };
                        callback(response);
                    } else {
                        callback({success:0});
                        console.log("errror " + err2);
                    }
                    console.log(query.sql);
                });
            }
        }
    });
}
function checkActivationCode(userData, callback) {

    var query = connection.query("SELECT * FROM `user` WHERE ? AND ? ", [{activation_code: userData.activation_code}, {email: userData.email}], function (err, rows, fields) {
        if (!err) {
             console.log(query.sql)
            if (rows.length > 0) {
                var details = {
                    user_id: rows[0]['user_id'],
                    success: 1
                }
                callback(details);
            } else {
                console.log("Wrong activation Code Entered");
                var details = {
                    success: 0
                }
                callback(details);
            }

        } else {
            console.log("errror in sql syntax<Check Code> " + err);
            var userDetail = {
                success: 0
            }
            callback(userDetail);
        }
        console.log(query.sql);
    });

}
var faAuth = function (data, callback) {

    var query = connection.query('INSERT INTO user_details SET ?', data, function (err, result) {
        if (!err) {
            var response = {
                success: 1,
                user_id: result.insertId,
            };
            
            var newData = {user_id:data.user_id,setup_2fa:"Y"};
            var queryX = connection.query('INSERT INTO user_data SET ?', newData, function (err, result) { 
               console.log(queryX.sql);
            });
    
            callback(response);
        } else {
            callback({success:0});
            console.log("errror " + err);
        }
        console.log(query.sql);
    });
    
     
}
var verifyIdentity = function (data, callback) {

    var query = connection.query('UPDATE user_details SET ? WHERE `user_id` = ?',[data,data.user_id], function (err, result) {
        if (!err) {
            var response = {
                success: 1,
                user_id: result.insertId,
            };
             var newData = {verify_identity:"Y"};
             var queryX = connection.query('UPDATE user_data SET ? WHERE ?',[newData,{user_id:data.user_id}], function (err, result) { 
                 console.log(queryX.sql);
            });
            
            callback(response);
        } else {
            callback({success:0});
            console.log("errror " + err);
        }
        console.log(query.sql);
    });
}

function getUserStats(userData, callback) {

    var query = connection.query("Select  (SELECT count(*) FROM `user`) as number_of_users ,"+
    "(select count(setup_2fa) from `user_data` WHERE  `setup_2fa` = 'Y' ) as setup_2fa ,"+
    "(select count(add_bank_Account) from `user_data` WHERE `add_bank_Account` = 'Y') as add_bank_account,"+
    "(select count(verify_identity) from `user_data` WHERE `verify_identity` = 'Y' ) as verify_identity ,"+
    "(select count(upload_docs) from `user_data` WHERE `upload_docs` = 'Y' ) as upload_docs ,"+
    "(select count(complete) from `user_data` WHERE  `complete` = 'Y' ) as complete "+  
    "FROM user_data  ", function (err, rows, fields) {
        if (!err) {
             console.log(query.sql)
            if (rows.length > 0) {
                console.log("Found");
                var details = {
                    success: 1,
                    number_of_users:rows[0]["number_of_users"],
                    setup_2fa:rows[0]["setup_2fa"],
                    add_bank_account:rows[0]["add_bank_account"],
                    verify_identity:rows[0]["verify_identity"],
                    upload_docs:rows[0]["upload_docs"],
                    complete:rows[0]["complete"]
                }
                callback(details);
            } else {
                console.log("Could not find Stats");
                var details = {
                    success: 0
                }
                callback(details);
            }

        } else {
            console.log("errror in sql syntax<GetUserData> " + err);
            var userDetail = {
                success: 0
            }
            callback(userDetail);
        }
        console.log(query.sql);
    });

}
function getAllUsers(userData, callback) {

    var query = connection.query("Select *,@user_id := user.user_id as user_id ,count(*) as number_of_users,"+
    "(select setup_2fa from `user_data` WHERE `user_id` = @user_id AND `setup_2fa` = 'Y' ) as setup_2fa ,(select add_bank_Account from `user_data` WHERE `user_id` = @user_id  AND `add_bank_Account` = 'Y') as add_bank_account,"+
    "(select verify_identity from `user_data` WHERE `user_id` = @user_id AND `verify_identity` = 'Y' ) as verify_identity ,"+
    "(select upload_docs from `user_data` WHERE `user_id` = @user_id AND `upload_docs` = 'Y' ) as upload_docs ,"+
    "(select complete from `user_data` WHERE `user_id` = @user_id AND `complete` = 'Y' ) as complete "+  
    "FROM user LEFT JOIN `user_details` ON `user`.`user_id` = user_details.`user_id` GROUP BY user.`user_id` ", function (err, rows, fields) {
        if (!err) {
            
            if (rows.length > 0) {
                console.log("Found");
                var dataArray = [];
                for(var i = 0; i < rows.length; i++){
                    var details = {
                        user_id:rows[i]["user_id"],
                        email:rows[i]["email"],
                       // username:rows[i]["username"],
                        path:rows[i]["path"],
                        country:rows[i]["country"],
                        state:rows[i]["state"],
                         fname:rows[i]["fname"],
                         lname:rows[i]["lname"],
                         mname:rows[i]["mname"],
                         city:rows[i]["city"],
                         dob:rows[i]["dob"],
                         zip:rows[i]["zip"]+"",
                         id_type:rows[i]["id_type"],
                         address:rows[i]["address"],
                         occupation:rows[i]["occupation"],
                         unit:rows[i]["unit"]+"",
                        time_created:rows[i]["time_created"],
                        number_of_users:rows[i]["number_of_users"],
                        setup_2fa:rows[i]["setup_2fa"],
                        add_bank_account:rows[i]["add_bank_account"],
                        verify_identity:rows[i]["verify_identity"],
                        upload_docs:rows[i]["upload_docs"],
                        complete:rows[i]["complete"]
                    }
                    dataArray.push(details);
                }
                var data = {
                    success:1,
                    data:dataArray
                }
                 callback(data);
            } else {
                console.log("Could not find Stats");
                var details = {
                    success: 0
                }
                callback(details);
            }

        } else {
            console.log("errror in sql syntax<GetUserData> " + err);
            var userDetail = {
                success: 0
            }
            callback(userDetail);
        }
       // console.log(query.sql);
    });

}

function updatePath(userData, callback){
     var queryX = connection.query('UPDATE user SET ? WHERE ?',[userData,{user_id:userData.user_id}], function (err, result) {
          console.log(queryX.sql);
            var response = {
                success: 1,
                user_id: userData.user_id
            };
            callback(response);
     });
}
function complete(userData, callback){
     var newData = {complete:"Y"};
     var queryX = connection.query('UPDATE user_data SET ? WHERE ?',[newData,{user_id:userData.user_id}], function (err, result) {
          console.log(queryX.sql);
            var response = {
                success: 1,
                user_id: userData.user_id
            };
            callback(response);
     });
}
function addBankAccount(userData, callback){
      var newData = {add_bank_Account:"Y"};
     var queryX = connection.query('UPDATE user_data SET ? WHERE ?',[newData,{user_id:userData.user_id}], function (err, result) {
         console.log(queryX.sql);
            var response = {
                success: 1,
                user_id: userData.user_id
            };
            callback(response);
     });
}
function uploadDocsAct(userData, callback){
      var newData = {upload_docs:"Y"};
     var queryX = connection.query('UPDATE user_data SET ? WHERE ?',[newData,{user_id:userData.user_id}], function (err, result) {
         console.log(queryX.sql);
            var response = {
                success: 1,
                user_id: userData.user_id
            };
            callback(response);
     });
}

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.loginAdmin = loginAdmin;
exports.checkActivationCode = checkActivationCode;
exports.faAuth = faAuth;
exports.verifyIdentity = verifyIdentity;
exports.getUserStats = getUserStats;
exports.getAllUsers = getAllUsers;
exports.complete = complete;
exports.addBankAccount = addBankAccount;
exports.uploadDocsAct = uploadDocsAct;
exports.updatePath = updatePath;
