
/*-----------------------------------------------------------------------
   * @ file        : appConstants.js
   * @ description : Includes all the app settings.
   * @ author      : Anurag Gupta
   * @ date        :
-----------------------------------------------------------------------*/

module.exports = {
    local: {
        name         : "Citrus",
        host         : '127.0.0.1',
        port         : "9033",
        absolutePath : __dirname+"/..",
        debug        : true
    },
    dev: {
        name         : "Citrus",
        host         : "",
        port         : "9033",
        absolutePath : __dirname+"/..",
        debug        : true
    },
    development: {
        name         : "Citrus",
        host         : "127.0.0.1",
        port         : "49153",
        absolutePath : __dirname+"/..",
        debug: true
    },
    test: {
        name         : "Citrus",
        host         : "",
        port         : "",
        absolutePath : __dirname+"/..",
        debug: true
    },
    live: {
        name         : "Citrus",
        host         : "127.0.0.1",
        port         : "5000",
        absolutePath : __dirname+"/..",
        debug        : true
    }

};
//module.exports.GOOGLE_TIMEZONE_API__KEY = GOOGLE_TIMEZONE_API__KEY
//module.exports.STATUS_MSG = STATUS_MSG
