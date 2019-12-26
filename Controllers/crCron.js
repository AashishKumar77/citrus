/*--------------------------------------------
 * Include internal modules.
 ---------------------------------------------*/
// var fs = require('fs');
// var UtmConverter = require('utm-converter');
var utmObj = require('utm-latlng');
var utm=new utmObj();
// var converter = new UtmConverter();
const Models = require('../Models');
const Utils = require('../Utils');
const Configs = require('../Configs');
var APP_CONSTANTS = Configs.CONSTS;
const env = require('../env');
const logger = Utils.logger;
const STATUS_MSG = Utils.responses.STATUS_MSG.SUCCESS //Configs.app.STATUS_MSG.SUCCESS;
var Responses = Utils.responses
var Service = require("../Services");
var USER_TYPE = APP_CONSTANTS.USER_TYPE;
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;
const CLOUDCMA_API_KEY = APP_CONSTANTS.CLOUDCMA_API_KEY;
const DBCommonFunction = Utils.DBCommonFunction;
const RetsPropertyRD_1_Controller = require("./retsPropertyRD_1_Controller");
/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
const async = require('async');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs');
const _ = require('underscore');
const moment = require('moment');
const Mongoose = require('mongoose');
var mongoose = require('mongoose');
var Path = require('path');
var nodeRestClient = require('node-rest-client').Client;
nodeRestClient = new nodeRestClient();
const downloadFile = require('download-file');
const extractFile = require('extract-zip');
var rimraf_deleteFolder = require('rimraf');
var eb = require('easybars');
var uniqid  = require('uniqid');
var RA_2_getData = "http://rets.citruscow.com/get_data/RD_1/";
var getData_link = "http://rets.citruscow.com/get_data/";
// var getData_link = "http://rets.citruscow.com/update_data/RA_2";
var getClassAndCount = "http://rets.citruscow.com/get_count";

var request = require('request');
////console.log("CLOUDCMA_API__KEY",CLOUDCMA_API_KEY);
// var automaticMeetingRequestCron = function(payload, callbackRoute) {

//     var criteria = {
//         "type" : "automaticmeetingrequest"
//     }
//     //console.log(criteria);
//     Service.crTemplate.getAllData(criteria,function (err, result) {
//         if (err){
//             //console.log(err);
//             var value = {
//                 "statusCode" : 400,
//                 "status" : "failure",
//                 "data" : err
//             }
//             //console.log("Error in CRON while getting Client Retention Data for sites",value);
//             // return cb(value);
//         }else if(result.length > 0){
//           var value = {
//               "statusCode" : 200,
//               "status" : "success",
//               "data" : result
//           }
//           //console.log("Result",result);
//           async.each(result,function(item, cb){
//               var date1 = new Date(Date.now() - 181 * 24 * 60 * 60 * 1000);
//               var date2 = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
//               var user_criteria = {
//                   "siteId" : item.siteId,
//                   "createdAt" : { $lte : date2 , $gte : date1 }
//               }
//               //console.log("User Criteria ::",user_criteria);
//               Service.UserService.getUser(user_criteria, {}, {}, (err, data)=> {
//                   if(err){
//                       //console.log("Err While getting user details",err);
//                   }else if(data.length > 0){
//                       // //console.log("User Details", data);
//                       // Sending Email to each User
//                       async.each(data,function(userItem, userCb){
//                         var contact_criteria = {
//                             "rating" : { $in: item.rating },
//                             "email" : userItem.email
//                         }
//                         //console.log("contact_criteria",contact_criteria);
//                         Service.ContactFormService.getData(contact_criteria,{},{ lean: true},(err,contactData)=> {
//                              if (err)  return userCb(err);
//                              async.each(data,function(contactItem, contactCb){
//                              //console.log("Contact Data Comes here",contactData);


//                               // Sending email to each user Functionality
//                                   var firstName = Utils.universalfunctions.capitalizeFirstLetter(userItem.firstName);
//                                   var theme_Criteria = {
//                                     siteId : item.siteId
//                                   }
//                                   Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, result) {
//                                     if (err) {
//                                       //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
//                                     }else if (result.length > 0){
//                                         var messageToSend = eb(item.content, { SIGNATURE: result[0].signature,firstName :userItem.firstName,LASTNAME : userItem.lastName, EMAIL : userItem.email, PHONE : userItem.phoneNumber});
//                                         var subject = item.subject;
//                                         var email_data = { // set email variables for user
//                                           to: userItem.email, // "anurag@devs.matrixmarketers.com",//
//                                           from: result[0].fromName + '<' + result[0].fromEmail + '>',
//                                           subject: subject,
//                                           html: messageToSend
//                                         };
//                                         Utils.universalfunctions.send_email(email_data, (err, res) => {
//                                           if(err)
//                                             return contactCb(err);
//                                           return contactCb();
//                                         });
//                                     }else{
//                                       //console.log("We were not able to send the email because there is no theme settings found for the user");
//                                     }
//                                   });
//                               },function(err){
//                                   if(err){
//                                       //console.log("An error occured while getting the user details",err);
//                                       userCb();
//                                   }else{
//                                       //console.log("Do Nothing");
//                                       userCb();
//                                   }
//                               });
//                         });
//                       // Sending email to each user Functionality ends here
//                       },function(err){
//                           if(err){
//                               //console.log("An error occured while getting the user details",err);
//                               cb();
//                           }else{
//                               //console.log("Do Nothing");
//                               cb();
//                           }
//                       });
//                   }else{
//                       //console.log("No Data FOund");
//                   }
//               });


//           },function(err){
//               if(err){
//                   //console.log("An error occured while getting the user details",err);
//               }else{
//                   //console.log("Do Nothing");
//               }
//           });
//         }else{
//           var value = {
//               "statusCode" : 200,
//               "status" : "success",
//               "data" : "Client retention data is not found"
//           }
//           //console.log(value);
//         }
//     });

