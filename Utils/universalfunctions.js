/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : Here defines all users routes.
 * @ author      : Anurag Gupta
 * @ date        :
 -----------------------------------------------------------------------*/

'use strict';

/*--------------------------------------------
 * Include internal and external modules.
 ---------------------------------------------*/

// external modules.
const md5 = require('md5');
const async = require('async');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const Joi = require('joi');
const Boom = require('boom');
const timezoner = require('timezoner');
const moment = require('moment');
const validator = require('validator');
// internal modules.
const Models = require('../Models');
const Utils = require('./mailer');
const transporter = Utils.transporter;
const messages = require('./responses');
const messenger = require('./responses')
const Configs = require('../Configs');
const CONSTS = Configs.CONSTS;
const env = require('../env');
const eventEmitter = require('./events');
const twilio_credentials = Configs.SMS[env.instance];
const logger = require('./logger');
const saltRounds = 10;
const Responses = require('./responses');
const GOOGLE_TIMEZONE_API__KEY = Configs.CONSTS.GOOGLE_TIMEZONE_API__KEY //Configs.app.GOOGLE_TIMEZONE_API__KEY;
const STATUS_MSG = Responses.STATUS_MSG.SUCCESS // Configs.app.STATUS_MSG;
const USER_TYPE = CONSTS.USER_TYPE // Configs.app.STATUS_MSG;

