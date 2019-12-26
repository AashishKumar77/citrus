/*--------------------------------------------
 * Include internal modules.
 ---------------------------------------------*/


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
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
// const moment = require('moment');
const Mongoose = require('mongoose');
var mongoose = require('mongoose');
var Path = require('path');
var schedule         = require('node-schedule');



var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;

// var ms = require('milliseconds');



// var RA_2_getData= "http://rets.citruscow.com/get_data/RD_1/";
// var getData_link= "http://rets.citruscow.com/get_data/";
// var getClassAndCount= "http://rets.citruscow.com/get_count/";

var request = require('request');


  var rule3 = new schedule.RecurrenceRule();
  rule3.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule3.hour = 1;
  rule3.minute = 0;

  var table_name = Models.users;
  var theme_model = Models.ThemeSetting_MODEL;

  var J = schedule.scheduleJob(rule3, function(){
      //console.log("+++++++++++++++++++++++++++++++++++++cronC+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      theme_model.find({}).distinct('siteId').exec(function(err,result){ ////console.log("criteria_err",err);
          if(err) {
              //console.log("Error in CRONC in getting data from ThemeSetting_MODEL")
          }else if(result.length > 0 ){
             async.each(result, (items, cb) => {
                  var criteria = {
                    siteId : items
                  }
                  //console.log(criteria);

                  theme_model.findOne(criteria, function(err,passwordExpiryDetails){
                      if(err){
                        //console.log("Error in CRONC in getting password expiry days");
                      }else if(passwordExpiryDetails){
                        //console.log(passwordExpiryDetails.passwordExpireDays);
                        var expireDayLimit = passwordExpiryDetails.passwordExpireDays;
                          var query = {
                              siteId : items
                          }
                          // var expiryDate =
                          // //console.log(new Date(Date.now() + day*24*60*60 * 1000));
                          table_name.find(query, function(err,userDetails){
                              if(err){
                                //console.log("Error in CronC in getting user details");
                              }else if( userDetails.length > 0){
                                       async.each(userDetails, (item, cb) => {
                                            // //console.log("password last updated",item.passwordLastUpdated);
                                            // //console.log("day",day);
                                            if(item.passwordLastUpdated){
                                              //console.log(expireDayLimit);
                                              var dd = new Date();
                                              // //console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
                                              // // //console.log(item);
                                              // //console.log("item.passwordLastUpdated.getTime()",item.passwordLastUpdated.getTime());
                                              // //console.log("dd.getTime()",dd.getTime());
                                              var totalMilliSeconds = dd.getTime() - item.passwordLastUpdated.getTime();
                                              // //console.log("totalMilliSeconds : ", totalMilliSeconds);
                                              var daysSincePasswordChange = Math.ceil(totalMilliSeconds / (1000 * 3600 * 24));
                                              // //console.log(item);
                                              // //console.log("Total Days Since password Changed : ", daysSincePasswordChange);

                                              var timeToExpire = expireDayLimit - daysSincePasswordChange
                                              // //console.log("You password will expire in : ",timeToExpire);
                                              // //console.log("kdfjksdf",item);
                                              if(timeToExpire === 3){
                                                //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                                    var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                                                    var fileReadStream = fs.createReadStream(templatepath + 'expire_password.html');

                                                    var emailTemplate = '';
                                                    fileReadStream.on('data', function (buffer) {
                                                        emailTemplate += buffer.toString();
                                                    });
                                                    // var path = Configs.CONSTS.accountconfirmationUrl+ '/' + payloadData.email + '/' + verificationToken;

                                                    var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');

                                                    var criteria = {
                                                        siteId: items
                                                    }
                                                    Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                                                      if(err){
                                                        fileReadStream.on('end', function (res) {
                                                            var signature = "Regards <br> Team Southsurrey";
                                                            var sendStr = emailTemplate.replace('{{signature}}', signature);

                                                            var email_data = { // set email variables for user
                                                                to: item.email,
                                                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                                subject: 'Password Expiry Reminder',
                                                                html: sendStr
                                                            };
                                                            Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                                                if (err)return cb(err);
                                                                return cb(null, {
                                                                    "statusCode": 200,
                                                                    "status": "success",
                                                                    "message": "Email sent successfully"
                                                                })
                                                            });
                                                        })
                                                      }else if(result.length > 0){
                                                        fileReadStream.on('end', function (res) {
                                                            // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                                                            var imagePath = '' + result[0].logoUrl

                                                            var sendStr = emailTemplate.replace('{{signature}}', result[0].signature).replace('{{imagePath}}', imagePath);

                                                            var email_data = { // set email variables for user
                                                                to: item.email,
                                                                from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                                                subject: 'Password Expiry Reminder',
                                                                html: sendStr
                                                            };
                                                            Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                                                if (err)return cb(err);
                                                                return cb(null, {
                                                                    "statusCode": 200,
                                                                    "status": "success",
                                                                    "message": "Email sent successfully"
                                                                })
                                                            });
                                                        })
                                                      }else{
                                                        fileReadStream.on('end', function (res) {
                                                            var signature = "Regards <br> Team Southsurrey";
                                                            var sendStr = emailTemplate.replace('{{signature}}', signature);

                                                            var email_data = { // set email variables for user
                                                                to: item.email,
                                                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                                subject: 'Password Expiry Reminder',
                                                                html: sendStr
                                                            };
                                                            Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                                                if (err)return cb(err);
                                                                return cb(null, {
                                                                    "statusCode": 200,
                                                                    "status": "success",
                                                                    "message": "Email sent successfully"
                                                                })
                                                            });
                                                        })
                                                      }
                                                    });

                                                    //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                                              }else if( timeToExpire === 7 ){
                                                  //console.log("Send an EMail that password will expire in 7 days");
                                                  var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                                                  var fileReadStream = fs.createReadStream(templatepath + 'expire_password_7.html');

                                                  var emailTemplate = '';
                                                  fileReadStream.on('data', function (buffer) {
                                                      emailTemplate += buffer.toString();
                                                  });
                                                  // var path = Configs.CONSTS.accountconfirmationUrl+ '/' + payloadData.email + '/' + verificationToken;

                                                  var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                                                  var criteria = {
                                                      siteId: items
                                                  }
                                                  Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                                                      if(err){
                                                        fileReadStream.on('end', function (res) {
                                                            var signature = "Regards <br> Team Southsurrey";
                                                            var sendStr = emailTemplate.replace('{{signature}}', signature);;

                                                            var email_data = { // set email variables for user
                                                                to: item.email,
                                                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                                subject: 'Password Expiry Reminder',
                                                                html: sendStr
                                                            };
                                                            Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                                                if (err)return cb(err);
                                                                return cb(null, {
                                                                    "statusCode": 200,
                                                                    "status": "success",
                                                                    "message": "Email sent successfully"
                                                                })
                                                            });
                                                        });
                                                      }else if(result.length > 0){
                                                        fileReadStream.on('end', function (res) {
                                                            var sendStr = emailTemplate.replace('{{signature}}', result[0].signature);;

                                                            var email_data = { // set email variables for user
                                                                to: item.email,
                                                                from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                                                subject: 'Password Expiry Reminder',
                                                                html: sendStr
                                                            };
                                                            Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                                                if (err)return cb(err);
                                                                return cb(null, {
                                                                    "statusCode": 200,
                                                                    "status": "success",
                                                                    "message": "Email sent successfully"
                                                                })
                                                            });
                                                        });
                                                      }else{
                                                        var signature = "Regards <br> Team Southsurrey";
                                                        fileReadStream.on('end', function (res) {
                                                            var sendStr = emailTemplate.replace('{{signature}}', signature);;

                                                            var email_data = { // set email variables for user
                                                                to: item.email,
                                                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                                subject: 'Password Expiry Reminder',
                                                                html: sendStr
                                                            };
                                                            Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                                                if (err)return cb(err);
                                                                return cb(null, {
                                                                    "statusCode": 200,
                                                                    "status": "success",
                                                                    "message": "Email sent successfully"
                                                                })
                                                            });
                                                        });
                                                      }
                                                  });

                                                  //console.log("Send an EMail that password will expire in 7 days");

                                              }else if( timeToExpire < 1){
                                                  var criteria = {
                                                      email : item.email
                                                  }
                                                  table_name.findOneAndUpdate(criteria,{ isPasswordExpired : true }, {new:true}, function(err,result){
                                                      if(err){
                                                          //console.log("err",err);
                                                      }else if(result){
                                                        //console.log("CRON functionality implemented successfully");
                                                      }else{
                                                          //console.log("Something went wrong and we were not able to update the isPasswordExpired field");
                                                      }
                                                  });
                                                  //console.log("Change the Value of isPasswordExpired in Database");
                                              }else{
                                                  //console.log("Do Nothing");
                                              }
                                            }else{
                                               //console.log("Password Last updated field doesn't exist");
                                            }
                                       },function(err){
                                              ////console.log("Hello");
                                          if(err){
                                            //console.log("Error grabbing data");
                                          }else {
                                            //console.log("Finished processing all data");
                                          }
                                      });
                              }else{
                                //console.log("Something went wrong in CronC while getting user details");
                              }
                          });
                      }else{
                        //console.log("Something went Wrong in cronC please try again later")
                      }
                  });

             },function(err){
                    ////console.log("Hello");
                if(err){
                  //console.log("Error grabbing data");
                } else {
                  //console.log("Finished processing all data");
                }
            });
            // //console.log(result);

          }else{
            //console.log("Something went Wrong. Please try again later!")
          }

      });
});