// };

// working on 24 oct
var automaticMeetingRequestCron = function(payload, callbackRoute) {

  var criteria = {
      "type" : "automaticmeetingrequest"
  }


  //console.log(criteria);
  Service.crTemplate.getAllData(criteria,function (err, result) {
      if (err){
          //console.log(err);
          var value = {
              "statusCode" : 400,
              "status" : "failure",
              "data" : err
          }
          //console.log("Error in CRON while getting Client Retention Data for sites",value);
          // return cb(value);
      }else if(result.length > 0){
        var value = {
            "statusCode" : 200,
            "status" : "success",
            "data" : result
        }
        //console.log("Result",result);
        async.each(result,function(item, cb){
          var today = new Date();
    var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    var myTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0);
            var user_criteria = {
                "siteId" : item.siteId,
                "isMovedToCMS" : true,
                "userType" : "Seller",
                "automatic_meeting_request_date" : { $lte : myTomorrow , $gte : myToday }
            }
            //console.log("User Criteria ::",user_criteria);
            Service.UserService.getUser(user_criteria, {}, {}, (err, data)=> {
                if(err){
                    //console.log("Err While getting user details",err);
                }else if(data.length > 0){
                    // //console.log("User Details", data);
                    // Sending Email to each User
                    async.each(data,function(userItem, userCb){
                      var contact_criteria = {
                          "rating" : { $in: item.rating },
                          "email" : userItem.email
                      }
                      //console.log("contact_criteria",contact_criteria);
                      // Service.ContactFormService.getData(contact_criteria,{},{ lean: true},(err,contactData)=> {
                          //  if (err)  return userCb(err);
                           async.each(data,function(contactItem, contactCb){
                          //  //console.log("Contact Data Comes here",contactData);


                            // Sending email to each user Functionality
                                var firstName = Utils.universalfunctions.capitalizeFirstLetter(userItem.firstName);
                                var theme_Criteria = {
                                  siteId : item.siteId
                                }
                                Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, result) {
                                  if (err) {
                                    //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                                  }else if (result.length > 0){
                                      var messageToSend = eb(item.content, { SIGNATURE: result[0].signature,firstName :userItem.firstName,LASTNAME : userItem.lastName, EMAIL : userItem.email, PHONE : userItem.phoneNumber});
                                      var subject = item.subject;
                                      var email_data = { // set email variables for user
                                        to: userItem.email, // "anurag@devs.matrixmarketers.com",//
                                        from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                        subject: subject,
                                        html: messageToSend
                                      };
                                      Utils.universalfunctions.send_email(email_data, (err, res) => {
                                        if(err)
                                          return contactCb(err);
                                          if(res){

                                            var criteria = {
                                              email: userItem.email
                                          }

                                          var dataToSave = {};
                                          var days = userItem.automatic_meeting_request_frequency/1440
                                          var automatic_meeting_request_date = new Date();
                                          automatic_meeting_request_date.setDate(automatic_meeting_request_date.getDate() + days);
                                          dataToSave.automatic_meeting_request_date = automatic_meeting_request_date;
                                          dataToSave.automatic_meeting_request_sent = 1
                                          
                                          
                              
                                          Service.UserService.updateUser(criteria, dataToSave, { new: true }, function (err, result) {
                                              //console.log("1", err)
                                              if (err) return contactCb(err);
                                              return contactCb();
                                          });
                                          }
                                       
                                      });
                                  }else{
                                    //console.log("We were not able to send the email because there is no theme settings found for the user");
                                  }
                                });
                            },function(err){
                                if(err){
                                    //console.log("An error occured while getting the user details",err);
                                    userCb();
                                }else{
                                    //console.log("Do Nothing");
                                    userCb();
                                }
                            });
                      // });
                    // Sending email to each user Functionality ends here
                    },function(err){
                        if(err){
                            //console.log("An error occured while getting the user details",err);
                            cb();
                        }else{
                            //console.log("Do Nothing");
                            cb();
                        }
                    });
                }else{
                    //console.log("No Data FOund");
                }
            });


        },function(err){
            if(err){
                //console.log("An error occured while getting the user details",err);
            }else{
                //console.log("Do Nothing");
            }
        });
      }else{
        var value = {
            "statusCode" : 200,
            "status" : "success",
            "data" : "Client retention data is not found"
        }
        //console.log(value);
      }
  });

};
// working on 24 oct
var importantDatesCron = function(payload, callbackRoute) {

    var criteria = {
        "type" : { $in : [ 'anniversary','birthday' ] }
    }
    //console.log(criteria);
    Service.crTemplate.getAllData(criteria,function (err, result) {
        if (err){
            //console.log(err);
            var value = {
                "statusCode" : 400,
                "status" : "failure",
                "data" : err
            }
            //console.log("Error in CRON while getting Client Retention Data for sites",value);
            // return cb(value);
        }else if(result.length > 0){
          var value = {
              "statusCode" : 200,
              "status" : "success",
              "data" : result
          }
          //console.log("Result",result);
          async.each(result,function(item, cb){
            var contact_criteria = {}
            if(item.type == "anniversary"){
                  contact_criteria = {
                      "siteId" : item.siteId,
                      "isMovedToCMS": true,
                      "Wedding_Anniversary" : { $exists : true },
                      "greetingCards":{ $in : ["Anniversary"] }
                  }
            }else if(item.type == "birthday"){
                  contact_criteria = {
                      "siteId" : item.siteId,
                      "isMovedToCMS": true,
                      "dob" : { $exists :  true },
                      "greetingCards":{ $in : ["Birthday"]}
                  }
            }
              //console.log("contact_criteria::",contact_criteria);
              // Service.ContactFormService.getData(contact_criteria,{},{ lean: true},(err,contactData)=> {
                Service.UserService.getUser(contact_criteria, {}, {}, (err, contactData)=> {
                  if(err){
                      //console.log("Err While getting user details",err);
                  }else if(contactData.length > 0){
                      //console.log("data",contactData.length);
                       async.each(contactData,function(userItem, userCb){
                         if(item.type == "birthday"){
                            var dobDate = userItem.dob;
                            var dat1 = dobDate.getDate();
                            var mon1 = dobDate.getMonth() + 1 ;

                            var compareDate = new Date();
                            var dat2 = compareDate.getDate();
                            var mon2 = compareDate.getMonth() + 1;
                            //console.log("sdfggggggggggggggg",dat1,dat2,mon1,mon2);
                            if(dat1 === dat2 && mon1 === mon2){
                                  // Sending EMail
                                  var firstName = Utils.universalfunctions.capitalizeFirstLetter(userItem.firstName);
                                  var theme_Criteria = {
                                    siteId : item.siteId
                                  }
                                  Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, themeResult) {
                                    if (err) {
                                      //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                                    }else if (themeResult.length > 0){
                                        var messageToSend = eb(item.content, { SIGNATURE: themeResult[0].signature,firstName :userItem.firstName,LASTNAME : userItem.lastName, EMAIL : userItem.email, PHONE : userItem.phoneNumber});
                                        var subject = item.subject;
                                        var email_data = { // set email variables for user
                                          to: userItem.email, // "anurag@devs.matrixmarketers.com",//
                                          from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                          subject: subject,
                                          html: messageToSend
                                        };
                                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                                          if(err)
                                            return userCb(err);
                                          return userCb();
                                        });
                                    }else{
                                      //console.log("We were not able to send the email because there is no theme settings found for the user");
                                      userCb();
                                    }
                                  });
                                  // Sending EMail Functionality ends here
                            }else{
                                userCb();
                            }
                         }

                         if(item.type == "anniversary"){
                           var anniversaryDate = userItem.Wedding_Anniversary;
                           var dat1 = anniversaryDate.getDate();
                           var mon1 = anniversaryDate.getMonth() + 1 ;

                           var compareDate = new Date();
                           var dat2 = compareDate.getDate();
                           var mon2 = compareDate.getMonth() + 1;
                           //console.log("sdfggggggggggggggg",dat1,dat2,mon1,mon2);
                           if(dat1 === dat2 && mon1 === mon2){
                                 // Sending EMail
                                 var firstName = Utils.universalfunctions.capitalizeFirstLetter(userItem.firstName);
                                 var theme_Criteria = {
                                   siteId : item.siteId
                                 }
                                 Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, themeResult) {
                                   if (err) {
                                     //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                                   }else if (themeResult.length > 0){
                                       var messageToSend = eb(item.content, { SIGNATURE: themeResult[0].signature,firstName :userItem.firstName,LASTNAME : userItem.lastName, EMAIL : userItem.email, PHONE : userItem.phoneNumber});
                                       var subject = item.subject;
                                       var email_data = { // set email variables for user
                                         to: userItem.email, // "anurag@devs.matrixmarketers.com",//
                                         from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                         subject: subject,
                                         html: messageToSend
                                       };
                                       Utils.universalfunctions.send_email(email_data, (err, res) => {
                                         if(err)
                                           return userCb(err);
                                         return userCb();
                                       });
                                   }else{
                                     //console.log("We were not able to send the email because there is no theme settings found for the user");
                                    userCb();
                                   }
                                 });
                                 // Sending EMail Functionality ends here
                           }else{
                               userCb();
                           }
                         }
                      },function(err){
                          if(err){
                              //console.log("An error occured while getting the user details",err);
                              cb();
                          }else{
                              //console.log("Do Nothing");
                              cb();
                          }
                      });

                  }else{
                      //console.log("No Data FOund");
                  }
              });


          },function(err){
              if(err){
                  //console.log("An error occured while getting the user details",err);
              }else{
                  //console.log("Do Nothing");
              }
          });
        }else{
          var value = {
              "statusCode" : 200,
              "status" : "success",
              "data" : "Client retention data is not found"
          }
          //console.log(value);
        }
    });

};