const DbCommonFunction = require('./dbCommonFunction');
const Services = require('../Services');
// require the notification modules.
const FCM = require('fcm-node');
var apn = require('apn');
var FCM_KEY = Configs.PUSH.android.dev.API_Key;
var nodeMailerModule = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport'); ////console.log("dddd",Configs.emailConfig.nodeMailer.Mandrill);
const transporter_Mandrill = nodeMailerModule.createTransport(smtpTransport(Configs.emailConfig.nodeMailer.Mandrill));
var APP_CONSTANTS = Configs.CONSTS;
// var key = APP_CONSTANTS.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');
//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 // new api key made by chetan on 11/06/2019
var key = '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';		//Your API key from sendrid comes here
sgMail.setApiKey(key);
module.exports = {
    failActionFunction: function (request, reply, source, error) {
        var customErrorMessage = '';
        if (error.output.payload.message.indexOf("[") > -1) {
            customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
        }else{
            customErrorMessage = error.output.payload.message;
        }
        customErrorMessage = customErrorMessage.replace(/"/g, '');
        customErrorMessage = customErrorMessage.replace('[', '');
        customErrorMessage = customErrorMessage.replace(']', '');
        error.output.payload.message = customErrorMessage;
        delete error.output.payload.validation
        return reply(error);
    },
    check_contact_exist: function (request, callback) { //check if email exist in db ??
        Models.users.find({phone: request, is_deleted: false}, function (err, res) {
            callback(err, res);
        });
    },
    check_email_exist: function (request, callback) { //check if email exist in db ??
        Models.users.find({email: request, is_deleted: false}, function (err, res) {
            callback(err, res);
        });
    },
    check_confirmAccount_token: function (request, callback) { //check if given email verify token exist in db ??
        ////console.log('\n\n', request);
        Models.users.find({confirmAccount_token: request}, function (err, res) {
            //console.log('\n\n', err, res);
            callback(err, res);
        });
    },
    check_resetpassword_token_exist: function (request, callback) { ////console.log("check_resetpassword_token_exist==init");
        Models.users.find({forgetpasswordVerifyToken: request}, function (err, res) {
            if(err) return callback(err);
            if(res.length==0) return callback(Responses.FORGOT_PASSWORD_TOKEN_EXPIRED)
            return callback(null,res);
        });
    },
    check_old_password1: function (request, callback) {
        Models.users.User.findOne({$and: [{password: request.password}, {_id: request.user_id}]}, function (err, res) {
            callback(err, res);
        });
    },
    encryptpassword: function (request) { // password encryption.

        return md5(request);
    },
    send_email: function (request, cb) {
        // //console.log("Reachooooooooooooooooooooooooooooooooooooooooooo");
        // //console.log(request);
        // var mailOptions = {
        //     from: request.from, // sender address
        //     to: request.to, // list of receivers
        //     subject: request.subject, // Subject line
        //     text: '', // plaintext body
        //     html: request.html // html body
        // };

        var msg = {
          to: request.to,
          from: request.from,
          subject: request.subject,
          text: 'sdf',
          html: request.html,
        };
        var key = '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'
        sgMail.setApiKey(key);
        // //console.log("Reachooooooooooooooooooooooooooooooooooooooooooo");
        // const msg = {
        //   to: 'rajat@devs.matrixmarketers.com',
        //   from: 'test@example.com',
        //   subject: 'xcvxc',
        //   text: 'and easy to do anywhere, even with Node.js',
        //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // };
        sgMail.send(msg,function(err,result){
            // //console.log(err,result);
            if(err){
                //console.log(err)
              //console.log("Err");
            }else{
                //console.log(result)
              //console.log("Email Send Successfully",request.to);
            }
        });

        // if (request.cc) {
        //     mailOptions.cc = request.cc;
        // }
        // if (request.replyTo) {
        //     mailOptions.replyTo = request.replyTo;
        // }
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'test@example.com',					//receiver's email
//   from: 'test@example.com',			//sender's email
//   subject: 'I think its working',				//Subject
//   text: 'and finally  i can send email from sendgrid',		//content
//   html: 'and easy to do anywhere, even with Node.js',			//HTML content
// };
        // sgMail.send(mailOptions,function (error, info) {
        //   //console.log(error,info);
        // });
        // transporter_Mandrill.sendMail(mailOptions, function (error, info) { // send mail with defined transport object
        //     //console.log(error, info)
        // });

        cb()
    },
    // send notification for both Android and Ios.
    sendNotification: function (data, cb) { ////console.log('------------ Inside FCM: Send Notification ------------', data);
        var fcmCli = new FCM(FCM_KEY); // YOUR_API_KEY_HERE.
        var payload = data.payload || {};
        payload.show_in_foreground = true;
        payload.custom_notification = {
            title: 'JayDee',
            body: (data.message) ? data.message : "Notification from JayDee.",
            click_action: 'com.pwayzNotificationClick',
            sound: "default",
            //badge: "1"
        }; ////console.log("data.device_token",data.device_token);
        var notification_obj = {
            to: data.device_token,
            data: payload, //some data object (optional).
            priority: 'high',
            content_available: true,
            notification: { // notification object.
                title: 'JayDee',
                body: (data.message) ? data.message : "Notification from JayDee.",
                click_action: 'com.pwayzNotificationClick',
                sound: "default",
                //badge: "1"
            }
        };
        if (data.click_action) {
            notification_obj.notification.click_action = data.click_action
        }
        (function () {
            fcmCli.send(notification_obj, function (err, res) {
                if (err) { ////console.log("Something has gone wrong! at FCM push notification ------", JSON.stringify(err));
                    cb(err, null)
                } else { ////console.log("\n\nFCM notification sent successfully. ------------------", JSON.stringify(res));
                    cb(null, res);
                };
            });
        })();
    },  // send notification for both Android and Ios.

    testsendNotification: function (data, cb) {
        var fcmCli = new FCM('AAAAzWy5eZc:APA91bHxLiBsFabxANiskDADXPyxVFVkbUeTRyOd-xy-3POyeRCeSqeOReuSf53GMwVOBgAwgtOHbA9hPV4Je1nfAg4oDvFS-WZ7oDQJMuRBnOku8tH4jKsekCSRrcLdNvcPb_3fovcc'); // YOUR_API_KEY_HERE.
        var payload = data.payload || {};
        payload.show_in_foreground = true;
        payload.custom_notification = {
            title: 'JayDee',
            body: (data.message) ? data.message : "Notification from JayDee.",
            click_action: 'com.pwayzNotificationClick',
            //  sound: "default",
            badge: "1"
        };

        var notification_obj = {
            to: data.device_token ? data.device_token : 'f61mo4p2MRc:APA91bHo7eYpivjFhBW0zoSojtTlbRUxb7y-tT7MxubZjCQWx9e1IfrEBE854u6u1x4ctLrW774jvrNwoep43n7XBqpV_Co0MHCIxWw3fiGKVXKYlFukHi5Jl61vUxzxUQLCYofd5xB3',
            data: payload, //some data object (optional).
            priority: 'high',
            content_available: true,
            notification: { // notification object.
                title: 'JayDee',
                body: (data.message) ? data.message : "Notification from JayDee.",
                click_action: 'com.pwayzNotificationClick',
                //    sound: "default",
                badge: "1"
            }
        };

        (function () {
            fcmCli.send(notification_obj, function (err, res) {
                if (err) {
                    ////console.log("Something has gone wrong! at GCM push notification ------", JSON.stringify(err));
                    cb(err, null)
                } else {
                    ////console.log("\n\nFCM notification sent successfully. ------------------", JSON.stringify(res));
                    cb(null, res);
                }
                ;
            });
        })();
    },

    //*************** To upload images to folder from app *****************//
    uploadProfilePic: function (data, cb) { ////console.log('\n\n', data.user_id); //console.log('\n\ndfsdfd', data.type, data.user_id)

        if (data && data.image) {
            var ext = data.image.hapi.filename.substr(data.image.hapi.filename.lastIndexOf('.') + 1);
            var filename = data.user_id + "_" + (Date.now()) + "." + ext.substr(0, ext.length); // append userid in image name and date

            ////console.log(filename);

            if (data.type == 1) { ////console.log('Profile Image upload');
                var dest = path.join('./Assets/UserImages', filename); // destination folder to write file
            }
            if (data.type == 2) { ////console.log('Vehicle Image upload');
                var dest = path.join('./Assets/Vehicles', filename); // destination folder to write file
            }
            if (data.type == 3) { ////console.log('Parking Space Image Upload');
                var dest = path.join('./Assets/ParkingSpace', filename); // destination folder to write file
            }
            if (data.type == 4) { ////console.log('Parking Space Image Upload');
                var dest = path.join('./Assets/issues', filename); // destination folder to write file
            }
            if (data.type == 5) { ////console.log('Verification Docs Image Upload');
                var dest = path.join('./Assets/VerificationDocs', filename); // destination folder to write file
            }

            fs.writeFile(dest, data.image['_data'], function (err) { // write the stream to file at a dest(path where to be stored)
                if (err) {
                    ////console.log("error in picture.....", err);
                    cb(messages.fileWriteError)
                } else {
                    cb(null, filename)
                }
            });
        } else {
            cb(messages.fileChooseError)
        }
    },
    uploadDigitalPic: function (data, cb) {
        if (data && data.digital_resume.pic && data.type == 0) {
            var ext = data.digital_resume.pic.hapi.filename.substr(data.digital_resume.pic.hapi.filename.lastIndexOf('.') + 1);
            var filename = data.user_id + "_" + Math.floor(Date.now() / 1000) + "." + ext.substr(0, ext.length); // append userid in image name and date

            ////console.log(filename);

            var dest = path.join('./Assets/ProfilePic/DigitalCv', filename); // destination folder to write file
            fs.writeFile(dest, data.digital_resume.pic['_data'], function (err) { // write the stream to file at a dest(path where to be stored)
                if (err) {
                    ////console.log("error in picture.....", err);
                    cb(messages.fileWriteError)
                } else {
                    cb(null, filename)
                }
            });
        } else
            cb(messages.fileChooseError)
    },
    require_login: function (request, reply) { // validate the given token

        var token = (request.payload != null && (request.payload.logintoken)) ? request.payload.logintoken : ((request.params && request.params.logintoken) ? request.params.logintoken : request.headers['x-logintoken']);
        async.waterfall([
            function (cb) {
                jwt.verify(token, Configs.CONSTS.jwtkey, function (err, decode) { // checking token expiry
                    if (err) {
                        cb(messages.tokenExpired)
                    } else {
                        cb(null, decode);
                    }
                })
            },
            function (decodedata, cb) {
                Models.users.findOne({login_token: token}, function (err, res) { // verifying token and respective userid existence in db
                    if (err) {
                        cb(messages.systemError)
                    } else {
                        if (!res) {
                            cb(messages.tokenExpired);
                        } else {
                            cb(null, {data: res})
                        }
                    }
                })
            }

        ], function (err, result) {
            if (err) {
                reply(err).takeover();
            } else {
                reply(result);
            }

        })
    },
    validate_socket: function (request, callback) {
        var token = request;

        async.waterfall([
            function (cb) {
                jwt.verify(token, Configs.CONSTS.jwtkey, function (err, decode) { // checking token expiry
                    if (err) {
                        cb(messages.tokenExpired)
                    } else {
                        cb(null, decode);
                    }
                })
            },
            function (decodedata, cb) {
                Models.users.findOne({login_token: token}, function (err, res) { // verifying token and respective userid existence in db
                    if (err) {
                        cb(messages.systemError)
                    } else {
                        if (!res) {
                            cb(messages.tokenExpired);
                        } else {
                            cb(null, {data: res})
                        }
                    }
                })
            }
        ], callback);
    },
    check_id_exist: function (request, callback) { // check if id exists in db
        if (request.type == 0) {
            Models.users.find({_id: request.id}, function (err, res) { // find id in users collection
                if (err)
                    callback(err);
                else
                    callback(null, res);
            });
        }
        if (request.type == 1) {
            Models.vehicle.find({_id: request.id, is_deleted: false}, function (err, res) { // find id in vehicle collection
                if (err)
                    callback(err);
                else
                    callback(null, res);
            });
        }
        if (request.type == 2) {
            Models.inbox.find({_id: request.id, is_deleted: false}, function (err, res) { // find id in inbox collection
                if (err)
                    callback(err);
                else
                    callback(null, res);
            });
        }
        if (request.type == 3) {
            Models.parking.find({_id: request.id, is_deleted: false}, function (err, res) { // find id in parkings collection
                if (err)
                    callback(err);
                else
                    callback(null, res);
            });
        }
        if (request.type == 4) {
            Models.bookings.find({_id: request.id, is_deleted: false}, function (err, res) { // find id in bookings collection
                if (err)
                    callback(err);
                else
                    callback(null, res);
            });
        }
    },
    populateModel: function (model, query, projectionQuery, options, populateModel, callback) {
        ////console.log("model,query,projectionQuery,options,", populateModel);
        ////console.log(query);
        model.find(query, projectionQuery, options).populate(populateModel).exec(function (err, res) {
            ////console.log("populateModel----", err, res);
            if (err)
                callback(err);
            else callback(null, res);
        });
    },
    aggregate: function (table_name, group) { ////console.log("data============", group)
        table_name.aggregate(group, function (err, data) { ////console.log(data, err);
            callback(err, data);
        });
    },
    // sending an sms of an event occured to the concerned party.
    sendSMS: function (request, callback) {
        messenger.messages.create({
            body: request.message,
            to: request.phone, // Text this number
            from: twilio_credentials.number // From a valid Twilio number
        }, function (err, message) {
            if (err) {
                callback(messages.systemError)
            } else {
                callback(null, message.sid)
            }
        });
    },
    check_phonenumber_exist: function (request, callback) { //check if email exist in db ??
        Models.users.find({phonenumber: request}, function (err, res) {
            callback(err, res);
        });
    },
    UnsetDeviceToken: function (deviceToken, callback) {
        var cert = {
            device_token: deviceToken
        };
        var dataToset = {
            $unset: {
                device_token: 1,
                device_type: 1
            }
        }
        Models.users.update(cert, dataToset, {multi: true}, function (err, res) {
            if (err) return callback(err);
            return callback();
        });
    },
    check_old_password: function (request, callback) {
        Models.users.findOne({$and: [{password: request.password}, {_id: request.user_id}]}, function (err, res) {
            callback(err, res);
        });
    },
    generateRandomString: function (length, alphanumeric) {
        var data = "",
            stringkey = "";

        if (alphanumeric) {
            stringkey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        } else {
            stringkey = "0123456789";  //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        }

        for (var i = 0; i < length; i++) {
            data += stringkey.charAt(Math.floor(Math.random() * stringkey.length));
        }
        return data;
    },
    fetchImagePath: function (ImageName, callback) {
          var profileImage = path.join('./Assets/UserImages', ImageName), //if the file is a user profile picture
              vehicleImage = path.join('./Assets/Vehicles', ImageName), //if the file is a Vehicle Image
              parkingImage = path.join('./Assets/ParkingSpace', ImageName), //if the file is a Parking Space
              issueImage = path.join('./Assets/IssuesImages', ImageName), //if the file is a Parking Space
              verificationDocImage = path.join('./Assets/VerificationDocs', ImageName);
              siteImages = path.join('./Assets/', ImageName); //if the file is a Parking Space

          if (fs.existsSync(profileImage)) {
              callback(null, profileImage)
          } else if (fs.existsSync(vehicleImage)) {
              callback(null, vehicleImage)
          } else if (fs.existsSync(parkingImage)) {
              callback(null, parkingImage)
          } else if (fs.existsSync(issueImage)) {
              callback(null, issueImage)
          } else if (fs.existsSync(verificationDocImage)){
              callback(null, verificationDocImage)
          }
            else if (fs.existsSync(siteImages)){
            callback(null, siteImages)
          }
          else {
              callback(messages.fileNotFound)
          }
      },
      downloadZip : function (ImageName, callback) {
            // //console.log("TESTTTTTTTTTT");

            var zippedFile = path.join('./../angular/builds', ImageName);
            if (fs.existsSync(zippedFile)) {
                callback(null, zippedFile)
            } else {
                callback(messages.fileNotFound)
            }
        },
      capitalizeFirstLetter1: function (string) { // capitalize the first letter of the strings

        var firstname;
        var secondname;
        var name = string.split(' ')

        if (name.length > 1) { // first name and second name both
            var username = "";
            for (var i = 0; i < name.length; i++) {
                ////console.log('name',name[0])
                firstname = name[i].charAt(0).toUpperCase() + name[i].slice(1);
                if (i != 0) {
                    username = username + ' ' + firstname;
                } else {
                    username = firstname;
                }
            }
            return username
        } else if (name.length == 1) { // only first name
            firstname = name[0].charAt(0).toUpperCase() + name[0].slice(1);
            username = firstname;
            return username
        }
    },
    // check the from date is lessthan the to date or not.
    checkFrom_and_ToDates: function (request, reply) {

        var currentTime = new Date(Date()).getTime() / 1000;
        var startTime = request.payload.startTime;
        var endTime = request.payload.endTime;

        if (currentTime > startTime) {
            reply({
                statusCode: 105,
                status: "error",
                message: 'Start time should be greater that the current time.'
            }).takeover();
            ;
        } else if (startTime > endTime) {
            reply({
                statusCode: 105,
                status: "error",
                message: 'start time should be less than the end time.'
            }).takeover();
            ;
        } else
            reply(true);
    },
    //fetch distance from user location
    getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c) * 1000; // Distance in m
        return d;
    },
    uploadMultipleDocuments: function (data, cb) {
        ////console.log("data======",data.user_id,data.file)
        var fileNames = []
        for (var i = 0; i < data.file.length; i++) {
            ////console.log("fileNames= onlu=======", data.file[i].hapi.filename)
            var obj = {}
            var ext = data.file[i].hapi.filename.substr(data.file[i].hapi.filename.lastIndexOf('.') + 1);
            var filename = i + data.user_id + "_" + generateRandomString(4) + Math.floor(Date.now() / 1000) + "." + ext.substr(0, ext.length); // append userid in image name and date
            if (data.type == 1) {
                var dest = path.join('./Assets/', filename); // destination folder to write file
            }
            var a = data.file[i].hapi.filename
            obj['name'] = filename
            obj['original_name'] = a.toLowerCase()
            obj['extension'] = ext
            fileNames.push(obj.name)
            fs.writeFile(dest, data.file[i]['_data']);
        }
        // //console.log("filename multiple=========",fileNames)
        cb(null, fileNames)
    },
    uploadDocument: function (data, cb) { ////console.log("uploadDocument",data);
       if(data.file){
        data.profile_pic = data.file
       }
        if (data && data.file) {
            var ext = data.profile_pic.hapi.filename.substr(data.file.hapi.filename.lastIndexOf('.') + 1);
            var filename = data.user_id + "_" + generateRandomString(8) + "_" + Math.floor(Date.now() / 1000) + "." + ext.substr(0, ext.length); // append userid in image name and date
            if (data.type == 1) {
                var dest = path.join('./Assets/UserImages', filename); // destination folder to write file
            }else if (data.type == 2) {
                var dest = path.join('./Assets/postImages', filename);
            }else if (data.type == 3) {
                var dest = path.join('./Assets/VerificationDocs', filename);
            }else if (data.type == 4) {
                var dest = path.join('./Assets/Csv', filename);
            }else  if (data.type == 5) {
                var dest = path.join('./Assets', filename);
            }////console.log("filename", filename,data.type,dest);
            var a = data.profile_pic.hapi.filename
            fs.writeFile(dest, data.file['_data'], function (err) { // write the stream to file at a dest(path where to be stored)
                if (err) { ////console.log("err", err);
                    cb(messages.fileWriteError)
                } else {
                    // //console.log("Single file upload====", fileNames)
                    cb(null, filename)
                }
            });
        } else {
            cb(messages.fileChooseError)
        }
    },

};


