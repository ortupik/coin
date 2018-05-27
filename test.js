var nodemailer = require("nodemailer");

var email = "chrisadriane.ca@gmail.com";

var transporter = nodemailer.createTransport({
    service: 'Godaddy',
    host: "localhost",  
    secure: false,
    port: 25,
    auth: {
        user: 'sd',
        pass: 'ss'
    }
});

/*var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",  
    secure: false,
    port: 465,
    auth: {
        user: 'techflay@gmail.com',
        pass: '#tech.254-flay'
    }
});*/

var mailOptions = {
    from: 'noreply@coinacropolis.com',
    to: email,
    subject: 'Test email $$#A Server',
    html: "Date "+new Date()
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log(info);
        //console.log('Email sent: ' + info.response);
    }
});