//Cron to Send Emails to users with saved search after a new property is added in the saved search
var rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = [0, new schedule.Range(0, 6)];
rule2.hour = 17;
rule2.minute = 28;

var K = schedule.scheduleJob(rule2, function(){
    //console.log("+++++++++++++++++++++++++++++++++++++cronC+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    var options= { lean :  true };
    Service.SEARCH_DATA_SERVICE.getSearchData({},(err,savedSearches)=> {
        if(err){
            //console.log(err);
        }else if(savedSearches.length > 0){
             //console.log('saved serach',savedSearches);
            //Searching properties with each search criteria
            async.each(savedSearches, (item, cab) => {
              if(item.user !== null){
                  // //console.log(item.user.userType);
                  var date = new Date();
                    date.setDate(date.getDate() - 2);
//console.log('date',date)
                  var query = {

                    $or: [ { createdAt: { $gte: date } }, { updatedAt: { $gte: date } } ]

                  };
                   // //console.log("_________________________________________________________________________");
                     //Property Type
                     if(item.propertyType){
                       query.lm_char1_36 = item.propertyType
                     }
                     //Area
                     if(item.area){
                         if(item.area.length > 0){
                             query.l_area = { $in: item.area }
                         }
                     }
                     //Mls Number
                     if(item.listingid){
                         query.l_displayid = item.listingid
                     }
                     //Price
                     if(item.maxAskingprice){
                         query.l_askingprice = {$gte: item.minAskingprice || 0,$lte:item.maxAskingprice}
                     }
                     if( item.minAskingprice && item.maxAskingprice){
                         query.l_askingprice = {$gte: item.minAskingprice,$lte:item.maxAskingprice}
                     }
                     if( item.minAskingprice && !item.maxAskingprice){
                         query.l_askingprice = {$gte: item.minAskingprice}
                     }
                     //Bed Rooms
                     if(item.maxbedRoom){
                         query.lm_int1_4 = { $gte: item.minbedRoom || 0,$lte:item.maxbedRoom }
                     }
                     if( item.minbedRoom &&  item.maxbedRoom ) {
                         query.lm_int1_4 = { $gte: item.minbedRoom,$lte:item.maxbedRoom }
                     }
                     if( item.minbedRoom && !item.maxbedRoom){
                         query.lm_int1_4 = { $gte: item.minbedRoom }
                     }

                     //Bath Rooms
                     if(item.maxbathRoom){
                         query.lm_int1_19 = { $gte: item.minbathRoom || 0,$lte:item.maxbathRoom }
                     }
                     if( item.minbathRoom &&  item.maxbathRoom ) {
                         query.lm_int1_19 = { $gte: item.minbathRoom,$lte:item.maxbathRoom }
                     }
                     if( item.minbathRoom && !item.maxbathRoom){
                         query.lm_int1_19 = { $gte: item.minbathRoom }
                     }

                     //Floor SPace
                     if(item.maxFloorSpace){
                         query.lm_dec_7 = { $gte: item.minFloorSpace || 0,$lte:item.maxFloorSpace }
                     }
                     if( item.minFloorSpace &&  item.maxFloorSpace ) {
                         query.lm_dec_7 = { $gte: item.minFloorSpace,$lte:item.maxFloorSpace }
                     }
                     if( item.minFloorSpace && !item.maxFloorSpace){
                         query.lm_dec_7 = { $gte: item.minFloorSpace }
                     }

                     //Lot Size

                     if(item.max_lot){
                         query.lm_dec_11 = {$gte: item.min_lot || 0,$lte:item.max_lot}
                     }
                     if(item.min_lot && item.max_lot){
                         query.lm_dec_11 = {$gte: item.min_lot,$lte:item.max_lot}
                     }
                     if(item.min_lot && !item.max_lot){
                         query.lm_dec_11 = {$gte: item.min_lot}
                     }
                     // //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                      //console.log(query);
                     // //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                     //getting properties from DB w.r.t. the search criteria
                     // var criteria = {_id: payloadData.PropertyId};
                     var projection = {};
                     var options = {lean: true,
                        
                    };
                     Service.REST_PROPERY_RD_1_Service.getData_limit(query, projection,options,9,function (err, properties) {
                         if (err) return cab(err);
                         if(properties.length > 0){
                             //console.log("Got Some Properties",properties);
                             var email = item.user.email
                             ////console.log('email',email)
                            //Getting Theme Settings From DB
                            var id = item.user.siteId
                            id = id.toString();
                            ////console.log("Site Id",id);
                            var criteria = {
                                siteId : id
                            }
                            //console.log(criteria);
                            theme_model.findOne(criteria, function(err,result){
                                if(err){
                                  return cab(err);
                                }else if(result){

                                    // global.document = document;
                                    // var elem = document.getElementById("abc");
                                    // var elem2 = document.getElementById("abc");
                                    // elem2.innerHTML = "";

                                    // for(var i =0;i<10;i++){
                                    //     elem.replace('{{path}}', "path")

                                    //     elem2.innerHTML += elem;
                                        
                                    // }
                                    
                                    var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                                    var fileReadStream = fs.createReadStream(templatepath + 'properties.html');
                        
                                    var emailTemplate = '';
                                    fileReadStream.on('data', function (buffer) {
                                        emailTemplate += buffer.toString();
                                    });

                                    var searchTitle = item.searchTitle
                                    
                                    fileReadStream.on('end', function (res) {
                                        var html1 = "";
                                        var html2 = "";
                                        var html3 = "";
                                        properties.forEach( function (item,i) {
                                                var lr_remarks22 = item.lr_remarks22.slice(0, 90);

                                    //             html += `<div class="grid-item">
                                    //     <a href="#" class="view-product">
                                    //       <img  src=" https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/`+item.l_displayid+`/image`+item.images_count+`.jpeg"> style="width: 165px; max-width: 100%; height: 130px; object-fit: cover;">
                                    //       <div class="product-name" style="display: flex;">
                                    //       <h2 class="product-title">` + item.l_address + `</h2>
                                    //       <h3 class="price">$`+item.l_askingprice +`</h3>
                                    //      </div>
                                    //      <div class="desc">
                                    //     <p> </p>
                                    //     </div>
                                    //     </a>
                                    //     <p class="add-to-cart">`+ lr_remarks22 +`...</p>
                                    //     <div class="area"> `+item.lm_dec_7 +`sqft , `+item.lm_int1_4 + `bedroom , `+item.lm_int1_19+` bathroom </div>
                                    //    <div class="icons" style="display:flex;" >
                                    //      <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="text-align: left;"> 
                                    //       <img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=location.png" style="width: 20px;">
                                    //       <img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=save.png" style="width: 20px;">
                                    //       <img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=home.png" style="width: 20px;">
                                    //     </a>
                                     
                                    //  <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="height: 29px;
                                    //     line-height: 22px;
                                    //     width: 100%;
                                    //     color: #3c96e2;
                                    //     font-size: 11px;
                                    //     text-align: left;
                                    //     padding: 0px 5px;
                                    //     font-family: 'Montserrat';
                                    //     /* border-bottom: 1px solid #ccc; */
                                    //     font-weight: 600;" > View Detail </a>
                                    //   </div>
                                    
                                    //      <p style="height: 16px;    line-height: 15px; width: 100%; color: #353738;
                                    //     font-size: 11px;
                                    //     text-align: left;
                                    //     padding: 0px 5px;
                                    //     font-family: 'Montserrat';"> `+item.lo1_organizationname+` </p>
                                    //   </div> `;
                                            
if(i == 0 || i == 1 || i == 2 ){
    html1 += `
    <th class="column-top" width="190" bgcolor="#ffffff" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style=" border: 1px solid #ccc;">
            <tr>
                <td class="img-center pb20" style="font-size:0pt; line-height:0pt; text-align:center; padding-bottom:0;">
                <img src="https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/`+item.l_displayid+`/image`+item.images_count+`.jpeg" width="190" height="190" border="0" alt="" />
                
                </td>
            </tr>
            <tr>
                <td class="blue-heading" style="font-size:13px; line-height:14px; padding:10px 5px; background: #205684; color: #fff;">
                        <table>
                                <tr>
                                        <td class="product_title" style="padding-right: 20px;"> ` + item.l_address + `</td>
                                        <td class="product_price" style="font-weight: 600;"> `+item.l_askingprice +` </td>
                                </tr>
                        </table>
                </td>
            </tr>
            <tr>
                <td class="text-title2 pb15 m-center" style="color:#000000; font-family: sans-serif; font-size:12px; line-height:16px; text-align:left; padding:8px 5px; font-weight: 600; border-bottom: 1px solid #bdbdbd;">
                `+ lr_remarks22 +`...
                </td>
            </tr>
            <tr>
                <td class="text2 pb20 m-center" style="color:#000; font-family: sans-serif; font-size:12px; line-height:16px; text-align:left; padding:8px 5px; font-weight: 600;">
                `+item.lm_dec_7 +`sqft , `+item.lm_int1_4 + `bedroom , `+item.lm_int1_19+` bathroom 
                </td>
            </tr>
            <tr>
                <td class="price pb20 m-center" style="color:#000000; font-family: sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:0px;">
                        <table width="100%">
                            <tr>
                                <td>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=location.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=save.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=home.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                </td>
                                <td>
                                    <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="height: 29px; line-height: 22px; width: 100%; color: #3c96e2; font-size: 11px; text-align: left; padding: 0px 5px; font-family: 'Montserrat'; font-weight: 600;"> View Detail </a>
                                </td>
                            </tr>
                        </table>


                </td>
            </tr>
            
            <tr>
                <td align="left">
                    <table class="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="text-align:left;">
                        <tr>
                            <td class="text-button purple-button" style="font-family:sans-serif, Arial,sans-serif; font-size:12px; line-height:18px; padding:8px 5px; background:transparent; color:#000000;">
                            `+item.lo1_organizationname+`
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
        </table>
    </th>
`
}
if(i == 3 || i == 4 || i == 5 ){
    html2 += `
    <th class="column-top" width="190" bgcolor="#ffffff" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style=" border: 1px solid #ccc;">
            <tr>
                <td class="img-center pb20" style="font-size:0pt; line-height:0pt; text-align:center; padding-bottom:0;">
                <img src="https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/`+item.l_displayid+`/image`+item.images_count+`.jpeg" width="190" height="190" border="0" alt="" />
                
                </td>
            </tr>
            <tr>
                <td class="blue-heading" style="font-size:13px; line-height:14px; padding:10px 5px; background: #205684; color: #fff;">
                        <table>
                                <tr>
                                        <td class="product_title" style="padding-right: 20px;"> ` + item.l_address + `</td>
                                        <td class="product_price" style="font-weight: 600;"> `+item.l_askingprice +` </td>
                                </tr>
                        </table>
                </td>
            </tr>
            <tr>
                <td class="text-title2 pb15 m-center" style="color:#000000; font-family: sans-serif; font-size:12px; line-height:16px; text-align:left; padding:8px 5px; font-weight: 600; border-bottom: 1px solid #bdbdbd;">
                `+ lr_remarks22 +`...
                </td>
            </tr>
            <tr>
                <td class="text2 pb20 m-center" style="color:#000; font-family: sans-serif; font-size:12px; line-height:16px; text-align:left; padding:8px 5px; font-weight: 600;">
                `+item.lm_dec_7 +`sqft , `+item.lm_int1_4 + `bedroom , `+item.lm_int1_19+` bathroom 
                </td>
            </tr>
            <tr>
                <td class="price pb20 m-center" style="color:#000000; font-family: sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:0px;">
                        <table width="100%">
                            <tr>
                                <td>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=location.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=save.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=home.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                </td>
                                <td>
                                    <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="height: 29px; line-height: 22px; width: 100%; color: #3c96e2; font-size: 11px; text-align: left; padding: 0px 5px; font-family: 'Montserrat'; font-weight: 600;"> View Detail </a>
                                </td>
                            </tr>
                        </table>


                </td>
            </tr>
            
            <tr>
                <td align="left">
                    <table class="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="text-align:left;">
                        <tr>
                            <td class="text-button purple-button" style="font-family:sans-serif, Arial,sans-serif; font-size:12px; line-height:18px; padding:8px 5px; background:transparent; color:#000000;">
                            `+item.lo1_organizationname+`
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
        </table>
    </th>
`
}
if(i == 6 || i == 7 || i == 8 ){
    html3 += `
<th class="column-top" width="190" bgcolor="#ffffff" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style=" border: 1px solid #ccc;">
            <tr>
                <td class="img-center pb20" style="font-size:0pt; line-height:0pt; text-align:center; padding-bottom:0;">
                <img src="https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/`+item.l_displayid+`/image`+item.images_count+`.jpeg" width="190" height="190" border="0" alt="" />
                
                </td>
            </tr>
            <tr>
                <td class="blue-heading" style="font-size:13px; line-height:14px; padding:10px 5px; background: #205684; color: #fff;">
                        <table>
                                <tr>
                                        <td class="product_title" style="padding-right: 20px;"> ` + item.l_address + `</td>
                                        <td class="product_price" style="font-weight: 600;"> `+item.l_askingprice +` </td>
                                </tr>
                        </table>
                </td>
            </tr>
            <tr>
                <td class="text-title2 pb15 m-center" style="color:#000000; font-family: sans-serif; font-size:12px; line-height:16px; text-align:left; padding:8px 5px; font-weight: 600; border-bottom: 1px solid #bdbdbd;">
                `+ lr_remarks22 +`...
                </td>
            </tr>
            <tr>
                <td class="text2 pb20 m-center" style="color:#000; font-family: sans-serif; font-size:12px; line-height:16px; text-align:left; padding:8px 5px; font-weight: 600;">
                `+item.lm_dec_7 +`sqft , `+item.lm_int1_4 + `bedroom , `+item.lm_int1_19+` bathroom 
                </td>
            </tr>
            <tr>
                <td class="price pb20 m-center" style="color:#000000; font-family: sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:0px;">
                        <table width="100%">
                            <tr>
                                <td>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=location.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=save.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                    <span class="old-price" style="text-decoration:line-through; color:#585858; display: inline-block;">
                                        <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="display: inline-block;"><img class="icon-width" src="http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=home.png" style="width: 15px;border: 1px solid #696969;padding: 3px; border-radius: 50px; margin: 2px; height: 15px;"></a>
                                    </span>
                                </td>
                                <td>
                                    <a href="http://southsurrey.ca/#/`+item.l_displayid+`/`+item.l_addressnumber+`" style="height: 29px; line-height: 22px; width: 100%; color: #3c96e2; font-size: 11px; text-align: left; padding: 0px 5px; font-family: 'Montserrat'; font-weight: 600;"> View Detail </a>
                                </td>
                            </tr>
                        </table>


                </td>
            </tr>
            
            <tr>
                <td align="left">
                    <table class="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="text-align:left;">
                        <tr>
                            <td class="text-button purple-button" style="font-family:sans-serif, Arial,sans-serif; font-size:12px; line-height:18px; padding:8px 5px; background:transparent; color:#000000;">
                            `+item.lo1_organizationname+`
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
        </table>
    </th>
`
}


                                            }
                                        );
                                       
                                       var sendStr = emailTemplate.replace('{{path}}', path).replace('{{siteName}}',result.siteName).replace('{{number}}',properties.length).replace('{{firstname}}',item.user.firstName).replace('{{site_link}}', result.siteUrl).replace('{{template1}}', html1).replace('{{template2}}', html2).replace('{{template3}}', html3).replace('{{title}}', searchTitle).replace('{{logo}}', result.logoUrl);
                 
                                       var email_data = {
                                           to: email,
                                           from: result.fromName + '<' + result.fromEmail + '>',
                                           subject: 'Results for your saved search on ' + result.siteName,
                                           html: sendStr
                                       };
                 
                                       Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                           if (err){
                                             //console.log("error")  
                                           }else if(res){
                                               //console.log('mail sent successfully',res)
                                           }
                                       });
                                   })
                                   
                                }else{
                                    //console.log("No Theme Settings found");
                                    return cab(err)
                                }
                            });
                         }else{
                             //console.log("No properties found");
                         }

                     });
                   }
               // //console.log("_________________________________________________________________________");
            },function(err){
                    ////console.log("Hello");
                if(err){
                  //console.log(err);
                  //console.log("Error grabbing data");
                } else {
                  // //console.log(" DETAILS HERE ");
                  ////console.log("Finished processing all data");
                }
            });
            //Property searching with each criteria ends here
        }else{
            //console.log("No Saved Search Found");
        }
    });
});