function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
var getOffsetViaLatLong = function (latLongObj, callback) {
    var rawOffset = 0;
    /* Request timezone with location coordinates */
    timezoner.getTimeZone(
        latLongObj[0],
        latLongObj[1],
        function (err, data) {
            if (err) {
                return callback(err)
            } else {
                rawOffset = data.rawOffset;
                rawOffset = rawOffset + data.dstOffset;
                return callback(null, data)
            }
        }, {
            language: 'en',
            //key: "AIzaSyDdlo-rcKhsd2APXiW0Ja37XX2lQivwCPI"
            key: GOOGLE_TIMEZONE_API__KEY
        }
    );
};
var sendSuccess = function (successMsg, data) { ////console.log("successMsg",successMsg);
    successMsg = successMsg || STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode: successMsg.statusCode, message: successMsg.customMessage, data: data || null};

    } else {
        return {statusCode: 200, message: successMsg, data: data || null};

    }
};

function jsonParseStringify(data) {
    return JSON.parse(JSON.stringify(data));
}

function failActionFunctionNew(request, reply, source, error) { ////console.log("++++++++here++++++++");
    var customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation ////console.log("error++++",error);
    return reply(error);
};
var verifyEmailFormat = function (string) {
    return validator.isEmail(string)
};

