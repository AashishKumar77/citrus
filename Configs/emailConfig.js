'use strict';
/**
 * Created by Anurag on 27/01/2018.
 */
//Massago
var nodeMailer = {
    "Mandrill" : {
        host: "smtp.mandrillapp.com", // hostname
        //secureConnection: true, // use SSL
        port: 587, // port for secure SMTP
        auth: {
            user: "Matrix Marketers",
            pass: "HMaBw_6kRObZ4EQLQ0IO2g"
        }
    }
};

module.exports = {
    nodeMailer: nodeMailer
};