// Christmas CRON
// working on 24 oct
var greetingsCron = function(payload, callbackRoute) {
  var todayDate = new Date();
  var dat1 = todayDate.getDate();
  var mon1 =  todayDate.getMonth() + 1;
  if( dat1 == 24 && mon1 == 10 ){
    var criteria = {
        "type" : 'christmas'
    }
    //console.log(criteria);
    Service.crTemplate.getAllData(criteria,function (err, result) {
        if (err){
            //console.log(err);
            var value = {
                "statusCode" : 400,
                "status" : "failure",
                "data" : err
            }
            //console.log("Error in CRON while getting Client Retention Data for sites",value);
            // return cb(value);
        }else if(result.length > 0){
          var value = {
              "statusCode" : 200,
              "status" : "success",
              "data" : result
          }
          //console.log("Result",result);
          async.each(result,function(item, cb){
            var contact_criteria = {
                "siteId" : item.siteId,
                "isMovedToCMS": true,
                "greetingCards":{ $in : ["Christmas"]}
            }

              //console.log("contact_criteria::",contact_criteria);
              // Service.ContactFormService.getData(contact_criteria,{},{ lean:true } , ( err,contactData )=> {
                Service.UserService.getUser(contact_criteria, {}, {}, (err, contactData)=> {
                  if(err){
                      //console.log("Err While getting user details",err);
                  }else if(contactData.length > 0){
                      //console.log("data",contactData.length);
                       async.each(contactData,function(userItem, userCb){
                            //Email sending Functionality
                            var firstName = Utils.universalfunctions.capitalizeFirstLetter(userItem.firstName);
                            var theme_Criteria = {
                              siteId : item.siteId
                            }
                            Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, themeResult) {
                              if (err) {
                                //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                              }else if (themeResult.length > 0){
                                  var messageToSend = eb(item.content, { SIGNATURE: themeResult[0].signature,firstName :userItem.firstName,LASTNAME : userItem.lastName, EMAIL : userItem.email, PHONE : userItem.phoneNumber});
                                  var subject = item.subject;
                                  var email_data = { // set email variables for user
                                    to: userItem.email, // "anurag@devs.matrixmarketers.com",//
                                    from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                    subject: subject,
                                    html: messageToSend
                                  };
                                  Utils.universalfunctions.send_email(email_data, (err, res) => {
                                    if(err)
                                      return userCb(err);
                                    return userCb();
                                  });
                              }else{
                                //console.log("We were not able to send the email because there is no theme settings found for the user");
                                userCb();
                              }
                            });
                                  // Sending EMail Functionality ends here


                      },function(err){
                          if(err){
                              //console.log("An error occured while getting the user details",err);
                              cb();
                          }else{
                              //console.log("Do Nothing");
                              cb();
                          }
                      });

                  }else{
                      //console.log("No Data FOund");
                  }
              });


          },function(err){
              if(err){
                  //console.log("An error occured while getting the user details",err);
              }else{
                  //console.log("Do Nothing");
              }
          });
        }else{
          var value = {
              "statusCode" : 200,
              "status" : "success",
              "data" : "Client retention data is not found"
          }
          //console.log(value);
        }
    });
  }else{
    //console.log("Its not christmas today");
  }

};