function generateRandomString(length) {
    var data = "";
    var stringkey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
        data += stringkey.charAt(Math.floor(Math.random() * stringkey.length));

    return data;
}
var sendSuccess = function (successMsg, data) {
    ////console.log("successMsg", successMsg);
    successMsg = successMsg || APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode: successMsg.statusCode, message: successMsg.customMessage, result: data || null};

    } else {
        return {statusCode: 200, message: successMsg, result: data || null};

    }
};
var sendError = function (data) { ////console.log("sadsasa+++++",data.statusCode);
    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) { ////console.log("sadsadsa_if",data);
        var errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        if (data.error) {
            errorToSend.output.payload.error = data.error;
        }
        if (data.name == 'MongoError') {
            return errorToSend.output.payload.error = data.errmsg
        }
        return errorToSend;
    } else { ////console.log("sadsadsa_else",data);
        return data
    }
};
var allowAccessTokenInHeader = function () {
    return Joi.object({'accessToken': Joi.string().trim().required()}).options({allowUnknown: true});
}
var deleteUnnecessaryUserData = function (userObj) {
    userObj = jsonParseStringify(userObj);
    delete userObj['__v'];
    delete userObj['password'];
    //delete userObj['accessToken'];
    delete userObj['emailVerificationToken'];
    delete userObj['passwordResetToken'];
    delete userObj['createdAt'];
    delete userObj['updatedAt'];
    // delete userObj['facebookId'];
    // delete userObj['linkedinId'];
    //delete userObj['isEmailVerified'];
    delete userObj['isPhoneVerified'];
    delete userObj['isActive'];
    delete userObj['isConfirmed'];
    delete userObj['deviceDetail'];
    //delete userObj['appVersion'];
    delete userObj['isDeleted'];
    delete userObj['isSuspended'];
    return userObj;
};

var getTokenFromDB = (request, reply) => { 
    //console.log("request",request)
    ////console.log("getTokenFromDB==init===",request.payload.accessToken);
    //var token = request.payload.accessToken;
    var token = (request.payload != null && (request.payload.accessToken)) ? request.payload.accessToken : ((request.params && request.params.accessToken) ? request.params.accessToken : request.headers['accesstoken']) ? request.headers['accesstoken'] : request.query.accessToken;
    var userData = null; ////console.log("getTokenFromDB==init==token=",token);
    var usertype, userId, criteria;
    ////console.log("getTokenFromDB==init=token=",token);
    async.series([
        (cb) => { ////console.log("init==1");
            jwt.verify(token, Configs.CONSTS.jwtkey, function (err, decoded) { ////console.log("decoded",decoded);
                if (err) return cb(messages.TOKEN_EXIRED);
                userId = decoded.id;
                criteria = {
                    _id: userId,
                    accessToken: token,
                }; ////console.log("asdsa====xxx",err,userId,criteria);
                return cb();
            });
        },
        (cb) => { ////console.log("init==2");
            Services.UserService.getUser(criteria, {}, {lean: true}, function (err, dataAry) { // //console.log('jwt err++++++',criteria,dataAry)
                if (err) return cb(err)
                if (dataAry && dataAry.length == 0) return cb(messages.TOKEN_NOT_VALID);
                userData = dataAry;
                return cb()
            });
        }
    ], (err, result) => { ////console.log("XXXXXX",err);
        if (err) {
            reply(err).takeover(); //reply(sendError(err)).takeover(); //
        } else {
            if (userData && userData._id) {
                userData.id = userData._id;
                userData.type = userType;
            }
            reply({userData: userData}) //return callbackRoute(null,{userData: userData});
        }

    });
};
var getTokenFromDB1 = (request, reply) => { ////console.log("getTokenFromDB==init===");
    //var token = request.payload.accessToken;
    var token = (request.payload != null && (request.payload.accessToken)) ? request.payload.accessToken : ((request.params && request.params.accessToken) ? request.params.accessToken : request.headers['accesstoken']);
    var userData = null;
    var usertype, userId, criteria;
    async.series([
        (cb) => { ////console.log("init==1");
            jwt.verify(token, Configs.CONSTS.jwtkey, function (err, decoded) {
                if (err) return cb(messages.TOKEN_EXIRED);
                userId = decoded.id;
                criteria = {
                    _id: userId,
                    accessToken: token,
                }; ////console.log("asdsa====xxx",err,userId,criteria);
                return cb();
            });
        },
        (cb) => { ////console.log("init==2");
            Services.UserService.getUser(criteria, {}, {lean: true}, function (err, dataAry) { // //console.log('jwt err++++++',criteria,dataAry)
                if (err) return cb(err)
                if (dataAry && dataAry.length == 0) return cb(messages.TOKEN_NOT_VALID);
                userData = dataAry;
                return cb()
            });
        }
    ], (err, result) => { ////console.log("XXXXXX",err);
        if (err) {
            reply(err).takeover(); //reply(sendError(err)).takeover(); //
        } else {
            if (userData && userData._id) {
                userData.id = userData._id;
                userData.type = userType;
            }
            reply({userData: userData}) //return callbackRoute(null,{userData: userData});
        }

    });
};
var bootstrapCategory = (callback) => {
    var adminData1 = [

    ];
    async.eachSeries(adminData1, (Data, InnerCb) => { ////console.log("datanew",Data);
        insertData1(Data, (err, result) => {
            if (err) return InnerCb(err);
            return InnerCb();
        });
    }, (err, result) => {
        if (err) return callback(err);
        return callback();
    }); //return callback();
};

