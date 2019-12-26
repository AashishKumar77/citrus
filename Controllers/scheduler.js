/*-----------------------------------------------------------------------
   * @ file        : scheduler.js
   * @ description : Main module containing all the scheduling services functions .
   * @ author      : Anurag Gupta
   * @ date        : 9th October, 2017
-----------------------------------------------------------------------*/
//internal modules
const Models = require('./Models');
const Utils    = require('./Utils');
const logger   = Utils.logger;
//const universalfunctions = require('./universalfunctions');
//const eventEmitter = require('./events');
const Configs          = require('./Configs');
const Services         = require('./Services');
const CronController   = require('./Controllers/CronController');
const env              = require('./env');

//external/installed modules
const async    = require('async');
const   _      = require('underscore');
const moment   = require('moment');
const schedule = require('node-schedule');
const fs       = require('fs');
const path     = require('path');

////console.log("dsadsad",env);
schedule.scheduleJob({ hour: 23, minute:59 }, function(err,result) { // a schedule job to run evry 5 minutes for sending reminder mails
    //if (env.instance == "test") { //console.log("dsadsad",env);
    //console.log('saveCounterOfRecommendation will run at 11.59pm minute!');
    CronController.allCompletedSubJobsAndReleasePayment({},{},function(err, res) {
        if (err) {
            //console.log(err)
        } else {
            ////console.log(res)
        }
    });
    //}
})
