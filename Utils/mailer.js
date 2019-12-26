/*-----------------------------------------------------------------------
 * @ file        : mailer.js
 * @ description : Here initialising nodemailer transport for sending mails.
 * @ author      : Duddukuri Mahesh
 * @ date        :
 -----------------------------------------------------------------------*/

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mandrillTransport = require('nodemailer-mandrill-transport');
const configs = require('../Configs');
const env = require('../env');
const mailer = (env.instance == "dev") ? configs.SMTP.dev : configs.SMTP.test;
////console.log(mailer);
// var nodeMailer = {
//     "Mandrill" : {
//         host: "smtp.mandrillapp.com", // hostname
//         //secureConnection: true, // use SSL
//         port: 587, // port for secure SMTP
//         auth: {
//             user: "LoveYourSport",
//             pass: "Ne5OzRpQhJgqFmCC802Nvw",
//             //apiKey: 'be33178193b6ee99dc0fb3c633e2ef38-us14'
//         }
//     }
// };

// var transporter = nodemailer.createTransport(smtpTransport(nodeMailer));
// //console.log("dsasadsa",nodeMailer.auth.apiKey)
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtpout.secureserver.net', port: 465, service: "Gmail",
    auth: {
        user: mailer.username,
        pass: mailer.password
    }
}));

module.exports = {
    transporter: transporter
};