function insertData1(Data, callback) { ////console.log("locatixxxonList_v",adminData);
    var needToCreate = false; ////console.log('sdsadafda', Data.name)
    var categoryobj = {
        name: Data.name.toLowerCase(),
        imageUrl: Data.imageUrl,
        isActive: true
    }
    async.series([
        (cb) => {
            var criteria = {
                name: Data.name.toLowerCase()
            };////console.log("====criteria===", criteria);
            Services.CategoryService.getCategories(criteria, {}, {}, (err, data) => { ////console.log("====data===",data);
                if (err) return cb(err);
                if (data && data.length > 0) {
                    needToCreate = false;
                } else {
                    needToCreate = true;
                }
                return cb()
            })
        },
        (cb) => { ////console.log("needToCreate", needToCreate);
            if (needToCreate) {
                Services.CategoryService.createCategory(categoryobj, function (err, data) { ////console.log("categoryobj",categoryobj)
                    if (err) return cb(err);
                    return cb(null, data)
                })
            } else {
                return cb();
            }
        }
    ], (err, data) => { ////console.log('Bootstrapping finished for ' + categoryobj.name);
        return callback(err, 'Bootstrapping finished' + categoryobj.name)
    })
}

var getAdminTokenFromDB = (request, reply) => { ////console.log("getTokenFromDB==init===");
    //var token = request.payload.accessToken;
    var token = (request.payload != null && (request.payload.accessToken)) ? request.payload.accessToken : ((request.params && request.params.accessToken) ? request.params.accessToken : request.headers['accesstoken']);
    var userData = null;
    var usertype, userId, criteria;
    async.series([
        (cb) => { ////console.log("token",token);
            jwt.verify(token, Configs.CONSTS.jwtkey, function (err, decoded) {
                if (err) return cb(messages.TOKEN_NOT_VALID);
                userId = decoded.id;
                criteria = {
                    _id: userId,
                    accessToken: token,
                    user_type: USER_TYPE.ADMIN

                }; ////console.log("asdsa====xxx",err,userId,criteria);
                return cb();
            });
        },
        (cb) => {
            Services.UserService.getUser(criteria, {}, {lean: true}, function (err, dataAry) { // //console.log('jwt err++++++',criteria,dataAry)
                if (err) return cb(err)
                if (dataAry && dataAry.length == 0) return cb(messages.TOKEN_NOT_VALID);
                userData = dataAry;
                return cb()
            });
        }
    ], (err, result) => { ////console.log("XXXXXX",err);
        if (err) {
            reply(sendError(err)); //reply(sendError(err)).takeover(); //
        } else {
            if (userData && userData._id) {
                userData.id = userData._id;
                userData.type = userType;
            }
            reply({userData: userData}) //return callbackRoute(null,{userData: userData});
        }

    });
};
var getAdminTokenFromDBNew = (request, reply) => { ////console.log("getTokenFromDB==init===",request.query);
    //var token = request.payload.accessToken;
    var token = (request.payload != null && (request.payload.accesstoken)) ? request.payload.accesstoken : ((request.params && request.params.accesstoken) ? request.params.accessToken : request.headers['accesstoken']) ? request.headers['accesstoken'] : request.query.accesstoken;
    var userData = null; ////console.log("getTokenFromDB==init==token=",token);;
    //var userData = null;
    var usertype, userId, criteria;
    async.series([
        (cb) => { ////console.log("token==xxx",token);
            jwt.verify(token, Configs.CONSTS.jwtkey, function (err, decoded) {
                if (err){
                    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    //console.log("err",err);
                    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                    return cb(messages.TOKEN_NOT_VALID);
                }
                userId = decoded.id;
                //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                //console.log(decoded);
                //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                criteria = {
                    _id: userId,
                    accessToken: token,
                    //userType: USER_TYPE.ADMIN
                    userType:{
                        $in:[USER_TYPE.ADMIN,USER_TYPE.AGENT,USER_TYPE.SITE_AGENT]
                    }

                }; ////console.log("asdsa====xxx",err,userId,criteria);
                return cb();
            });
        },
        (cb) => { ////console.log("asdsa====userId",userId);
            Services.UserService.getUser(criteria, {}, {lean: true}, function (err, dataAry) { //console.log('jwt err++++++',criteria,dataAry)
                if (err) return cb(err)
                if (dataAry && dataAry.length == 0) return cb(messages.TOKEN_NOT_VALID);
                userData = dataAry;
                return cb()
            });
        }
    ], (err, result) => { ////console.log("XXXXXX",err);
        if (err) {
            reply(sendError(err)); //reply(sendError(err)).takeover(); //
        } else {
            if (userData && userData._id) {
                userData.id = userData._id;
                userData.type = userType;
            }
            reply({userData: userData}) //return callbackRoute(null,{userData: userData});
        }

    });
};

var bootstrapAdmin = function (callback) {
    var needToCreate = true;
    var siteId;
    var adminData = {
        email: 'ranjeet@matrixmarketers.com',
        password: 'anurag', //'1e7eebb19ca71233686f26a43bbc18a9',
        firstName: 'Ranjeet',
        lastName: 'Gupta',
        phoneNumber:56456418989230,
        countryCode:'+91',
        userType:USER_TYPE.ADMIN
    };
    var agentData = [
        {
         email: 'krishna@devs.matrixmarketers.com',
         password: 'anurag123', //'1e7eebb19ca71233686f26a43bbc18a9',
         firstName: 'krishna',
         lastName: 'kumar',
         phoneNumber:8923496989,
         countryCode:'+91',
         userType:USER_TYPE.ADMIN
         },
         {
             email: 'lakhveer@devs.matrixmarketers.com',
             password: 'anurag', //'1e7eebb19ca71233686f26a43bbc18a9',
             firstName: 'lakhveer',
             lastName: 'Singh',
             phoneNumber:56486419999230,
             countryCode:'+91',
             userType:USER_TYPE.AGENT
         },
         {
             email: 'dalvir@devs.matrixmarketers.com',
             password: 'anurag', //'1e7eebb19ca71233686f26a43bbc18a9',
             firstName: 'dalvir',
             lastName: 'Singh',
             phoneNumber:56486689998230,
             countryCode:'+91',
             userType:USER_TYPE.AGENT
         },
         {
             email: 'ankur@matrixmarketers.com',
             password: 'anurag', //'1e7eebb19ca71233686f26a43bbc18a9',
             firstName: 'ankur',
             lastName: 'M',
             phoneNumber:9983659781,
             countryCode:'+91',
             userType:USER_TYPE.AGENT
         },
    ];
    async.auto({
        checkAdminExistsOrNot:[(cb)=>{
            var criteria = {email:adminData.email}
            Services.UserService.getUser(criteria, {}, {}, function (err, data) {
                if (data && data.length > 0) {
                    siteId = data[0]._id;
                    needToCreate = false;
                }
            return cb()
            })
        }],
        InsertAdmin:['checkAdminExistsOrNot',(ag1,cb)=>{
            if (needToCreate) { //console.log(adminData.email)
                adminData.password = md5(adminData.password);
                //adminData.password = md5(adminData.password);
                Services.UserService.createUser(adminData, function (err, data) { ////console.log("sdsds",err, data)
                    if(err) return cb(err);
                    siteId = data._id;
                    return cb();
                })
            } else {
               return cb();
            }
        }],
        InsertAgent:['InsertAdmin',(ag2,cb)=>{
            agentData.forEach(function (v) {
                insertData(v.email, v , siteId, function (err, result) {
                if (err) return callback(err);
                //return callback();
                });
            });
            return cb();
        }]

    },function(err,result){
        if(err) return callback(err)
        return callback(err)

    })
};

