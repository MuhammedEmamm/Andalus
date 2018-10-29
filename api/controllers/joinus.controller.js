var uniqid = require('uniqid');
var fs = require('fs');
var rimraf = require('rimraf');
var mailer = require('nodemailer');

exports.Join_US = (req, res) => {
    console.log(req.file);
    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'miduqasem74@gmail.com', // generated ethereal user
            pass: '01007002634' // generated ethereal password
        }
    });
    const mailOptions = {
        from: 'miduqasem74@gmail.com', // sender address
        to: 'muhammedfathifcis@gmail.com', // list of receivers
        subject: 'Subject of your email', // Subject line
        html: '<p>Your html here</p>',
        attachments: [{
            filename: req.file.originalname,
            path: `./public/files/${req.file.originalname}`
        }]
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}