//Closed Deal Cron
var closedDealCron =  function(payload,callbackRoute){
  var leadList = [];
  var funnelDetails = [];
  var funnelTemplateData = [];
  var unsubUser = false;
  async.auto({
    getPropertyLeads: [ (cb) => {
          var criteria = {
                            status:  "Closed",
                            includeInFunnel : true
                        }
          Service.propertyDeals.getAllDataWithLeadDetails(criteria,function (err, result) {
            if (err)
              return cb(err);
            leadList = result;
            // //console.log("Lead List",leadList);
            return cb();
          });
      }
    ],
    checkDealTemplateExistsAndSendEmail: ['getPropertyLeads',(ag1, OuterCb) => {
          async.eachSeries(leadList, function(item, InnerCb) {
              var itemData = item;
              var sendEmail = false;
              var dealTemplateData = [];
              var emailSendDate = null;
              var userLastEmailsend = false;
              var funnelIdArray = []
              var themeData = {};
              var propertyDetails = {};
              var base64Image;
              async.auto({
                getEmailDetailoflastSend: [(cb) => {
                    var criteria = {
                      status: item.status,
                      leadId : itemData._id
                    }
                    var opt = {
                      lean: true,
                      sort: {
                        emailSendDate: -1
                      }
                    }

                    Service.EmailSendDetail_SERVICE.getDealData(criteria, {}, opt, (err, data) => {
                      if (err)
                        return cb(err);
                      if (data.length > 0){
                        data.forEach(function(element){
                          funnelIdArray.push(element.funneltemplateId)
                        });
                        userLastEmailsend = true;
                        emailSendDate = data[0].emailSendDate
                      }
                      return cb(null, {
                        criteria: criteria,
                        funnelIdArray: funnelIdArray,
                        data: data
                      });
                    });
                  }
                ],
                getfunnelTemplate: ['getEmailDetailoflastSend',(ag1, cb) => {

                    var criteria = {
                      status: item.status,
                      _id: {
                          $nin: funnelIdArray
                      }
                    }

                    Service.dealTemplates.getAllData(criteria,(err, templateData) => {
                      if (err)
                        return cb(err);

                      funnelTemplateData = templateData
                      // //console.log("funnel Templates",funnelTemplateData);
                      if (templateData.length > 0) {
                        sendEmail = true;
                      }
                      return cb();
                    });
                  }
                ],
                checkEmailSendOrNot: ['getfunnelTemplate','getEmailDetailoflastSend',(ag1, cb) => {
                    var emailTimeInterval = -1;
                    var diffTime = -1

                    if(funnelTemplateData.length > 0) {
                      emailTimeInterval = funnelTemplateData[0].emailToBeTriggeredForCompletion
                    }
                    ////console.log("Current Date",item.createdAt);
                    if(sendEmail == true){
                          var currentDate = new Date().toString();
                          // //console.log("++++++++++================================================================");
                          currentDate = moment();
                          //console.log("Current Date",item.createdAt);
                          var emailSendDateNew = moment(emailSendDate);
                          diffTime = currentDate.diff(item.createdAt, 'minutes');

                        // //console.log("============================================================================");
                        // //console.log("funnelTemplateData",funnelTemplateData);
                        //console.log("Email Send Date New : ",item.createdAt);
                        //console.log("diff time",diffTime);
                        //console.log("diffTime==========",diffTime,"emailTimeInterval====",emailTimeInterval);
                        //console.log("emailTimeInterval",emailTimeInterval,"diffTime",diffTime,"funnelTemplateData","userLastEmailsend",userLastEmailsend);
                        // //console.log("============================================================================");

                        if (userLastEmailsend == false) {
                          if (diffTime <= -1) {
                            diffTime = 0;
                          }
                          if (emailTimeInterval <= -1) {
                            diffTime = 0;
                          }
                        }
                        //console.log("emailTimeInterval::",emailTimeInterval,"diffTime::",diffTime);
                        // var diffTime = 6
                        if (emailTimeInterval > 0 && diffTime > 0 && diffTime >= emailTimeInterval){
                            sendEmail = true;
                        }else{
                          sendEmail = false;
                        }
                        return cb(null, {
                          sendEmail: sendEmail,
                          diffTime: diffTime,
                          currentDate: currentDate,
                          emailSendDate: emailSendDate,
                          funnelTemplateData: funnelTemplateData
                        });
                    }else{
                      return cb();
                    }
                  }
                ],
                InsertLastemailSendDetail: [
                  'checkEmailSendOrNot',
                  (ag2, cb) => { ////console.log("item===InsertLast===init");
                      //console.log("funnelTemplateData[0] :::::::::::",funnelTemplateData[0]);
                      if(sendEmail == true){
                        var dataToSave = {
                          leadId: itemData._id,
                          status: funnelTemplateData[0].status,
                          dealtemplateId: funnelTemplateData[0]._id,
                          emailSendDate: new Date().toISOString()
                        }
                        Service.EmailSendDetail_SERVICE.InsertDealData(dataToSave, function(err, result) {
                          if (err)
                            return cb(err);
                          return cb();
                        });

                      }else{
                        return cb();
                      }
                    }
                ],
                getPropertyDetails: [
                  'checkEmailSendOrNot',
                  (ag22, cb) => { ////console.log("item===InsertLast===init");

                    var criteria = {
                        l_displayid : item.mlsNumber
                    }
                    var projection={
                        l_listingid:1,
                        propertyAutoIncrement:1,
                        l_area:1,
                        lm_int1_19:1,
                        lm_int1_4:1,
                        l_askingprice:1,
                        lm_dec_11:1,
                        lo1_organizationname:1,
                        lo1_shortname:1,
                        la3_phonenumber1:1,
                        la1_loginname:1,
                        la1_loginname:1,
                        lm_char10_12:1,
                        lm_char1_36:1,
                        lm_dec_16:1,
                        lm_int2_3:1,
                        lm_int4_2:1,
                        l_remarks:1,
                        lr_remarks22:1,
                        l_pricepersqft:1,
                        lr_remarks22:1,
                        location:1,
                        propertyImages:1,
                        lo1_organizationname:1,
                        l_askingprice:1,
                        l_city:1,l_state:1,l_zip:1,
                        l_addressstreet:1,
                        l_addressnumber:1,
                        l_addressunit : 1,
                        l_streetdesignationid : 1,
                        l_displayid:1,
                        lm_dec_7:1,
                        l_displayid:1,
                        lm_char10_22:1,
                        lm_char1_36:1,
                        lfd_featuresincluded_85:1,
                        lfd_featuresincluded_24:1,
                        lfd_featuresincluded_55:1,
                        lo1_organizationname:1,
                        isDeleted:1,
                        createdAt:1,
                        images_count : 1
                    };
                    var options = { lean: true };
                    Service.REST_PROPERY_RD_1_Service.getData(criteria, projection,options,function (err, result) {
                        if (err){
                             return cb(err);
                        }else if(result.length > 0){
                            propertyDetails = result[0];
                            return cb();
                        }else{
                          //console.log("No data found");
                          sendEmail = false;
                          return cb("no data found");
                        }
                    });
                  }
                ],
                sendEmailToUser: [
                  'checkEmailSendOrNot','getPropertyDetails',
                  (ag1, cb) => {
                    if(sendEmail){
                        var firstName = Utils.universalfunctions.capitalizeFirstLetter(item.leadId.firstName);
                        var theme_Criteria = {
                          siteId : item.siteId
                        }
                        Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, themeResult) {
                          if (err) {
                            cb();
                            //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                          }else if (themeResult.length > 0){
                              var messageToSend = eb(funnelTemplateData[0].content, { SIGNATURE : themeResult[0].signature,firstName :item.firstName,LASTNAME : item.lastName, EMAIL : item.email, PHONE : item.phoneNumber,l_listingid:propertyDetails.l_listingid,
                              propertyAutoIncrement:propertyDetails.propertyAutoIncrement,
                              l_area:propertyDetails.l_area,
                              lm_int1_19:propertyDetails.lm_int1_19,
                              lm_int1_4:propertyDetails.lm_int1_4,
                              l_askingprice:propertyDetails.l_askingprice,
                              lm_dec_11:propertyDetails.lm_dec_11,
                              lo1_organizationname:propertyDetails.lo1_organizationname,
                              lo1_shortname:propertyDetails.lo1_shortname,
                              la3_phonenumber1:propertyDetails.la3_phonenumber1,
                              la1_loginname:propertyDetails.la1_loginname,
                              la1_loginname:propertyDetails.la1_loginname,
                              lm_char10_12:propertyDetails.lm_char10_12,
                              lm_char1_36:propertyDetails.lm_char1_36,
                              lm_dec_16:propertyDetails.lm_dec_16,
                              lm_int2_3:propertyDetails.lm_int2_3,
                              lm_int4_2:propertyDetails.lm_int4_2,
                              l_remarks:propertyDetails.l_remarks,
                              lr_remarks22:propertyDetails.lr_remarks22,
                              l_pricepersqft:propertyDetails.l_pricepersqft,
                              lr_remarks22:propertyDetails.lr_remarks22,
                              location:propertyDetails.location,
                              propertyImages:propertyDetails.propertyImages,
                              lo1_organizationname:propertyDetails.lo1_organizationname,
                              l_askingprice:propertyDetails.l_askingprice,
                              l_city:propertyDetails.l_city,l_state:propertyDetails.l_state,l_zip:propertyDetails.l_zip,
                              l_addressstreet:propertyDetails.l_addressstreet,
                              l_addressnumber:propertyDetails.l_addressnumber,
                              l_addressunit : propertyDetails.l_addressunit,
                              l_streetdesignationid : propertyDetails.l_streetdesignationid,
                              l_displayid:propertyDetails.l_displayid,
                              lm_dec_7:propertyDetails.lm_dec_7,
                              l_displayid:propertyDetails.l_displayid,
                              lm_char10_22:propertyDetails.lm_char10_22,
                              lm_char1_36:propertyDetails.lm_char1_36,
                              lfd_featuresincluded_85:propertyDetails.lfd_featuresincluded_85,
                              lfd_featuresincluded_24:propertyDetails.lfd_featuresincluded_24,
                              lfd_featuresincluded_55 : propertyDetails.lfd_featuresincluded_55,
                              lo1_organizationname:propertyDetails.lo1_organizationname,
                              isDeleted:propertyDetails.isDeleted,
                              createdAt:propertyDetails.createdAt,
                              images_count : propertyDetails.images_count });


                              var subject = funnelTemplateData[0].subject;
                              var email_data = { // set email variables for user
                                to: item.leadId.email, // "anurag@devs.matrixmarketers.com",//
                                from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                subject: subject,
                                html: messageToSend
                              };
                              Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if(err)
                                  return cb(err);
                                return cb();
                              });
                          }else{
                            //console.log("We were not able to send the email because there is no theme settings found for the user");
                            cb();
                          }
                        });
                    }else{
                      //console.log('we are in else')
                      var messageToSend = eb("We were not able to send the email because the mls number was in correct deals funnel" 
                         );
                       
                        var email_data = {
                                to: "savita@matrixmarketers.com",
                                from: "info@matrixmarketers.com",
                                subject: "MLS number not valid",
                                html: messageToSend
                                
                          
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                          if(err)
                            return cb(err);
                            //console.log(res)
                          return cb();
                        });
                        // //console.log("Email Not Sent ++++++++++++++++++++++++++++++skjdfbjsfbdj");
                        // cb();
                    }
                  }
                ]
              }, function(err, result) {
                if (err)
                  return InnerCb(err);
                return InnerCb();
              })
        }, function(err, result) {
          if (err)
            return OuterCb(err);
          return OuterCb();
        })
        }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })
  }