function insertData(email, adminData,siteId,callback) { ////console.log("locatixxxonList_v",adminData);
    var needToCreate = true;
    async.series([function (cb) {
        var criteria = {
            email: email
        };
        Services.UserService.getUser(criteria, {}, {}, function (err, data) {
            if (data && data.length > 0) {
                needToCreate = false;
            }
            cb()
        })
    }, function (cb) { ////console.log("needToCreate", needToCreate);
         if (needToCreate) { 
            ////console.log(adminData.email)
        //     adminData.email = adminData.email.toLowerCase();
        //     adminData.password = md5(adminData.password); //commonFunctions.encryptpassword(adminData.password);
        //     adminData.user_type = adminData.userType
        //     adminData.siteId = siteId;
        //     //console.log("adminData",adminData)
        //     Services.UserService.createUser(adminData, function (err, data) {

        //         if (data){
        //             //console.log('datatatta',data)
        //             var criteria = {
        //                 siteId: siteId
        //             }
        //             Services.UserService.checkDisplayAgent(criteria, (err, result) => {
        //                 //console.log("OUTPUTX:", result)
        //                 //console.log("ERRX:", err)
        //                 if (err) {
        //                     return cb(err);
        //                 } else if (result) {
        //                     //console.log('resultdjdjdjjdjddddddddddddddd------------------------------------',result)
        //                     result.agentsOrder.push(data.siteId);
        //                     Services.UserService.updateDisplayAgent(criteria, { $set: { agentsOrder: result.agentsOrder } }, { new: true }, function (err, data2) {
        //                         if (err) {
        //                             return cb(err);
        //                         } else {
        //                             return cb(err, data)
        //                         }
        //                     });
        //                 } else {

        //                     var payloadData = {
        //                         siteId: siteId
        //                     }
        //                     Services.UserService.createDisplayAgent(payloadData, function (error, addedAgentsOrder) {
        //                         if (error) {
        //                             //.log(err);
        //                             return cb(error);
        //                         } else {
        //                             var value = {
        //                                 statusCode: 200,
        //                                 status: "Agents order Added",
        //                                 data: addedAgentsOrder
        //                             }
        //                             return cb(value);
        //                         }
        //                     });
        //                 }
        //             });                
                        
        //         }
                
        //     })
        cb();
        } else {
            cb();
        }
    }], function (err, data) { ////console.log('Bootstrapping finished for ' + email);
        callback(err, 'Bootstrapping finished' + email)
    })
}

var UpdateMultipleRecords = (model, conditions, update, options, callback) => {
    model.update(conditions, update, options, function (error, result) {
        if (error) { ////console.log("xerrorxx",error);
            //logger.error("update multiple", error);
            return callback(error);
        }
        return callback(null, result);
    })
}
var unsetDeviceToken = function (deviceData, callback) { //UpdateMultipleRecords
    var criteria = {"deviceDetail.device_token": deviceData.device_token};
    var dataToSet = {$unset: {deviceDetail: 1}};
    var options = {multi: true};
    //Services.UserService.updateUser(criteria, dataToSet, options, (err,result)=>{
    UpdateMultipleRecords(Models.users, criteria, dataToSet, options, (err, result) => {
        if (err) return callback(err);
        return callback();
    });
}

var capitalizeFirstLetter = function (string) { ////console.log("capitalizeFirstLetter====string=====",string);

    var firstname;
    var secondname;

    var name = string.split(' ')
    //name = string.split('_')

    if (name.length > 1) { // first name and second name both
        var username = "";
        for (var i = 0; i < name.length; i++) {
            ////console.log('name',name[0])
            firstname = name[i].charAt(0).toUpperCase() + name[i].slice(1);
            if (i != 0) {
                username = username + ' ' + firstname;
            } else {
                username = firstname;
            }
        }
        return username
    } else if (name.length == 1) { // only first name
        firstname = name[0].charAt(0).toUpperCase() + name[0].slice(1);
        username = firstname;
        return username
    }

}

var CheckIsNumberOrNot = function (str) {
    var pattern = new RegExp('^[0-9]+$');
    return pattern.test(str);  // returns a boolean
}
var serverKey = require('../Certificates/tradepeople-48be7-firebase-adminsdk-xircr-1d629191f2.json') //put the generated private key path here
var fcm = new FCM(serverKey)

var sendPushNotification = function (data, callback) {
    //console.log("data in send push notification function", data)


    var payload = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        jobid: data.jobid
    }; ////console.log(data.device_token)
    var notification_obj = {
        to: data.device_token ? data.device_token : 'DEEF6E69C871BE59EE76216C179165FFF2D5BF359F710942D8969512331D67C8',
        data: payload, //some data object (optional).
        notification: { // notification object.
            title: data.title,
            body: data.message,
            sound: "default",
            //badge: "1"
        }
    };

    fcm.send(notification_obj, function (err, response) {
        if (err) {
            //console.log("Something has gone wrong!", err)
            callback(err)
        } else {
            //console.log("\n\n\nSuccessfully sent with response: ", JSON.stringify(response), '\n\n\n')
            callback(null, response)
        }
    })

}

var apnPushNotification = function (data) {
    //console.log('inside push ', data)
    var options = {
        cert: "Certificates/unijob_cert.pem",
        key: "Certificates/unijob_key.pem",
        passphrase: '',
        production: false,
        "gateway": "gateway.push.apple.com"
    }

    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();

    note.topic = "";

// note.sound = "Certificates/ping.aiff";

//*********** message to be sent *************//
    note.alert = data.message;
    note.payload = {};

//******* send notification *******//
    //78d9460270b61019b1f6a94ebe383fcfacc73b39791283bbf7b66bb370806e4e"
    apnProvider.send(note, data.device_token).then(function (result) {
        //console.log("**** INSIDE PUSH NOTIFICATIONS IOS****", JSON.stringify(result));
    });
}
function replaceCharacterInString(str, replaceCharacter, withNewCharacter) { ////console.log("str==",str);
    var strLength = str.length   //var newString = str;
    for (var i = 0; i < strLength; i++) {
        str = str.replace(replaceCharacter, withNewCharacter); ////console.log("xxxxi",i);
    } ////console.log("newString",str,"str",strLength);
    return str;
}
function removeSpecialCharacters(str, withNewCharacter) {
    var replaceCharacter = /[^a-zA-Z ]/g ;
    var strLength = str.length   //var newString = str;
    for (var i = 0; i < strLength; i++) {
        str = str.replace(replaceCharacter, withNewCharacter); ////console.log("xxxxi",i);
    } ////console.log("newString",str,"str",strLength);
    return str;
}
function calculationPrice(price,callback){ //console.log("price",price);
    var adminPrice=0,consumerPrice=0,calculateTwoPercent=0,totalAdminPrice=0;
    calculateTwoPercent = (price*2)/100;  //console.log("calculateTwoPercent",calculateTwoPercent);
    consumerPrice = (price+(price*2)/100).toFixed(2); //console.log("consumerPrice",consumerPrice);
    adminPrice =  ((price-(price - (price*3)/100)).toFixed(2))/1; //console.log("adminPrice",adminPrice);
    totalAdminPrice = (adminPrice+calculateTwoPercent)
    return callback(null,{
        adminPrice:adminPrice,
        consumerPrice:consumerPrice,
        totalAdminPrice:totalAdminPrice,
    })
}

