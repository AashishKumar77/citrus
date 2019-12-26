/*-----------------------------------------------------------------------
   * @ file        : scheduler.js
   * @ description : Main module containing all the scheduling services functions .
   * @ author      : Anurag Gupta
   * @ date        : 27th April, 2017
-----------------------------------------------------------------------*/
//internal modules


const Models = require('./Models');
const Utils    = require('./Utils');
const logger   = Utils.logger;
//const universalfunctions = require('./universalfunctions');
//const eventEmitter = require('./events');
const Configs          = require('./Configs');
const Services         = require('./Services');
const CronController   = require('./Controllers/cronController');
const crCronController   = require('./Controllers/crCron');
const env              = require('./env');

//external/installed modules
const async    = require('async');
const   _      = require('underscore');
const moment   = require('moment');
const schedule = require('node-schedule');
const fs       = require('fs');
const path     = require('path');
var count = 0;



schedule.scheduleJob("*/1 *", function(err,result) { // a schedule job to run evry 5 minutes for sending reminder mails

    CronController.FunnelEmailAndCma({},function(err, res){
        if(err){
            console.log(err)
        }else{
            //console.log(res)
        }
    });

})

schedule.scheduleJob({ hour: 6, minute: 40 }, function(err,result) { // a schedule job to run evry 5 minutes for sending reminder mails

      CronController.RD_1_Properties({},function(err, res) {
          if (err) {
              console.log(err)
          }else{
              console.log(res)
          }
      });
})

// Client Retention Cron Is running from here
//{ hour: 7, minute:15  }
schedule.scheduleJob({ hour: 7, minute:15  }, function(err,result) { // a schedule job to run evry 5 minutes for sending reminder mails
// working on 24 oct
    // CRON for automatic meeting reminder after 6 months
      crCronController.automaticMeetingRequestCron({},function(err, res){
          if (err) {
              console.log(err)
          }else{
              //console.log(res)
          }
      });
// working on 24 oct
    // importantDatesCron for sending email on birthdays and anniversaries
      crCronController.importantDatesCron({},function(err, res){
          if (err) {
              console.log(err)
          }else{
              //console.log(res)
          }
      });
// working on 24 oct
    // greetingsCron for sending emails on christmas
      crCronController.greetingsCron({},function(err, res){
          if (err) {
              console.log(err)
          }else{
              //console.log(res)
          }
      });
    
    // Pending Deals CRON
      crCronController.pendingDealCron({},function(err, res){
          if (err) {
              console.log(err);
          }else{
              console.log(res)
          }
      });


    //CLosed Deal CRON
    crCronController.closedDealCron({},function(err, res){
        if (err) {
            console.log(err);
        }else{
            console.log(res)
        }
    });

      //Adding Primary School details
      crCronController.addSchoolPrimary({},function(err, res){
          if (err) {
              console.log(err)
          }else{
              //console.log(res)
          }
      });
      
      // Adding Secondary School details
      crCronController.addSchoolSecondary({},function(err, res){
          if (err) {
              console.log(err)
          }else{
              //console.log(res)
          }
      });
})
