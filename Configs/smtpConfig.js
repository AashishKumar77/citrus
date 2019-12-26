
/*-----------------------------------------------------------------------
   * @ file        : smtpConstants.js
   * @ description : Includes all the smtp (mail) settings.
   * @ author      : Duddukuri Mahesh
   * @ date        :
-----------------------------------------------------------------------*/

module.exports = {

    dev: {
        smtpUser   : "",
        smtpPass   : "",
        smtpPort   : 587,//25,
        smtpServer : "smtp.gmail.com",
        mailFrom   : "Citrus",
        // gmail credentials used for temporary purpose
        username: "anurag@devs.matrixmarketers.com",
        password: "Admin123$%^1!",//"bindalsimran123"
    },
    development:{
        smtpUser   : "",
        smtpPass   : "",
        smtpPort   : 587,//25,
        smtpServer : "smtp.gmail.com",
        mailFrom   : "Citrus",
        // gmail credentials used for temporary purpose
        username: "simran.bisoncode@gmail.com",
        password: "bindalsimran123"
    },
    test: {
        smtpUser   : "",
        smtpPass   : "",
        smtpPort   : 587,//25,
        smtpServer : "smtp.gmail.com",
        mailFrom   : "Citrus",
        // gmail credentials used for temporary purpose
        username: "simran.bisoncode@gmail.com",
        password: "bindalsimran123"
    },
    live: {
        smtpUser   : "",
        smtpPass   : "",
        smtpPort   : 587,//25,
        smtpServer : "smtp.gmail.com",
        mailFrom   : "Citrus"
    }

};