function calculationPrice_old(price,callback){ //console.log("price",price);
    var adminPrice=0,consumerPrice=0,calculateTwoPercent=0,totalAdminPrice=0;
    calculateTwoPercent = (price*2)/100
    consumerPrice = Math.round(price+(price*2)/100);
    adminPrice =  Math.round(price-(price - (price*3)/100));
    totalAdminPrice = Math.round(adminPrice+calculateTwoPercent)
    return callback(null,{
        adminPrice:adminPrice,
        consumerPrice:consumerPrice,
        totalAdminPrice:totalAdminPrice,
    })
}
function stipePricecalculation(price,callback){ //console.log("stipePricecalculation======price",price);
    var x = price
    var y = 100
    var cf = 100
    var z=  x*y;
    var zy= (x * cf) * y / cf ; //console.log("z",z,"cf",cf,zy);
    zy=(zy.toFixed(2))/1;
    return callback(null,{
        stipePrice:zy,
    })
}

function makeDirectory() {

    var staticFolder = ["Assets", "Assets/Images","Assets/UserImages","Assets/postImages","Assets/Csv","Assets/schoolZipDowloads"];

    var task = async.queue(function(path1, callback) {

        fs.mkdir(path.join(__dirname, "../" + path1), "0777", function(err, res) {
            if (err) {
                if (err.code == 'EEXIST') {
                    callback();
                   // //console.log("++++++++++***** Folder Exists *******++++++", path);
                } else {
                    callback();
                    ////console.log("++++++++++***** Folder Create Error *******++++++", err);
                }
            } else {
                callback();
              // //console.log("++++++++++***** Folder Created Successfully *******++++++");
            }
        });

    });

    task.push(staticFolder);

    task.drain = function() {

    };
}


var fetchImagePath = function(ImageName, callback) {

    var profileImage = path.join('./Assets/UserImages', ImageName),
        allImage = path.join('./Assets/Images' + ImageName),
        postImage = path.join('./Assets/postImages', ImageName),
        assetImage = path.join('./Assets', ImageName),
        emailTemplateImage = path.join('./Assets/Images', ImageName);
        //VerificationDocs = path.join('./emailTemplates/img', ImageName); ////console.log("VerificationDocs",VerificationDocs);
    ////console.log("assetImage",assetImage);
    if (fs.existsSync(allImage)) {
        callback(null, allImage)
    }else if (fs.existsSync(profileImage)) {
        callback(null, profileImage)
    }else if (fs.existsSync(postImage)) {
        callback(null, postImage)
    }else if (fs.existsSync(emailTemplateImage)) {
        callback(null, emailTemplateImage)
    }else if (fs.existsSync(assetImage)) {
        callback(null, assetImage)
    }else {
        callback(messages.fileNotFound)
    }
}


var downloadZip = function(ImageName, callback) {
  // var path1 = __dirname + "/../../angular/builds/" + ImageName;
  var path1 = "/home/matrix/2019/angular/builds/" + ImageName;
    // var zippedFile = path.join(, ImageName);
        //VerificationDocs = path.join('./emailTemplates/img', ImageName); ////console.log("VerificationDocs",VerificationDocs);
    ////console.log("assetImage",assetImage);
    // //console.log("__dirname",__dirname);
    //
    // //console.log("zippedFile ::",zippedFile);
    // //console.log('process.cwd() (the directory from which the script file was called): ', process.cwd());
      // process.chdir("./../angular/");
    //console.log("path1 :::",path1);
    if (fs.existsSync(path1)) {
        //console.log('reacging hrer');
        callback(null, path1)
    }else {
        callback(messages.fileNotFound)
    }
}

var bootstrapOfPriceperSqft_ConvertTo_Number = function (callback) {
    var data=[];
    async.auto({
     getAllProperty:[(cb)=>{
        var criteria= {};
        var projection={
            l_pricepersqft:1,
        }
        var options= {
            lean:true,
            //limit:1
        }
        Services.REST_PROPERY_RD_1_Service.getData(criteria,projection, options,function (err, result) {
            if(err) return cb(err);
            data = result;
            return cb();
        })
     }],
     updateData:['getAllProperty',(ag1,OuterCb)=>{

            async.eachSeries(data, (item, InnerCb) => {  ////console.log("item",item);
                var pricepersqft = parseFloat(item.l_pricepersqft);
                var criteria = {
                   _id:item._id
                };
                var dataToSet = {
                    l_pricepersqft: pricepersqft
                }
                Services.REST_PROPERY_RD_1_Service.updateData(criteria,dataToSet, {},function (err, result) {
                    if(err) return InnerCb(err);
                    data = result;
                    return InnerCb();
                }) //

            }, (err, result) => {
               if (err) return OuterCb(err);
               return OuterCb();
            });
     }]
    },(err, result)=> {
        if (err) return callback(err);
        return callback();
    })

};

function makeDirectory_customFolder(FolderName) {

    var staticFolder = [FolderName];

    var task = async.queue(function(path1, callback) {

        fs.mkdir(path.join(__dirname, "../Assets/schoolZipDowloads/" + path1), "0777", function(err, res) {
            if (err) {
                if (err.code == 'EEXIST') {
                    callback();
                   ////console.log("++++++++++***** Folder Exists *******++++++", path);
                } else {
                    callback();
                    ////console.log("++++++++++***** Folder Create Error *******++++++", err);
                }
            } else {
                callback();
              ////console.log("++++++++++***** Folder Created Successfully *******++++++");
            }
        });

    });

    task.push(staticFolder);

    task.drain = function() {

    };
}