//Pending Deals Cron
var pendingDealCron = function(payload, callbackRoute) {
  var leadList = [];
  var funnelDetails = [];
  var funnelTemplateData = [];
  var unsubUser = false;
  async.auto({
    getPropertyLeads: [ (cb) => {
          var criteria = {
                            status:  "Pending",
                            includeInFunnel : true
                        }
          Service.propertyDeals.getAllDataWithLeadDetails(criteria,function (err, result) {
            if (err)
              return cb(err);
            leadList = result;
            //console.log("Lead List",leadList.length);

            return cb();
          });
      }
    ],
    checkDealTemplateExistsAndSendEmail: ['getPropertyLeads',(ag1, OuterCb) => {
          async.eachSeries(leadList, function(item, InnerCb) {
              var itemData = item;
              var sendEmail = false;
              var dealTemplateData = [];
              var emailSendDate = null;
              var userLastEmailsend = false;
              var funnelIdArray = []
              var themeData = {};
              var propertyDetails = {};
              var base64Image;
              async.auto({
                getEmailDetailoflastSend: [(cb) => {
                    var criteria = {
                      status: item.status,
                      leadId : itemData._id
                    }
                    var opt = {
                      lean: true,
                      sort: {
                        emailSendDate: -1
                      }
                    }

                    Service.EmailSendDetail_SERVICE.getDealData(criteria, {}, opt, (err, data) => {
                      if (err)
                        return cb(err);
                      if (data.length > 0) {
                        data.forEach(function(element) {
                          funnelIdArray.push(element.funneltemplateId)
                        });
                        userLastEmailsend = true;
                        emailSendDate = data[0].emailSendDate
                      }
                      //console.log('EmailSendDetail_SERVICE',data)
                      return cb(null, {
                        criteria: criteria,
                        funnelIdArray: funnelIdArray,
                        data: data
                      });
                    });
                  }
                ],
                getfunnelTemplate: ['getEmailDetailoflastSend',(ag1, cb) => {

                    var criteria = {
                      status: item.status,
                      _id: {
                        $nin: funnelIdArray
                      }
                    }

                    Service.dealTemplates.getAllData(criteria,(err, templateData) => {
                      if (err)
                        return cb(err);

                      funnelTemplateData = templateData
                       //console.log("funnel Templates",funnelTemplateData);
                      if (templateData.length > 0) {
                        sendEmail = true;
                      }
                      return cb();
                    });
                  }
                ],
                checkEmailSendOrNot: ['getfunnelTemplate','getEmailDetailoflastSend',(ag1, cb) => {
                    var completionDate = "";
                    var daysBefore = -1;
                    // var emailTimeInterval = -1;
                    // var diffTime = -1
                    //
                    if(funnelTemplateData.length > 0) {
                        completionDate = new Date(funnelTemplateData[0].daysOfCompletion),
                        daysBefore += funnelTemplateData[0].emailToBeTriggeredForCompletion 
                    }

                    // ////console.log("Current Date",item.createdAt);
                    if(sendEmail == true){
                      //console.log('completionDate',completionDate,'daysBefore',daysBefore)

                          //var target = new Date(completionDate - daysBefore * 24 * 60 * 60 * 1000 );
                          var target = new Date(completionDate - daysBefore * 24 * 60 * 60 * 1000 );
                          //console.log('target',target)
                          var today = new Date(Date.now());
                          //console.log(target.getDate(),target.getMonth(),target.getFullYear());
                          //console.log(today.getDate(),today.getMonth(),today.getFullYear());
                          if(target.getDate() == today.getDate() && target.getMonth() == today.getMonth() && target.getFullYear() == today.getFullYear() ){

                              //console.log("We wIll send this user an email");
                              sendEmail = true
                              return cb(null,{
                                sendEmail: sendEmail,
                                funnelTemplateData: funnelTemplateData
                              });

                          }else{
                            //console.log("We will not send this user an email");
                            sendEmail = false
                            return cb(null,{
                              sendEmail: sendEmail,
                              funnelTemplateData: funnelTemplateData
                            });
                          }
                    }else{
                      return cb();
                    }
                  }
                ],
                InsertLastemailSendDetail: [
                  'checkEmailSendOrNot',
                  (ag2, cb) => { ////console.log("item===InsertLast===init");
                  //console.log("funnelTemplateData[0] :::::::::::",funnelTemplateData[0]);
                  if(sendEmail == true){
                    var dataToSave = {
                      leadId: itemData._id,
                      status: funnelTemplateData[0].status,
                      dealtemplateId: funnelTemplateData[0]._id,
                      emailSendDate: new Date().toISOString()
                    }
                    Service.EmailSendDetail_SERVICE.InsertDealData(dataToSave, function(err, result) {
                      if (err){
                        return cb(err);
                      }
                        if(result){
                          //console.log(result)
                          return cb();
                        }
                     
                    });
                  }else{
                    //console.log('we  are in else')
                    return cb();
                  }


                    }
                ],
                getPropertyDetails: [
                  'checkEmailSendOrNot',
                  (ag22, cb) => { ////console.log("item===InsertLast===init");

                    var criteria = {
                        l_displayid : item.mlsNumber
                    }
                    var projection={
                        l_listingid:1,
                        propertyAutoIncrement:1,
                        l_area:1,
                        lm_int1_19:1,
                        lm_int1_4:1,
                        l_askingprice:1,
                        lm_dec_11:1,
                        lo1_organizationname:1,
                        lo1_shortname:1,
                        la3_phonenumber1:1,
                        la1_loginname:1,
                        la1_loginname:1,
                        lm_char10_12:1,
                        lm_char1_36:1,
                        lm_dec_16:1,
                        lm_int2_3:1,
                        lm_int4_2:1,
                        l_remarks:1,
                        lr_remarks22:1,
                        l_pricepersqft:1,
                        lr_remarks22:1,
                        location:1,
                        propertyImages:1,
                        lo1_organizationname:1,
                        l_askingprice:1,
                        l_city:1,l_state:1,l_zip:1,
                        l_addressstreet:1,
                        l_addressnumber:1,
                        l_addressunit : 1,
                        l_streetdesignationid : 1,
                        l_displayid:1,
                        lm_dec_7:1,
                        l_displayid:1,
                        lm_char10_22:1,
                        lm_char1_36:1,
                        lfd_featuresincluded_85:1,
                        lfd_featuresincluded_24:1,
                        lfd_featuresincluded_55:1,
                        lo1_organizationname:1,
                        isDeleted:1,
                        createdAt:1,
                        images_count : 1
                    };
                    var options = { lean: true };
                    Service.REST_PROPERY_RD_1_Service.getData(criteria, projection,options,function (err, result) {
                        if (err){
                             return cb(err);
                        }else if(result.length > 0){
                            propertyDetails = result[0];
                            return cb();
                        }else{
                          //console.log("No data found");
                          sendEmail = false;
                          return cb();
                        }
                    });
                  }
                ],
                sendEmailToUser: [
                  'checkEmailSendOrNot','getPropertyDetails',
                  (ag1, cb) => {
                    if(sendEmail){
                        var firstName = Utils.universalfunctions.capitalizeFirstLetter(item.leadId.firstName);
                        var theme_Criteria = {
                          siteId : item.siteId
                        }
                        Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function(err, themeResult) {
                          if (err) {
                            cb();
                            //console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                          }else if (themeResult.length > 0){
                              var messageToSend = eb(funnelTemplateData[0].content, { SIGNATURE : themeResult[0].signature,firstName :item.firstName,LASTNAME : item.lastName, EMAIL : item.email, PHONE : item.phoneNumber,l_listingid:propertyDetails.l_listingid,
                              propertyAutoIncrement:propertyDetails.propertyAutoIncrement,
                              l_area:propertyDetails.l_area,
                              lm_int1_19:propertyDetails.lm_int1_19,
                              lm_int1_4:propertyDetails.lm_int1_4,
                              l_askingprice:propertyDetails.l_askingprice,
                              lm_dec_11:propertyDetails.lm_dec_11,
                              lo1_organizationname:propertyDetails.lo1_organizationname,
                              lo1_shortname:propertyDetails.lo1_shortname,
                              la3_phonenumber1:propertyDetails.la3_phonenumber1,
                              la1_loginname:propertyDetails.la1_loginname,
                              la1_loginname:propertyDetails.la1_loginname,
                              lm_char10_12:propertyDetails.lm_char10_12,
                              lm_char1_36:propertyDetails.lm_char1_36,
                              lm_dec_16:propertyDetails.lm_dec_16,
                              lm_int2_3:propertyDetails.lm_int2_3,
                              lm_int4_2:propertyDetails.lm_int4_2,
                              l_remarks:propertyDetails.l_remarks,
                              lr_remarks22:propertyDetails.lr_remarks22,
                              l_pricepersqft:propertyDetails.l_pricepersqft,
                              lr_remarks22:propertyDetails.lr_remarks22,
                              location:propertyDetails.location,
                              propertyImages:propertyDetails.propertyImages,
                              lo1_organizationname:propertyDetails.lo1_organizationname,
                              l_askingprice:propertyDetails.l_askingprice,
                              l_city:propertyDetails.l_city,l_state:propertyDetails.l_state,l_zip:propertyDetails.l_zip,
                              l_addressstreet:propertyDetails.l_addressstreet,
                              l_addressnumber:propertyDetails.l_addressnumber,
                              l_addressunit : propertyDetails.l_addressunit,
                              l_streetdesignationid : propertyDetails.l_streetdesignationid,
                              l_displayid:propertyDetails.l_displayid,
                              lm_dec_7:propertyDetails.lm_dec_7,
                              l_displayid:propertyDetails.l_displayid,
                              lm_char10_22:propertyDetails.lm_char10_22,
                              lm_char1_36:propertyDetails.lm_char1_36,
                              lfd_featuresincluded_85:propertyDetails.lfd_featuresincluded_85,
                              lfd_featuresincluded_24:propertyDetails.lfd_featuresincluded_24,
                              lfd_featuresincluded_55 : propertyDetails.lfd_featuresincluded_55,
                              lo1_organizationname:propertyDetails.lo1_organizationname,
                              isDeleted:propertyDetails.isDeleted,
                              createdAt:propertyDetails.createdAt,
                              images_count : propertyDetails.images_count });


                              var subject = funnelTemplateData[0].subject;
                              var email_data = { // set email variables for user
                                to: item.leadId.email, // "anurag@devs.matrixmarketers.com",//
                                from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                subject: subject,
                                html: messageToSend
                              };
                              Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if(err)
                                  return cb(err);
                                return cb();
                              });
                          }else{
                            //console.log("We were not able to send the email because there is no theme settings found for the user");
                            cb();
                          }
                        });
                    }else{
                      //console.log('we are in else')
                      var messageToSend = eb("We were not able to send the email because the mls number was in correct deals funnel" 
                         );
                       
                        var email_data = {
                                to: "savita@matrixmarketers.com",
                                from: "info@matrixmarketers.com",
                                subject: "MLS number not valid",
                                html: messageToSend
                                
                          
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                          if(err)
                            return cb(err);
                            //console.log(res)
                          return cb();
                        });
                        // //console.log("Email Not Sent ++++++++++++++++++++++++++++++skjdfbjsfbdj");
                        // cb();
                    }
                  }
                ]
              }, function(err, result) {
                if (err)
                  return InnerCb(err);
                return InnerCb();
              })
        }, function(err, result) {
          if (err)
            return OuterCb(err);
          return OuterCb();
        })
        }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })
}



// Adding Schools in the database
var addSchoolSecondary = function(payload, callbackRoute) {
  var filename = '/home/matrix/2019/Citrus_backend/Controllers/secondary_schools.json'; //Name of the file to be read
  var content = fs.readFileSync(filename);
  // var points = [];
  // var pointsNew = [];
  var elemData = JSON.parse(content);
  // //console.log('Content : ' + elemData);
  var checkLat = 0;
  var checkLong = 0;
  var chec1 = true;
  var j = 0;
  async.each(elemData.features, function(item, cb) {
    //console.log("----------------------------------------------------------------------");
      var arr = item.geometry.coordinates[0];
      var points = [];
      var pointsNew = [];
      for (var i = 0; i < arr.length; i++) {
        // var wgsResult = converter.toWgs({"coord":{"x":arr[i][0],"y":arr[i][1]},"zone":10,"isSouthern":false });
        let val = utm.convertUtmToLatLng(arr[i][0], arr[i][1], 10, 'N');
        //console.log(val);

        points.push(val);
        pointsNew.push([val.lng,val.lat]);

    }

    // cb();
      // //console.log(pointsNew);
      var value = {
          location: {
              'type': "Polygon",//LineString //Polygon
              coordinates: points
          },
          location2 : {
            'type': "Polygon",
            coordinates:  [pointsNew]
          },
          schoolTitle: item.properties.SCHOOL_NAME,
          schoolType:item.properties.SCHOOL_CATCHMENT_TYPE_2
      }
      // // //console.log(value.location2);
      // // return cb();
      Service.SCHOOL_SERVICE.InsertData(value,function (err, result) {
          if (err) return cb(err);
          return cb();
      });

      // cb();
  }, function(err) {
      if(err){
        //console.log(err);
      }else{
        //console.log("Execution Done");
      }
  });
};