var bootstrapDefaultPage = (callback) => {
    var adminData1 = [
        {pageTitle:'Home',routerLink:'',isdefaultNavigation:true},
        {pageTitle:'about',routerLink:'about',isdefaultNavigation:true},
        {pageTitle:'Property Search',routerLink:'searchresult',isdefaultNavigation:true},
        {pageTitle:'Advanced Search',routerLink:'searchresult',isdefaultNavigation:true},
        {pageTitle:'Blog',routerLink:'blog',isdefaultNavigation:true},
        {pageTitle:'Knowledgebase',routerLink:'knowledgebase',isdefaultNavigation:true},
        {pageTitle:'contact',routerLink:'contact',isdefaultNavigation:true},
    ];
    async.eachSeries(adminData1, (item, InnerCb) => { ////console.log("datanew",Data);
        var dataInsert=true
        async.auto({
            checkPageExistsORNot:[(cb)=>{
                var criteria ={
                    pageTitle:item.pageTitle,
                    routerLink:item.routerLink
                }
                Services.FRONTPAGE_SERVICE.getData(criteria,{},{},function (err, result) {
                    if(err) return cb(err);
                    if(result.length>0){
                        dataInsert= false;
                    }
                    return cb();
                })
            }],
            InsertPage:['checkPageExistsORNot',(ag1,cb)=>{
                if(dataInsert==true){ ////console.log("if====");
                    Services.FRONTPAGE_SERVICE.InsertData(item,function (err, data) { ////console.log("sdsds",err, data)
                        if(err) return cb(err);
                        return cb();
                    })
                }else{ ////console.log("else====");
                    return cb();
                }
            }]
        },function(err,result){
            if(err) return InnerCb(err);
            return InnerCb();
        })
    }, (err, result) => {
        if (err) return callback(err);
        return callback();
    });
};
var bootstrapDefaultPageDetail = (callback) => {
    var adminData1 = [
        {title:'Home',routerLink:'',isdefaultNavigation:true},
        {title:'about',routerLink:'about',isdefaultNavigation:true},
        {title:'Property Search',routerLink:'searchresult',isdefaultNavigation:true},
        {title:'Advanced Search',routerLink:'searchresult',isdefaultNavigation:true},
        {title:'Blog',routerLink:'blog',isdefaultNavigation:true},
        {title:'Knowledgebase',routerLink:'knowledgebase',isdefaultNavigation:true},
        {title:'contact',routerLink:'contact',isdefaultNavigation:true},
    ];
    async.eachSeries(adminData1, (item, InnerCb) => { ////console.log("datanew",Data);
        var dataInsert=true
        async.auto({
            checkPageExistsORNot:[(cb)=>{
                var criteria ={
                    title:item.title,
                    //routerLink:item.routerLink
                }
                Services.PageDetailService.getData(criteria,{},{},function (err, result) {
                    if(err) return cb(err);
                    if(result.length>0){
                        dataInsert= false;
                    }
                    return cb();
                })
            }],
            InsertPage:['checkPageExistsORNot',(ag1,cb)=>{
                if(dataInsert==true){ ////console.log("if====");
                    Services.PageDetailService.InsertData(item,function (err, data) { ////console.log("sdsds",err, data)
                        if(err) return cb(err);
                        return cb();
                    })
                }else{ ////console.log("else====");
                    return cb();
                }
            }]
        },function(err,result){
            if(err) return InnerCb(err);
            return InnerCb();
        })
    }, (err, result) => {
        if (err) return callback(err);
        return callback();
    });
};

var bootstrapDefaultLandingPage = function (callback) {
    var needToCreate = true;
    var siteId;

    var LandingPageData = {
       title: 'default Page',
       slug: 'default-Page', //'1e7eebb19ca71233686f26a43bbc18a9',
       isDeleted:true,
       "landingPageForm" : [
            {
                "fieldName" : "name",
                "fieldRequired" : true,
                "isenable" : true,
                "fieldType" : "text",
            },
            {
                "fieldName" : "email",
                "fieldRequired" : true,
                "isenable" : true,
                "fieldType" : "text",
            },
            {
                "fieldName" : "phonenumber",
                "fieldRequired" : true,
                "isenable" : true,
                "fieldType" : "text",
            },
            {
                "fieldName" : "address",
                "fieldRequired" : true,
                "isenable" : true,
                "fieldType" : "text",
            }
        ],
    }
    async.auto({
        checkLandingPageExistsOrNot:[(cb)=>{
            var criteria = {
                title:LandingPageData.title,
                slug:LandingPageData.slug,
                isDeleted:LandingPageData.isDeleted
            }
            Services.PageDetailService.getData(criteria,{},{},function (err, result) {
                if (err) return cb(err);
                if (result && result.length > 0) {
                    needToCreate = false;
                    //console.log("=========DefaultLandingPage======",result[0].PageAutoIncrement);
                }
                return cb();
            });
        }],
        InsertLandingPage:['checkLandingPageExistsOrNot',(ag1,cb)=>{
            if (needToCreate) {
                Services.PageDetailService.InsertData(LandingPageData, function (err, data) {
                    if(err) return cb(err);
                    //console.log("=========DefaultLandingPage======",data.PageAutoIncrement);
                    return cb();
                })
            } else {
               return cb();
            }
        }],
    },function(err,result){
        if(err) return callback(err)
        return callback(err)
    })
};

module.exports.bootstrapOfPriceperSqft_ConvertTo_Number            =  bootstrapOfPriceperSqft_ConvertTo_Number;
module.exports.bootstrapAdmin                =  bootstrapAdmin;
module.exports.getOffsetViaLatLong           =  getOffsetViaLatLong;
module.exports.sendSuccess                   =  sendSuccess;
module.exports.jsonParseStringify            =  jsonParseStringify;
module.exports.failActionFunctionNew         =  failActionFunctionNew;
module.exports.verifyEmailFormat             =  verifyEmailFormat;
module.exports.generateRandomString          =  generateRandomString;
module.exports.sendSuccess                   =  sendSuccess;
module.exports.sendError                     =  sendError;
module.exports.unsetDeviceToken              =  unsetDeviceToken;
module.exports.allowAccessTokenInHeader      =  allowAccessTokenInHeader;
module.exports.deleteUnnecessaryUserData     =  deleteUnnecessaryUserData;
module.exports.getTokenFromDB                =  getTokenFromDB;
module.exports.getAdminTokenFromDB           =  getAdminTokenFromDB;
module.exports.getAdminTokenFromDBNew        =  getAdminTokenFromDBNew;
module.exports.bootstrapCategory             =  bootstrapCategory;
module.exports.UpdateMultipleRecords         =  UpdateMultipleRecords;
module.exports.capitalizeFirstLetter         =  capitalizeFirstLetter;
module.exports.sendPushNotification          =  sendPushNotification;
module.exports.apnPushNotification           =  apnPushNotification;
module.exports.replaceCharacterInString      =  replaceCharacterInString;
module.exports.removeSpecialCharacters       =  removeSpecialCharacters;
module.exports.CheckIsNumberOrNot            =  CheckIsNumberOrNot;
module.exports.calculationPrice              =  calculationPrice;
module.exports.makeDirectory                 =  makeDirectory;
module.exports.stipePricecalculation         =  stipePricecalculation;
module.exports.fetchImagePath                =  fetchImagePath;
module.exports.downloadZip                   =  downloadZip;
module.exports.makeDirectory_customFolder    =  makeDirectory_customFolder;
module.exports.bootstrapDefaultPage          =  bootstrapDefaultPage;
module.exports.bootstrapDefaultPageDetail    =  bootstrapDefaultPageDetail;
module.exports.bootstrapDefaultLandingPage   =  bootstrapDefaultLandingPage;