var addSchoolPrimary = function(payload, callbackRoute) {
  var filename = '/home/matrix/2019/Citrus_backend/Controllers/elementary_schools.json'; //Name of the file to be read
  var content = fs.readFileSync(filename);
  // var points = [];
  // var pointsNew = [];
  var elemData = JSON.parse(content);
  // //console.log('Content : ' + elemData);
  var checkLat = 0;
  var checkLong = 0;
  var chec1 = true;
  var j = 0;
  async.each(elemData.features, function(item, cb) {
    //console.log("----------------------------------------------------------------------");
      var arr = item.geometry.coordinates[0];
      var points = [];
      var pointsNew = [];
      for (var i = 0; i < arr.length; i++) {
        // var wgsResult = converter.toWgs({"coord":{"x":arr[i][0],"y":arr[i][1]},"zone":10,"isSouthern":false });
        let val = utm.convertUtmToLatLng(arr[i][0], arr[i][1], 10, 'N');
        //console.log(val);

        points.push(val);
        pointsNew.push([val.lng,val.lat]);

    }

    // cb();
      // //console.log(pointsNew);
      var value = {
          location: {
              'type': "Polygon",//LineString //Polygon
              coordinates: points
          },
          location2 : {
            'type': "Polygon",
            coordinates:  [pointsNew]
          },
          schoolTitle: item.properties.SCHOOL_NAME,
          schoolType:item.properties.SCHOOL_CATCHMENT_TYPE_2,
          displayInNavigation : false
      }
      // // //console.log(value.location2);
      // // return cb();
      Service.SCHOOL_SERVICE.InsertData(value,function (err, result) {
          if (err) return cb(err);
          return cb();
      });

      // cb();
  },function(err){
      if(err){
        //console.log(err);
      }else{
        //console.log("Execution Done");
      }
  });
};


// Adding Schools in the database ends here
module.exports = {
    automaticMeetingRequestCron : automaticMeetingRequestCron,
    importantDatesCron          : importantDatesCron,
    greetingsCron               : greetingsCron,
    addSchoolPrimary            : addSchoolPrimary,
    addSchoolSecondary          : addSchoolSecondary,
    pendingDealCron             : pendingDealCron,
    closedDealCron              : closedDealCron
}
