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
const POST_STATUS = APP_CONSTANTS.POST_STATUS;
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;
const DBCommonFunction = Utils.DBCommonFunction;
//const paymentController  = require("./paymentController");
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
const PAYMENT_CONTROLLER = require("./paymentController");
const STRIPE_CURRENCY = APP_CONSTANTS.STRIPE_CURRENCY;
var request = require('request');
var utmObj = require('utm-latlng');
const Users = require('./../Models/users');
const SellerLogs = require('./../Models/sellerLogs');
// const RetsProperty = require('./../Models/retsPropertyRD_1');
var utm = new utmObj();
var geolib = require('geolib');
var arraySort = require('array-sort');
//Without Services
const fp_NEW = require('.././Models/featuredProperties');
const property_NEW = require('./../Models/retsPropertyRD_1');
const WHMCS = require('node-whmcs');
var generator = require('generate-password');
//Code Ends Here

/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
var exec = require('child_process').exec;
var zip = require('bestzip');
const async = require('async');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const moment = require('moment');
const Mongoose = require('mongoose');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Path = require('path');
const parse = require('csv-parse');
const csvTojson = require('csvtojson');
var eb = require('easybars');
var uniqid = require('uniqid');

var projection = {
    l_listingid: 1,
    propertyAutoIncrement: 1,
    l_area: 1,
    lm_int1_19: 1,
    lm_int1_4: 1,
    l_askingprice: 1,
    lm_dec_11: 1,
    lo1_organizationname: 1,
    lo1_shortname: 1,
    la3_phonenumber1: 1,
    la1_loginname: 1,
    la1_loginname: 1,
    lm_char10_12: 1,
    lm_char1_36: 1,
    lm_dec_16: 1,
    lm_int2_3: 1,
    lm_int4_2: 1,
    l_remarks: 1,
    lr_remarks22: 1,
    l_pricepersqft: 1,
    lr_remarks22: 1,
    location: 1,
    propertyImages: 1,
    lo1_organizationname: 1,
    l_askingprice: 1,
    l_city: 1, l_state: 1, l_zip: 1,
    l_addressstreet: 1,
    l_addressnumber: 1,
    l_addressunit: 1,
    l_streetdesignationid: 1,
    l_displayid: 1,
    lm_dec_7: 1,
    l_displayid: 1,
    lm_char10_22: 1,
    lm_char1_36: 1,
    lfd_featuresincluded_85: 1,
    lfd_featuresincluded_24: 1,
    lfd_featuresincluded_55: 1,
    lo1_organizationname: 1,
    isDeleted: 1,
    createdAt: 1,
    images_count: 1
};

var emailTimeIntervalArray = [
    { 'id': 1, 'name': '0', 'displayName': 'Immediately' },
    { 'id': 2, 'name': '5', 'displayName': '5 minutes' },
    { 'id': 3, 'name': '10', 'displayName': '10 minutes' },
    { 'id': 4, 'name': '15', 'displayName': '15 minutes' },
    { 'id': 5, 'name': '60', 'displayName': '1 Hour' },
    { 'id': 6, 'name': '120', 'displayName': '2 Hours' },
    { 'id': 7, 'name': '180', 'displayName': '3 Hours' },
    { 'id': 8, 'name': '240', 'displayName': '4 Hours' },
    { 'id': 9, 'name': '300', 'displayName': '5 Hours' },
    { 'id': 10, 'name': '360', 'displayName': '6 Hours' },
    { 'id': 11, 'name': '420', 'displayName': '7 Hour' },
    { 'id': 12, 'name': '480', 'displayName': '8 Hours' },
    { 'id': 13, 'name': '540', 'displayName': '9 Hours' },
    { 'id': 14, 'name': '600', 'displayName': '10 Hours' },
    { 'id': 15, 'name': '660', 'displayName': '11 Hours' },
    { 'id': 16, 'name': '720', 'displayName': '12 Hours' },
    { 'id': 17, 'name': '780', 'displayName': '13 Hour' },
    { 'id': 18, 'name': '840', 'displayName': '14 Hours' },
    { 'id': 19, 'name': '900', 'displayName': '15 Hours' },
    { 'id': 20, 'name': '960', 'displayName': '16 Hours' },
    { 'id': 21, 'name': '1020', 'displayName': '17 Hours' },
    { 'id': 22, 'name': '1080', 'displayName': '18 Hours' },
    { 'id': 23, 'name': '1140', 'displayName': '19 Hour' },
    { 'id': 24, 'name': '1200', 'displayName': '20 Hours' },
    { 'id': 25, 'name': '1260', 'displayName': '21 Hours' },
    { 'id': 26, 'name': '1320', 'displayName': '22 Hours' },
    { 'id': 27, 'name': '1380', 'displayName': '23 Hours' },
    { 'id': 28, 'name': '1440', 'displayName': '1 Day' },
    { 'id': 29, 'name': "2880", 'displayName': '2 Days' },
    { 'id': 30, 'name': "4320", 'displayName': '3 Days' },
    { 'id': 31, 'name': "5760", 'displayName': ' 4 Days' },
    { 'id': 32, 'name': "7200", 'displayName': ' 5 Days' },
    { 'id': 33, 'name': "8640", 'displayName': ' 6 Days' },
    { 'id': 34, 'name': "10080", 'displayName': ' 1 Week' },
    { 'id': 35, 'name': "20160", 'displayName': ' 2 Weeks' },
    { 'id': 36, 'name': "30240", 'displayName': ' 3 Weeks' },
    { 'id': 37, 'name': "43200", 'displayName': ' 1 Month' },
    { 'id': 38, 'name': "86400", 'displayName': ' 2 Months' },
    { 'id': 39, 'name': "129600", 'displayName': ' 3 Months' },
    { 'id': 40, 'name': "172800", 'displayName': ' 4 Months' },
    { 'id': 42, 'name': "216000", 'displayName': ' 5 Months' },
    { 'id': 43, 'name': "259200", 'displayName': ' 6 Months' },
    { 'id': 44, 'name': "302400", 'displayName': ' 7 Months' },
    { 'id': 45, 'name': "345600", 'displayName': ' 8 Months' },
    { 'id': 46, 'name': "388800", 'displayName': ' 9 Months' },
    { 'id': 47, 'name': "432000", 'displayName': ' 10 Months' },
    { 'id': 48, 'name': "475200", 'displayName': ' 11 Months' },
    { 'id': 49, 'name': "525600", 'displayName': ' 1 Year' },
    { 'id': 50, 'name': "568800", 'displayName': ' 13 Months' },
    { 'id': 51, 'name': "612000", 'displayName': ' 14 Months' },
    { 'id': 52, 'name': "655200", 'displayName': ' 15 Months' },
    { 'id': 53, 'name': "698400", 'displayName': ' 16 Months' },
    { 'id': 54, 'name': "741600", 'displayName': ' 17 Months' },
    { 'id': 55, 'name': "784800", 'displayName': ' 18 Months' },
    { 'id': 56, 'name': "828000", 'displayName': ' 19 Months' },
    { 'id': 57, 'name': "871200", 'displayName': ' 20 Months' },
    { 'id': 58, 'name': "914400", 'displayName': ' 21 Months' },
    { 'id': 59, 'name': "957600", 'displayName': ' 22 Months' },
    { 'id': 60, 'name': "1000800", 'displayName': ' 23 Months' },
    { 'id': 61, 'name': "1051200", 'displayName': ' 2 years' },

];





var dealSendReminder = function (payload, callbackRoute) {
    var leadList = [];
    var funnelDetails = [];
    var funnelTemplateData = [];
    var unsubUser = false;
    async.auto({
        getPropertyLeads: [(cb) => {
            var criteria = {
                status: payload.status,
                mlsNumber: payload.mlsNumber,
                leadId: payload._id
            }

            console.log('criteria', criteria)
            Service.propertyDeals.getAllDataWithLeadDetails(criteria, function (err, result) {
                if (err)
                    return cb(err);
                leadList = result;


                return cb();
            });
        }
        ],
        checkDealTemplateExistsAndSendEmail: ['getPropertyLeads', (ag1, OuterCb) => {
            console.log('leadList', leadList)
            var itemData = leadList;
            var sendEmail = false;
            var dealTemplateData = [];
            var emailSendDate = null;
            var userLastEmailsend = false;
            var themeData = {};
            var propertyDetails = {};
            var base64Image;
            async.auto({

                getfunnelTemplate: [(cb1) => {

                    var criteria = {
                        status: itemData[0].status,
                        _id: payload.template_id

                    }

                    Service.dealTemplates.getAllData(criteria, (err, templateData) => {
                        if (err)
                            return cb1(err);

                        funnelTemplateData = templateData
                        console.log("funnel Templates", funnelTemplateData);
                        if (templateData.length > 0) {
                            sendEmail = true;

                        }
                        return cb1();
                    });
                }
                ],
                getPropertyDetails: [
                    'getfunnelTemplate',
                    (ag22, cb) => { //console.log("item===InsertLast===init");

                        var criteria = {
                            l_displayid: itemData[0].mlsNumber
                        }
                        var projection = {
                            l_listingid: 1,
                            propertyAutoIncrement: 1,
                            l_area: 1,
                            lm_int1_19: 1,
                            lm_int1_4: 1,
                            l_askingprice: 1,
                            lm_dec_11: 1,
                            lo1_organizationname: 1,
                            lo1_shortname: 1,
                            la3_phonenumber1: 1,
                            la1_loginname: 1,
                            la1_loginname: 1,
                            lm_char10_12: 1,
                            lm_char1_36: 1,
                            lm_dec_16: 1,
                            lm_int2_3: 1,
                            lm_int4_2: 1,
                            l_remarks: 1,
                            lr_remarks22: 1,
                            l_pricepersqft: 1,
                            lr_remarks22: 1,
                            location: 1,
                            propertyImages: 1,
                            lo1_organizationname: 1,
                            l_askingprice: 1,
                            l_city: 1, l_state: 1, l_zip: 1,
                            l_addressstreet: 1,
                            l_addressnumber: 1,
                            l_addressunit: 1,
                            l_streetdesignationid: 1,
                            l_displayid: 1,
                            lm_dec_7: 1,
                            l_displayid: 1,
                            lm_char10_22: 1,
                            lm_char1_36: 1,
                            lfd_featuresincluded_85: 1,
                            lfd_featuresincluded_24: 1,
                            lfd_featuresincluded_55: 1,
                            lo1_organizationname: 1,
                            isDeleted: 1,
                            createdAt: 1,
                            images_count: 1
                        };
                        var options = { lean: true };
                        Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, function (err, result) {
                            if (err) {
                                return cb(err);
                            } else if (result.length > 0) {
                                propertyDetails = result[0];
                                return cb();
                            } else {
                                console.log("No data found");
                                sendEmail = false;
                                return cb();
                            }
                        });
                    }
                ],
                sendEmailToUser: [
                    'getPropertyDetails', 'getfunnelTemplate',
                    (ag1, cb) => {
                        if (sendEmail) {
                            var theme_Criteria = {
                                siteId: itemData[0].siteId
                            }
                            Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function (err, themeResult) {
                                if (err) {
                                    cb();
                                    console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                                } else if (themeResult.length > 0) {
                                    var messageToSend = eb(funnelTemplateData[0].content, {
                                        SIGNATURE: themeResult[0].signature, firstName: itemData.firstName, LASTNAME: itemData.lastName, EMAIL: itemData.email, PHONE: itemData.phoneNumber, l_listingid: propertyDetails.l_listingid,
                                        propertyAutoIncrement: propertyDetails.propertyAutoIncrement,
                                        l_area: propertyDetails.l_area,
                                        lm_int1_19: propertyDetails.lm_int1_19,
                                        lm_int1_4: propertyDetails.lm_int1_4,
                                        l_askingprice: propertyDetails.l_askingprice,
                                        lm_dec_11: propertyDetails.lm_dec_11,
                                        lo1_organizationname: propertyDetails.lo1_organizationname,
                                        lo1_shortname: propertyDetails.lo1_shortname,
                                        la3_phonenumber1: propertyDetails.la3_phonenumber1,
                                        la1_loginname: propertyDetails.la1_loginname,
                                        la1_loginname: propertyDetails.la1_loginname,
                                        lm_char10_12: propertyDetails.lm_char10_12,
                                        lm_char1_36: propertyDetails.lm_char1_36,
                                        lm_dec_16: propertyDetails.lm_dec_16,
                                        lm_int2_3: propertyDetails.lm_int2_3,
                                        lm_int4_2: propertyDetails.lm_int4_2,
                                        l_remarks: propertyDetails.l_remarks,
                                        lr_remarks22: propertyDetails.lr_remarks22,
                                        l_pricepersqft: propertyDetails.l_pricepersqft,
                                        lr_remarks22: propertyDetails.lr_remarks22,
                                        location: propertyDetails.location,
                                        propertyImages: propertyDetails.propertyImages,
                                        lo1_organizationname: propertyDetails.lo1_organizationname,
                                        l_askingprice: propertyDetails.l_askingprice,
                                        l_city: propertyDetails.l_city, l_state: propertyDetails.l_state, l_zip: propertyDetails.l_zip,
                                        l_addressstreet: propertyDetails.l_addressstreet,
                                        l_addressnumber: propertyDetails.l_addressnumber,
                                        l_addressunit: propertyDetails.l_addressunit,
                                        l_streetdesignationid: propertyDetails.l_streetdesignationid,
                                        l_displayid: propertyDetails.l_displayid,
                                        lm_dec_7: propertyDetails.lm_dec_7,
                                        l_displayid: propertyDetails.l_displayid,
                                        lm_char10_22: propertyDetails.lm_char10_22,
                                        lm_char1_36: propertyDetails.lm_char1_36,
                                        lfd_featuresincluded_85: propertyDetails.lfd_featuresincluded_85,
                                        lfd_featuresincluded_24: propertyDetails.lfd_featuresincluded_24,
                                        lfd_featuresincluded_55: propertyDetails.lfd_featuresincluded_55,
                                        lo1_organizationname: propertyDetails.lo1_organizationname,
                                        isDeleted: propertyDetails.isDeleted,
                                        createdAt: propertyDetails.createdAt,
                                        images_count: propertyDetails.images_count
                                    });


                                    var subject = funnelTemplateData[0].subject;
                                    var email_data = { // set email variables for user
                                        to: itemData.email, // "anurag@devs.matrixmarketers.com",//
                                        from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                        subject: subject,
                                        html: messageToSend
                                    };
                                    Utils.universalfunctions.send_email(email_data, (err, res) => {
                                        if (err)
                                            return cb(err);
                                        return cb();
                                    });
                                } else {
                                    console.log("We were not able to send the email because there is no theme settings found for the user");
                                    cb();
                                }
                            });
                        } else {
                            console.log('we are in else')
                            var messageToSend = eb("We were not able to send the email because the mls number was in correct deals funnel"
                            );

                            var email_data = {
                                to: "savita@matrixmarketers.com",
                                from: "info@matrixmarketers.com",
                                subject: "MLS number not valid",
                                html: messageToSend


                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if (err)
                                    return OuterCb(err);
                                console.log(res)
                                return OuterCb();
                            });
                            // console.log("Email Not Sent ++++++++++++++++++++++++++++++skjdfbjsfbdj");
                            // cb();
                        }
                    }
                ]
            })

        }
        ]
    }, function (err, result) {
        if (err) {
            return callbackRoute(err);
        }
        if (result) {
            var value = {
                "statusCode": 200,
                "status": "success",
                "data": result
            }
            return callbackRoute(value);
        }

    })
}



var crmUserFilter = function (payloadData, UserData, callbackRoute) {
    //  console.log("UserData",UserData.userType);
    var totalRecord = 0;
    var finalData = [];
    var finalData_new = [];
    var criteria = {};
    // console.log(payloadData,"payload")
    // `{"rating":["A","B","C","D","E"],
    // "sourceOfContact":["past_client","open_house","friend","refferal"],
    // "characteristics":["married","near_important_events","kids","pets"],
    // "principalResidence":["Apartment","Townhouse","Detached Home","Duplex"],
    // "assignedFunnel":["_id":"5d1da0470d5ce404c1c05091"],
    // "whenAdded":"last_week","whenAddedInDateFormat":"DD/MM/YYYY"}`

    if (payloadData.rating) {
        criteria.rating = { $in: payloadData.rating }
    }
    if (payloadData.sourceofContact) {
        criteria.sourceofContact = { $in: payloadData.sourceofContact }
    }
    if (payloadData.typeofResidence) {
        criteria.typeofResidence = { $in: payloadData.typeofResidence }
    }
    if (payloadData.assignedFunnel) {

        criteria.funnelId = { $in: payloadData.assignedFunnel }
    }
    if (payloadData.userType) {

        criteria.userType = { $in: payloadData.userType }


    }
    if (payloadData.whenAdded) {
        if (typeof payloadData.whenAdded === 'object') {
            var from = new Date(payloadData.whenAdded.from);
            var to = new Date(payloadData.whenAdded.to)
            criteria.createdAt = { $gte: from, $lte: to }
        }
        else if (typeof payloadData.whenAdded === 'string') {
            var whenAdded = new Date(payloadData.whenAdded)
            criteria.createdAt = { $gte: whenAdded }
        }

    }
    if (payloadData.characteristics) {
        // console.log(payloadData.characteristics,"pppppppppppppppppp")
        if (payloadData.characteristics.includes("pets")) {

            criteria.family = {
                $elemMatch: { relation: "Pets" }
            }
        }
        if (payloadData.characteristics.includes("married")) {
            criteria.family = {
                $elemMatch: { relation: "Spouse" }
            }
        }
        if (payloadData.characteristics.includes("kids")) {
            // criteria.$or = [{'family.$.relation'  : "son"},{'family.$.relation'  : "daughter"}]
            criteria.family = {
                $elemMatch: { relation: "Kids" }
            }
        }
    }


    // console.log('userDatattattatattatatatata',UserData,"00000000000000000",USER_TYPE)
    if (UserData.userType == USER_TYPE.AGENT) {
        criteria.agentId = UserData._id
        criteria.isMovedToCMS = true
    }
    else if (UserData.userType == USER_TYPE.SITE_AGENT) {
        criteria.isMovedToCMS = true
        criteria.siteId = UserData._id
    } else {
        criteria.isMovedToCMS = true
    }

    // console.log('**************************************************', criteria)
    var projection = {
        __v: 0
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'l_askingprice l_addressstreet l_addressnumber l_city l_state l_addressdirection',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "userId",
            match: {},
            select: 'firstName lastName email userType',
            model: 'user',
            options: { lean: true }
        },
        {
            path: "contactDetailId",
            match: {},
            select: 'createdAt',
            model: 'ContactDetail',
            options: {
                lean: true,
                sort: { createdAt: -1 }
            }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    /*ContactFormAutoIncrement:-1*/
                }
            };
            if (payloadData.sortby) {
                if (payloadData.sortby == 'email') {
                    options.sort = {
                        email: -1
                    }
                }
                if (payloadData.sortby == 'name') {
                    options.sort = {
                        firstName: -1
                    }
                }
                if (payloadData.sortby == 'date') {
                    options.sort = {
                        createdAt: -1
                    }
                }
            } else {
                options.sort.createdAt = -1
            };

            // console.log('criteria', criteria)
            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {
                //Service.ContactFormService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = Utils.universalfunctions.jsonParseStringify(data);//data
                // console.log('finalData')
                return cb();
            });
        }],
        // setDataFormat: ['getData', (ag1, cb) => {
        //     finalData.forEach((element) => {
        //         var tempObject = element
        //         if (element.contactDetailId.length > 0) {
        //             tempObject.lastContactDate = element.contactDetailId[0].createdAt;
        //             delete tempObject.contactDetailId;
        //         }

        //         if (!tempObject.phoneNumber) {
        //             tempObject.phoneNumber = "N/A";
        //             //.log("if==", tempObject.phoneNumber);
        //         } else {
        //             //.log("else==", tempObject.phoneNumber);
        //         }
        //         finalData_new.push(tempObject);
        //     })
        //     return cb();
        // }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.ContactFormService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: finalData.length,
            datalist: finalData
        });
    })
}






// Update Family Member Data Or Delete Family member data
var updateGreetingCards = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addLogData: [(cb) => {
            var criteria = {
                _id: payloadData.leadId
            }
            var data = {};
            var dataToSet = {};
            if (payloadData.greetingCards) {
                dataToSet = {
                    $set: { greetingCards: payloadData.greetingCards, newsletter: payloadData.newsletter }
                }
            }
            //.log(dataToSet);

            var options = {
                new: true,
            }
            Service.UserService.updateUser(criteria, dataToSet, options, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


var createUserCrm = function (payloadData, UserData, callback) {
    if (payloadData.profile_pic) {
        payloadData.attachments = payloadData.profile_pic;
    }
    var totalSlug;
    payloadData.attachments = payloadData.profile_pic;
    var ImageUrl;
    async.auto({
        InsertData: [(cb) => {
            if (payloadData.userType == "Buyer" || "Seller" || "Builder" || "Investor" || "Buyer/Seller") {

                var dataToSet = payloadData;
                delete dataToSet.accesstoken;
                delete dataToSet.accesstoken;
                if (payloadData.password) {
                    var password = Utils.universalfunctions.encryptpassword(payloadData.password);  //UniversalFunctions.CryptData(res + res1);
                    dataToSet.password = password;
                }
                if (payloadData.firstName) {
                    dataToSet.first = payloadData.firstName;
                    dataToSet.firstName = payloadData.firstName;
                    totalSlug = payloadData.firstName;
                }
                if (payloadData.lastName) {
                    dataToSet.last = payloadData.lastName;
                    dataToSet.lastName = payloadData.lastName;
                    totalSlug += " " + payloadData.lastName;
                }
                if (payloadData.ContactNumber) {
                    dataToSet.phone = payloadData.ContactNumber;
                    //dataToSet.lastName = payloadData.lastName;
                }
                if (payloadData.profilePicUrl) {
                    dataToSet.profile_pic = payloadData.profilePicUrl
                }
                if (payloadData.siteId) {
                    //.log("HREE1");
                    dataToSet.siteId = payloadData.siteId
                    dataToSet.createdBy = UserData._id
                } else {
                    //.log("HREE");
                    dataToSet.siteId = UserData._id
                }
                var slug = Utils.universalfunctions.removeSpecialCharacters(totalSlug, '');
                slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-');
                dataToSet.slug = slug;
                dataToSet.isEmailVerified = true;
                if (payloadData.type == "crm") {
                    dataToSet.fromCrm = 1,
                        dataToSet.isMovedToCMS = "true"
                }

                Service.UserService.createUser(dataToSet, function (err, result) {  // //.log("createUser======err",err);
                    if (err) return cb(err);
                    agentData = result;
                    return cb();
                });
            }

            // else if(payloadData.clientType == "Seller"){    

            //     this.addHomeWorth(payloadData, function (err, data) {
            //         if (err) return cb(err);
            //         return cb(null,Responses.STATUS_MSG.SUCCESS.CREATED);
            //     });


            // }


        }],

    }, function (err, result) {
        if (err) return callback(err)
        return callback()
    })

}





var login = function (payloadData, userData, CallbackRoute) {
    var returnedData, token, verificationToken, registerSocialId, IsFirstLogin = true;
    var preData;
    var Criteria;
    async.auto({
        verifyEmailAddress: [(cb) => {
            if (!Utils.universalfunctions.verifyEmailFormat(payloadData.email)) return cb(Responses.INVALID_EMAIL);
            return cb();
        }],
        checkSiteId: ['verifyEmailAddress', (r1, cb) => { // //.log("getUserData init", RunQuery)

            var preCriteria2 = {
                _id: payloadData.siteId
            };
            console.log(preCriteria2, "preCriteria2")
            Service.UserService.getUser(preCriteria2, {}, {}, (err, data) => {
                console.log("getUserData", err, data)
                if (err) return cb(err);
                if (data.length == 0) {
                    return cb(Responses.USER_NOT_FOUND);
                }

                else if (data[0].userType == "Admin") {
                     console.log('hieeee1')
                    preData = data[0];
                    return cb();
                }

                else if (data[0].userType != "Admin") {
                     console.log('hieeee2')
                    var preCriteria1 = {
                        email: payloadData.email
                    };
                    Service.UserService.getUser(preCriteria1, {}, {}, (err, userData) => {
                        // console.log("getUserData", err, userData)
                        if (err) return cb(err);
                        if (userData.length == 0) {
                             console.log('hieeee3')
                            return cb(Responses.USER_NOT_FOUND);
                        }
                        else if (userData[0].userType == "Admin") {
                            // console.log('hieeee4')
                            return cb(Responses.INVALID_USER);
                        }
                        else if (userData[0].userType != "Admin") {
                            console.log('hieeee5')
                            preData = userData[0];
                            return cb();
                        }
                    })
                }


            });
        }],
        getPreUserData: ['verifyEmailAddress', 'checkSiteId', (r1, cb) => { //\
             //.log("getUserData init", RunQuery)
            var conditionArray = [];
            var conditionArrayNew = {};
            var password = Utils.universalfunctions.encryptpassword(payloadData.password);
            var preCriteria = {
                email: payloadData.email
            };
            Service.UserService.getUser(preCriteria, {}, {}, (err, data) => {//  //.log("getUserData",err, data)
                if (err) return cb(err);
                if (data.length == 0) return cb(Responses.USER_NOT_FOUND);
                preData = data[0];
                 console.log(password, "RETURNXP:", preData)
                if (password != preData.password) return cb(Responses.INVALID_EMAIL_PASSWORD);
                return cb();
            });
        }],
        getUserData: ['getPreUserData', 'verifyEmailAddress', (r1, cb) => { // //.log("getUserData init", RunQuery)
            var conditionArray = [];
            var conditionArrayNew = {};
            if (preData.userType === USER_TYPE.ADMIN || preData.userType === USER_TYPE.SITE_AGENT) {
                var Criteria = {
                    email: payloadData.email,
                    userType: { $in: [USER_TYPE.ADMIN, USER_TYPE.SITE_AGENT] },
                    // _id: payloadData.siteId   (need to chnage when deploy code) TEMPORARY_SOLUTION
                };
                console.log(Criteria, "Criteria1111")
            } else if (preData.userType === USER_TYPE.AGENT) {
                var Criteria = {
                    email: payloadData.email,
                    // userType: { $in: [USER_TYPE.AGENT] },
                    siteId: payloadData.siteId
                };
                console.log(Criteria, "Criteria")
            } else {
                return cb(Responses.USER_NOT_FOUND);
            }

            //.log("Criteria", Criteria);
            Service.UserService.getUser(Criteria, {}, {}, (err, data) => {//  //.log("getUserData",err, data)
                if (err) return cb(err);
                if (data.length == 0) return cb(Responses.USER_NOT_FOUND);
                returnedData = data[0];
                var password = Utils.universalfunctions.encryptpassword(payloadData.password);
                if (password != returnedData.password) return cb(Responses.INVALID_EMAIL_PASSWORD);
                return cb();
            });
        }],
        setAccesToken: ['getUserData', (r3, cb) => {


            //.log("setAccesToken init")
            var setCriteria = { _id: returnedData._id };
            token = jwt.sign({
                id: returnedData._id,
                email: returnedData.email
                // isEmailVerified : returnedData.isEmailVerified
            }, Configs.CONSTS.jwtkey, { algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '10 days' });
            // //.log("token",  Configs.CONSTS.jwtkey);
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNDg0MTAyMjRlMjhhNDJhODUxNDk4NSIsImVtYWlsIjoiaW5mb0Bzb3V0aHN1cnJleS5jYSIsImlhdCI6MTU3NTUyMTE0OSwiZXhwIjoxNTc1NjkzOTQ5fQ.PqPNfP5gFcg2BkR8z0AMCZCdGvGS0lUr1o86nq3eCBY
            //  var setQuery
            // if (returnedData.accessToken && returnedData.accessToken.length > 0) {
            //     setQuery = {
            //         updatedAt: new Date(),
            //         IsFirstLogin: false,
            //         accessToken: returnedData.accessToken,
            //     };
            // } else {
            var setQuery = {
                updatedAt: new Date(),
                IsFirstLogin: false,
                accessToken: token,
            };
            // }


            Service.UserService.updateUser(setCriteria, setQuery, { new: true }, (err, data) => { // //.log("err, data",err, data);
                if (err) return cb(err)
                returnedData = data;
                returnedData.IsFirstLogin = IsFirstLogin
                return cb(null, data);
            });



        }],
    }, (err, result) => {
        if (err) return CallbackRoute(err);
        return CallbackRoute(null, {
            accessToken: returnedData.accessToken,
            userDetails: Utils.universalfunctions.deleteUnnecessaryUserData(returnedData)
        });
    });
}

//Change password API
var ChangedPassword = function (payloadData, UserData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var token;
    async.auto({
        CheckOldPassword: [(cb) => {
            //.log("payloadData", payloadData);
            if (payloadData.newPassword) {
                if (UserData.password != Utils.universalfunctions.encryptpassword(payloadData.oldPassword)) return cb(Responses.INCORRECT_OLD_PASS)
                if (UserData.password == Utils.universalfunctions.encryptpassword(payloadData.newPassword)) return cb(Responses.SAME_PASSWORD)
                return cb();
            } else {
                return cb();
            }
            //if (UserData.password != Utils.universalfunctions.encryptpassword(payloadData.oldPassword)) return cb(Responses.INCORRECT_OLD_PASS)
            //if (UserData.password == Utils.universalfunctions.encryptpassword(payloadData.newPassword)) return cb(Responses.SAME_PASSWORD)

        }],
        UpdatePassword: ['CheckOldPassword', (r1, cb) => {
            var criteria = { _id: UserData._id };
            var setQuery = payloadData;
            if (payloadData.ContactNumber) {
                setQuery.phone = payloadData.ContactNumber
            }

            /*var setQuery = {
                password: Utils.universalfunctions.encryptpassword(payloadData.newPassword)
            };*/
            if (payloadData.newPassword) {
                setQuery.password = Utils.universalfunctions.encryptpassword(payloadData.newPassword);
            }
            if (payloadData.startHour && payloadData.startMinute && payloadData.endHour && payloadData.endMinute) {
                var workingTime = {
                    startHour: payloadData.startHour,
                    startMinute: payloadData.startMinute,
                    endHour: payloadData.endHour,
                    endMinute: payloadData.endMinute,
                }
                setQuery.workingTime = workingTime
            }
            var options = { lean: true, new: true };
            Service.UserService.updateUser(criteria, setQuery, options, function (err, result) {
                //.log("err===", err);
                if (err) return cb(err);
                return cb(null, result);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(null, result.UpdatePassword);
    });
};

var setFeatured = function (payloadData, UserData, callbackRoute) {
    //.log("payloadData", payloadData);
    var isFeatured = true;
    async.auto({
        getPropertyDetails: [(cb) => {//Check Old Password
            var criteria = { _id: payloadData.PropertyId };
            var projection = {};
            var options = { lean: true };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, function (err, result) {
                if (err) return cb(err);
                if (result.length == 0) return cb(Responses.INVALID_PROPERTY_ID);
                if (result[0].isFeatured == true) {
                    isFeatured = false
                } else {
                    isFeatured = true
                }
                return cb();
            });
        }],
        UpdateProperty: ['getPropertyDetails', (r1, cb) => {
            var criteria = { _id: payloadData.PropertyId };
            var setQuery = {
                isFeatured: isFeatured //payloadData.isFeatured
            }; // //.log("setQuery",criteria);
            var options = { lean: true };
            Service.REST_PROPERY_RD_1_Service.updateData(criteria, setQuery, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};



var updatePost = function (payloadData, UserData, callbackRoute) {
    var location, postImageUrl, returnedDatas;
    // if (payloadData.postImage) {
    //     payloadData.attachments = payloadData.postImage;
    // }
    // payloadData.attachments = payloadData.postImage;
    async.auto({
        checkPostImageLength: [function (cb) {
            if (payloadData.attachments) { // //.log("dasdas");
                if (Array.isArray(payloadData.attachments) == false) {
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                }
                else {
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                }
            }
            cb()
        }],
        uploadPostImage: ['checkPostImageLength', (r1, cb) => {
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: payloadData.postId,//UserData._id,
                    type: 2
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        postImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        postImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],
        UpdatePostDataintoDb: ['uploadPostImage', (r2, cb) => {
            var criteria = {
                _id: payloadData.postId
            }
            var dataToSave = payloadData;
            var slug = Utils.universalfunctions.removeSpecialCharacters(payloadData.title, '');
            slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-'); // //.log("=====slug====",slug);
            if (payloadData.postImage) {
                dataToSave.propertyImages = [payloadData.postImage];
            }
            if (payloadData.status == "Publish") {
                dataToSave.publishedAt = new Date().toISOString();
            }
            dataToSave.slug = slug
            Service.PostService.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var getAllpost = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = { isDeleted: false };
    var projection = {};
    if (UserData.userType != USER_TYPE.ADMIN) {
        criteria = {
            $or: [
                { siteId: UserData._id },
                { globalView: true }
            ],
            isDeleted: false
        }
    };
    //.log("getAllpost===criteria", criteria);
    var populateModel = [
        {
            path: "siteId",
            match: {},
            select: 'lastName firstName first last email',
            model: 'user',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    postAutoIncrement: -1
                }
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.POST, criteria, projection, options, populateModel, (err, data) => {
                //.log("err", err);
                //Service.PostService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        setAuthorName: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                var name = null;
                if (tempData.siteId && tempData.siteId != null) {
                    if (tempData.siteId.firstName) {
                        var name = tempData.siteId.firstName;
                    }
                    tempData.AuthorId = tempData.siteId._id;
                    tempData.AuthorEmail = tempData.siteId.email;
                    tempData.AuthorName = name;
                    delete tempData.siteId;
                } else {
                    tempData.AuthorName = "N/A";
                }
                finalData_new.push(tempData);
            })
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.PostService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: UserData.userType,
            totalRecord: totalRecord,
            postListing: finalData_new
        });
    })
}


var deletepost = function (payloadData, UserData, callbackRoute) {
    //.log("===payloadData===", payloadData)
    var totalRecord = 0;
    var finalData = [];
    var criteria = {};
    var projection = {};
    async.auto({
        deleteData: [(cb) => {
            var criteria = {
                _id: payloadData.postId
            }
            var dataToSave = {
                isDeleted: true
            };
            Service.PostService.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            })
        }],

    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

// var addSchool = function (payloadData, UserData, callbackRoute) {
//
//     async.auto({
//         CreateSchool: [(cb)=> {
//             var dataToSave = {
//                 schoolTitle: payloadData.schoolTitle,
//
//             };
//             Service.SCHOOL_SERVICE.InsertData(dataToSave,function (err, result) {
//                 if (err) return cb(err);
//                 return cb();
//             });
//         }]
//     }, (err, result)=> {
//         if (err) return callbackRoute(err);
//         return callbackRoute();
//     });
// };


var addSchool = function (payloadData, UserData, callbackRoute) {
    var schoolData = [];
    async.auto({
        CreateSchool: [(cb) => {
            var checkLat = 0;
            var checkLong = 0;
            var chec1 = true;
            var j = 0;
            async.each(payloadData.schools, function (item, cb) {
                //.log("----------------------------------------------------------------------");
                var arr = item.coordinates[0];
                var points = [];
                var pointsNew = [];
                for (var i = 0; i < arr.length; i++) {
                    // var wgsResult = converter.toWgs({"coord":{"x":arr[i][0],"y":arr[i][1]},"zone":10,"isSouthern":false });
                    let val = utm.convertUtmToLatLng(arr[i][0], arr[i][1], 10, 'N');
                    //  //.log(val);

                    points.push(val);
                    pointsNew.push([val.lng, val.lat]);

                }

                // cb();
                //.log(points);
                var value = {
                    location: {
                        'type': "Polygon",//LineString //Polygon
                        coordinates: points
                    },
                    location2: {
                        'type': "Polygon",
                        coordinates: [pointsNew]
                    },
                    schoolTitle: item.schoolTitle,
                    displayInNavigation: false
                }

                if (item.schoolType) {
                    value.schoolType = item.schoolType
                }

                if (item.weblink) {
                    value.weblink = item.weblink
                }
                if (item.no_of_parking_spaces) {
                    value.no_of_parking_spaces = item.no_of_parking_spaces
                }
                if (item.status) {
                    value.status = item.status
                }
                if (item.operating_hours) {
                    value.operating_hours = item.operating_hours
                }
                if (item.sq_footage) {
                    value.sq_footage = item.sq_footage
                }
                if (item.facility_type) {
                    value.facility_type = item.facility_type
                }
                if (item.address) {
                    value.address = item.address
                }
                if (item.description) {
                    value.description = item.description
                }
                // //  //.log(value.location2);
                // // return cb();
                Service.SCHOOL_SERVICE.InsertData(value, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });

                // cb();
            }, function (err) {
                if (err) {
                    //.log(err);
                } else {
                    //.log("Execution Done");
                    var val = {
                        "statusCode": 200,
                        "status": "success",
                        "data": "Data saved successfully"
                    }
                    return callbackRoute(val);
                }
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Update School
var updateSchool = function (payloadData, callbackRoute) {
    async.auto({
        updateSchool: [(cb) => {
            var dataToSave = {
                displayInNavigation: payloadData.displayInNavigation
            };
            var options = {
                lean: true
            };
            var criteria = {
                _id: payloadData.schoolId
            }
            Service.SCHOOL_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                if (result) {

                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "Data not found",
                        "data": ""
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    });
};


var getAllSchool = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {};
    var projection = {
        location2: 0,
        _v: 0
    };
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    schoolAutoIncrement: -1
                }
            };
            Service.SCHOOL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.SCHOOL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            schoolListing: finalData
        });
    })
}

var editSchool = function (payloadData, UserData, callbackRoute) {

    async.auto({
        CreateSchool: [(cb) => {
            var dataToSet = {
                schoolTitle: payloadData.schoolTitle
            };
            var criteria = {
                _id: payloadData.schoolId
            };
            Service.SCHOOL_SERVICE.updateData(criteria, dataToSet, {}, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getAllUserWithoutTokenContr = function (payloadData, UserData, callbackRoute) {

    //.log("*********************************************************");

    //.log('User data ', payloadData, UserData);
    // //.log("UserData",UserData.userType);
    var totalRecord = 0;
    var userData = [];
    var finalData = [];
    var criteria = {};
    if (payloadData.userType) {
        if (UserData.userType == USER_TYPE.ADMIN) {

        }
        criteria.userType = payloadData.userType;
        criteria.siteId = payloadData.siteId
    } else {
        criteria.userType = {
            $nin: [USER_TYPE.ADMIN]
        };
        if (UserData.userType == USER_TYPE.AGENT) {
            criteria.siteId = UserData._id
        }
        //criteria.siteId=
    }

    var projection = {
        password: 0,
        emailVerificationToken: 0,
        accessToken: 0,
        forgetpasswordVerifyToken: 0,
        __v: 0,
    };
    var populateModel = [
        {
            path: "LookedPropertiesId",
            match: {},
            select: 'l_askingprice ',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "markfavoriteId",
            match: { IsFavorited: true },
            select: 'PropertyId IsFavorited ',
            model: 'markfavorite',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            if (payloadData.userType) {
                var options = {
                    skip: payloadData.skip,
                    limit: payloadData.limit,
                    lean: true,
                    sort: {
                        firstName: 1
                    }
                };

            } else {
                var options = {
                    skip: payloadData.skip,
                    limit: payloadData.limit,
                    lean: true,
                    sort: {
                        lastVisitedDate: -1
                    }
                };
            }

            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {
                var i = 0;
                //.log('***********Found users*********** ', data);
                async.eachSeries(data, (item, next) => {
                    Models.REST_PROPERY_RD_1.find({ agentId: item._id }, (err1, foundListings) => {
                        if (err1) callback(Responses.systemError);
                        var countListings = foundListings.length;
                        data[i]['propertiesCount'] = countListings;
                        i++;
                        next();
                    })
                }, function (err, response) {
                    if (err) return cb(err);
                    userData = data
                    return cb(null, { criteria: criteria, dt: data });
                });
            });
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.UserService.getUser(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            userListing: userData
        });
    })
}

var getAllUser = function (payloadData, UserData, callbackRoute) {

    //.log("*********************************************************");

    //.log('User data ', payloadData, UserData);
    // //.log("UserData",UserData.userType);
    var totalRecord = 0;
    var userData = [];
    var finalData = [];
    var criteria = {};
    if (payloadData.userType) {
        if (UserData.userType == USER_TYPE.ADMIN) {

        }
        criteria.userType = payloadData.userType;
        criteria.siteId = UserData._id
    } else {
        criteria.userType = {
            $nin: [USER_TYPE.ADMIN]
        };
        if (UserData.userType == USER_TYPE.AGENT) {
            criteria.siteId = UserData._id
        }
    }
    var projection = {
        password: 0,
        emailVerificationToken: 0,
        accessToken: 0,
        forgetpasswordVerifyToken: 0,
        __v: 0,
    };
    var populateModel = [
        {
            path: "LookedPropertiesId",
            match: {},
            select: 'l_askingprice ',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "markfavoriteId",
            match: { IsFavorited: true },
            select: 'PropertyId IsFavorited ',
            model: 'markfavorite',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            if (payloadData.userType) {
                var options = {
                    skip: payloadData.skip,
                    limit: payloadData.limit,
                    lean: true,
                    sort: {
                        firstName: 1
                    }
                };

            } else {
                var options = {
                    skip: payloadData.skip,
                    limit: payloadData.limit,
                    lean: true,
                    sort: {
                        lastVisitedDate: -1
                    }
                };
            }

            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {
                var i = 0;
                async.eachSeries(data, (item, next) => {
                    Models.REST_PROPERY_RD_1.find({ agentId: item._id }, (err1, foundListings) => {
                        if (err1) callback(Responses.systemError);
                        var countListings = foundListings.length;
                        data[i]['propertiesCount'] = countListings;
                        i++;
                        next();
                    })
                }, function (err, response) {
                    if (err) return cb(err);
                    userData = data
                    return cb(null, { criteria: criteria, dt: data });
                });
            });
        }],
        calculataAveragePrice: ['getData', (ag1, cb) => { // finalData
            //userData.forEach
            userData.forEach(function (element) { // //.log("element",element);
                var sum = 0;
                var temp = element;
                //var averagePrice= 0
                if (element.LookedPropertiesId && element.LookedPropertiesId.length > 0) {
                    //var newArray = _.rest(element.LookedPropertiesId,'l_askingprice')
                    var cx = _.forEach(element.LookedPropertiesId, function (regex, key) {
                        sum = sum + regex.l_askingprice;
                    });
                    temp.averagePrice = parseFloat(sum / element.LookedPropertiesId.length);//averagePrice;
                    temp.noOfpropertiesLooked = element.LookedPropertiesId.length;
                    //cb({averagePrice:temp.averagePrice,sum:sum,newArray:newArray})
                } else {
                    temp.averagePrice = 0;
                    temp.noOfpropertiesLooked = 0;
                }
                if (temp.markfavoriteId) {
                    temp.IsFavorited = temp.markfavoriteId.length
                    delete temp.markfavoriteId;
                } else {
                    temp.IsFavorited = 0
                }
                if (temp.LookedPropertiesId) {
                    if (temp.LookedPropertiesId.length > 0) {
                        //.log("asdasd==if");
                        var avgPerVist = temp.LookedPropertiesId.length / temp.countOfVisitingWebsite
                        avgPerVist = parseFloat(avgPerVist.toFixed(2))
                        if (avgPerVist < 1) {
                            avgPerVist = 1
                        }
                        //.log("avgPerVist==if", avgPerVist);
                        temp.averagePropertyPerVisit = avgPerVist
                    } else {
                        temp.averagePropertyPerVisit = 0
                    }
                } else {
                    temp.averagePropertyPerVisit = 0
                }
                finalData.push(temp);
            });
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.UserService.getUser(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            userListing: finalData
        });
    })
}

var getSaveListingOfUser = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = {
        user: payloadData.userId
    };
    if (payloadData.userType) {
        criteria.userType = payloadData.userType;
    } else {
        criteria.userType = {
            $nin: [USER_TYPE.ADMIN]
        };
    }
    var projection = {
        updatedAt: 0,
        createdAt: 0,
        accessToken: 0,
        isDeleted: 0,
        __v: 0,
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'l_displayid l_askingprice l_addressstreet l_addressnumber l_city l_state l_addressdirection',
            model: 'retspropertyrd_1',
            options: { lean: true }
        }
    ];
    /* */
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    schoolAutoIncrement: -1
                }
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.MY_LISTING, criteria, projection, options, populateModel, (err, data) => {
                //Service.MY_LISTING_SERVICE.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = Utils.universalfunctions.jsonParseStringify(data);//data
                return cb(null, finalData);
            });
        }],
        setDataFormat: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element
                var PropertyId = element.PropertyId;
                //.log("PropertyId", PropertyId.l_addressnumber);
                if (PropertyId.l_addressnumber.length > 0) {
                    var newAddress = PropertyId.l_addressnumber + '-' + PropertyId.l_addressstreet + '-' + PropertyId.l_city + '-' + PropertyId.l_state;
                } else {
                    var newAddress = PropertyId.l_addressstreet + '-' + PropertyId.l_city + '-' + PropertyId.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();
                finalData_new.push(tempData);
            })
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.MY_LISTING_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            saveListing: finalData_new
        });
    })
}


var editUserProfile = function (payloadData, UserData, callback) {
    //.log("editConsumerProfile======init");
    if (payloadData.profile_pic) {
        payloadData.attachments = payloadData.profile_pic;
    }
    payloadData.attachments = payloadData.profile_pic;
    var ImageUrl;
    async.auto({
        checkUserId: [(cb) => {
            return cb();
        }],
        checkEmailFormat: [(cb) => {
            if (payloadData.email) {
                if (!Utils.universalfunctions.verifyEmailFormat(payloadData.email)) return cb(Responses.INVALID_EMAIL);
                return cb();
            } else {
                return cb()
            }
        }],
        // checkImageLength:[function (cb) {  //.log("checkImageLength==init");
        //     if (payloadData.attachments) {
        //         if (Array.isArray(payloadData.attachments) == false) {  //.log("checkImageLength==init==if==if");
        //             if (payloadData.attachments['_data'].length > 1048576 * 5) {
        //                 return cb(Responses.fileLengthExceeded);
        //             }
        //             return cb();
        //         }
        //         else {  //.log("checkImageLength==init==if==else");
        //             for (var i = 0; i < payloadData.attachments.length; i++) {
        //                 if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
        //                     return cb(Responses.fileLengthExceeded);
        //                 }
        //             }
        //             return cb();
        //         }
        //     }else{
        //         return cb();
        //     }
        // }],
        // uploadImage:['checkImageLength',(r1,cb)=> {  //.log("uploadImage==init");
        //     if (payloadData.attachments) {
        //         var ImageData = {
        //             file: payloadData.attachments,
        //             user_id: UserData._id,
        //             type: 1
        //         };
        //         if (payloadData.attachments.length >= 0) {
        //             Utils.universalfunctions.uploadMultipleDocuments(ImageData,(err, res)=>{
        //                 if (err) return cb(err)
        //                 ImageUrl = res;
        //                 return cb();
        //             });
        //         }else {
        //             //picData.profile_pic = payloadData.postImage
        //             Utils.universalfunctions.uploadDocument(ImageData,(err, res)=>{
        //                 if (err) return cb(err)
        //                 ImageUrl = res;
        //                 return cb();
        //             });
        //         }
        //     }else {
        //       return  cb()
        //     }
        // }],
        updateData: ['checkEmailFormat', (r1, cb) => {
            var dataToSet = payloadData;
            delete dataToSet.accesstoken;
            var criteria = {
                _id: payloadData.userId
            }
            // if (payloadData.password) {
            //     var password = Utils.universalfunctions.encryptpassword(payloadData.password);  //UniversalFunctions.CryptData(res + res1);
            //     dataToSet.password = password;
            // }
            if (payloadData.firstName) {
                dataToSet.first = payloadData.firstName;
                dataToSet.firstName = payloadData.firstName;
            }
            if (payloadData.lastName) {
                dataToSet.last = payloadData.lastName;
                dataToSet.lastName = payloadData.lastName;
            }
            if (payloadData.phoneNumber) {
                dataToSet.ContactNumber = payloadData.phoneNumber;
                dataToSet.phone = payloadData.phoneNumber;
                dataToSet.phoneNumber = payloadData.phoneNumber;
            }
            if (payloadData.biography) {
                dataToSet.biography = payloadData.biography;
                dataToSet.biography = payloadData.biography;
            }
            if (payloadData.currentpassword) {
                Users.findOne({ _id: payloadData.userId }, function (err, checkresult) {
                    if (checkresult) {
                        console.log(checkresult)
                        if (checkresult.password == Utils.universalfunctions.encryptpassword(payloadData.currentpassword)){
                            dataToSet.password = Utils.universalfunctions.encryptpassword(payloadData.password);
                            console.log( dataToSet.password,"payloadData.password",payloadData.password)
                            Service.UserService.updateUser(criteria, dataToSet, { new: true }, function (err, result) {
                                if (err) return cb(err);
                                return cb();
                            });

                        }else{
                            err = {
                                status: 400,
                                message: "Password not matched"
                            }
                            return cb(err);
                        }
                 } else {
                        err = {
                            status: 400,
                            message: "Invalid userid"
                        }
                        return cb(err);
                    }
    

                })

            } else {
                Service.UserService.updateUser(criteria, dataToSet, { new: true }, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            }
           

        }]

    }, function (err, result) {
        if (err) return callback(err)
        return callback()
    })
}

var getAllContact = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {

    };
    if (UserData.userType == USER_TYPE.AGENT) {
        criteria.assignedTo = UserData._id;
        var projection = {
            __v: 0
        };
    } else {
        var projection = {
            __v: 0
        };
    }
    var projection = {
        __v: 0
    };
    if (payloadData.Type) {
        criteria.formType = payloadData.Type
    }

    //if(payloadData.isMovedToCMS && payloadData.isMovedToCMS==true){
    /*if(payloadData.isMovedToCMS ==true || payloadData.isMovedToCMS ==false){
        criteria.isMovedToCMS = payloadData.isMovedToCMS
    }*/

    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'l_askingprice l_addressstreet l_addressnumber l_city l_state l_addressdirection',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "assignedTo",
            match: {},
            select: 'firstName email lastName',
            model: 'user',
            options: { lean: true }
        },
        {
            path: "userId",
            match: {},
            select: 'firstName email lastName userType',
            model: 'user',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    //ContactFormAutoIncrement:-1
                }
            };
            if (payloadData.sortby) {
                if (payloadData.sortby == 'email') {
                    options.sort = {
                        email: -1
                    }
                }
                if (payloadData.sortby == 'name') {
                    options.sort = {
                        firstName: -1
                    }
                }
                if (payloadData.sortby == 'date') {
                    options.sort = {
                        createdAt: -1
                    }
                }

            } else {
                options.sort.ContactFormAutoIncrement = -1
            }; // //.log("options",options);
            DBCommonFunction.getDataPopulateOneLevel(Models.CONTACTFORM, criteria, projection, options, populateModel, (err, data) => {
                //Service.ContactFormService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                //.log(finalData);
                finalData = Utils.universalfunctions.jsonParseStringify(data);//data
                return cb();
            });
        }],
        setDataForrmat: ['getData', (ag1, cb) => {
            var tempDataArray = []
            finalData.forEach(function (element) {
                var agentId;
                var agentName;
                var agentEmail;


                if (element.assignedTo) {
                    agentId = element.assignedTo._id
                } else {
                    agentId = "N/A"
                }

                if (element.assignedTo && element.assignedTo.firstName) {
                    if (element.assignedTo.lastName) {
                        agentName = element.assignedTo.firstName + ' ' + element.assignedTo.lastName
                    } else {
                        agentName = element.assignedTo.firstName
                    }

                } else {
                    agentName = "N/A"
                }

                if (element.assignedTo && element.assignedTo.firstName) {
                    agentEmail = element.assignedTo.email
                } else {
                    agentEmail = "N/A"
                }
                delete element.assignedTo
                element.assignedTo = agentId
                element.agentName = agentName
                element.agentEmail = agentEmail
                if (element.userType == "Member") {
                    if (element.userId && element.userId.firstName) {
                        element.firstName = element.userId.firstName
                    }
                    if (element.userId && element.userId.lastName) {
                        element.lastName = element.userId.lastName
                    }
                }
                if (element.userId) {
                    if (element.userId != null) {
                        element.userType = element.userId.userType
                    } else {
                        element.userType = USER_TYPE.BUYER
                    }
                } else {
                    if (element.formType === "homeworth") {
                        element.userType = "Seller"
                    } else {
                        element.userType = USER_TYPE.BUYER
                    }

                }

                tempDataArray.push(element);
            })
            finalData = tempDataArray;
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.ContactFormService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            userType: UserData.userType,
            datalist: finalData
        });
    })
}


var ProfileUpload = function (payloadData, UserData, callback) {
    //.log("ProfileUpload======init", payloadData.userId);
    if (payloadData.profile_pic) {
        payloadData.attachments = payloadData.profile_pic;
    }
    payloadData.attachments = payloadData.profile_pic;
    var ImageUrl;
    async.auto({
        checkUserId: [(cb) => {
            return cb();
        }],
        checkEmailFormat: [(cb) => {
            if (payloadData.email) {
                if (!Utils.universalfunctions.verifyEmailFormat(payloadData.email)) return cb(Responses.INVALID_EMAIL);
                return cb();
            } else {
                return cb()
            }
        }],
        checkImageLength: [function (cb) {
            //.log("checkImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    //.log("checkImageLength==init==if==if");
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                    return cb();
                }
                else {
                    //.log("checkImageLength==init==if==else");
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                    return cb();
                }
            } else {
                return cb();
            }
        }],
        uploadImage: ['checkImageLength', (r1, cb) => {
            //.log("uploadImage==init");
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: payloadData.userId,//UserData._id,
                    type: 1
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],

    }, function (err, result) {
        if (err) return callback(err)
        return callback(null, {
            ImageUrl: ImageUrl
        })
    })
}

// var userDetail =  function (payloadData,callbackRoute) {
//     var criteria= {
//         _id:payloadData.userId
//     };
//
//     var projection={
//         password:0,
//         emailVerificationToken:0,
//         accessToken:0,
//         forgetpasswordVerifyToken:0,
//         __v:0,
//     };
//     var populateModel = [
//         {
//             path: "LookedPropertiesId",
//             match: {},
//             select: 'l_askingprice ',
//             model: 'retspropertyrd_1',
//             options: {lean: true}
//         }
//     ];
//     var options= {
//         lean:true,
//     };
//
//     DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {  //.log("errr",err);
//         if (err)  return callbackRoute(err);
//         return callbackRoute(null,data[0]);
//     });
// }

var userDetail = function (payloadData, callbackRoute) {

    //.log("*********************************************************");

    //.log('User data ', payloadData);
    // //.log("UserData",UserData.userType);

    var userData = {};
    var propertyData = [];
    var propertyData2 = [];
    var finalData = {};
    var criteria = {
        _id: payloadData.userId
    };

    var projection = {
        password: 0,
        emailVerificationToken: 0,
        accessToken: 0,
        forgetpasswordVerifyToken: 0,
        __v: 0,
    };
    var populateModel = [
        {
            path: "LookedPropertiesId",
            match: {},
            select: 'l_askingprice ',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "markfavoriteId",
            match: { IsFavorited: true },
            select: 'PropertyId IsFavorited',
            model: 'markfavorite',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, { lean: true }, populateModel, (err, data) => {

                Models.REST_PROPERY_RD_1.find({ agentId: data[0]._id }, (err1, foundListings) => {
                    if (err1) callback(Responses.systemError);
                    propertyData = foundListings
                    var countListings = foundListings.length;
                    data[0]['propertiesCount'] = countListings;
                    userData = data[0];
                    //  //.log("USER DATA",userData);
                    return cb();
                })

            });
        }],
        calculataAveragePrice: ['getData', (ag1, cb) => { // finalData
            var sum = 0;
            var temp = userData;
            //var averagePrice= 0
            if (userData.LookedPropertiesId && userData.LookedPropertiesId.length > 0) {
                //var newArray = _.rest(element.LookedPropertiesId,'l_askingprice')
                var cx = _.forEach(userData.LookedPropertiesId, function (regex, key) {
                    sum = sum + regex.l_askingprice;
                    //  //.log("SUm",sum);
                });
                temp.averagePrice = parseFloat(sum / userData.LookedPropertiesId.length);//averagePrice;
                temp.noOfpropertiesLooked = userData.LookedPropertiesId.length;
                //cb({averagePrice:temp.averagePrice,sum:sum,newArray:newArray})
            } else {
                temp.averagePrice = 0;
                temp.noOfpropertiesLooked = 0;
            }
            if (temp.markfavoriteId) {
                temp.IsFavorited = temp.markfavoriteId.length
                delete temp.markfavoriteId;
            } else {
                temp.IsFavorited = 0
            }
            if (temp.LookedPropertiesId) {
                if (temp.LookedPropertiesId.length > 0) {
                    //.log("asdasd==if");
                    var avgPerVist = temp.LookedPropertiesId.length / temp.countOfVisitingWebsite
                    avgPerVist = parseFloat(avgPerVist.toFixed(2))
                    if (avgPerVist < 1) {
                        avgPerVist = 1
                    }
                    //.log("avgPerVist==if", avgPerVist);
                    temp.averagePropertyPerVisit = avgPerVist
                } else {
                    temp.averagePropertyPerVisit = 0
                }
            } else {
                temp.averagePropertyPerVisit = 0
            }
            finalData = temp;

            return cb();
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userListing: finalData
        });
    })
}


var agentDetails = function (payloadData, callbackRoute) {

    //.log(' payloadData ', payloadData);

    var criteria = {
        slug: payloadData.slug,
        userAutoIncrement: payloadData.id
    };

    var projection = {
        password: 0,
        emailVerificationToken: 0,
        accessToken: 0,
        forgetpasswordVerifyToken: 0,
        __v: 0,
    };

    var options = {
        lean: true,
    };

    Models.users.findOne(criteria, projection, options, (err, foundUser) => {
        if (err) return callbackRoute(err);
        //.log(' user found ', foundUser);

        Models.REST_PROPERY_RD_1.find({ agentId: foundUser._id }, (err1, foundListings) => {
            if (err1) return callbackRoute(err1);

            var dataToReturn = {
                'agentDetails': foundUser,
                'agentProperties': foundListings
            }
            return callbackRoute(null, dataToReturn);
        })
    });

}


var PostImageUpload = function (payloadData, UserData, callback) {
    //.log("ProfileUpload======init", payloadData);
    if (payloadData.profile_pic) {
        payloadData.attachments = payloadData.profile_pic;
    }
    payloadData.attachments = payloadData.profile_pic;
    var ImageUrl;
    async.auto({
        checkUserId: [(cb) => {
            return cb();
        }],
        checkEmailFormat: [(cb) => {
            if (payloadData.email) {
                if (!Utils.universalfunctions.verifyEmailFormat(payloadData.email)) return cb(Responses.INVALID_EMAIL);
                return cb();
            } else {
                return cb()
            }
        }],
        checkImageLength: [function (cb) {
            //.log("checkImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    //.log("checkImageLength==init==if==if");
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                    return cb();
                }
                else {
                    //.log("checkImageLength==init==if==else");
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                    return cb();
                }
            } else {
                return cb();
            }
        }],
        uploadImage: ['checkImageLength', (r1, cb) => {
            //.log("uploadImage==init");
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: payloadData.userId,//UserData._id,
                    type: 1
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],

    }, function (err, result) {
        if (err) return callback(err)
        return callback(null, {
            ImageUrl: ImageUrl
        })
    })
}

var CretePost_old = function (payloadData, UserData, callbackRoute) {
    //.log("editConsumerProfile======init");
    var location, postImageUrl, returnedDatas;
    if (payloadData.postImage) {
        payloadData.attachments = payloadData.postImage;
    }
    payloadData.attachments = payloadData.postImage;

    async.auto({
        checkPostImageLength: [function (cb) {
            //.log("checkPostImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                }
                else {
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                }
            }
            cb()
        }],
        uploadPostImage: ['checkPostImageLength', (r1, cb) => {
            //.log("uploadPostImage==init");
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: UserData._id,
                    type: 2
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        postImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        postImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],
        InsertPostDataintoDb: ['uploadPostImage', (r2, cb) => {
            //.log("InsertPostDataintoDb==init");
            var dataToSave = payloadData;
            if (payloadData.postImage) {
                dataToSave.propertyImages = [postImageUrl];
            }
            var slug = Utils.universalfunctions.removeSpecialCharacters(payloadData.title, '');
            slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-');
            if (payloadData.status == POST_STATUS.PUBLISH) {
                dataToSave.publishedAt = new Date().toISOString();
            }
            dataToSave.slug = slug;
            Service.PostService.InsertData(dataToSave, function (err, result) {
                //.log("InsertPostDataintoDb==err", err);
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var CretePost = function (payloadData, UserData, callbackRoute) {
    //.log("editConsumerProfile======init", payloadData);
    var location, postImageUrl, returnedDatas;

    async.auto({
        checkPostImageLength: [function (cb) {
            //.log("checkPostImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                }
                else {
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                }
            }
            cb()
        }],
        uploadPostImage: ['checkPostImageLength', (r1, cb) => {
            //.log("uploadPostImage==init");
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: UserData._id,
                    type: 2
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        postImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        postImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],
        InsertPostDataintoDb: ['uploadPostImage', (r2, cb) => {
            //.log("InsertPostDataintoDb==init");
            var dataToSave = payloadData;
            if (payloadData.postImage) {
                dataToSave.propertyImages = [payloadData.postImage];
            }
            if (payloadData.siteId) {
                dataToSave.siteId = payloadData.siteId
                dataToSave.createdBy = UserData._id
            } else {
                dataToSave.siteId = UserData._id
            }

            var slug = Utils.universalfunctions.removeSpecialCharacters(payloadData.title, '');
            slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-');
            if (payloadData.status == POST_STATUS.PUBLISH) {
                dataToSave.publishedAt = new Date().toISOString();
            }
            dataToSave.slug = slug;
            Service.PostService.InsertData(dataToSave, function (err, result) {
                //.log("CretePost======InsertPostDataintoDb==err====", err);
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var createBuild = function (agentData) {
    //.log("Agent Data in the Create Build function", agentData);
    var production_live = true;
    var production_local = false;
    var agentIdLive = agentData._id;
    var facebookAppId = agentData.facebookAppId;
    var baseUrl = agentData.baseUrl;
    var facebookPixelId = agentData.facebookPixelId;

    var prod_environment = `export const environment={ production: ${production_live},apiBaseUrl: "http://api.citruscow.com",agentIdLive: "${agentIdLive}",facebookAppId: "${facebookAppId}",baseUrl: "${baseUrl}",facebookPixelId: "${facebookPixelId}",s3ImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/image{{count}}.jpeg",s3ThumbImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/thumb_image{{count}}.jpeg",appTitle: "UAT"};`

    var environment = `export const environment={ production: ${production_local},apiBaseUrl: "http://api.citruscow.com",agentIdLive: "${agentIdLive}",facebookAppId: "${facebookAppId}",baseUrl: "${baseUrl}",facebookPixelId: "${facebookPixelId}",s3ImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/image{{count}}.jpeg",s3ThumbImageUrl: "https://s3.ca-central-1.amazonaws.com/citruscow-canada/FVREB/{{mslno}}/thumb_image{{count}}.jpeg",appTitle: "UAT"};`


    console.log(__dirname);
    console.log(__filename);

    var pathToFile1 = '/var/www/html/angular/src/environments/environment.prod.ts';
    var pathToFile2 = '/var/www/html/angular/src/environments/environment.ts'
    var destinationPath = `/angular/${agentIdLive}.zip`;
    console.log("Reached here 1 : starting to change the prod file");
    fs.writeFile(pathToFile1, prod_environment, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Reached here 2 : Prod file1 change successfully. Moving on to change prod file 2 ");
            fs.writeFile(pathToFile2, environment, (err2, data2) => {
                if (err) {
                    console.log(err);
                } else {
                    // Creating The Build
                    console.log("Reached here 3 : Prod file 2 changed successfully. Moving on to change the directory");
                    process.chdir("/var/www/html/angular/");
                    console.log("Reached here 4 : starting the process of creating build");
                    // var child = exec('pwd',function (error, stdout, stderr) {
                    var child = exec('npm run build:ssr', { maxBuffer: 1024 * 2048 }, function (error, stdout, stderr) {
                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        // `/angular/${agentIdLive}.zip`
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        } else {
                            console.log("Reached here 5 : Starting with creating Zip file");
                            zip({
                                source: "dist",
                                destination: "dist.zip"
                            }).then(function () {
                                console.log('all done!');

                                const ftp = require("basic-ftp")
                                const fs = require("fs")

                                example()

                                async function example() {
                                    const client = new ftp.Client()
                                    client.ftp.verbose = true
                                    try {
                                        await client.access({
                                            host: "192.228.108.253",
                                            port: 21,
                                            user: agentData.serviceusername,
                                            password: agentData.servicepassword
                                        })
                                        console.log(await client.list())
                                        await client.uploadDir('/var/www/html/angular/dist', 'public_html')

                                        var email_data = {
                                            to: 'savita@matrixmarketers.com',
                                            cc: 'savita@matrixmarketers.com',
                                            from: agentData.email,
                                            subject: 'Welcome - site has been uploaded' + agentData.domain,

                                        };

                                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                                            if (err) {
                                                console.log("error")
                                            }
                                            else {
                                                console.log("success site has been uploaded");
                                            }

                                        });
                                        // await client.upload(fs.createReadStream("README.md"), "README.md")
                                    }
                                    catch (err) {
                                        console.log(err)
                                    }
                                    client.close()
                                }
                                console.log("Reached here 6 : Starting the process of changing file name");

                                var fileName = agentIdLive + ".zip"

                                // var child2 = exec(`mv dist.zip ../../Assets/${agentIdLive}.zip`,function (error, stdout, stderr) {
                                //      //.log('stdout: ' + stdout);
                                //      //.log('stderr: ' + stderr);
                                //     if (error !== null) {
                                //        //.log('exec error: ' + error);
                                //     }else{
                                var pathtoSave = Configs.CONSTS.apiBaseUrl + fileName
                                var dataToSet = {
                                    "buildPath": pathtoSave
                                }
                                //.log("data To Set Value is : ", dataToSet);

                                var criteria = {
                                    _id: agentIdLive
                                }
                                var options = {
                                    new: true
                                }
                                Service.UserService.updateUser(criteria, dataToSet, options, function (err, result) {  // //.log("createUser======err",err);
                                    //.log(err);
                                    //.log(result);
                                    if (err) return cb(err);
                                    if (result) {
                                        console.log("Path added successfully");
                                    } else {
                                        console.log("Something went wront while adding path");
                                    }
                                });
                                // }
                                // });
                            }).catch(function (err) {
                                //.log("reaching here !!! SOmething went wrong");
                                //.error(err.stack);
                                process.exit(1);
                            });
                        }
                    });
                    //Creating the Build function ends here
                }
            });
        }
    });
}

var createUser = function (payloadData, UserData, callback) { // //.log("createUser======init");
    var agentData = {};
    var siteId;
    if (payloadData.profile_pic) {
        payloadData.attachments = payloadData.profile_pic;
    }

    var totalSlug;

    payloadData.attachments = payloadData.profile_pic;
    var ImageUrl;
    async.auto({
        InsertData: [(cb) => {
            var dataToSet = payloadData;
            delete dataToSet.accesstoken;

            // else{
            if (payloadData.password) {
                var password = Utils.universalfunctions.encryptpassword(payloadData.password);  //UniversalFunctions.CryptData(res + res1);
                dataToSet.password = password;
            }
            if (payloadData.firstName) {
                dataToSet.first = payloadData.firstName;
                dataToSet.firstName = payloadData.firstName;
                totalSlug = payloadData.firstName;
            }
            if (payloadData.lastName) {
                dataToSet.last = payloadData.lastName;
                dataToSet.lastName = payloadData.lastName;
                totalSlug += " " + payloadData.lastName;
            }
            if (payloadData.ContactNumber) {
                dataToSet.phone = payloadData.ContactNumber;
                //dataToSet.lastName = payloadData.lastName;
            }
            if (payloadData.profilePicUrl) {
                dataToSet.profile_pic = payloadData.profilePicUrl
            }

            if (payloadData.siteId) {
                //.log("HREE1");
                dataToSet.siteId = payloadData.siteId
                dataToSet.createdBy = UserData._id
            } else {
                //.log("HREE");
                dataToSet.siteId = UserData._id
            }
            if (payloadData.userType == 'SITE_AGENT') {

                dataToSet.password = "";
            }
            // }

            var slug = Utils.universalfunctions.removeSpecialCharacters(totalSlug, '');
            slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-');
            dataToSet.slug = slug;
            dataToSet.isEmailVerified = true;


            Service.UserService.createUser(dataToSet, function (err, result) {  // //.log("createUser======err",err);
                if (err) return cb(err);
                agentData = result;
                return cb();
            });
        }],
        // Addingdataindisplayagents: ['InsertData', (r1, cb) => {
        //     //var dataToSet= agentData._id;
        //     if (payloadData.userType === "Agent") {
        //         var criteria = {
        //             siteId: agentData.siteId
        //         }

        //         //.log("CRITERIA WILL BE PRINTED HERE", criteria);
        //         Service.UserService.checkDisplayAgent(criteria, (err, result) => {
        //             if (err) {
        //                 //.log(err);
        //                 return cb(err);
        //             } else if (result) {
        //                 //  //.log("RESULT IS PRINTED HERE:",result.agentsOrder);
        //                 result.agentsOrder.push(agentData._id);
        //                 //  //.log("RESULY IS PRINTED HERE:",result);
        //                 //  //.log("RESULT IS PRINTED HERE:",result.agentsOrder);
        //                 Service.UserService.updateDisplayAgent(criteria, { $set: { agentsOrder: result.agentsOrder } }, { new: true }, function (error, updatedAgentsOrder) {
        //                     if (error) {
        //                         //.log(err);
        //                         return cb(err);
        //                     } else {
        //                         var value = {
        //                             statusCode: 200,
        //                             status: "Agents order updated",
        //                             data: updatedAgentsOrder
        //                         }
        //                         //.log(value);
        //                         return cb();
        //                     }
        //                 });
        //             } else {
        //                 var dd = [];
        //                 dd.push(agentData._id)
        //                 var dataToSet = {
        //                     siteId: agentData.siteId,
        //                     agentsOrder: dd
        //                 }
        //                 Service.UserService.createDisplayAgent(dataToSet, function (error, addedAgentsOrder) {
        //                     if (error) {
        //                         //.log(err);
        //                         return cb(err);
        //                     } else {

        //                         var value = {
        //                             statusCode: 200,
        //                             status: "Agents order Added",
        //                             data: addedAgentsOrder
        //                         }
        //                         //.log(value);
        //                         // callback(value)
        //                         return cb();
        //                     }
        //                 });
        //             }
        //         });
        //     } else {
        //         return cb();
        //     }
        // }],

        // create build previous function start
        // createBuild: ['InsertData', (r1, cb) => {
        //     if (payloadData.userType === "SITE_AGENT") {
        //         console.log('we are in create build')
        //         createBuild(agentData);
        //         return cb();
        //     } else {
        //         return cb();
        //     }
        // }],
        // create build previous function end


        //         createBuild: ['InsertData', (r1, cb) => {
        //             if (payloadData.userType === "SITE_AGENT") {
        //                 const fs = require('fs');  
        // const child_process = require('child_process');  
        //    var worker_process = child_process.fork("/home/chetannarang/chetan_nodejs/test/myapp/child.js", [agentData]);    
        //   worker_process.on('close', function (code) {  
        //       console.log('child process exited with code ' + code);  
        //    });  

        //                 //createBuild(agentData);
        //                 return cb();
        //             } else {
        //                 return cb();
        //             }
        //         }],



        whmcs: ['InsertData', (r1, cb) => {
            if (payloadData.userType === "SITE_AGENT") {
                console.log('agentDtat', agentData)

                // createBuild(agentData);
                // return cb();

                const whmcsClient = new WHMCS({
                    host: 'clients.citruscow.com', //dont include http/https.
                    identifier: '6OIgbEh0tOlubCFjyJBpBeiM69GZL4BA',
                    secret: 'R5xgMoj4beRNFpD1L7oZxISEnN1df2Km'
                    //endpoint: 'includes/api.php', //only required if you changed the api.php location
                });
                //console.log('agentData',agentData)

                /* create client */
                whmcsClient
                    .add('Client', {
                        firstname: agentData.firstName,
                        lastname: agentData.lastName,
                        email: agentData.email,
                        address1: 'Sunny Meadows',
                        city: 'Brampton',
                        state: 'Toronto',
                        postcode: '10010',
                        country: 'CA',
                        phonenumber: agentData.phone,
                        password2: agentData.password,
                        currency: '2'
                    })
                    .then(function (client) {

                        var products_ids = ['7'];

                        whmcsClient
                            .add('Order', {
                                clientid: client.clientid,
                                paymentmethod: 'stripe',
                                pid: products_ids,
                                promocode: '100PERCENTOFF',
                            })
                            .then(function (order) {
                                console.log('order', order)
                                /** Add service to client */
                                var productids = order.productids;

                                whmcsClient.update('ClientProduct', {
                                    serviceid: productids,
                                    domain: agentData.domain,
                                    serviceusername: agentData.serviceusername,
                                    servicepassword: agentData.servicepassword,
                                    status: 'Active'
                                }).then(function (updatedClient) {

                                    console.log(' updated client', updatedClient);

                                    /** Accept order */

                                    whmcsClient.call('AcceptOrder', {
                                        orderid: order.orderid,
                                    }).then(function (acceptedOrder) {
                                        console.log(' order accepted', acceptedOrder);
                                        //  return cb(acceptedOrder)
                                        whmcsClient.call('ModuleCreate', {
                                            serviceid: updatedClient.serviceid,
                                        }).then(function (acceptedOrder) {
                                            console.log(' order accepted2', acceptedOrder);
                                            if (acceptedOrder.result == 'error') {
                                                return cb(acceptedOrder.message);
                                            }
                                            else {
                                                createBuild(agentData);
                                                return cb();
                                            }
                                        });
                                    });
                                });

                            }).catch(err => console.log('ERROR:', err));

                        console.log('client response ', client);

                    }).catch(err => console.log('ERROR:', err));



            } else {
                return cb();
            }
        }],


    }, function (err, result) {
        if (err) return callback(err)
        return callback()
    })
}


var moveLeadToCrm = function (payloadData, UserData, callbackRoute) {  //moveLeadToCrm
    var leadData = {}
    var userData = {}
    var query = "Insert";
    async.auto({
        getLeadData: [(cb) => {
            var projection = {
                message: 0,
                isRead: 0,
                isDeleted: 0,
                createdAt: 0,
                __v: 0,
            };
            var options = { lean: true };
            var criteria = {
                _id: payloadData.leadlId
            };
            Service.ContactFormService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                leadData = data[0];//data
                return cb(null, leadData);
            });
        }],
        checkUserExistsORNot: ['getLeadData', (ag1, cb) => {
            var criteria = {
                email: leadData.email
            };
            var options = { lean: true };
            var projection = {
                _id: 1,
                email: 1
            }
            Service.CRM_USER_DATA_SERVICE.getData(criteria, projection, options, function (err, result) { // //.log("InsertData, result",err, result);
                if (err) return cb(err);
                if (result.length > 0) {
                    userData = result[0];
                    query = "update"
                }

                return cb();
            });
        }],
        InsertData: ['checkUserExistsORNot', (ag2, cb) => { // //.log("InsertData==init");
            if (query == "Insert") {
                var dataToSave = leadData;
                dataToSave.ContactId = payloadData.leadlId;
                delete dataToSave._id;
                Service.CRM_USER_DATA_SERVICE.InsertData(dataToSave, function (err, result) { // //.log("InsertData, result",err, result);
                    if (err) return cb(err);
                    userData = result;
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        /*addTosetPropertyId:['checkUserExistsORNot',(ag3,cb)=>{
             if(query=="update"){
                 var criteria= {_id:userData._id}
                 var setQuery = {
                    $addToSet: {
                        ContactId: leadData._id
                    }
                }

                if(leadData.PropertyId){
                    var setQuery = {
                        $addToSet: {
                            ContactId: leadData._id ,
                            PropertyId: leadData.PropertyId
                        }
                    }
                 }
                Service.CRM_USER_DATA_SERVICE.updateData(criteria,setQuery, {new: true}, (err, data)=> {
                     //.log("err, data",err, data);
                    if (err) return cb(err)
                    return cb();
                });
            }else{
                return cb();
            }
        }],*/
        addTosetPropertyId: ['checkUserExistsORNot', 'InsertData', (ag3, cb) => {
            //.log("addTosetPropertyId==init");
            //var criteria= {_id:userData._id}
            var setQuery = { ContactId: leadData._id }
            if (leadData.PropertyId) {
                var setQuery = {
                    crmUserId: userData._id,
                    ContactId: leadData._id,
                    PropertyId: leadData.PropertyId
                }
            }
            Service.CRM_USER_PROPERTY_SERVICE.InsertData(setQuery, (err, data) => {
                //.log("err, data", err, data);
                if (err) return cb(err)
                return cb();
            });
        }],
        UpdateStatus: ['InsertData', 'addTosetPropertyId', (ag2, cb) => {
            //.log("UpdateStatus==init");
            var setCriteria = { _id: payloadData.leadlId }
            var setQuery = { isMovedToCMS: true };
            Service.ContactFormService.updateData(setCriteria, setQuery, { new: true }, (err, data) => {
                // //.log("err, data",err, data);
                if (err) return cb(err)
                return cb(null, data);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var crmUserLead = function (payloadData, callbackRoute) {
    //.log("kkk");
    var totalRecord = 0;
    var finalData = [];
    var finalData_new = [];
    var criteria = {

    };
    var projection = {
        __v: 0
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'l_askingprice l_addressstreet l_addressnumber l_city l_state l_addressdirection',
            model: 'retspropertyrd_1',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    //autoIncrement:-1
                }
            };
            if (payloadData.sortby) {
                if (payloadData.sortby == 'email') {
                    options.sort = {
                        email: -1
                    }
                }
                if (payloadData.sortby == 'name') {
                    options.sort = {
                        firstName: -1
                    }
                }
                if (payloadData.sortby == 'date') {
                    options.sort = {
                        createdAt: -1
                    }
                }

            } else {
                options.sort.autoIncrement = -1
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.CRM_USER_DATA, criteria, projection, options, populateModel, (err, data) => {
                //Service.ContactFormService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = Utils.universalfunctions.jsonParseStringify(data);//data
                return cb();
            });
        }],

        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.CRM_USER_DATA_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            datalist: finalData
        });
    })
}

var crmPropertyofUserLead = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], PropertyIdArray = [];
    var criteria = {
        _id: payloadData.crmUserId
    };
    var userDetail = {}
    var projection = {
        __v: 0
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'lm_int1_19 lm_char1_36 l_askingprice lm_int1_4 l_area l_displayid',
            model: 'retspropertyrd_1',
            options: { lean: true }
        }
    ];
    async.auto({
        getUserData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
            };
            //DBCommonFunction.getDataPopulateOneLevel(Models.CRM_USER_DATA, criteria, projection, options, populateModel, (err, data) => {
            Service.CRM_USER_DATA_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    userDetail = data[0];
                    //PropertyIdArray = data[0].PropertyId
                }
                return cb(null, PropertyIdArray);
            });
        }],
        getProperty: ['getUserData', (ag1, cb) => {
            var criteria = {
                crmUserId: payloadData.crmUserId
            }
            var projection = { __v: 0 }
            var options = {
                lean: true,
                sort: {
                    _id: -1
                }
            }
            DBCommonFunction.getDataPopulateOneLevel(Models.CRM_USER_PROPERTY, criteria, projection, options, populateModel, (err, data) => {
                //.log("errr", err, data);
                //Service.REST_PROPERY_RD_1_Service.getData(criteria, projection,options,(err,data)=> {  // //.log("data",data.length,data);
                if (err) return cb(err);
                PropertyIdArray = Utils.universalfunctions.jsonParseStringify(data);//data
                return cb(null, { criteria: criteria, data });
            });
        }],
        setData: ['getProperty', (ag1, cb) => {
            PropertyIdArray.forEach(function (element) {
                var temp = element;
                temp.lm_char1_36 = temp.PropertyId.lm_char1_36
                temp.lm_int1_4 = temp.PropertyId.lm_int1_4
                temp.lm_int1_19 = temp.PropertyId.lm_int1_19
                temp.l_displayid = temp.PropertyId.l_displayid
                temp.l_askingprice = temp.PropertyId.l_askingprice
                temp.l_area = temp.PropertyId.l_area
                temp.PropertyId = temp.PropertyId._id
                finalData.push(temp);
            })
            return cb();
        }]

    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        if (userDetail.PropertyId) {
            delete userDetail.PropertyId;
        }
        if (userDetail.ContactId) {
            delete userDetail.ContactId;
        }
        return callbackRoute(null, {
            totalRecord: finalData.length,
            userDetail: userDetail,
            datalist: finalData
        });
    })
}

var crmUserProfile = function (payloadData, UserData, callbackRoute) {
    //.log("editConsumerProfile======init");
    var location, postImageUrl, returnedDatas;


    async.auto({

        UpdateData: [(cb) => {
            var criteria = {
                _id: payloadData.userId
            }
            var dataToSave = payloadData;

            Service.CRM_USER_DATA_SERVICE.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var createFunnel = function (payloadData, UserData, callbackRoute) {
    async.auto({
        CreateSchool: [(cb) => {
            var dataToSave = payloadData
            if (payloadData.siteId) {
                dataToSave.siteId = payloadData.siteId;
                dataToSave.createdBy = UserData._id;
            } else {
                dataToSave.siteId = UserData._id;
            }
            Service.FUNNEL_SERVICE.InsertData(dataToSave, function (err, result) {
                //.log("err", err);
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getAllFunnel = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {
        $or: [
            { globalView: true },
            { siteId: UserData._id }
        ],
        isDeleted: false,
    };
    var projection = { __v: 0 };
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    schoolAutoIncrement: -1
                }
            };
            Service.FUNNEL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.FUNNEL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            funnel: finalData
        });
    })
}


var assignedFunnelIdToCrmProperty = function (payloadData, callbackRoute) {
    async.auto({
        update: [(cb) => {
            var criteria = {
                crmUserId: payloadData.crmUserId,
                _id: payloadData.PropertyId,
            };
            var options = {
                new: true
            };
            var dataToSave = {
                funnelId: payloadData.funnelId
            }
            Service.CRM_USER_PROPERTY_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
}

var updateFunnel_old = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb) => {
            var criteria = {
                _id: payloadData.funnelId,
            }
            var options = {
                new: true,
            }
            var dataToSave = payloadData
            Service.FUNNEL_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};



var getFunnelDetail = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = {};
    var criteria = {
        _id: payloadData.funnelId
    };
    var projection = { __v: 0 };
    async.auto({
        getData: [(cb) => {
            var options = { lean: true };
            Service.FUNNEL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    finalData = data[0]
                }
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            funnel: finalData
        });
    })
}

var updateCatgoryOfLead = function (payloadData, UserData, callbackRoute) {
    //.log("payloadData", payloadData);
    async.auto({
        updateFunnelData: [(cb) => {
            var criteria = {
                _id: payloadData.leadlId,
            }
            var options = {
                new: true,
            }
            var dataToSave = {
                category: payloadData.category
            }
            Service.CRM_USER_PROPERTY_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                return cb(null, { dataToSave: dataToSave, result: result });
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var CsvFileUpload = function (payloadData, UserData, callback) {
    //.log("CsvFileUpload======init");
    console.log(payloadData, "ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp==========================")
    if (payloadData.CsvFile) {
        payloadData.attachments = payloadData.CsvFile;
    }

    payloadData.attachments = payloadData.CsvFile;
    var type = payloadData.type;
    var ImageUrl;
    var csvData = [];
    var userExistEmail = [];
    console.log("payloadData", type)
    async.auto({
        checkUserId: [(cb) => {
            return cb();
        }],
        checkImageLength: [function (cb) {
            //.log("checkImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    //.log("checkImageLength==init==if==if");
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                    return cb();
                }
                else {
                    //.log("checkImageLength==init==if==else");
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                    return cb();
                }
            } else {
                return cb();
            }
        }],
        uploadImage: ['checkImageLength', (r1, cb) => {
            //.log("uploadImage==init");
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: payloadData.userId,//UserData._id,
                    type: 4
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],
        readCSV: ['uploadImage', (ag1, cb) => {
            var imageUrl_new = path.join('./Assets/Csv', ImageUrl);
            csvTojson().fromFile(imageUrl_new).on('json', (jsonObj) => { // //.log("jsonObj",jsonObj)
                csvData.push(jsonObj);
            }).on('done', (error) => {
                //.log('end')
                return cb()
            })
        }],
        ImportDataIntoDB: ['readCSV', (ag1, Outercb) => {
            async.eachSeries(csvData, function (item, InnerCb) {
                var IsExists = false;
                async.auto({
                    checkUserExistsOrNot: [function (cb) {
                        var criteria = {
                            email: item.email
                        }
                        Service.ContactFormService.getData(criteria, {}, { lean: true }, (err, result) => {
                            if (err) return cb(err);
                            if (result.length > 0) {
                                console.log('available')
                                userExistEmail.push(item.email.toString())
                                IsExists = true;
                            }
                            return cb()
                        })
                    }],
                    InsertData: ['checkUserExistsOrNot', function (ag1, cb) {

                        console.log(IsExists, ",ieemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", item, "oooooooooooooooooooooooooooooooo")
                        if (IsExists == false) {
                            if (payloadData.type == "crm") {
                                console.log("in crm section")
                                item.isMovedToCMS = true
                                item.userType = "Seller"
                                item.siteId = payloadData.siteId
                                Service.ContactFormService.InsertDataTousers(item, (err, result) => {
                                    // console.log("eeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",result)
                                    if (err) return cb(err);
                                    return cb()
                                })
                            } else {
                                console.log('inseller')
                                item.isMovedToCMS = false
                                item.siteId = payloadData.siteId
                                item.userType = "Seller"
                                item.formType = "homeworth"
                                item.sellerEmail = item.email
                                item.status = "No Contact"
                                Service.ContactFormService.InsertDatatoSeller(item, (err, result) => {
                                    console.log("eeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", result)
                                    if (err) return cb(err);
                                    return cb()
                                })
                            }

                        }
                        // else if (IsExists == false && payloadData.type == "seller") {

                        // }
                        else {
                            console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
                            return cb()
                        }
                    }]
                }, function (err, result) {
                    if (err) return InnerCb(err);
                    return InnerCb();
                })
            }, function (err, restult) {
                if (err) return Outercb(err);
                return Outercb();
            })
        }]
    }, function (err, result) {
        if (err) return callback(err)
        return callback(null, {
            ImageUrl: ImageUrl,
            userExistEmail: userExistEmail
        })
    })
}

var contactDetail = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = {
        ContactId: payloadData.ContactId
    };

    var projection = {
        __v: 0
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'l_askingprice l_addressnumber l_addressstreet l_addressnumber l_city l_state l_addressdirection l_displayid',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "ContactId",
            match: {},
            select: 'firstName email lastName agentId',
            model: 'ContactForm',
            options: { lean: true }
        },
        {
            path: "userId",
            match: {},
            select: 'firstName email lastName phone',
            model: 'user',
            options: { lean: true }
        }
    ];
    var agentId = 0;
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    //ContactFormAutoIncrement:-1
                }
            };
            if (payloadData.sortby) {
                if (payloadData.sortby == 'email') {
                    options.sort = {
                        email: -1
                    }
                }
                if (payloadData.sortby == 'name') {
                    options.sort = {
                        firstName: -1
                    }
                }
                if (payloadData.sortby == 'date') {
                    options.sort = {
                        createdAt: -1
                    }
                }

            } else {
                options.sort._id = -1
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.ContactDetail, criteria, projection, options, populateModel, (err, data) => {
                if (err) return cb(err);
                finalData = Utils.universalfunctions.jsonParseStringify(data);//data
                if (data.length > 0) {
                    if (data[0].ContactId.agentId) {
                        agentId = data[0].ContactId.agentId
                    }

                }
                return cb();
            });
        }],
        setDataFormat: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element; // //.log("element",element);
                if (element.PropertyId) {
                    var propertyTemp = element.PropertyId;
                    if (propertyTemp.l_addressnumber.length > 0) {
                        var newAddress = propertyTemp.l_addressnumber + '-' + propertyTemp.l_addressstreet + '-' + propertyTemp.l_city + '-' + propertyTemp.l_state;
                    } else {
                        var newAddress = propertyTemp.l_addressstreet + '-' + propertyTemp.l_city + '-' + propertyTemp.l_state;
                    }
                    newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                    tempData.PropertyId.newAddress = newAddress.toLowerCase();
                }
                finalData_new.push(tempData)

            })
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.ContactForm_Detail_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            agentId: agentId,
            datalist: finalData_new
        });
    })
}

var assignedAgent = function (payloadData, UserData, callbackRoute) {
    console.log("iheeeeeeeee")
    console.log("payloadData", payloadData);
    var dataToSet = {
        assignedTo: payloadData.agentId
    }

    async.auto({
        updateAgentId: [(cb) => {
            var criteria = {
                _id: payloadData.ContactId
            }
            var options = {
                new: true
            }
            Service.ContactFormService.updateData(criteria, dataToSet, options,
                //Service.UserService.updateUser(criteria, dataToSet, options,
                function (err, result) {
                    if (err) return cb(err);
                    else if (result) {
                        var criteria1 = {
                            _id: payloadData.agentId
                        }

                        Service.UserService.getUser(criteria1, {}, {}, (err, data) => {

                            console.log('data', data)
                            console.log('payloadData', payloadData)

                            // new lead template
                            var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                            var fileReadStream = fs.createReadStream(templatepath + 'new_lead.html');
                            var emailTemplate = '';
                            fileReadStream.on('data', function (buffer) {
                                emailTemplate += buffer.toString();
                            });
                            // var path = Configs.CONSTS.accountconfirmationUrl+ '/' + payloadData.email + '/' + verificationToken;

                            // var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                            var criteria = {
                                siteId: payloadData.siteId
                            }

                            Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) {
                                if (err) {
                                    console.log("err", err);
                                    fileReadStream.on('end', function (res) {
                                        var message = "A new Lead is assigned to you with following details : <br><br>Name : " + payloadData.firstName + "<br> Phone : " + payloadData.phoneNumber +
                                            "<br> email : " + payloadData.email + "<br> ";
                                        var sendStr = emailTemplate.replace('{{message}}', message);
                                        // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                        var email_data = { // set email variables for user
                                            to: data[0].email,
                                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                            subject: 'Lead Assigned',
                                            html: sendStr
                                        };
                                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                                            if (err) return cb(err);
                                            console.log("homeWorth Lead Assigned to agent successfully0");
                                            return cb()

                                        });
                                    });
                                } else if (result.length > 0) {
                                    console.log("Reachhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                                    var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                                    fileReadStream.on('end', function (res) {

                                        var message = "A new Lead is assigned to you with following details : <br><br>Name : " + payloadData.firstName + "<br> Phone : " + payloadData.phoneNumber +
                                            "<br> email : " + payloadData.email + "<br> ";
                                        // to: data[0].email,
                                        //     from: data[0].firstName + '<' + data[0].email + '>',
                                        //     subject: subject,
                                        //     //html: sendStr,
                                        //     body: Message
                                        var sendStr = emailTemplate.replace('{{imagePath}}',
                                            imagePath)
                                            .replace('{{name}}', data[0].firstName || "Agent")
                                            .replace('{{message}}', message)
                                            .replace('{{signature}}', result[0].signature)
                                            .replace('{{logo}}', result[0].logoUrl);
                                        // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                        var email_data = { // set email variables for user
                                            to: data[0].email,
                                            from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                            subject: 'Lead Assigned',
                                            html: sendStr
                                        };
                                        console.log('emailData', email_data)
                                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                                            if (err) return cb(err);
                                            console.log("homeWorth Lead Assigned to agent successfully1");
                                            return cb()

                                        });
                                    });
                                } else {
                                    fileReadStream.on('end', function (res) {
                                        var message = "A new Lead is assigned to you with following details : <br><br>Name : " + payloadData.firstName + "<br> Phone : " + payloadData.phoneNumber +
                                            "<br> email : " + payloadData.email + "<br> ";
                                        var sendStr = emailTemplate.replace('{{message}}', message);
                                        // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                        var email_data = { // set email variables for user
                                            to: data[0].email,
                                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                            subject: 'Lead Assigned',
                                            html: sendStr
                                        };
                                        Utils.universalfunctions.send_email(email_data, (err, res) => {
                                            if (err) return cb(err);
                                            console.log("homeWorth Lead Assigned to agent successfully2");
                                            return cb()

                                        });
                                    });
                                }
                            });


                            // old lead template
                            // var Message = "assigned agent changed";
                            // var subject = 'assigned agent changed';
                            // //var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{imagePath}}', imagePath).replace('{{signature}}', result[0].signature).replace('{{site_link}}', result[0].siteUrl).replace('{{siteName}}',result[0].siteName);
                            // var email_data = { // set email variables for user
                            //     to: data[0].email,
                            //     from: data[0].firstName + '<' + data[0].email + '>',
                            //     subject: subject,
                            //     //html: sendStr,
                            //     body: Message
                            // };
                            // Utils.universalfunctions.send_email(email_data, (err, res) => {
                            //     if (err) return cb(err);
                            //     return cb();
                            // });


                        })
                    }
                });
        }],
        updateAgentIdInDetail: [(cb) => {
            var criteria = {
                ContactId: payloadData.ContactId
            }
            var options = {
                new: true,
                multi: true
            }
            DBCommonFunction.UpdateMultipleRecords(Models.ContactDetail, criteria, dataToSet, options, function (err, result) {
                //Service.ContactForm_Detail_Service.updateData(criteria,dataToSet,options,function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var crmUserLead_new = function (payloadData, UserData, callbackRoute) { // //.log("UserData",UserData.userType);
    var totalRecord = 0;
    var finalData = [];
    var finalData_new = [];
    var criteria = {}
    if (payloadData.search) {
        console.log('we are in search')
        criteria.$and = [
            {
                $or: [
                    { firstName: new RegExp(payloadData.search, 'gi') },
                    { lastName: new RegExp(payloadData.search, 'gi') },
                    { phone: new RegExp(payloadData.search, 'gi') },
                    { email: new RegExp(payloadData.search, 'gi') },
                ],
            },

            {
                $or: [

                    { userType: 'Seller' },
                    { userType: 'Buyer' },
                    { userType: 'Builder' },
                    { userType: 'Buyer/Seller' },
                    { userType: 'Investor' },



                ]
            }
        ]

    }
    else {

        criteria.$or = [
            { userType: 'Seller' },
            { userType: 'Buyer' },
            { userType: 'Builder' },
            { userType: 'Buyer/Seller' },
            { userType: 'Investor' },

        ]

    }

    //console.log('userDatattattatattatatatata',UserData)
    if (UserData.userType == USER_TYPE.AGENT) {
        console.log('usertype case')
        criteria.agentId = UserData._id
        criteria.isMovedToCMS = true
    }

    else if (UserData.userType == USER_TYPE.SITE_AGENT) {
        console.log('useragent case')
        criteria.isMovedToCMS = true
        criteria.siteId = UserData._id
        console.log(criteria.isMovedToCMS = true, "===========",
            criteria.siteId = UserData._id)
    } else {
        console.log('else case')
        criteria.isMovedToCMS = true
    }

    // console.log('**************************************************',criteria)
    var projection = {
        __v: 0
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'l_askingprice l_addressstreet l_addressnumber l_city l_state l_addressdirection',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "userId",
            match: {},
            select: 'firstName lastName email userType phoneNumber',
            model: 'user',
            options: { lean: true }
        },
        {
            path: "contactDetailId",
            match: {},
            select: 'createdAt',
            model: 'ContactDetail',
            options: {
                lean: true,
                sort: { createdAt: -1 }
            }
        },
        {
            path: "propertiesId",
            match: {},
            select: '',
            model: 'ContactForm',
            // options: {
            //     lean: true,
            //     sort: { createdAt: -1 }
            // }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    /*ContactFormAutoIncrement:-1*/
                }
            };
            if (payloadData.sortby) {
                if (payloadData.sortby == 'email') {
                    options.sort = {
                        email: -1
                    }
                }
                if (payloadData.sortby == 'name') {
                    options.sort = {
                        firstName: -1
                    }
                }
                if (payloadData.sortby == 'date') {
                    options.sort = {
                        createdAt: -1
                    }
                }
                if (payloadData.phoneNumber == 'phoneNumber') {
                    options.sort = {
                        phoneNumber: -1
                    }
                }
            } else {
                options.sort.ContactFormAutoIncrement = -1
            };
            console.log('criteria==============Data', JSON.stringify(criteria))
            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {
                console.log(data, "getDataPopulate")
                //Service.ContactFormService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = Utils.universalfunctions.jsonParseStringify(data);//data
                //  console.log('finalData',finalData)
                return cb();
            });
        }],
        // setDataFormat: ['getData', (ag1, cb) => {
        //     finalData.forEach((element) => {
        //         var tempObject = element
        //         if (element.contactDetailId.length > 0) {
        //             tempObject.lastContactDate = element.contactDetailId[0].createdAt;
        //             delete tempObject.contactDetailId;
        //         }

        //         if (!tempObject.phoneNumber) {
        //             tempObject.phoneNumber = "N/A";
        //             //.log("if==", tempObject.phoneNumber);
        //         } else {
        //             //.log("else==", tempObject.phoneNumber);
        //         }
        //         finalData_new.push(tempObject);
        //     })
        //     return cb();
        // }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            //Service.ContactFormService.getData(criteria, projection, options, (err, data) => {
            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            datalist: finalData
        });
    })
}
//==============================================================================================
// var crmPropertyofUserLead_new = function (payloadData, callbackRoute) {
//     //.log("here");
//     var totalRecord = 0;
//     var finalData = [], PropertyIdArray = [];
//     var criteria = {
//         _id: payloadData.crmUserId
//     };
//     var userDetail = {}
//     var projection = {
//         __v: 0
//     };
//     var populateModel = [
//         {
//             path: "PropertyId",
//             match: {},
//             select: 'lm_int1_19 lm_char1_36 l_askingprice lm_int1_4 l_area l_displayid l_addressnumber l_addressstreet l_city l_state',
//             model: 'retspropertyrd_1',
//             options: { lean: true }
//         }
//     ];
//     async.auto({
//         getUserData: [(cb) => {
//             var options = {
//                 skip: payloadData.skip,
//                 limit: payloadData.limit,
//                 lean: true,
//             };
//             //DBCommonFunction.getDataPopulateOneLevel(Models.CRM_USER_DATA, criteria, projection, options, populateModel, (err, data) => {
//             Service.ContactFormService.getData(criteria, projection, options, (err, data) => {
//                 if (err) return cb(err);
//                 if (data.length > 0) {
//                     userDetail = data[0];
//                     //PropertyIdArray = data[0].PropertyId
//                 }
//                 return cb();
//             });
//         }],
//         getProperty: ['getUserData', (ag1, cb) => {
//             var criteria = {
//                 ContactId: payloadData.crmUserId,
//                 PropertyId: { $exists: true }
//             }
//             var projection = { __v: 0 }
//             var options = {
//                 lean: true,
//                 sort: {
//                     _id: -1
//                 }
//             }
//             DBCommonFunction.getDataPopulateOneLevel(Models.ContactDetail, criteria, projection, options, populateModel, (err, data) => {
//                 //.log("errr", err, data);
//                 //Service.REST_PROPERY_RD_1_Service.getData(criteria, projection,options,(err,data)=> {  // //.log("data",data.length,data);
//                 if (err) return cb(err);
//                 PropertyIdArray = Utils.universalfunctions.jsonParseStringify(data);//data
//                 return cb(null, { criteria: criteria, data });
//             });
//         }],
//         setData: ['getProperty', (ag1, cb) => {
//             PropertyIdArray.forEach(function (element) { // //.log("element",element)
//                 var temp = element;
//                 if (temp.PropertyId.l_addressnumber.length > 0) {
//                     var newAddress = temp.PropertyId.l_addressnumber + '-' + temp.PropertyId.l_addressstreet + '-' + temp.PropertyId.l_city + '-' + temp.PropertyId.l_state;
//                 } else {
//                     var newAddress = temp.PropertyId.l_addressstreet + '-' + temp.PropertyId.l_city + '-' + temp.PropertyId.l_state;
//                 }
//                 newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
//                 temp.newAddress = newAddress.toLowerCase();
//                 temp.lm_char1_36 = temp.PropertyId.lm_char1_36
//                 temp.lm_int1_4 = temp.PropertyId.lm_int1_4
//                 temp.lm_int1_19 = temp.PropertyId.lm_int1_19
//                 temp.l_displayid = temp.PropertyId.l_displayid
//                 temp.l_askingprice = temp.PropertyId.l_askingprice
//                 temp.l_area = temp.PropertyId.l_area
//                 temp.PropertyId = temp.PropertyId._id
//                 finalData.push(temp);
//             })
//             return cb();
//         }]

//     }, (err, result) => { // //.log("===erredatarrerr===",err,result)
//         if (err) return callbackRoute(err);
//         if (userDetail.PropertyId) {
//             delete userDetail.PropertyId;
//         }
//         if (userDetail.ContactId) {
//             delete userDetail.ContactId;
//         }
//         return callbackRoute(null, {
//             totalRecord: finalData.length,
//             userDetail: userDetail,
//             datalist: finalData
//         });
//     })
// }


var sellerDetails = function (payloadData, callbackRoute) {

    var fullCount;
    var fullData = [];
    var finalData = {};
    var projection = {
        __v: 0
    };
    var data1
    async.auto({

        getDataFromDb: [(cb) => {




            var options = {
                lean: true,

            };

            if (payloadData.sortBy == 'email') {
                if (payloadData.sortOrder) {
                    options.sort = {
                        email: payloadData.sortOrder
                    }
                } else {
                    options.sort = {
                        email: 1
                    }
                }

            }
            if (payloadData.sortBy == 'name') {
                if (payloadData.sortOrder) {

                    options.sort = {
                        firstName: payloadData.sortOrder,

                    }
                } else {

                    options.sort = {
                        firstName: 1,

                    }
                }

            }
            if (payloadData.sortBy == 'date') {
                if (payloadData.sortOrder) {
                    options.sort = {
                        createdAt: payloadData.sortOrder
                    }
                } else {
                    options.sort = {
                        createdAt: -1
                    }
                }
            }

            Models.CONTACTFORM.findOne({ _id: payloadData.crmUserId }, (err, data) => {


                if (err) {
                    console.log(err);
                    return cb(err);
                }
                if (data) {

                    var match = {
                        $match: {
                            "email": data.email
                        }
                    };
                    var groupBy = {
                        $group: {
                            _id: "$sellerEmail",
                            "id": { "$last": "$_id" },
                            "firstName": { "$last": "$firstName" },
                            "lastName": { "$last": "$lastName" },
                            "phoneNumber": { "$last": "$phoneNumber" },
                            "email": { "$last": "$sellerEmail" },
                            "address": { "$last": "$address" },
                            "createdAt": { "$last": "$createdAt" },
                            "status": { "$last": "$status" },
                            "emailSendDate": { "$last": "$emailSendDate" },
                            "funnelId": { "$last": "$funnelId" },
                            "assignedTo": { "$last": "$assignedTo" },
                            "isFunnelEnable": { "$last": "$isFunnelEnable" },
                            "assignedFunnel": { "$last": "$assignedFunnel" },
                            properties: {
                                $push: {
                                    address: "$address",
                                    bedrooms: "$bedrooms",
                                    bathrooms: "$bathrooms",
                                    squareFeet: "$squareFeet",
                                    sellingIn: "$sellingIn"
                                }
                            },
                        }
                    };

                    var addFields = {
                        $project:
                        {
                            _id: 0,
                        }
                    }


                    //console.log(match,groupBy,addFields)
                    // var sort = {
                    //     $sort : options.sort
                    //   }
                    Models.CONTACTFORM.aggregate([match, groupBy, addFields], (err, data) => {
                        console.log('datatatatatatatatatatattatattata', data)
                        if (err) {
                            console.log(err);
                            return cb(err);
                        } else if (data.length > 0) {

                            finalData['userDetail'] = data[0]

                            // console.log('data', data)
                            // fullData = data
                            // fullData.map(item => {
                            //     item["_id"] = item.id
                            // })

                            return cb()
                        } else {

                            finalData['userDetail'] = {}
                            return cb();
                        }

                    });
                }
            })

        }]
    }, (err, result) => {
        //var details1 = arraySort(fullData,'createdAt',{reverse: true});
        if (err) return callbackRoute(err);
        return callbackRoute(null, finalData
        );
    });
}

var crmPropertyofUserLead_new = function (payloadData, callbackRoute) {
    // var fullCount;
    // var fullData = [];
    // var projection = {
    //     __v: 0
    // };
    // var data1
    // async.auto({

    //     getDataFromDb: [(cb) => {




    //         var options = {
    //             lean: true,

    //         };

    //         if (payloadData.sortBy == 'email') {
    //             if (payloadData.sortOrder) {
    //                 options.sort = {
    //                     email: payloadData.sortOrder
    //                 }
    //             } else {
    //                 options.sort = {
    //                     email: 1
    //                 }
    //             }

    //         }
    //         if (payloadData.sortBy == 'name') {
    //             if (payloadData.sortOrder) {

    //                 options.sort = {
    //                     firstName: payloadData.sortOrder,

    //                 }
    //             } else {

    //                 options.sort = {
    //                     firstName: 1,

    //                 }
    //             }

    //         }
    //         if (payloadData.sortBy == 'date') {
    //             if (payloadData.sortOrder) {
    //                 options.sort = {
    //                     createdAt: payloadData.sortOrder
    //                 }
    //             } else {
    //                 options.sort = {
    //                     createdAt: -1
    //                 }
    //             }
    //         }

    //             console.log('payloadData.siteId',payloadData.siteId)
    //             var match = {
    //                 $match: {
    //                    "email":payloadData.email
    //                 }
    //             };
    //             var groupBy = {
    //                  $group : { _id : "$sellerEmail",
    //                 "id":{ "$last": "$_id"},
    //                 "firstName": { "$last": "$firstName"},
    //                 "lastName": { "$last": "$lastName"},
    //                 "phoneNumber": { "$last": "$phoneNumber"},
    //                 "email": { "$last": "$sellerEmail"},
    //                 "address": { "$last": "$address"},
    //                 "createdAt": { "$last": "$createdAt"},
    //                 "status": { "$last": "$status"},
    //                 "emailSendDate": { "$last": "$emailSendDate"},
    //                 "funnelId": { "$last": "$funnelId"},
    //                   properties: { $push: { 
    //                     address: "$address",
    //                     bedrooms: "$bedrooms",
    //                     bathrooms: "$bathrooms",
    //                     squareFeet: "$squareFeet",
    //                     sellingIn: "$sellingIn"
    //                      }},
    //                     } 
    //             };

    //              var addFields =  {
    //                 $project:
    //                   {
    //                       _id :0,
    //                   }
    //               }


    //             //console.log(match,groupBy,addFields)
    //             // var sort = {
    //             //     $sort : options.sort
    //             //   }
    //             Models.CONTACTFORM.aggregate([match,groupBy,addFields],(err,data) => {
    //                 console.log('datatatatatatatatatatattatattata',data)
    //             if (err) {
    //                 console.log(err);
    //                 return cb(err);
    //             } else if (data.length > 0) {


    //                 console.log('data',data)
    //                 fullData = data
    //                 fullData.map(item => {
    //                     item["_id"] = item.id
    //                 })

    //                 return cb()
    //             } else {

    //                 fullData = [];
    //                 return cb();
    //             }

    //         });

    //     }]
    // }, (err, result) => {
    //     //var details1 = arraySort(fullData,'createdAt',{reverse: true});
    //     if (err) return callbackRoute(err);
    //     return callbackRoute(null, {
    //         datalist: fullData
    //     });
    // });

    //.log("here");
    var totalRecord = 0;
    var finalData = [], PropertyIdArray = [];
    var criteria = {
        _id: payloadData.crmUserId
    };
    var userDetail = {}
    var projection = {
        __v: 0
    };
    var populateModel = [
        {
            path: "PropertyId",
            match: {},
            select: 'lm_int1_19 lm_char1_36 l_askingprice lm_int1_4 l_area l_displayid l_addressnumber l_addressstreet l_city l_state',
            model: 'retspropertyrd_1',
            options: { lean: true }
        }
    ];
    async.auto({
        getUserData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
            };
            //DBCommonFunction.getDataPopulateOneLevel(Models.CRM_USER_DATA, criteria, projection, options, populateModel, (err, data) => {
            Models.users.findOne(criteria, projection, options, function (err, data) {
                if (err) return cb(err);
                // if (data.length > 0) {
                userDetail = data;
                //PropertyIdArray = data[0].PropertyId
                // }
                return cb();
            }).populate('propertiesId');
        }],
        getProperty: ['getUserData', (ag1, cb) => {
            var criteria = {
                ContactId: payloadData.crmUserId,
                PropertyId: { $exists: true }
            }
            var projection = { __v: 0 }
            var options = {
                lean: true,
                sort: {
                    _id: -1
                }
            }
            DBCommonFunction.getDataPopulateOneLevel(Models.ContactDetail, criteria, projection, options, populateModel, (err, data) => {
                //.log("errr", err, data);
                //Service.REST_PROPERY_RD_1_Service.getData(criteria, projection,options,(err,data)=> {  // //.log("data",data.length,data);
                if (err) return cb(err);
                PropertyIdArray = Utils.universalfunctions.jsonParseStringify(data);//data
                return cb(null, { criteria: criteria, data });
            });
        }],
        setData: ['getProperty', (ag1, cb) => {
            PropertyIdArray.forEach(function (element) { // //.log("element",element)
                var temp = element;
                if (temp.PropertyId.l_addressnumber.length > 0) {
                    var newAddress = temp.PropertyId.l_addressnumber + '-' + temp.PropertyId.l_addressstreet + '-' + temp.PropertyId.l_city + '-' + temp.PropertyId.l_state;
                } else {
                    var newAddress = temp.PropertyId.l_addressstreet + '-' + temp.PropertyId.l_city + '-' + temp.PropertyId.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                temp.newAddress = newAddress.toLowerCase();
                temp.lm_char1_36 = temp.PropertyId.lm_char1_36
                temp.lm_int1_4 = temp.PropertyId.lm_int1_4
                temp.lm_int1_19 = temp.PropertyId.lm_int1_19
                temp.l_displayid = temp.PropertyId.l_displayid
                temp.l_askingprice = temp.PropertyId.l_askingprice
                temp.l_area = temp.PropertyId.l_area
                temp.PropertyId = temp.PropertyId._id
                finalData.push(temp);
            })
            return cb();
        }]

    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        if (userDetail.PropertyId) {
            delete userDetail.PropertyId;
        }
        if (userDetail.ContactId) {
            delete userDetail.ContactId;
        }
        return callbackRoute(null, {
            totalRecord: finalData.length,
            userDetail: userDetail,
            datalist: finalData
        });
    })
}
var updatesellerperofile = function (payloadData, UserData, callbackRoute) {
    var location, postImageUrl, returnedDatas;
    var funneltemplateData = [];
    var templateId;
    var alreadySendOrNot = false
    var ThemeData = {}
    var updateUserData;
    async.auto({
        UpdateData: [(cb) => {
            var criteria = {
                _id: payloadData.userId
            }
            var dataToSave = payloadData;
            console.log(dataToSave, criteria, "oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
            // now data will be updating in users table instead of contact froms
            Service.UserService.updateContactUser(criteria, dataToSave, { new: true }, function (err, result) {
                // console.log("1", err)
                if (err) return cb(err);
                updateUserData = result;
                console.log('resultttt', updateUserData)
                return cb();
            });
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })


}
// update crm users
var crmUserProfile_new = function (payloadData, UserData, callbackRoute) {
    //.log("editConsumerProfile======init", payloadData);
    var location, postImageUrl, returnedDatas;
    var funneltemplateData = [];
    var templateId;
    var alreadySendOrNot = false
    var ThemeData = {}
    var updateUserData;
    async.auto({
        UpdateData1: [(cb) => {
            var criteria = {
                _id: payloadData.userId
            }
            var dataToSave = payloadData;
            console.log(dataToSave, criteria, "oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
            // now data will be updating in users table instead of contact froms
            Service.UserService.updateContactUser(criteria, dataToSave, { new: true }, function (err, result) {
                // console.log("1", err)
                if (err) return cb(err);
                updateUserData = result;
                console.log('resultttt', updateUserData)
                return cb();
            });

            // Service.UserService.updateUser(criteria, dataToSave, { new: true }, function (err, result) {
            //     if (err) return cb(err);
            //     updateUserData = result;
            //     if(updateUserData.nModified == 1){
            //         return cb();
            //     }
            // });
        }], UpdateData: [(cb) => {
            var criteria = {
                _id: payloadData.userId
            }
            var dataToSave = payloadData;

            // now data will be updating in users table instead of contact froms
            // Service.UserService.updateContactUser(criteria, dataToSave, { new: true }, function (err, result) {
            //     // console.log("1", err)
            //     if (err) return cb(err);
            //     updateUserData = result;
            //     console.log('resultttt', updateUserData)
            //     if(updateUserData.nModified == 1){
            //         return cb();
            //     }

            // });
            Service.UserService.updateUser(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                updateUserData = result;

                return cb();

            });
        }],
        checkFunnelGetData: [(cb) => {
            if (payloadData.funnelId) {
                var criteria = {
                    funnelId: payloadData.funnelId,
                    emailTimeInterval: 0
                }
                // console.log('criteria', criteria)
                var dataToSave = payloadData;
                Service.FUNNEL_TEMPLATE_SERVICE.getData(criteria, {}, { new: true }, function (err, result) {
                    // console.log("2", result)
                    if (err) return cb(err);
                    funneltemplateData = result;
                    return cb();
                });

            } else {
                return cb();
            }
        }],
        getThemeData: ['UpdateData', (ag1, cb) => {
            if (payloadData.funnelId && updateUserData.agentId) {
                // console.log("3")
                var criteria = {
                    siteId: updateUserData.agentId
                }
                var options = { lean: true };
                Service.ThemeSetting_SERVICE.getData(criteria, {}, options, (err, data) => {
                    // console.log("3")
                    if (err) return cb(err);
                    if (data.length > 0) {
                        ThemeData = data[0]
                    }
                    return cb();
                });
            } else {
                console.log("3")
                return cb();
            }
        }],
        checkEmailSendORNot: ['checkFunnelGetData', (ag1, cb) => {
            if (payloadData.funnelId && funneltemplateData.length > 0) {
                var criteria = {
                    funnelId: payloadData.funnelId,
                    userId: payloadData.userId,
                    funneltemplateId: funneltemplateData[0]._id,
                }
                Service.EmailSendDetail_SERVICE.getData(criteria, {}, { new: true }, function (err, result) {
                    console.log("4")
                    if (err) return cb(err);
                    if (result.length > 0) {
                        alreadySendOrNot = true;
                    }
                    return cb();
                });
            } else {
                console.log("4")
                return cb();
            }
        }],
        InsertLastemailSendDetail: ['checkEmailSendORNot', (ag1, cb) => { // //.log("item===funneltemplateData===init",funneltemplateData.length);
            if (payloadData.funnelId && funneltemplateData.length > 0 && alreadySendOrNot == false) {
                var dataToSave = {
                    userId: payloadData.userId,
                    funnelId: funneltemplateData[0].funnelId,
                    funneltemplateId: funneltemplateData[0]._id,
                    emailSendDate: new Date().toISOString()
                }
                Service.EmailSendDetail_SERVICE.InsertData(dataToSave, function (err, result) {
                    console.log("5", err)
                    if (err) return cb(err);
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        sendEmailToUser: ['checkEmailSendORNot', 'getThemeData', (ag2, cb) => { // //.log("item===sendEmailToUser===init",payloadData.email);
            if (payloadData.funnelId && funneltemplateData.length > 0 && alreadySendOrNot == false) {
                var firstName = Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var emailTemplateHtml = funneltemplateData[0].emailTemplateHtml;
                var subject = funneltemplateData[0].subject;
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'funnelTemplate.html');
                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });
                //.log("ThemeData", ThemeData);
                if (ThemeData.logoUrl) {
                    var imagePath = "http://api.uat.djt.ca/Assets/" + ThemeData.logoUrl;
                } else {
                    var imagePath = "http://dev.citruscow.com/assets/email_Images/logo.png";
                }

                var criteria = {
                    siteId: UserData.id
                }
                Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) {
                    if (err) {
                        fileReadStream.on('end', function (res) { //logopath
                            var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', emailTemplateHtml)
                            var subject = funneltemplateData[0].subject;
                            var email_data = { // set email variables for user
                                to: payloadData.email, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                subject: subject,
                                // html: sendStr
                                html: emailTemplateHtml
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                console.log("6")
                                if (err) return cb(err);
                                return cb()
                            });
                        })
                    } else if (result.length > 0) {
                        fileReadStream.on('end', function (res) { //logopath
                            var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', emailTemplateHtml)
                            var subject = funneltemplateData[0].subject;
                            var email_data = { // set email variables for user
                                to: payloadData.email, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                subject: subject,
                                // html: sendStr
                                html: emailTemplateHtml + "<br>" + result[0].signature
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if (err) return cb(err);
                                return cb()
                            });
                        })
                    } else {
                        fileReadStream.on('end', function (res) { //logopath
                            var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', emailTemplateHtml)
                            var subject = funneltemplateData[0].subject;
                            var email_data = { // set email variables for user
                                to: payloadData.email, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                subject: subject,
                                // html: sendStr
                                html: emailTemplateHtml
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if (err) return cb(err);
                                return cb()
                            });
                        })
                    }
                });

                /*
                var oldstring = "{{name}}";
                var newstring =payloadData.firstName;
                if(payloadData.lastName){
                    newstring = newstring+" "+payloadData.lastName
                }
                while (emailTemplateHtml.indexOf(oldstring) > -1) {
                       emailTemplateHtml = emailTemplateHtml.replace(oldstring, newstring).replace('{{name}}', funneltemplateData[0].message);
                }
                var email_data = { // set email variables for user
                    to: payloadData.email, //  "anurag@devs.matrixmarketers.com",//
                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                    subject: subject,
                    html: emailTemplateHtml
                };
                Utils.universalfunctions.send_email(email_data, (err, res)=> {
                    if (err)return cb(err);
                    return cb()
                }); */
            } else {
                return cb()
            }
        }],

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}








var automaticMeeting = function (payloadData, UserData, callbackRoute) {

    var updateUserData;
    async.auto({
        UpdateData: [(cb) => {
            var criteria = {
                _id: payloadData.userId
            }

            var days = 0;
            if (payloadData.automatic_meeting_request_frequency) {
                days = payloadData.automatic_meeting_request_frequency / 1440
            }

            var automatic_meeting_request_date = new Date();
            automatic_meeting_request_date.setDate(automatic_meeting_request_date.getDate() + days);

            var dataToSave = payloadData;
            if (payloadData.automatic_meeting_request == "on") {
                dataToSave.automatic_meeting_request_date = automatic_meeting_request_date;
                dataToSave.automatic_meeting_request_sent = 1
            }
            if (payloadData.automatic_meeting_request == "off") {
                dataToSave.automatic_meeting_request_date = null
                dataToSave.automatic_meeting_request_sent = 0
            }

            Service.UserService.updateUser(criteria, dataToSave, { new: true }, function (err, result) {
                console.log("1", err)
                if (err) return cb(err);
                updateUserData = result;
                console.log('resultttt', updateUserData)
                return cb();
            });

        }],
    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var birthdayGreeting = function (payloadData, UserData, callbackRoute) {
    async.auto({
        UpdateData: [(cb) => {

            var criteria = {
                "type": { $in: ['birthday'] }
            }

            console.log(criteria);
            Service.crTemplate.getAllData(criteria, function (err, result) {
                if (err) {
                    console.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    console.log("Error in CRON while getting Client Retention Data for sites", value);
                    return cb(value);
                } else if (result.length > 0) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    console.log("Result", result);
                    async.each(result, function (item, cb) {
                        var contact_criteria = {}

                        if (item.type == "birthday") {
                            contact_criteria = {
                                "siteId": item.siteId,
                                "_id": payloadData.userId,
                                "isMovedToCMS": true,
                                "dob": { $exists: true },
                                "greetingCards": { $in: ["Birthday"] }
                            }
                        }
                        console.log("contact_criteria::", contact_criteria);
                        // Service.ContactFormService.getData(contact_criteria,{},{ lean: true},(err,contactData)=> {
                        Service.UserService.getUser(contact_criteria, {}, {}, (err, contactData) => {
                            if (err) {
                                console.log("Err While getting user details", err);
                                return cb(err);
                            } else if (contactData.length > 0) {
                                console.log("data", contactData.length);
                                async.each(contactData, function (userItem, userCb) {
                                    if (item.type == "birthday") {
                                        var dobDate = userItem.dob;
                                        var dat1 = dobDate.getDate();
                                        var mon1 = dobDate.getMonth() + 1;

                                        var compareDate = new Date();
                                        var dat2 = compareDate.getDate();
                                        var mon2 = compareDate.getMonth() + 1;
                                        console.log("sdfggggggggggggggg", dat1, dat2, mon1, mon2);
                                        // if(dat1 === dat2 && mon1 === mon2){
                                        // Sending EMail
                                        var firstName = Utils.universalfunctions.capitalizeFirstLetter(userItem.firstName);
                                        var theme_Criteria = {
                                            siteId: item.siteId
                                        }
                                        Service.ThemeSetting_SERVICE.getData(theme_Criteria, {}, {}, function (err, themeResult) {
                                            if (err) {
                                                console.log("We were not able to send the email because DB error occurred while getting the theme settings from the database");
                                            } else if (themeResult.length > 0) {
                                                var messageToSend = eb(item.content, { SIGNATURE: themeResult[0].signature, firstName: userItem.firstName, LASTNAME: userItem.lastName, EMAIL: userItem.email, PHONE: userItem.phoneNumber });
                                                var subject = item.subject;
                                                var email_data = { // set email variables for user
                                                    to: userItem.email, // "anurag@devs.matrixmarketers.com",//
                                                    from: themeResult[0].fromName + '<' + themeResult[0].fromEmail + '>',
                                                    subject: subject,
                                                    html: messageToSend
                                                };
                                                Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                    if (err)
                                                        return userCb(err);
                                                    return userCb();
                                                });
                                            } else {
                                                console.log("We were not able to send the email because there is no theme settings found for the user");
                                                userCb();
                                            }
                                        });
                                        // Sending EMail Functionality ends here
                                        // }else{
                                        //     userCb();
                                        // }
                                    }

                                }, function (err) {
                                    if (err) {
                                        console.log("An error occured while getting the user details", err);
                                        cb();
                                    } else {
                                        console.log("Do Nothing");
                                        cb();
                                    }
                                });

                            } else {
                                return cb();
                            }
                        });

                    }, function (err) {
                        if (err) {
                            console.log("An error occured while getting the user details", err);
                            return cb();
                        } else {
                            console.log("Do Nothing");
                            return cb();
                        }
                    });
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": "Client retention data is not found"
                    }
                    console.log(value);
                    return cb(value);
                }
            });
        }],
    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

// var moveLeadToCrm_new = function (payloadData, UserData, callbackRoute) {  //moveLeadToCrm
//     var leadData = {}
//     var userData = {}
//     var query = "Insert";
//     async.auto({

//         /*getLeadData: [(cb)=> {
//             var projection = {
//                 message:0,
//                 isRead:0,
//                 isDeleted:0,
//                 createdAt:0,
//                 __v:0,
//             };
//             var options = {lean:true};
//             var criteria ={
//                _id:payloadData.leadlId
//             };
//             Service.ContactFormService.getData(criteria, projection, options,(err,data)=> {
//                 if (err)  return cb(err);
//                 leadData = data[0];//data
//                 return cb(null,leadData);
//             });
//         }],
//         checkUserExistsORNot:['getLeadData',(ag1,cb)=>{
//             var criteria ={
//                email:leadData.email
//             };
//             var options = {lean:true};
//             var projection ={
//                 _id:1,
//                 email:1
//             }
//             Service.CRM_USER_DATA_SERVICE.getData(criteria,projection,options,function (err, result) { // //.log("InsertData, result",err, result);
//                 if (err) return cb(err);
//                 if(result.length>0){
//                     userData= result[0];
//                     query = "update"
//                 }

//                 return cb();
//             });
//         }],
//         InsertData:['checkUserExistsORNot',(ag2,cb)=>{ // //.log("InsertData==init");
//             if(query=="Insert"){
//                 var dataToSave = leadData;
//                     dataToSave.ContactId =  payloadData.leadlId;
//                     delete dataToSave._id;
//                     Service.CRM_USER_DATA_SERVICE.InsertData(dataToSave,function (err, result) { // //.log("InsertData, result",err, result);
//                     if (err) return cb(err);
//                     userData = result;
//                     return cb();
//                 });
//                 }else{
//                      return cb();
//                 }
//         }],
//         addTosetPropertyId:['checkUserExistsORNot','InsertData',(ag3,cb)=>{  //.log("addTosetPropertyId==init");
//                  //var criteria= {_id:userData._id}
//                  var setQuery = {ContactId: leadData._id}
//                 if(leadData.PropertyId){
//                     var setQuery = {
//                         crmUserId:userData._id,
//                         ContactId: leadData._id,
//                         PropertyId: leadData.PropertyId
//                     }
//                 }
//                 Service.CRM_USER_PROPERTY_SERVICE.InsertData(setQuery,(err, data)=> {  //.log("err, data",err, data);
//                     if (err) return cb(err)
//                     return cb();
//                 });
//         }],*/
//         UpdateStatus: [(cb) => { // //.log("UpdateStatus==init");
//             var setCriteria = { email: payloadData.leadlId }
//             var setQuery = { isMovedToCMS: true };
//             Service.ContactFormService.updateData(setCriteria, setQuery, { new: true , multi: true }, (err, data) => {
//                 // //.log("err, data",err, data);
//                 if (err) return cb(err)
//                 return cb(null, data);
//             });
//         }]
//     }, (err, result) => {
//         if (err) return callbackRoute(err);
//         return callbackRoute();
//     });
// };

var moveLeadToCrm_new = function (payloadData, UserData, callbackRoute) {  //moveLeadToCrm
    var userData
    async.auto({

        findSellerData: [(cb) => {

            Models.CONTACTFORM.findOne({ "sellerEmail": payloadData.leadlId, _id: payloadData.id }, (err, data) => {
                console.log(err)
                if (err) return cb(err);
                console.log('data', data)
                userData = data;
                return cb();

            });

        }],

        registerUser: ["findSellerData", (ag1, cb) => {
            var dataToSet = {

                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                siteId: userData.siteId,


            }
            if (userData.phoneNumber) {
                dataToSet.phone = userData.phoneNumber;
            }

            dataToSet.userType = "Seller"

            Models.CONTACTFORM.distinct("_id", { "sellerEmail": payloadData.leadlId }, (err, data) => {
                console.log(err)
                if (err) return cb(err);
                if (data) {
                    dataToSet.propertiesId = data
                }
                console.log('dataToSet', dataToSet)

                Service.UserService.createUser(dataToSet, function (err, user) {
                    console.log("createUser======err", err);
                    if (err && err.customMessage == 'Email already exists') {

                        return cb();
                    }
                    else if (user) {

                        return cb();

                    }
                    else {
                        return cb(err);
                    }
                });

            });

        }],

        UpdateStatus: ['registerUser', (ag1, cb) => { // //.log("UpdateStatus==init");
            var setCriteria = { email: payloadData.leadlId }
            var setQuery = { isMovedToCMS: true };
            Service.UserService.updateUser(setCriteria, setQuery, { new: true, multi: true }, (err, data) => {
                // //.log("err, data",err, data);
                if (err) return cb(err)
                return cb();
            });
        }],
        UpdateContactForm: ["UpdateStatus", (ag1, cb) => { // //.log("UpdateStatus==init");
            var setCriteria = { email: payloadData.leadlId }
            var setQuery = { isMovedToCMS: true };
            Service.ContactFormService.updateData(setCriteria, setQuery, { new: true, multi: true }, (err, data) => {
                // //.log("err, data",err, data);
                if (err) return cb(err)
                return cb(null, data);
            });
        }]
    }, (err, result) => {
        console.log
        if (err) return callbackRoute(err);

        return callbackRoute();
    });
};

var removeLeadFromCRM = function (payloadData, UserData, callbackRoute) {  //moveLeadToCrm
    async.auto({
        UpdateStatus: [(cb) => { // //.log("UpdateStatus==init");
            // var setCriteria = { email: payloadData.leadlId }
            // var setQuery = { isMovedToCMS: false };
            // Service.UserService.updateUserFromcrm(setCriteria, setQuery, { new: true, multi: true }, (err, data) => {
            //     // //.log("err, data",err, data);
            //     if (err) return cb(err)
            //     return cb();
            // });
            var setCriteria = { email: payloadData.leadlId }
            var setQuery = { isMovedToCMS: false };
            Service.ContactFormService.updateData(setCriteria, setQuery, { new: true, multi: true }, (err, data) => {
                // //.log("err, data",err, data);
                if (err) return cb(err)
                return cb(null, data);
            });
            Users.remove(setCriteria, function (err, result) {
                console.log(result, "oooooooooooooooooooooooo Removed")
            })

        }],
        // UpdateContactForm: ["UpdateStatus", (ag1, cb) => { // //.log("UpdateStatus==init");
        //     var setCriteria = { email: payloadData.leadlId }
        //     var setQuery = { isMovedToCMS: false };
        //     Service.ContactFormService.updateData(setCriteria, setQuery, { new: true, multi: true }, (err, data) => {
        //         // //.log("err, data",err, data);
        //         if (err) return cb(err)
        //         return cb(null, data);
        //     });
        // }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getallSearchPopertyUsingMlsNumber = function (payloadData, UserData, callbackRoute) {   // //.log("payloadData",payloadData);
    var PropertyIdArray = [];
    var saveProperty = []
    var saveSearchData = []
    var finalSearchData = []
    var userIdArray = []
    var userlistArray = []
    var final_userlistArray = []
    async.auto({
        getPropertyId: [(cb) => {
            var criteria = {
                l_displayid: payloadData.mlsNumber
            }
            var projection = {
                _id: 1,
                propertyAutoIncrement: 1
            }
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, { lean: true }, (err, data) => {  // //.log("data",data.length,data);
                if (err) return cb(err);
                if (data.length == 0) return cb(Responses.MLS_NUMBER_IS_NOT_VALID);
                return cb(null, { criteria: criteria, data: data });
            });
        }],
        getAllSearch: [(cb) => { //MY_LISTING_SERVICE
            var criteria = {
            }
            var projection = { __v: 0, createdAt: 0, updatedAt: 0 }
            var options = { lean: true }
            Service.SEARCH_DATA_SERVICE.getData(criteria, projection, options, (err, data) => {  // //.log("data",data.length,data);
                if (err) return cb(err);
                saveSearchData = Utils.universalfunctions.jsonParseStringify(data);
                return cb(null, { criteria: criteria, saveSearchData: saveSearchData });
            });
        }],
        checkUserLead: ['getAllSearch', (ag1, Outercb) => {
            async.eachSeries(saveSearchData, function (item, InnerCb) {
                var criteria = {
                    l_displayid: payloadData.mlsNumber
                }
                if (item.minAskingprice && item.maxAskingprice) {
                    //.log("if")
                    criteria.l_askingprice = {
                        $gte: item.minAskingprice,
                        $lte: item.maxAskingprice
                    }
                } else {
                    if (item.minAskingprice) {
                        criteria.l_askingprice = {
                            $gte: item.minAskingprice
                        }
                    }
                    if (item.maxAskingprice) {
                        criteria.l_askingprice = {
                            $lte: item.maxAskingprice
                        }
                    }
                }
                if ((item.minbedRoom || item.minbedRoom == 0) && (item.maxbedRoom || item.maxbedRoom == 0)) {
                    //.log("if==bed")
                    criteria.lm_int1_4 = {
                        $gte: item.minbedRoom,
                        $lte: item.maxbedRoom
                    }
                } else {
                    //.log("else==bed", item.minbedRoom)
                    if (item.minbedRoom || item.minbedRoom == 0) {
                        //.log("else==min==bed", item.minbedRoom)
                        criteria.lm_int1_4 = {
                            $gte: item.minbedRoom
                        }
                    }
                    if (item.maxbedRoom || item.maxbedRoom == 0) {
                        //.log("else==max==bed")
                        criteria.lm_int1_4 = {
                            $lte: item.maxbedRoom
                        }
                    }
                }

                var projection = {
                    l_displayid: 1,
                    _id: 1
                }; // //.log("projection",projection)
                Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, { lean: true }, (err, data) => {  // //.log("data",data.length,data);
                    if (err) return InnerCb(err);
                    //if(data.length==0) return InnerCb(Responses.MLS_NUMBER_IS_NOT_VALID);
                    if (data.length > 0) {
                        if (item.user) {
                            userIdArray.push(item.user)
                        }
                    }
                    return InnerCb(null, { criteria: criteria, item: item, data: data });
                });
                //return InnerCb(item);

            }, function (err, restult) {
                if (err) return Outercb(err);
                //userIdArray=  _.uniq(userIdArray);
                return Outercb(null, userIdArray);
            })
        }],
        getUserListing: ['checkUserLead', 'getPropertyId', (ag1, cb) => {
            var criteria = {
                userId: {
                    $in: userIdArray
                }
            }
            var options = {
                skip: 0,
                limit: 10
            }
            var populateModel = [
                {
                    path: "userId",
                    match: {},
                    select: 'firstName lastName email userType',
                    model: 'user',
                    options: { lean: true }
                },
                {
                    path: "agentId",
                    match: {},
                    select: 'firstName lastName email userType',
                    model: 'user',
                    options: { lean: true }
                }
            ];
            var projection = {
                agentId: 1,
                userId: 1,
                ContactFormAutoIncrement: 1,
            }
            DBCommonFunction.getDataPopulateOneLevel(Models.CONTACTFORM, criteria, projection, options, populateModel, (err, data) => {
                //Service.ContactFormService.getData(criteria, {__v:0},{},(err,data)=> {  // //.log("data",data.length,data);
                if (err) return cb(err);
                userlistArray = Utils.universalfunctions.jsonParseStringify(data);
                return cb(null, userlistArray);
            });
        }],
        coutData: ['checkUserLead', (ag1, cb) => {
            var criteria = {
                userId: {
                    $in: userIdArray
                }
            }
            var options = {
                skip: 0,
                limit: 10
            }
            var populateModel = [
                {
                    path: "userId",
                    match: {},
                    select: 'firstName lastName email userType',
                    model: 'user',
                    options: { lean: true }
                },
                {
                    path: "agentId",
                    match: {},
                    select: 'firstName lastName email userType',
                    model: 'user',
                    options: { lean: true }
                }
            ];
            var projection = {
                agentId: 1,
                userId: 1,
                ContactFormAutoIncrement: 1,
            }
            Service.ContactFormService.getData(criteria, { __v: 0 }, {}, (err, data) => {  // //.log("data",data.length,data);
                if (err) return cb(err);
                totalRecord = data.length;
                return cb(null, userlistArray);
            });
        }],
        setDataFormat: ['getUserListing', (ag2, cb) => {
            userlistArray.forEach(function (element) {
                var tempItem = element;
                if (tempItem.agentId && tempItem.agentId != null) {
                    tempItem.agentName = tempItem.agentId.firstName + ' ' + tempItem.agentId.lastName
                    tempItem.agentEmail = tempItem.agentId.email
                    tempItem.agentId = tempItem.agentId._id
                    if (UserData.userType == USER_TYPE.AGENT && tempItem.agentId == UserData._id) {
                        tempItem.isDisplayData = true;
                    } else {
                        tempItem.isDisplayData = false;
                    }

                } else {
                    tempItem.agentName = "N/A"
                }
                if (tempItem.userId) {
                    tempItem.userName = tempItem.userId.firstName + ' ' + tempItem.userId.lastName
                    tempItem.userEmail = tempItem.userId.email
                    tempItem.userId = tempItem.userId._id
                } else {
                    tempItem.userName = "N/A"
                    tempItem.userEmail = "N/A"
                    tempItem.userId = "N/A"
                }; // //.log("tempItem.userId ",tempItem );
                //return cb(tempItem);
                final_userlistArray.push(tempItem);
            })
            return cb(null, final_userlistArray);
        }]

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: UserData.userType,
            totalRecord: totalRecord,
            datalist: final_userlistArray,
        });
    });
};

var setLogoAndOtherThemeOption = function (payloadData, UserData, callback) {
    //.log("setLogoAndOtherThemeOption======init", payloadData);
    if (payloadData.logo) {
        payloadData.attachments = payloadData.logo;
    }
    var ImageUrl, dataInsert = true, logoId;
    var criteria = {
        siteId: UserData._id
    }
    var themeData, old_agentId;
    async.auto({
        checkUserId: [(cb) => {
            return cb();
        }],
        checkImageLength: [function (cb) { // //.log("checkImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                    return cb();
                }
                else { // //.log("checkImageLength==init==if==else");
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                    return cb();
                }
            } else {
                return cb();
            }
        }],
        uploadImage: ['checkImageLength', (r1, cb) => {
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: UserData._id,//UserData._id,
                    type: 5
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],
        checkDataExistORNot: [(cb) => {
            //.log("checkDataExistORNot===init");
            Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) { // //.log("checkDataExistORNot===err",err);
                if (err) return cb(err);
                if (result.length > 0) {
                    dataInsert = false;
                    themeData = result[0];
                    logoId = result[0]._id;
                }
                return cb();
            });
        }],
        UpdateData: ['uploadImage', 'checkDataExistORNot', (r2, cb) => {
            if (dataInsert == false) {
                var dataToSave = payloadData;
                if (payloadData.logo) {
                    dataToSave.logoUrl = ImageUrl
                } else if (payloadData.logoUrl) {
                    dataToSave.logoUrl = payloadData.logoUrl
                } else if (themeData.logoUrl) {
                    dataToSave.logoUrl = themeData.logoUrl
                }
                dataToSave.siteId = UserData._id;
                Service.ThemeSetting_SERVICE.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                    //.log("updateData===err", err, result);
                    if (err) return cb(err);
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        InsertData: ['uploadImage', 'checkDataExistORNot', (r2, cb) => {
            if (dataInsert == true) {
                var dataToSave = payloadData;
                if (payloadData.logo) {
                    dataToSave.logoUrl = ImageUrl
                }
                dataToSave.siteId = UserData._id
                Service.ThemeSetting_SERVICE.InsertData(dataToSave, function (err, result) {
                    //.log("InsertData===err", err);
                    if (err) return cb(err);
                    return cb();
                });
            } else {
                return cb();
            }
        }]


    }, function (err, result) {
        if (err) return callback(err)
        return callback(null, {
            ImageUrl: ImageUrl
        })
    })
}
var uploadLogo = function (payloadData, UserData, callback) {
    //.log("setLogoAndOtherThemeOption======init");
    if (payloadData.logo) {
        payloadData.attachments = payloadData.logo;
    }
    var ImageUrl, dataInsert = true, logoId;
    async.auto({
        checkUserId: [(cb) => {
            return cb();
        }],
        checkImageLength: [function (cb) {
            //.log("checkImageLength==init");
            if (payloadData.attachments) {
                if (Array.isArray(payloadData.attachments) == false) {
                    if (payloadData.attachments['_data'].length > 1048576 * 5) {
                        return cb(Responses.fileLengthExceeded);
                    }
                    return cb();
                }
                else {
                    //.log("checkImageLength==init==if==else");
                    for (var i = 0; i < payloadData.attachments.length; i++) {
                        if (payloadData.attachments[i]['_data'].length > 1048576 * 5) {// file size sholud not exceed 5MB
                            return cb(Responses.fileLengthExceeded);
                        }
                    }
                    return cb();
                }
            } else {
                return cb();
            }
        }],
        uploadImage: ['checkImageLength', (r1, cb) => {
            if (payloadData.attachments) {
                var ImageData = {
                    file: payloadData.attachments,
                    user_id: UserData._id,//UserData._id,
                    type: 5
                };
                if (payloadData.attachments.length >= 0) {
                    Utils.universalfunctions.uploadMultipleDocuments(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                } else {
                    //picData.profile_pic = payloadData.postImage
                    Utils.universalfunctions.uploadDocument(ImageData, (err, res) => {
                        if (err) return cb(err)
                        ImageUrl = res;
                        return cb();
                    });
                }
            } else {
                return cb()
            }
        }],
    }, function (err, result) {
        if (err) return callback(err)
        return callback(null, {
            ImageUrl: ImageUrl
        })
    })
}


// "facebookpageUrl" : "http://facebook.com",
// "twitterpageUrl" : "http://twitter.com",
// "ContactNumber" : "6049925198",
// "fromEmail" : "southsurrey@mailinator.com",
// "fromName" : "southsurrey",
// "siteName" : "southsurrey.ca",
// "siteUrl" : "http://southsurrey.ca",
// "signature" : "<p>Thanks,</p>\n\n<p>Larry</p>\n",
// "passwordExpireDays" : 30,
// "copyrightYear" : "2019",
// "siteId" : ObjectId("5d8462cac2ffad048e2cfff3"),
// "updatedAt" : ISODate("2019-09-25T12:52:40.213Z"),
// "createdAt" : ISODate("2019-09-25T12:52:40.213Z"),
// "__v" : 0


var getAllThemeData = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = {};
    var criteria = {
        // siteId: payloadData.siteId
        siteId: payloadData.siteId
    };
    var projection = {};
    async.auto({
        getData: [(cb) => {
            var options = {};
            Service.ThemeSetting_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data[0]
                return cb();
            });
        }],

    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            //totalRecord: totalRecord,
            data: finalData
        });
    })
}

var setHoliday = function (payloadData, UserData, callbackRoute) { // //.log("UserData",UserData);
    async.auto({
        InsertData: [(cb) => {
            var dataToset = {
                agentId: UserData._id,
                title: payloadData.title,
                holidayDate: new Date(payloadData.holidayDate).toISOString()
            }
            Service.Holiday_SERVICE.InsertData(dataToset, (err, data) => {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var getHoliday = function (payloadData, UserData, callbackRoute) { // //.log("UserData",UserData);
    var finalData = [], totalRecord = 0;
    var criteria = {
        agentId: UserData._id,
    }
    var project = {
        __v: 0,
        createdAt: 0
    }
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
            }
            Service.Holiday_SERVICE.getData(criteria, project, options, (err, data) => {
                if (err) return cb(err);
                finalData = data;
                return cb();
            });
        }],
        countData: [(cb) => {
            Service.Holiday_SERVICE.getData(criteria, {}, {}, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            list: finalData
        });
    })
}

var deleteHoliday = function (payloadData, UserData, callbackRoute) { // //.log("===payloadData===",payloadData)
    var totalRecord = 0;
    var finalData = [];
    var criteria = {};
    var projection = {};
    async.auto({
        deleteData: [(cb) => {
            var criteria = {
                _id: payloadData.holidayId
            }
            Service.Holiday_SERVICE.delteRecord(criteria, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            })
        }],

    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var getPostCard = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {};
    var projection = {};
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    createdAt: -1
                }
            };
            Service.PostCardLobService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.PostCardLobService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            postListing: finalData
        });
    })
}

var getAllFunnelTemplate = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = {
        funnelId: payloadData.funnelId,
        isDeleted: false,
    };
    if (payloadData.funnelTemplateId) {
        criteria._id = payloadData.funnelTemplateId
    }
    var projection = { _v: 0 };
    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true,
                sort: {
                    title: 1
                }
            };
            Service.FUNNEL_TEMPLATE_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        setDataFormat: ['getData', (ag1, cb) => {
            var i = 0;
            for (i = 0; i < finalData.length; i++) {
                //.log("In For Loop");
                //.log(finalData);
                var tempIndex = _.findLastIndex(emailTimeIntervalArray, { name: finalData[i].emailTimeInterval.toString() });
                var newObject = emailTimeIntervalArray[tempIndex]
                // tempData.emailTimeInterval_new = newObject.displayName;
                var val = newObject.displayName;
                var tempVar = {
                    _id: finalData[i]._id,
                    funnelTemplateAutoIncrement: finalData[i].funnelTemplateAutoIncrement,
                    title: finalData[i].title,
                    emailTemplateHtml: finalData[i].emailTemplateHtml,
                    funnelId: finalData[i].funnelId,
                    emailType: finalData[i].emailType,
                    status: finalData[i].status,
                    subject: finalData[i].subject,
                    emailTimeInterval: finalData[i].emailTimeInterval,
                    isDeleted: finalData[i].isDeleted,
                    createdAt: finalData[i].createdAt,
                    sendCmaAutomatically: finalData[i].sendCmaAutomatically,
                    displayName: val
                };

                finalData_new.push(tempVar);
            }

            //.log("THIS SHOULD BE EXECUTED LATER");
            return cb();
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        //  //.log(value);
        return callbackRoute(null, {
            totalRecord: finalData_new.length,
            funnel: finalData_new
        });
    })
}

var updateFunnel = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb) => {
            if (payloadData.funnelTemplateId) {
                var criteria = {
                    funnelId: payloadData.funnelId,
                    _id: payloadData.funnelTemplateId,
                }
                var options = {
                    new: true,
                }
                var dataToSave = payloadData
                Service.FUNNEL_TEMPLATE_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        InsertData: [(cb) => {
            if (!payloadData.funnelTemplateId) {
                var dataToSave = payloadData
                Service.FUNNEL_TEMPLATE_SERVICE.InsertData(dataToSave, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            } else {
                return cb();
            }
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var deleteFunnelTemplate = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb) => {
            var criteria = {
                _id: payloadData.funnelTemplateId,
            }
            var options = {
                new: true,
            }
            var dataToSave = {
                isDeleted: true
            }
            Service.FUNNEL_TEMPLATE_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });

        }],
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var deleteFunnel = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb) => {
            var criteria = {
                _id: payloadData.funnelId,
            }
            var options = {
                new: true,
            }
            var dataToSave = {
                isDeleted: true
            }
            Service.FUNNEL_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });

        }],
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var sendMessageToAgent = function (payloadData, UserData, callbackRoute) {
    var agentData = {}
    async.auto({
        getAgentData: [(cb) => {
            var criteria = {
                _id: payloadData.agentId
            }
            var projection = {
                firstName: 1,
                lastName: 1,
                email: 1,
            }
            Service.UserService.getUser(criteria, projection, {}, (err, data) => {
                if (err) return cb(err);
                agentData = data[0]
                return cb();
            });
        }],
        sendEmailToAgent: ['getAgentData', (ag1, cb) => { // send verification email to user

            var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
            var fileReadStream = fs.createReadStream(templatepath + 'contactUs_admin.html');

            var emailTemplate = '';
            fileReadStream.on('data', function (buffer) {
                emailTemplate += buffer.toString();
            });
            // var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
            var messageEmail = payloadData.message
            fileReadStream.on('end', function (res) {
                var sendStr = emailTemplate.replace('{{message}}', messageEmail)

                var email_data = { // set email variables for user
                    to: agentData.email, //'anurag@devs.matrixmarketers.com',//
                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                    subject: 'New Message Southsurrey',
                    html: sendStr
                };
                Utils.universalfunctions.send_email(email_data, (err, res) => {
                    if (err) return cb(err);
                    return cb(null, {
                        "statusCode": 200,
                        "status": "success",
                        "message": "Verification link sent to your email."
                    })
                });
            })
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var activateDeactivatedUser = function (payloadData, userData, callbackRoute) {
    var userData = {}
    var criteria = {
        _id: payloadData.userId
    };
    async.auto({
        getUserData: [(cb) => {
            var projection = {
                accessToken: 0, emailVerificationToken: 0
            };
            Service.UserService.getUser(criteria, projection, { lean: true }, (err, data) => {
                if (err) return cb(err);
                if (data.length == 0) return cb(Responses.INVALID_USER_ID);
                userData = data[0]
                return cb();
            });
        }],
        updateData: ['getUserData', (ag1, cb) => {
            var dataToSet = {}
            if (userData.isSuspended == true) {
                dataToSet.isSuspended = false;
            } else {
                dataToSet.isSuspended = true;
            }
            Service.UserService.updateUser(criteria, dataToSet, { new: true }, (err, data) => {
                if (err) return cb(err);
                if (data.length == 0) return cb(Responses.INVALID_USER_ID);
                userData = data[0]
                return cb(userData);
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var addSchoolPolygon = function (payload, UserData, callback) {
    var finalData;
    var criteriaPro = {};
    var PropertyArray = [];
    var PropertyArrayFinal = [];
    var totalRecord = 0;
    async.auto({
        saveLocation: [(cb) => {
            var criteria = {
                _id: payload.schoolId,
            }
            var dataToSet = {
                location: {
                    type: "Polygon",
                    coordinates: [payload.coordinates]
                }
            }
            Service.SCHOOL_SERVICE.updateData(criteria, dataToSet, { new: true }, (err, data) => { // //.log("xcxcdata", data);
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        setProCriteria: ['saveLocation', (ag1, cb) => {
            //.log("cvcvvcvc===", finalData);
            if (finalData.location) {
                if (finalData.location && finalData.location.coordinates.length > 0) {
                    var coordinate_db = finalData.location.coordinates[0];
                    var tempLocation = {
                        $geoWithin: {
                            $polygon: coordinate_db
                        }
                    };
                    criteriaPro['location.coordinates'] = tempLocation
                }
                return cb();
            } else {
                return cb();
            }
        }],
        getProperty: ['setProCriteria', (ag2, cb) => {
            if (finalData.location) {
                var projectionPro = {
                    l_listingid: 1,
                    propertyAutoIncrement: 1,
                    l_area: 1,
                    lm_int1_19: 1,
                    lm_int1_4: 1,
                    l_askingprice: 1,
                    lm_dec_11: 1,
                    lo1_organizationname: 1,
                    lo1_shortname: 1,
                    la3_phonenumber1: 1,
                    la1_loginname: 1,
                    lm_char10_12: 1,
                    lm_char1_36: 1,
                    lm_dec_16: 1,
                    lm_int2_3: 1,
                    lm_int4_2: 1,
                    l_remarks: 1,
                    lr_remarks22: 1,
                    l_pricepersqft: 1,
                    lr_remarks22: 1,
                    location: 1,
                    propertyImages: 1,
                    lo1_organizationname: 1,
                    l_askingprice: 1,
                    l_city: 1, l_state: 1, l_zip: 1,
                    l_addressunit: 1,
                    l_streetdesignationid: 1,
                    l_addressnumber: 1,
                    l_addressstreet: 1,
                    l_displayid: 1,
                    lm_dec_7: 1,
                    lm_char10_11: 1
                };
                var optionsPro = { lean: true };
                Service.REST_PROPERY_RD_1_Service.getData(criteriaPro, projectionPro, optionsPro, (err, data) => {
                    if (err) return cb(err);
                    if (data.length > 0) {
                        PropertyArray = data;
                    }
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        setPropertyData: ['getProperty', (ag3, OuterCb) => {
            PropertyArray.forEach(function (element) {
                var tempData = element;
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();
                var lat = tempData.location.coordinates[1] //latlong
                var Lng = tempData.location.coordinates[0] //latlong
                var latlong = [lat, Lng];
                tempData.latlong = latlong;
                delete tempData.location;
                if (lat != 0 && Lng != 0) {
                    PropertyArrayFinal.push(tempData);
                    //finalData_new.push(tempData);
                }
            })
            return OuterCb();
        }]
    }, (err, result) => {
        if (err) return callback(err);
        //return callback(null,finalData)
        return callback(null, {
            totalRecord: totalRecord,
            PropertCount: PropertyArrayFinal.length,
            data: finalData,
            PropertyArray: PropertyArrayFinal
        })
    })
}

var getSchoolPolygon = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = {}, finalData_new = [];
    var criteria = { _id: payloadData.schoolId };
    var projection = { schoolTitle: 1, location: 1, location2: 1 };
    var PropertyArray = [];
    var PropertyArrayFinal = [];
    var criteriaPro = {};
    var arr = [];
    var PropertyCount = 0;
    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true,
                sort: {
                    postAutoIncrement: -1
                }
            };
            Service.SCHOOL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    finalData = data[0];
                }
                return cb();
            });
        }],
        setProCriteria: ['getData', (ag1, cb) => { // //.log("cvcvvcvc===",finalData);
            //  //.log(finalData);
            if (finalData.location2) {
                if (finalData.location2 && finalData.location2.coordinates) {

                    var coordinate_db = finalData.location2.coordinates;

                    var tempLocation = {
                        $geoWithin: {
                            $geometry: {
                                type: "Polygon",
                                coordinates: coordinate_db
                            }
                        }
                    }

                    criteriaPro = {
                        "location.coordinates": tempLocation
                    }
                    return cb();

                } else {
                    return cb();
                }
            } else {
                return cb();
            }


        }],
        getProperty: ['getData', 'setProCriteria', (ag2, cb) => {
            //.log("Reaching in This get Property Table", finalData);
            if (finalData.location2 && finalData.location2.coordinates.length > 0) {

                var projectionPro = {
                    l_listingid: 1,
                    propertyAutoIncrement: 1,
                    l_area: 1,
                    lm_int1_19: 1,
                    lm_int1_4: 1,
                    l_askingprice: 1,
                    lm_dec_11: 1,
                    lo1_organizationname: 1,
                    lo1_shortname: 1,
                    la3_phonenumber1: 1,
                    la1_loginname: 1,
                    lm_char10_12: 1,
                    lm_char1_36: 1,
                    lm_dec_16: 1,
                    lm_int2_3: 1,
                    lm_int4_2: 1,
                    l_remarks: 1,
                    lr_remarks22: 1,
                    l_pricepersqft: 1,
                    lr_remarks22: 1,
                    location: 1,
                    propertyImages: 1,
                    lo1_organizationname: 1,
                    l_askingprice: 1,
                    l_city: 1, l_state: 1, l_zip: 1,
                    l_addressunit: 1,
                    l_streetdesignationid: 1,
                    l_addressnumber: 1,
                    l_addressstreet: 1,
                    l_displayid: 1,
                    lm_dec_7: 1,
                    lm_char10_11: 1,
                    images_count: 1
                };
                var optionsPro = { lean: true };


                // Adding Criteria for Search
                if (payloadData.propertyType) {
                    criteriaPro.lm_char1_36 = payloadData.propertyType
                }

                if (payloadData.typeOfDwelling) {
                    criteriaPro.lm_char10_11 = payloadData.typeOfDwelling
                }

                if (payloadData.listingid) {
                    criteriaPro.l_displayid = payloadData.listingid
                }

                /*if(payloadData.listingid){
                    criteriaPro.l_listingid = payloadData.listingid
                }*/

                if (payloadData.area) {
                    var area_array = payloadData.area.split(',');
                    if (area_array.length > 0) {
                        criteriaPro.l_area = { $in: area_array }
                    }

                }

                if (payloadData.minbathRoom && payloadData.maxbathRoom) {
                    var lm_int1_19 = {
                        $gte: payloadData.minbathRoom,
                        $lte: payloadData.maxbathRoom
                    }
                    criteriaPro.lm_int1_19 = lm_int1_19;
                } else {
                    if (payloadData.minbathRoom) {
                        var lm_int1_19 = {
                            $gte: payloadData.minbathRoom,
                        }
                        criteriaPro.lm_int1_19 = lm_int1_19;
                    }
                    if (payloadData.maxbathRoom) {
                        var lm_int1_19 = {
                            $lte: payloadData.maxbathRoom
                        }
                        criteriaPro.lm_int1_19 = lm_int1_19;
                    }
                }

                if (payloadData.minbedRoom && payloadData.maxbedRoom) {
                    var lm_int1_4 = {
                        $gte: payloadData.minbedRoom,
                        $lte: payloadData.maxbedRoom
                    }
                    criteriaPro.lm_int1_4 = lm_int1_4;
                } else {
                    if (payloadData.minbedRoom) {
                        var lm_int1_4 = {
                            $gte: payloadData.minbedRoom,
                        }
                        criteriaPro.lm_int1_4 = lm_int1_4;
                    }
                    if (payloadData.maxbedRoom) {
                        var lm_int1_4 = {
                            $lte: payloadData.maxbedRoom
                        }
                        criteriaPro.lm_int1_4 = lm_int1_4;
                    }
                }

                if (payloadData.minAskingprice && payloadData.maxAskingprice) {
                    var price = {
                        $gte: payloadData.minAskingprice,
                        $lte: payloadData.maxAskingprice
                    }
                    criteriaPro.l_askingprice = price;
                } else {
                    if (payloadData.minAskingprice) {
                        var price = {
                            $gte: payloadData.minAskingprice,
                        }
                        criteriaPro.l_askingprice = price;
                    }
                    if (payloadData.maxAskingprice) {
                        var price = {
                            $lte: payloadData.maxAskingprice
                        }
                        criteriaPro.l_askingprice = price;
                    }
                };
                if (payloadData.min_lot && payloadData.max_lot) {
                    var lm_dec_11 = {
                        $gte: payloadData.min_lot,
                        $lte: payloadData.max_lot
                    }
                    criteriaPro.lm_dec_11 = lm_dec_11;
                } else {
                    if (payloadData.min_lot) {
                        var lm_dec_11 = {
                            $gte: payloadData.min_lot,
                        }
                        criteriaPro.lm_dec_11 = lm_dec_11;
                    }
                    if (payloadData.max_lot) {
                        var lm_dec_11 = {
                            $lte: payloadData.max_lot
                        }
                        criteriaPro.lm_dec_11 = lm_dec_11;
                    }
                }
                if (payloadData.minFloorSpace && payloadData.maxFloorSpace) {
                    var lm_dec_7 = {
                        $gte: payloadData.minFloorSpace,
                        $lte: payloadData.maxFloorSpace
                    }
                    criteriaPro.lm_dec_7 = lm_dec_7;
                } else {
                    if (payloadData.minFloorSpace) {
                        var lm_dec_7 = {
                            $gte: payloadData.minFloorSpace,
                        }
                        criteriaPro.lm_dec_7 = lm_dec_7;
                    }
                    if (payloadData.maxFloorSpace) {
                        var lm_dec_7 = {
                            $lte: payloadData.max_lot
                        }
                        criteriaPro.lm_dec_7 = lm_dec_7;
                    }
                }
                // Search Criteria ends here
                //.log(criteriaPro);

                Service.REST_PROPERY_RD_1_Service.getData(criteriaPro, projectionPro, optionsPro, (err, data) => {
                    if (err) {
                        //.log("Reaching in IF");
                        // errmsg: 'Loop is not valid
                        var valueToReturn = {
                            "statusCode": 200,
                            "message": "Loop is Not valid",
                            "result": [],
                            "err": err
                        }
                        return cb(valueToReturn);
                    } else if (data.length > 0) {
                        arr = data;
                        return cb();
                    } else {
                        //.log("Coming In else loop. No data found");
                        return cb();
                    }
                });
            } else {
                //.log("Returning from here");
                cb();
            }
        }],
        getPropertyCount: [(cb) => { // //.log("cvcvvcvc===",finalData);
            Service.REST_PROPERY_RD_1_Service.getDataCount({}, (err, data) => {
                if (err) {
                    return cb(err);
                } else {
                    PropertyCount = data
                    return cb();
                }

            });

        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        //  //.log(err,result);
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: arr.length,
            PropertyCount: PropertyCount,
            schoolData: finalData,
            PropertyArray: arr
        });
    })
}

var getAllFrontPages = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [], siteData;
    var criteria = {
        $or: [
            { isdefaultNavigation: true },
            { siteId: payloadData.siteId },
        ],
        isDeleted: false,
    };
    var projection = { __v: 0 };
    var siteOwnerData = {}
    async.auto({
        getAgentData: [(cb) => {
            var criteriAg = {
                _id: Mongoose.Types.ObjectId(payloadData.siteId)
            }
            var proAg = { deletedDefaultNavigation: 1, email: 1, phone: 1, phone: 1, lastName: 1, firstName: 1, verifiedAt: 1 };
            Service.UserService.getUser(criteriAg, proAg, {}, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    siteData = data[0];
                    if (siteData._id) {
                        siteOwnerData.agentId = siteData._id
                    }
                    if (siteData.firstName) {
                        siteOwnerData.agentName = siteData.firstName
                        siteOwnerData.firstName = siteData.firstName
                    }
                    if (siteData.lastName) {
                        siteOwnerData.agentName = siteOwnerData.agentName + ' ' + siteData.lastName
                        siteOwnerData.lastName = siteData.lastName
                    }
                    if (siteData.phone) {
                        siteOwnerData.phone = siteData.phone
                    }
                    if (siteData.email) {
                        siteOwnerData.email = siteData.email
                    }
                    siteOwnerData.ImageUrl = 'N/A'
                    if (siteData.deletedDefaultNavigation && siteData.deletedDefaultNavigation.length > 0) {
                        criteria._id = {
                            $nin: siteData.deletedDefaultNavigation
                        }
                    }

                }; // //.log("==getAllFrontPages==criteria====",criteria);
                return cb(null, { criteria: criteria, siteData: siteData });
            });
        }],
        getData: ['getAgentData', (ag1, cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                /*sort:{
                    schoolAutoIncrement:-1
                }*/
            };
            var populateModel = [
                {
                    path: "pageId",
                    match: {},
                    select: 'PageAutoIncrement title slug templateName isLandingPage',
                    model: 'Pagedetail',
                    options: { lean: true }
                }
            ];
            DBCommonFunction.getDataPopulateOneLevel(Models.FRONTPAGE_MODEL, criteria, projection, options, populateModel, (err, data) => {   // //.log("err====getData",err);
                //Service.FRONTPAGE_SERVICE.getData(criteria,projection,options,(err,data)=> {
                if (err) return cb(err);
                finalData = Utils.universalfunctions.jsonParseStringify(data)
                return cb();
            });
        }],
        setDataFormat: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                if (element.routerLink) {

                    tempData.slug = element.routerLink
                } else {
                    tempData.slug = "N/A"
                }
                if (element.pageId) {
                    tempData.PageAutoIncrement = element.pageId.PageAutoIncrement
                    // //.log("element=====",tempData._id,tempData.pageId.isLandingPage);

                    if (tempData.pageId.isLandingPage == true) {
                        tempData.isLandingPage = true
                    } else {
                        tempData.isLandingPage = false
                    }
                    if (tempData.pageId.templateName) {
                        tempData.templateName = tempData.pageId.templateName
                    } else {
                        tempData.templateName = "N/A"
                    }
                } else {
                    tempData.PageAutoIncrement = 0
                    tempData.slug = "N/A"
                    tempData.templateName = "N/A"
                    tempData.isLandingPage = false
                }
                finalData_new.push(tempData);
            })
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.FRONTPAGE_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            siteOwnerData: siteOwnerData,
            pagelist: finalData
        });
    })
}

var createFrontPage = function (payloadData, UserData, callbackRoute) {
    async.auto({
        checkRouterLink: [(cb) => {
            var criteria = {
                siteId: UserData._id,
                routerLink: payloadData.routerLink
            }
            Service.FRONTPAGE_SERVICE.getData(criteria, {}, {}, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) return cb(Responses.SLUG_ALREADY_EXISTS);
                return cb();
            });
        }],
        CreateSchool: ['checkRouterLink', (ag1, cb) => {
            var dataToSave = payloadData
            dataToSave.siteId = Mongoose.Types.ObjectId(UserData._id)
            Service.FRONTPAGE_SERVICE.InsertData(dataToSave, function (err, result) { // //.log("err",err);
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var editFrontPage = function (payloadData, UserData, callbackRoute) {
    //.log("payloadData", payloadData.templateName);
    var location, postImageUrl, returnedDatas;
    var criteria = {
        _id: payloadData.pageId,
    }
    async.auto({
        InsertPostDataintoDb: [(cb) => {
            var dataToSave = payloadData;

            Service.FRONTPAGE_SERVICE.updateData(criteria, dataToSave, { lean: true }, function (err, result) {  // //.log("err",criteria,err);
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}


var createPage = function (payloadData, UserData, callbackRoute) {
    var location, postImageUrl, returnedDatas;
    async.auto({
        InsertPostDataintoDb: [(cb) => {
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id
            var slug = Utils.universalfunctions.removeSpecialCharacters(payloadData.slug, '');
            slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-');
            if (payloadData.status == POST_STATUS.PUBLISH) {
                dataToSave.publishedAt = new Date().toISOString();
            }
            dataToSave.slug = slug;
            Service.PageDetailService.InsertData(dataToSave, function (err, result) {
                //.log("errr", err);
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var createnewPage = function (payloadData, UserData, callbackRoute) {
    var location, postImageUrl, returnedDatas;
    async.auto({
        InsertPostDataintoDb: [(cb) => {
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id
            if (payloadData.status == POST_STATUS.PUBLISH) {
                dataToSave.publishedAt = new Date().toISOString();
            }
            //dataToSave.slug = slug;
            Service.PageDetailService.InsertData(dataToSave, function (err, result) {
                //.log("errr", err);
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var getAllPages = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = { isDeleted: false };
    var projection = {};
    if (UserData.userType == USER_TYPE.ADMIN || UserData.userType == USER_TYPE.SITE_AGENT) {
        criteria = {
            $or: [
                { siteId: UserData._id },
                { isdefaultNavigation: payloadData.isdefaultNavigation }
            ],
            isDeleted: false
        }
    } else {
        criteria = {
            $or: [
                { siteId: UserData._id },
                { isdefaultNavigation: payloadData.isdefaultNavigation }
            ],
            isDeleted: false
        }
    };
    if (payloadData.isLandingPage == true || payloadData.isLandingPage == false) {
        criteria.isLandingPage = payloadData.isLandingPage
    }
    //.log("getAllpost===criteria", criteria);
    var populateModel = [
        {
            path: "siteId",
            match: {},
            select: 'lastName firstName first last email templateName slug',
            model: 'user',
            options: { lean: true }
        },
        {
            path: "category",
            match: {},
            select: 'category',
            model: 'category',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    publishedAt: -1
                }
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.PageDetail_MODEL, criteria, projection, options, populateModel, (err, data) => { // //.log("err",err);
                //Service.PostService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = data
                return cb(null, { finalData: finalData, criteria: criteria, userData: UserData });
            });
        }],
        setAuthorName: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                var name = null;
                if (tempData.siteId && tempData.userId != null) {
                    if (tempData.userId.firstName) {
                        var name = tempData.userId.firstName;
                    }
                    tempData.AuthorId = tempData.userId._id;
                    tempData.AuthorEmail = tempData.userId.email;
                    tempData.AuthorName = name;
                    delete tempData.userId;
                } else {
                    tempData.AuthorName = "N/A";
                }
                finalData_new.push(tempData);
            })
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            console.log('criteria', criteria)
            Service.PageDetailService.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => {
        //.log("===erredatarrerr===", err, result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: UserData.userType,
            totalRecord: totalRecord,
            postListing: finalData_new
        });
    })
}

var editPage = function (payloadData, UserData, callbackRoute) {
    //.log("payloadData", payloadData.templateName);
    var location, postImageUrl, returnedDatas;
    var criteria = {
        _id: payloadData.pageId,
    }
    async.auto({
        InsertPostDataintoDb: [(cb) => {
            var dataToSave = payloadData;
            //dataToSave.userId= UserData._id
            var slug = Utils.universalfunctions.removeSpecialCharacters(payloadData.slug, '');
            slug = Utils.universalfunctions.replaceCharacterInString(slug, ' ', '-');
            if (payloadData.status == POST_STATUS.PUBLISH) {
                dataToSave.publishedAt = new Date().toISOString();
            }
            if (payloadData.templateName) {
                dataToSave.templateName = payloadData.templateName;
            }
            dataToSave.slug = slug;
            Service.PageDetailService.updateData(criteria, dataToSave, { lean: true }, function (err, result) {  // //.log("err",criteria,err);
                if (err) return cb(err);
                return cb();
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}


var getPageData = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = { isDeleted: false };
    var projection = {};

    var criteria = {
        _id: payloadData.pageId
    }
    var populateModel = [
        {
            path: "userId",
            match: {},
            select: 'lastName firstName first last email',
            model: 'user',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    postAutoIncrement: -1
                }
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.PageDetail_MODEL, criteria, projection, options, populateModel, (err, data) => { // //.log("err",err);
                //Service.PostService.getData(criteria, projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = data
                return cb(null, { criteria: criteria, userData: UserData });
            });
        }],
        setAuthorName: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                var name = null;
                if (tempData.userId && tempData.userId != null) {
                    if (tempData.userId.firstName) {
                        var name = tempData.userId.firstName;
                    }
                    tempData.AuthorId = tempData.userId._id;
                    tempData.AuthorEmail = tempData.userId.email;
                    tempData.AuthorName = name;
                    delete tempData.userId;
                } else {
                    tempData.AuthorName = "N/A";
                }
                finalData_new.push(tempData);
            })
            return cb();
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: UserData.userType,
            totalRecord: totalRecord,
            postListing: finalData_new[0]
        });
    })
}

var deletepage = function (payloadData, UserData, callbackRoute) { // //.log("===deletepage===",payloadData)
    var totalRecord = 0;
    var finalData = [];
    var criteria = {};
    var projection = {};
    async.auto({
        deleteData: [(cb) => {
            var criteria = {
                _id: payloadData.postId
            }
            var dataToSave = {
                isDeleted: true
            };
            Service.PageDetailService.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            })
        }],
        deleteNavigtion: ['deleteData', (ag1, cb) => {
            var criteria = {
                pageId: payloadData.postId
            }
            var dataToSave = {
                isDeleted: true
            };
            Service.FRONTPAGE_SERVICE.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            })
        }],

    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var deleteNavigtion = function (payloadData, UserData, callbackRoute) { // //.log("===UserData===",UserData)
    var totalRecord = 0;
    var finalData = [];
    var navigtionData;
    var criteria = {};
    var projection = {};
    var criteria = {
        _id: payloadData.navigtionId
    }
    async.auto({
        getNavigationData: [(cb) => {
            var dataToSave = {
                isDeleted: true
            };
            Service.FRONTPAGE_SERVICE.getData(criteria, {}, { lean: true }, function (err, result) {
                if (err) return cb(err);
                if (result.length > 0) {
                    navigtionData = result[0];
                }
                return cb();
            })
        }],
        deleteData: ['getNavigationData', (ag1, cb) => {
            if (navigtionData.isdefaultNavigation == true) {
                return cb();
            } else {
                var dataToSave = {
                    isDeleted: true
                };
                Service.FRONTPAGE_SERVICE.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                })
            }
        }],
        UpdateData: ['getNavigationData', (ag1, cb) => {
            if (navigtionData.isdefaultNavigation == true) {
                var criteria1 = {
                    _id: UserData._id
                }
                var dataToSave = {
                    $addToSet: {
                        deletedDefaultNavigation: Mongoose.Types.ObjectId(payloadData.navigtionId)
                    }
                };
                Service.UserService.updateUser(criteria1, dataToSave, { new: true }, function (err, result) {
                    //.log(err, result);
                    if (err) return cb(err);
                    return cb();
                })
            } else {
                return cb();
            }
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var createDuplicateFunnel = function (payloadData, UserData, callbackRoute) {
    var funnelData, funneltemplateData = [];
    var criteria = {
        _id: payloadData.funnelId
    }
    var newFunnelId;
    async.auto({
        getData: [(cb) => {
            var options = { lean: true };
            Service.FUNNEL_SERVICE.getData(criteria, {}, {}, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    funnelData = data[0]
                    console.log(funnelData)
                }
                return cb();
            });
        }],
        getTemplateData: [(cb) => {
            var criteria1 = {
                funnelId: payloadData.funnelId,
                isDeleted: false
            }
            var options = { lean: true };
            var pro = { __v: 0, createdAt: 0, isDeleted: 0 }
            Service.FUNNEL_TEMPLATE_SERVICE.getData(criteria1, pro, options, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    funneltemplateData = data
                }
                return cb();
            });
        }],
        CreateFunel: ['getData', (ag1, cb) => {
            var dataToSave = {
                title: funnelData.title,
                isDeleted: false,
                siteId: UserData._id,
                unsubscribeText: funnelData.unsubscribeText
            }

            Service.FUNNEL_SERVICE.InsertData(dataToSave, function (err, result) { // //.log("err",err);
                console.log("resulttttttttttttttttt", result)
                if (err) return cb(err);
                newFunnelId = result._id;
                return cb();
            });
        }],
        setFunnelTemplateData: ['getTemplateData', 'CreateFunel', (ag1, Outercb) => {
            async.eachSeries(funneltemplateData, function (item, InnerCb) {
                var tempData = item
                tempData.funnelId = newFunnelId
                tempData.isDeleted = false;
                delete tempData._id;
                delete tempData.funnelTemplateAutoIncrement;
                Service.FUNNEL_TEMPLATE_SERVICE.InsertData(tempData, function (err, result) {
                    //.log("err===", newFunnelId, err);
                    if (err) return InnerCb(err);
                    return InnerCb();
                });
            }, function (err, restult) {
                if (err) return Outercb(err);
                return Outercb();
            })
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            newFunnelId: newFunnelId
        });
    });
};

var updateTitleFunnel = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb) => {
            var criteria = {
                _id: payloadData.funnelId,
            }
            var options = {
                new: true,
            }
            var dataToSave = {
                title: payloadData.title
            }
            if (payloadData.unsubscribe) {
                dataToSave.unsubscribe = true
            } else {
                dataToSave.unsubscribe = false
            }

            if (payloadData.unsubscribeText) {
                dataToSave.unsubscribeText = payloadData.unsubscribeText
            }

            //.log("data to save", dataToSave);
            Service.FUNNEL_SERVICE.updateData(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var deleteSchool = function (payloadData, UserData, callbackRoute) {
    async.auto({
        deleteSchool: [(cb) => {
            var criteria = {
                _id: payloadData.schoolId
            }
            Service.SCHOOL_SERVICE.delteRecord(criteria, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            })
        }],
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var addPropertyAgent = function (payloadData, UserData, callbackRoute) {
    var location = {
        type: "Point",
        coordinates: [0, 0]
    }
    var isDeleted = false;
    var propertyAutoIncrement = 0;
    var query = "Insert";
    async.auto({
        checkPropertyExistOrNot: [(cb) => {
            var pro = {
                l_displayid: 1,
                propertyAutoIncrement: 1,
                isDeleted: 1
            }
            var criteria = {
                l_displayid: payloadData.l_displayid,
            }
            Service.REST_PROPERY_RD_1_Service.getData(criteria, pro, { lean: true }, function (err, result) { //console.log("err",err);
                if (err) return cb(err);
                if (result.length > 0) { //console.log("result.length====if",result[0]);
                    if (result) {
                        query = "updated"
                        return cb();
                    } else {//console.log("result.length====else");
                        return cb(Responses.PROPERTY_ALREADY_EXISTS);
                    }

                }
                return cb();
            });
        }],
        InsertData: ['checkPropertyExistOrNot', (ag1, cb) => {
            //console.log(query)
            //.log("InsertData===init")
            if (query == "Insert") { // //.log("InsertData===init==if",query)
                var dataToSave = payloadData;
                dataToSave.l_listingdate = moment().format('YYYY-MM-DD')
                dataToSave.location = location
                dataToSave.agentId = Mongoose.Types.ObjectId(UserData._id);
                //console.log(dataToSave)
                Service.REST_PROPERY_RD_1_Service.InsertData(dataToSave, function (err, result) {
                    console.log(err)
                    //.log("err", err);
                    if (err) return cb(err);
                    propertyAutoIncrement = result.propertyAutoIncrement;
                    return cb();
                });
            } else { // //.log("InsertData===init==else",query)
                return cb();
            }
        }],
        UpdateData: ['checkPropertyExistOrNot', (ag1, cb) => { // //.log("UpdateData===init")
            if (query == "updated") {
                var criteria = {
                    l_displayid: payloadData.l_displayid,
                }
                var options = {
                    new: true
                }
                var dataToSet = payloadData;
                dataToSet.l_listingdate = moment().format('YYYY-MM-DD')
                //dataToSet.location = location
                dataToSet.agentId = Mongoose.Types.ObjectId(UserData._id);
                dataToSet.isDeleted = false
                Service.REST_PROPERY_RD_1_Service.updateData(criteria, dataToSet, options, function (err, result) {
                    //.log("err", err);
                    if (err) return cb(err);
                    propertyAutoIncrement = result.propertyAutoIncrement;
                    return cb();
                });
            } else {
                return cb();
            }
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute(null, { propertyAutoIncrement: propertyAutoIncrement });
    })
}

var getManuallyInsertedPropertyList = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = {
        isDeleted: false,
        agentId: UserData._id
    };
    var projection = {};
    // //.log("getAllpost===criteria",criteria);
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
                sort: {
                    postAutoIncrement: -1
                }
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        addAddressKey: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();
                finalData_new.push(tempData);
            });
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: UserData.userType,
            totalRecord: totalRecord,
            property: finalData_new
        });
    })
}

var deletePropertyAgent = function (payloadData, userData, callbackRoute) {
    async.auto({
        updateProperty: [(cb) => {
            var dataToSet = {
                isDeleted: true,
            }
            var criteria = {
                _id: Mongoose.Types.ObjectId(payloadData.propertyId),
            }
            Service.REST_PROPERY_RD_1_Service.deleteRecord(criteria, {}, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                return cb();
            });
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute()
    })
}
var createSubscriptionPlan = function (payloadData, userData, callbackRoute) {
    var SubscriptionPlanId, SubscriptionPlanData;
    var planData;
    async.auto({
        createPlan: [(cb) => {
            var dataToInsert = payloadData
            Service.SUBSCRIPTION_Plan_SERVICE.InsertData(dataToInsert, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                SubscriptionPlanId = data._id;
                SubscriptionPlanData = data;
                return cb(null, { SubscriptionPlanId: SubscriptionPlanId });
            });
        }],
        stripPlanCreate: ['createPlan', (ag1, cb) => {
            //.log("===stripPlanCreate===")
            var dataT = {
                amount: payloadData.planAmount,
                interval: payloadData.interval,
                product: {
                    name: payloadData.planName,
                },
                currency: "usd",
                metadata: {
                    SubscriptionPlanId: SubscriptionPlanData.SubscriptionIdAutoIncrement
                }
            }
            PAYMENT_CONTROLLER.CreateSubscriptionPlan(dataT, function (err, restult) {
                //.log("===stripPlanCreate===err===", err)
                if (err) return cb(err);
                planData = restult;
                return cb();
            })
        }],
        updatePlanId: ['stripPlanCreate', (ag2, cb) => {
            var criteria = {
                _id: SubscriptionPlanId
            }
            var dataToSet = {
                stripePlanId: planData.id
            }
            Service.SUBSCRIPTION_Plan_SERVICE.updateData(criteria, dataToSet, { lean: true }, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                SubscriptionPlanId = data._id;
                return cb(null, { SubscriptionPlanId: SubscriptionPlanId });
            });
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute()
    })
}

var editSubscriptionPlan = function (payloadData, userData, callbackRoute) {
    var SubscriptionPlanId, SubscriptionPlanData;
    var planData;
    async.auto({
        editPlan: [(cb) => {
            var dataToSet = payloadData
            var criteria = {
                _id: payloadData.planId
            }
            var options = {
                new: true
            }
            Service.SUBSCRIPTION_Plan_SERVICE.updateData(criteria, dataToSet, options, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                SubscriptionPlanId = data._id;
                SubscriptionPlanData = data;
                return cb(null, { SubscriptionPlanId: SubscriptionPlanId });
            });
        }],
        /*stripPlanCreate:['createPlan',(ag1,cb)=>{  //.log("===stripPlanCreate===")
            var dataT= {
                amount:payloadData.planAmount,
                interval:payloadData.interval,
                product: {
                    name:payloadData.planName,
                },
                currency: "usd",
                metadata:{
                    SubscriptionPlanId:SubscriptionPlanData.SubscriptionIdAutoIncrement
                }
            }
            PAYMENT_CONTROLLER.CreateSubscriptionPlan(dataT,function(err,restult){  //.log("===stripPlanCreate===err===",err)
                if(err) return cb(err);
                planData = restult;
                return cb();
            })
        }],
        updatePlanId:['stripPlanCreate',(ag2,cb)=>{
            var criteria = {
                _id:SubscriptionPlanId
            }
            var dataToSet ={
               stripePlanId:planData.id
            }
            Service.SUBSCRIPTION_Plan_SERVICE.updateData(criteria, dataToSet, {lean:true},(err, data)=> { // //.log("===eruuuurerrerr===", data)
                if (err)  return cb(err);
                SubscriptionPlanId = data._id;
                return cb(null,{SubscriptionPlanId:SubscriptionPlanId});
            });
        }] */

    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute()
    })
}

var subscriptionPlanDetail = function (payloadData, userData, callbackRoute) {
    var planData = {};
    var stripePlanData
    async.auto({
        getDataFromDb: [(cb) => {
            var criteria = {
                _id: payloadData.stripePlanId
            }
            Service.SUBSCRIPTION_Plan_SERVICE.getData(criteria, {}, { lean: true }, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    planData = data[0]
                }
                return cb(null, { planData: planData });
            });
        }],
        getStripData: ['getDataFromDb', (ag1, cb) => {
            //.log("===getStripData===", planData)
            var dataT = {
                stripPlanId: planData.stripPlanId
            }
            PAYMENT_CONTROLLER.stripePlansRetrieve(dataT, function (err, restult) {
                //.log("===stripPlanCreate===err===", err)
                if (err) return cb(err);
                stripePlanData = restult;

                return cb();
            })
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute(null, {
            planData: planData
        })
    })
}

var addCardToAgent = function (payloadData, userData, callbackRoute) {
    var customerIdExists = false;
    var stripeData;
    var stripeCustomerId
    async.auto({
        checkStripeCustomerIdExistsORNot: [(cb) => {
            if (userData.customer_id) {
                customerIdExists = true
                stripeCustomerId = userData.customer_id
            }
            return cb();
        }],
        createCustomer: ['checkStripeCustomerIdExistsORNot', (ag1, cb) => { // //.log("createCustomer====");
            if (customerIdExists == false) {
                var data = {
                    email: userData.email
                }
                PAYMENT_CONTROLLER.createCustomer(data, function (err, restult) { // //.log("===stripPlanCreate===err===",err,restult)
                    if (err) return cb(err);
                    //stripeData        = restult;
                    stripeCustomerId = restult.id
                    return cb();
                })
            } else {
                return cb();
            }
        }],
        UpdateCustomerId: ['createCustomer', (ag2, cb) => {
            if (customerIdExists == false) {
                var setCriteria = { _id: userData._id }
                var setQuery = {
                    customer_id: stripeCustomerId
                };
                Service.UserService.updateUser(setCriteria, setQuery, { new: true }, (err, dbData) => {
                    if (err) return cb(err)
                    return cb(null, { customer_id: stripeCustomerId });
                });
            } else {
                return cb();
            }
        }],
        createSource: ['createCustomer', (ag1, cb) => {
            var data = {
                customer_id: stripeCustomerId,
                token: payloadData.cardToken
            }// //.log("data==xx===xx===",data);
            PAYMENT_CONTROLLER.createSource(data, function (err, restult) { // //.log("===stripPlanCreate===err===",err,restult)
                if (err) return cb(err);
                return cb();
            })
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute()
    })

}

var StripeAddPlan = function (payloadData, userData, callbackRoute) {
    var planData;
    var transactionData, stripeCustomerId;
    var customerIdExists = false;
    var cardTokenCu;
    async.auto({
        checkStripeCustomerIdExistsORNot: [(cb) => {
            if (userData.customer_id) {
                customerIdExists = true
                stripeCustomerId = userData.customer_id
            }
            //customerIdExists =false;
            return cb(customerIdExists);
        }],
        generateCardToken: [(cb) => {
            PAYMENT_CONTROLLER.generateCardToken(payloadData, function (err, restult) {
                if (err) return cb(err);
                cardTokenCu = result;
                return cb();
            })
        }],
        getAmount: [(cb) => {
            var criteria = {
                _id: payloadData.stripePlanId
            }
            Service.SUBSCRIPTION_Plan_SERVICE.getData(criteria, {}, { lean: true }, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    planData = data[0]
                }
                return cb(null, { planData: planData });
            });
        }],
        createStripeCustomer: ['checkStripeCustomerIdExistsORNot', (ag1, cb) => {
            if (customerIdExists == false) {
                var data = {
                    email: userData.email
                }
                PAYMENT_CONTROLLER.createCustomer(data, function (err, restult) { // //.log("===stripPlanCreate===err===",err,restult)
                    if (err) return cb(err);
                    //stripeData        = restult;
                    stripeCustomerId = restult.id
                    return cb();
                })
            } else {
                return cb();
            }
        }],
        UpdateCustomerId: ['createStripeCustomer', (ag2, cb) => {
            if (customerIdExists == false) {
                var setCriteria = { _id: userData._id }
                var setQuery = {
                    customer_id: stripeCustomerId
                };
                Service.UserService.updateUser(setCriteria, setQuery, { new: true }, (err, dbData) => {
                    if (err) return cb(err)
                    return cb(null, { customer_id: stripeCustomerId });
                });
            } else {
                return cb();
            }
        }],
        createSource: ['getAmount', 'createStripeCustomer', 'generateCardToken', (ag3, cb) => {
            var data = {
                amount: planData.planAmount,
                customer: stripeCustomerId, // obtained with Stripe.js
                stripePlanId: planData.stripePlanId,
                source: cardTokenCu,
                metadata: { planId: planData.SubscriptionIdAutoIncrement },
            };  //.log("data==", data);

            PAYMENT_CONTROLLER.subscriptionsCreate(data, function (err, restult) { // //.log("===stripPlanCreate===err===",err,restult)
                if (err) return cb(err);
                transactionData = restult;
                return cb();
            })
        }],
        InsertIntoDB: ['createSource', (ag4, cb) => {
            //.log("InsertIntoDB==init")
            var paymentStatus = false
            if (transactionData.status == "succeeded") {
                paymentStatus = true;
            }
            var dataToInsert = {
                userId: userData._id,
                transactionId: transactionData.id,
                planId: payloadData.stripePlanId,
                status: paymentStatus,
                transactionDetail: JSON.stringify(transactionData),
                createdAt: new Date().toISOString()
            }
            Service.PaymentDetailServices.InsertData(dataToInsert, (err, data) => {
                //.log("InsertIntoDB==err", err)
                if (err) return cb(err);
                if (data.length > 0) {
                    planData = data[0]
                }
                return cb(null, { planData: planData });
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var subscriptionPlanList = function (payloadData, userData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {}
    var projection = {}
    if (payloadData.planId) {
        criteria._id = Mongoose.Types.ObjectId(payloadData.planId)
    } else {
        criteria.isDeleted = false
    }
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
            }
            Service.SUBSCRIPTION_Plan_SERVICE.getData(criteria, projection, options, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        count: [(cb) => {
            Service.SUBSCRIPTION_Plan_SERVICE.getData(criteria, projection, {}, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                totalRecord = data.length
                return cb();
            });
        }]

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: userData.userType,
            totalRecord: totalRecord,
            planList: finalData
        });
    })
}

var StripeAddPlanList = function (payloadData, userData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {
        userId: userData._id
    }
    var projection = {}
    var populateModel = [
        {
            path: "planId",
            match: {},
            select: 'planName numberOfMonths interval planAmount',
            model: 'subscriptionplan',
            options: { lean: true }
        },
        {
            path: "userId",
            match: {},
            select: 'email',
            model: 'user',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true,
            }
            DBCommonFunction.getDataPopulateOneLevel(Models.PaymentDetail_MODEL, criteria, projection, options, populateModel, (err, data) => {
                //.log("err", err);
                //Service.SUBSCRIPTION_Plan_SERVICE.getData(criteria, projection, options,(err, data)=> { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        count: [(cb) => {
            Service.PaymentDetailServices.getData(criteria, projection, {}, (err, data) => { // //.log("===eruuuurerrerr===", data)
                if (err) return cb(err);
                totalRecord = data.length
                return cb();
            });
        }]

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userType: userData.userType,
            totalRecord: totalRecord,
            planList: finalData
        });
    })
}

var deleteSubscriptionPlan = function (payloadData, UserData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var dbPlanData;
    async.auto({
        deleteData: [(cb) => {
            var criteria = {
                _id: payloadData.stripePlanId
            }
            var dataToSave = {
                isDeleted: true
            };
            Service.SUBSCRIPTION_Plan_SERVICE.updateData(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                dbPlanData = result;
                return cb();
            })
        }],
        StripeDeletePlan: ['deleteData', (ag1, cb) => {
            var dataT = {
                stripePlan_Id: "plan_CpoSlwuNTKk4RR"
            }
            PAYMENT_CONTROLLER.subscriptionsPlanDelete(dataT, function (err, restult) {
                //.log("===stripPlanCreate===err===", err)
                if (err) return cb(err);
                return cb();
            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

/** Testimonials functions starts here */


var getTestimonials = function (payloadData, callbackRoute) {
    async.auto({
        getTestimonials: [(cb) => {
            //.log("Getting Testimonials From DB==init");
            if (payloadData.type === "Draft") {
                var criteria = {
                    siteId: payloadData.id,
                    status: "Draft"
                }
                // //.log("Data to save --------------------->",dataToSave);
                Service.Testimonial.getTestimonials(criteria, function (err, result) {
                    if (err) return cb(err);
                    //.log("result coming from service", result);
                    // var valueToReturn = {
                    //   "statusCode": 200,
                    //   "message": "successghfg",
                    //   data: result
                    // }
                    return cb(result);

                });
            } else if (payloadData.type === "Publish") {
                var criteria = {
                    $or: [
                        { siteId: payloadData.id },
                        { globalView: true }
                    ],
                    status: "Publish"
                }
                // //.log("Data to save --------------------->",dataToSave);
                Service.Testimonial.getTestimonials(criteria, function (err, result) {
                    if (err) return cb(err);
                    //.log("result coming from service", result);
                    // var valueToReturn = {
                    //   "statusCode": 200,
                    //   "message": "success",
                    //   data: result
                    // }
                    return cb(result);

                });
            } else if (payloadData.type === "All") {
                var criteria = {
                    siteId: payloadData.id
                }
                // //.log("Data to save --------------------->",dataToSave);
                Service.Testimonial.getTestimonials(criteria, function (err, result) {
                    if (err) return cb(err);
                    //.log("result coming from service", result);

                    // var valueToReturn = {
                    //   "statusCode": 200,
                    //   "message": "success",
                    //   data: result
                    // }
                    //var details1 = arraySort(result,'createdAt');
                    console.log("resulttttttttttttttttttttttttt")
                    console.log(result)
                    return cb(result);


                });
            } else {
                return cb("No Matching Data");
            }
        }]

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Testimonials By ID
var getTestimonialById = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({

        getTestimonials: [(cb) => {
            //.log("Getting Testimonials From DB==init");
            var criteria = {
                _id: payloadData.id
            }
            // //.log("Data to save --------------------->",dataToSave);
            Service.Testimonial.getTestimonials(criteria, function (err, result) {
                if (err) return cb(err);
                //.log("result coming from service", result);
                if (result) {
                    return cb(result);
                } else {
                    var value = {
                        "statusCode": 400,
                        "message": "No Testimonials Available with corresponding ID",
                        data: "No Testimonials Available"
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};
//Add Testimonials
var addTestimonial = function (payloadData, UserData, callbackRoute) {
    //.log("SAVE TESTIMONIAL-------------------------------->  ", payloadData);
    // //.log("User Data -------------------------------------->",UserData);
    async.auto({
        saveTestimonialInDB: [(cb) => {
            //.log("saveTestimonialInDB==init");
            var dataToSave = payloadData;
            if (payloadData.siteId) {
                dataToSave.siteId = payloadData.siteId;
                dataToSave.createdBy = UserData._id;
                // dataToSave.userType = "Admin";
            } else {
                dataToSave.siteId = UserData._id;
            }

            //.log("Data to save --------------------->", dataToSave);
            Service.Testimonial.insertTestimonial(dataToSave, function (err, result) {
                if (err) return cb(err);

                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Delete Testimonial controller
var deleteTestimonial = function (payloadData, UserData, callbackRoute) {
    //.log("===deletepage===", payloadData);
    async.auto({
        deleteData: [(cb) => {
            var criteria = {
                _id: payloadData.testimonialId
            }
            var dataToSave = {
                isDeleted: "true"
            };
            Service.Testimonial.deleteTestimonial(criteria, function (err, result) {
                if (err) return cb(err);
                // //.log(result);
                return cb();
            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}
//Edit TESTIMONIALS

var editTestimonial = function (payloadData, UserData, callbackRoute) {
    //.log("===Updatepage===", payloadData);
    async.auto({
        updateData: [(cb) => {
            var criteria = {
                _id: payloadData.testimonialId
            }

            Service.Testimonial.updateTestimonial(criteria, payloadData, { new: true }, function (err, result) {
                if (err) return cb(err);
                //.log(result);
                return cb();
            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

/** Testimonial function ends here **/


//Featured Property Listing Algorithm
var addFeaturedPropertyAlgorithm = function (payloadData, UserData, callbackRoute) {
    async.auto({
        saveFeaturedPropertyAlgorithmInDB: [(cb) => {
            //.log("saveFeaturedPropertyAlgorithmInDB==init");
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id;
            dataToSave.type = payloadData.type;
            //.log("Data to save --------------------->", dataToSave);
            if (payloadData.type) {
                var values = {
                    id: UserData._id,
                    type: payloadData.type
                }
                Service.featuredProperty.checkId(values, function (err, result) {
                    if (result.length > 0) {

                        var criteria = {
                            siteId: UserData._id,
                            type: payloadData.type
                        }
                        Service.featuredProperty.updateFeaturedPropertyAlgorithmService(criteria, payloadData, { new: true }, function (err, result) {
                            if (err) return cb(err);
                            return cb();
                        });
                    } else {
                        Service.featuredProperty.addFeaturedPropertyAlgorithmService(dataToSave, function (err, result) {
                            if (err) return cb(err);
                            return cb();
                        });
                    }

                });
            } else {
                var criteria = {
                    siteId: UserData._id,
                }
                Service.featuredProperty.updateFeaturedPropertyAlgorithmService(criteria, payloadData, { new: true }, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            }


        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


var getFeaturedProperties = function (payloadData, callbackRoute) {
    var agentData, limit;
    var fin = false;
    var runthis = true;
    var arr = [];
    async.auto({
        getData: [(cb) => {
            var criteria2 = {
                siteId: payloadData.siteId,
                userType: 'Agent',
                rotateInFeaturedListing: true
            }
            var criteriaId = payloadData.siteId;
            Service.featuredProperty.getFeaturedPropertyCriteria1(criteria2, function (err, result) {

                if (err) {
                    return cb(err);
                } else if (result) {
                    if (result.includeOwnListing == true) {
                        Service.featuredProperty.getAgentIds(criteria, function (err, foundUser) {
                            if (err) return cb(err);
                            if (foundUser.length > 0) {
                                console.log("Data Coming from ", foundUser);
                                agentData = foundUser;
                                return cb();
                            } else {
                                runthis = false;
                                limit = 10;
                                return cb();
                            }
                        });
                    }
                    else {
                        runthis = false;
                        limit = 10;
                        return cb();
                    }
                }
            })

        }],
        getPropertiesWithAgentId: ['getData', (ag1, cb) => {
            if (runthis == true) {
                console.log(agentData, "AGENTDATA");
                var criteria_1 = {
                    la1_loginname: { $in: agentData },
                }
                criteria_1.images_count != 0;
                // criteria_1["propertyImages.0"] = { $exists : true };
                var options = {
                    lean: true
                }

                console.log("CRITERIA 1 :::::", criteria_1);
                Service.REST_PROPERY_RD_1_Service.getData(criteria_1, projection, options, (err, propertyDetails) => {
                    if (err) return cb(err);
                    if (propertyDetails.length > 0) {
                        var propertyLength = propertyDetails.length;
                        if (propertyLength < 10) {
                            //.log("Data is coming from here 3");

                            limit = 10 - propertyLength;
                            arr = propertyDetails.concat();
                            //  //.log(arr);
                            fin = false
                            return cb();
                        } else {
                            arr = propertyDetails.concat();
                            fin = true;
                            //.log("Data is coming from here 1");
                            var value = {
                                statusCode: 200,
                                status: "success",
                                data: arr
                            }
                            return cb(value);
                        }
                    } else {
                        return cb();
                    }
                });
            } else {
                //.log("Data is coming from here 2");
                fin = false;
                limit = 10;
                return cb();
            }
        }],
        getPropertiesFromAlgorithm: ['getPropertiesWithAgentId', 'getData', (ag2, cb) => {
            //getPropertiesFromAlgorithm: [(cb) => {
            //COde Starts here
            //.log("We are reaching Get properties from algorithm fucntion", fin);
            if (fin == false) {
                criteria = {
                    siteId: payloadData.siteId,
                    type: payloadData.type
                }
                var criteriaId = payloadData.siteId;
                Service.featuredProperty.getFeaturedPropertyCriteria1(criteria, function (err, result) {

                    if (err) {
                        return cb(err);
                    } else if (result.length > 0) {
                        //Property Criteria Found


                        var result = result[0];
                        console.log(agentData, "ojoooooooooojjojojojojoojjojojojojojojo");
                        var criteria = {
                            la1_loginname: { $nin: agentData }
                        };
                        if (result.area) {
                            if (result.area.length > 0) {
                                //  //.log("Reaching area");
                                criteria.l_area = { $in: result.area }
                            }
                        }
                        if (result.city) {
                            if (result.city.length > 0) {
                                //  //.log("Reaching city");
                                criteria.l_city = { $in: result.city }
                            }
                        }
                        //Price
                        if (result.maxAskingprice) {
                            criteria.l_askingprice = { $gte: result.minAskingprice || 0, $lte: result.maxAskingprice }
                        }

                        if (result.minAskingprice && result.maxAskingprice) {
                            criteria.l_askingprice = { $gte: result.minAskingprice, $lte: result.maxAskingprice }
                        }

                        if (result.minAskingprice && !result.maxAskingprice) {
                            criteria.l_askingprice = { $gte: result.minAskingprice }
                        }

                        //Bed
                        if (result.maxbedRoom) {
                            criteria.lm_int1_4 = { $gte: result.minbedRoom || 0, $lte: result.maxbedRoom }
                        }
                        if (result.minbedRoom && result.maxbedRoom) {
                            criteria.lm_int1_4 = { $gte: result.minbedRoom, $lte: result.maxbedRoom }
                        }
                        if (result.minbedRoom && !result.maxbedRoom) {
                            criteria.lm_int1_4 = { $gte: result.minbedRoom }
                        }
                        console.log(criteria.lm_int1_4, " criteria.lm_int1_4")
                        //Bath Rooms
                        if (result.maxbathRoom) {
                            criteria.lm_int1_19 = { $gte: result.minbathRoom || 0, $lte: result.maxbathRoom }
                        }
                        if (result.minbathRoom && result.maxbathRoom) {
                            criteria.lm_int1_19 = { $gte: result.minbathRoom, $lte: result.maxbathRoom }
                        }
                        if (result.minbathRoom && !result.maxbathRoom) {
                            criteria.lm_int1_19 = { $gte: result.minbathRoom }
                        }
                        // criteria["propertyImages.0"] = { $exists : true };
                        if (result.boardUserName) {
                            criteria.la1_loginname = result.boardUserName
                        }
                        // console.log("inminbedroom", result.minbedRoom,result.maxbedRoom);
                        // if (result.minbedRoom) {

                        //     criteria.lm_int1_4 = { $gte: result.minbedRoom, $lte: result.maxbedRoom }
                        // }
                        criteria.images_count != 0;
                        //.log("Before Anything Value of Arr", arr)
                        console.log("CRITERIA dsdss: ", criteria);
                        var skipValue = 0;
                        Service.featuredProperty.getProperties(criteria, limit, skipValue, function (error, properties) {
                            if (error) {
                                return cb(error);
                            } else if (properties.length > 0) {
                                var newArr = arr.concat(properties);
                                //.log("After Everything Value of arr", arr)

                                if (properties.length < 10) {
                                    var ids = [];
                                    properties.forEach(element => {
                                        ids.push(element._id);
                                    });
                                    Service.featuredProperty.getProperties({ _id: { $nin: ids } }, 10 - properties.length, skipValue, function (error, properties2) {

                                        var finalArr = newArr.concat(properties2);
                                        var value = {
                                            statusCode: 200,
                                            status: "success",
                                            data: finalArr
                                        }
                                        return cb(value);
                                    });

                                } else {
                                    var value = {
                                        statusCode: 200,
                                        status: "success",
                                        data: newArr
                                    }
                                    return cb(value);
                                }

                            } else {
                                return cb();
                            }
                        });
                        //Ends here




                    } else {
                        //.log('No Property criteria found. Server is sending only agent properties');
                        var value = {
                            statusCode: 200,
                            status: "success",
                            data: arr
                        }
                        return cb(value);
                    }
                });
            } else {
                //.log("Result coming from this API");
                var value = {
                    statusCode: 200,
                    status: "success",
                    data: arr
                }
                return cb(value);
                // return cb();
            }
            //COde ends here
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        // if(result){
        //
        // }else{
        //   var value = {
        //     statusCode: 200,
        //     status: "No Data Found",
        //     data: ""
        //   }
        //   return callbackRoute(value);
        //
        // }
        return callbackRoute(result);

    });
};

//Add Useful links API
var addUsefulLinks = function (payloadData, UserData, callbackRoute) {
    //.log(payloadData)
    //.log("ADD USEFUL LINKS-------------------------------->  ", payloadData);
    // //.log("User Data -------------------------------------->",UserData);
    async.auto({
        addUsefulLinksInDB: [(cb) => {
            //.log("saveUsefulLinksInDB==init");
            var dataToSave = payloadData;
            if (payloadData.siteId) {
                dataToSave.siteId = payloadData.siteId;
                createdBy: UserData._id;
            } else {
                dataToSave.siteId = UserData._id;
            }

            //.log("Data to save --------------------->", dataToSave);
            Service.usefulLinks.addUsefulLinks(dataToSave, function (err, result) {
                if (err) return cb(err);

                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Add Useful links API
var editUsefulLinks = function (payloadData, UserData, callbackRoute) {
    //.log(payloadData)
    //.log("ADD USEFUL LINKS-------------------------------->  ", payloadData);
    // //.log("User Data -------------------------------------->",UserData);
    async.auto({
        editUsefulLinksInDB: [(cb) => {
            //.log("saveUsefulLinksInDB==init");
            var dataToSave = payloadData;
            //    if (payloadData.siteId) {
            //        dataToSave.siteId = payloadData.siteId;
            //        createdBy: UserData._id;
            //    } else {
            //        dataToSave.siteId = UserData._id;
            //    }

            //.log("Data to save --------------------->", dataToSave);
            Service.usefulLinks.editUsefulLinks(dataToSave, function (err, result) {
                if (err) return cb(err);

                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Delete Useful lInks
var deleteUsefulLinks = function (payloadData, UserData, callbackRoute) {
    //.log("===delete Useful Links===", payloadData);


    async.auto({
        deleteData: [(cb) => {
            var criteria = {
                _id: payloadData.linkId
            }
            // var dataToSave = {
            //   isDeleted:"true"
            // };
            Service.usefulLinks.deleteUsefulLinks(criteria, function (err, result) {
                if (err) return cb(err);
                // //.log(result);
                if (result) {
                    return cb();
                } else {
                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'Useful Link not found'
                    }
                    return cb(value);
                }
                return cb();
            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}


//Get Useful links
var getUsefulLinks = function (payloadData, callbackRoute) {
    //.log("==Get Useful Links===", payloadData);

    var criteria = {};
    async.auto({
        getData: [(cb) => {

            if (payloadData.type == 'footer') {
                criteria = {
                    $or: [{ siteId: payloadData.id }, { globalView: true }],
                    type: { $in: ['footer'] }
                }
            }
            else if (payloadData.type == 'sidebar') {
                criteria = {
                    $or: [{ siteId: payloadData.id }, { globalView: true }],
                    type: { $in: ['sidebar'] }
                }
            }
            else if (payloadData.role == 'Admin') {
                criteria = {}
            }
            else {
                criteria = {
                    $or: [{ siteId: payloadData.id }, { globalView: true }]

                }
            }
            // var dataToSave = {
            //   isDeleted:"true"
            // };
            Service.usefulLinks.getUsefulLinks(criteria, payloadData, function (err, result) {
                if (err) {
                    console.log(err);
                    return cb(err);
                }
                // //.log(result);
                if (!result.length) {

                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'Useful Links not found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }


            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}


// Get GLobal Useful lInks
var getGlobalUsefulLinks = function (payloadData, callbackRoute) {
    //.log("==Get Useful Links===", payloadData);
    async.auto({
        getData: [(cb) => {
            var criteria = {
                globalView: true
            }
            Service.usefulLinks.getGlobalUsefulLinks(criteria, payloadData, function (err, result) {
                if (err) return cb(err);
                // //.log(result);
                if (!result.length) {
                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'Useful Links not found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }


            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

//Get Company Address
var getContactInfo = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getData: [(cb) => {
            //.log("===Get Company Address===");

            var criteriaId = payloadData.id;
            var criteria = {
                siteId: payloadData.id
            }
            Service.companyAddress.getInfo(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {

                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'Company address not found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }
                // return cb(result);
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};



// Add or update Contact Information
var addContactInfo = function (payloadData, UserData, callbackRoute) {
    async.auto({
        addContactInfoInDB: [(cb) => {
            //.log("addContactInfoInDB==init");
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id;
            //.log("Data to save --------------------->", dataToSave);
            Service.companyAddress.checkId(UserData._id, function (err, result) {
                if (err) return cb(err);
                //.log("++++++++++++++++++++++++++++++RESULT+++++++++++++++++++++++++++", result);
                if (!result.length) {
                    Service.companyAddress.addInfo(dataToSave, function (err, result) {
                        if (err) return cb(err);
                        return cb();
                    });
                } else {
                    var criteria = {
                        siteId: UserData._id
                    }
                    Service.companyAddress.updateInfo(criteria, payloadData, { new: true }, function (err, result) {
                        if (err) return cb(err);
                        return cb();
                    });
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Add or update Contact Information
var addContactInfoListing = function (payloadData, UserData, callbackRoute) {
    async.auto({
        addContactInfoListingInDB: [(cb) => {
            //.log("add Contact Info Listing InDB==init");
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id;
            //.log("Data to save --------------------->", dataToSave);
            Service.companyAddress.checkIdListing(UserData._id, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {
                    Service.companyAddress.addListing(dataToSave, function (err, result) {
                        if (err) return cb(err);
                        return cb();
                    });
                } else {
                    var criteria = {
                        siteId: UserData._id
                    }
                    Service.companyAddress.updateListing(criteria, payloadData, { new: true }, function (err, result) {
                        if (err) return cb(err);
                        return cb();
                    });
                }
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};
//Get Listed Contact Information
var getListedContactInfo = function (payloadData, callbackRoute) {
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Listed Contact info From DB==init");
            var criteriaId = payloadData.id;
            var criteria = {
                siteId: payloadData.id
            }
            Service.companyAddress.getListing(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {

                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'Contact information not found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Add or update ABout US
var addAboutUs = function (payloadData, UserData, callbackRoute) {
    //.log("Add Contact Info-------------------------------->  ", payloadData);
    //.log("User Data -------------------------------------->", UserData._id);

    async.auto({
        addAboutUsInDB: [(cb) => {
            //.log("addContactInfoInDB==init");
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id;
            //.log("Data to save --------------------->", dataToSave);
            Service.aboutUs.checkId(UserData._id, function (err, result) {
                if (err) return cb(err);
                // //.log("++++++++++++++++++++++++++++++RESULT+++++++++++++++++++++++++++",result);
                if (!result.length) {
                    //.log("IN IFFFF LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPPPPPPPPPPPPPPPPp");
                    Service.aboutUs.addInfo(dataToSave, function (err, data) {
                        if (err) return cb(err);
                        return cb();
                    });
                } else {
                    //.log("IN ELSE  LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPPPPPPPPPPPPPPPPp");
                    var criteria = {
                        siteId: UserData._id
                    }
                    Service.aboutUs.updateInfo(criteria, payloadData, { new: true }, function (err, data) {
                        if (err) return cb(err);
                        return cb();
                    });
                }
                //  //.log("Result on admin controller :",result);
                // return cb(result);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get About us
var getAboutUs = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting About Us data From DB==init");

            var criteriaId = payloadData.id;
            var criteria = {
                siteId: payloadData.id
            }
            Service.aboutUs.getInfo(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {

                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'page not found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }
                // return cb(result);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Add Comments
var addComment = function (payloadData, UserData, callbackRoute) {
    async.auto({
        addCommentsInDB: [(cb) => {
            var dataToSave = payloadData;
            dataToSave.userId = UserData._id;
            dataToSave.isVisible = true;
            Service.PostService.addComments(dataToSave, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {

        //.log('dsfdfsdf ', result);


        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Comments Public API
var getComments = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting comments data From DB==init");

            var criteriaId = payloadData.id;
            var criteria = {
                siteId: payloadData.id,
                postId: payloadData.postId,
                isVisible: true
            }
            Service.PostService.getComments(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {
                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'No comments found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Delete Comments
var deleteComment = function (payloadData, UserData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting comments data From DB==init");

            var criteriaId = payloadData.id;
            var criteria = {
                _id: payloadData.commentId,
                userId: payloadData.userId
            }
            Service.PostService.deleteComments(criteria, function (err, result) {
                if (err) return cb(err);
                //.log("COMING AFTER DELETING THE COMMENTS", result);

                if (result === null) {
                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'Comment not found'
                    }
                    return cb(value);
                } else {
                    return cb();
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Validate Comment Admin
var validateComment = function (payloadData, UserData, callbackRoute) {
    //.log("Add Contact Info-------------------------------->  ", payloadData);
    //.log("User Data -------------------------------------->", UserData._id);

    async.auto({
        validateCommentInDB: [(cb) => {
            //.log("addContactInfoInDB==init");

            var criteria = {
                _id: payloadData.commentId
            }
            // RetsProperty
            Service.PostService.validateComment(criteria, payloadData, { new: true }, function (err, data) {
                if (err) return cb(err);

                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Delete Comment Admin
var deleteCommentsAdmin = function (payloadData, userData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Deleting comments data From DB==init");

            //var criteriaId = payloadData.id;
            var criteria = {
                _id: payloadData.commentId
            }
            Service.PostService.deleteCommentsAdmin(criteria, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Comments Public API
var getCommentsAdmin = function (userData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting comments ADMIN From DB==init");
            var criteria = {
                siteId: userData.id
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria)
            Service.PostService.getCommentsAdmin(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {
                    var value = {
                        statusCode: 404,
                        status: "warning",
                        message: 'No Comments Found'
                    }
                    return cb(value);
                } else {
                    return cb(result);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Add Category
var addCategory = function (payloadData, UserData, callbackRoute) {
    //.log("ADD Category-------------------------------->  ", payloadData);
    //.log("User Data -------------------------------------->", UserData);
    async.auto({
        addCategoryInDB: [(cb) => {
            //.log("saveCommentsInDB==init");
            var dataToSave = payloadData;

            //.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++", dataToSave);
            Service.category.addCategory(dataToSave, function (err, result) {
                if (err) return cb(err);

                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Delete Categories
var deleteCategory = function (payloadData, userData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Deleting Category data From DB==init");

            //var criteriaId = payloadData.id;
            var criteria = {
                _id: payloadData.categoryId
            }
            var objToSave = {
                isDeleted: true
            }
            Service.category.deleteCategory(criteria, objToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Category Public API
var getCategory = function (userData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Categories From DB==init");
            var criteria = {
                siteId: userData.id,
                isDeleted: false
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria)
            Service.category.getCategory(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Categories Found'
                    }
                    return cb(value);
                } else {
                    var details1 = arraySort(result, 'createdAt', { reverse: true });
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: details1
                    }

                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getFeaturedPropertyAlgorithm = function (payloadData, userData, callbackRoute) {
    async.auto({
        getFeaturedAlgorithm: [(cb) => {
            //.log("Getting Criteria From DB==init");
            //.log("Payload DATA : ", payloadData);
            var criteriaId = payloadData.id;
            // //.log("Data to save --------------------->",dataToSave);
            Service.featuredProperty.getFeaturedPropertyCriteria(criteriaId, function (err, result) {
                if (err) {
                    return cb(err);
                } else if (result) {
                    var value = {
                        statusCode: 200,
                        status: "Success",
                        data: result
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 404,
                        status: "Failure",
                        message: "Featured Property Algorithm not found"
                    }
                    return cb(value);
                }
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Get Recent properties
var getRecentProperties = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    var longitude = payloadData.longitude || 151.209900;
    var latitude = payloadData.latitude || -33.865143;
    //.log(longitude);
    //.log(latitude);
    async.auto({
        getPropertiesFromDb: [(cb) => {
            //.log("Getting Criteria From DB==init");
            //.log("Getting Criteria From DB==init");
            //.log("Payload DATA : ", payloadData);
            // var longitude = payloadData.longitude;
            // var latitude =  payloadData.latitude;
            var options = {
                lean: true
            };
            var criteria = {
                location:
                {
                    $near:
                    {
                        $geometry: { type: "Point", coordinates: [longitude, latitude] },
                        $maxDistance: 40233.6
                    }
                },
                createdAt: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) }

            }
            // criteria["propertyImages.0"] = { $exists : true };
            //.log("CRITERIA :::::", criteria);
            Service.REST_PROPERY_RD_1_Service.getRecent(criteria, projection, options, (err, data) => {
                if (err) {
                    return cb(err);
                } else if (data.length > 0) {
                    var value = {
                        statusCode: 200,
                        status: "Success",
                        data: data
                    }
                    return cb(value);
                } else {
                    //**************************************************SECOND CONDITION****************************************/
                    //.log("REACHING HERE");
                    var options1 = {
                        lean: true,
                        sort: {
                            createdAt: -1
                        }
                    }
                    var criteria_B = {
                        location:
                        {
                            $near:
                            {
                                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                                $maxDistance: 40233.6
                            }
                        }
                    }
                    // criteria_B["propertyImages.0"] = { $exists : true };
                    Service.REST_PROPERY_RD_1_Service.getRecent(criteria_B, projection, options1, (err, data1) => {
                        if (err) {
                            return cb(err);
                        } else if (data1.length > 0) {
                            //.log("Coming In second LOOOPPPPP");

                            var value1 = {
                                statusCode: 200,
                                status: "Success",
                                data: data1
                            }
                            return cb(value1);
                        } else {
                            //**************************************************THIRD CONDITION****************************************/
                            //.log("REACHING HERE 3rd condition");
                            var options2 = {
                                lean: true
                            }
                            var criteria_C = {
                                createdAt: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) }
                            };
                            // criteria_C["propertyImages.0"] = { $exists : true };
                            Service.REST_PROPERY_RD_1_Service.getRecentLoop(criteria_C, projection, options2, (err, data2) => {
                                if (err) {
                                    return cb(err);
                                } else if (data2.length > 0) {
                                    //  //.log("Coming In second LOOOPPPPP");

                                    var value2 = {
                                        statusCode: 200,
                                        status: "Success",
                                        data: data2
                                    }
                                    return cb(value2);
                                } else {
                                    //FOURTH CONDITION COMES HERE
                                    var options3 = {
                                        lean: true,
                                        sort: {
                                            createdAt: -1
                                        }
                                    }
                                    var criteria_D = {

                                    }
                                    // criteria_D["propertyImages.0"] = { $exists : true };
                                    Service.REST_PROPERY_RD_1_Service.getRecentLoop(criteria_D, projection, options3, (err, data3) => {
                                        if (err) {
                                            return cb(err);
                                        } else if (data3.length > 0) {
                                            //.log("Coming In second LOOOPPPPP");

                                            var value3 = {
                                                statusCode: 200,
                                                status: "Success",
                                                data: data3
                                            }
                                            return cb(value3);
                                        } else {
                                            //FIFTh condition
                                            var options4 = {
                                                lean: true,
                                                sort: {
                                                    createdAt: -1
                                                }
                                            }

                                            var criteria_E = {}
                                            // criteria_E["propertyImages.0"] = { $exists : true };
                                            Service.REST_PROPERY_RD_1_Service.getRecent(criteria_E, projection, options4, (err, data4) => {
                                                if (err) {
                                                    return cb(err);
                                                } else if (data4.length > 0) {
                                                    //.log("Coming In second LOOOPPPPP");

                                                    var value4 = {
                                                        statusCode: 200,
                                                        status: "Success",
                                                        data: data4
                                                    }
                                                    return cb(value4);
                                                } else {
                                                    //**************************************************TERMINATION CONDITION****************************************/
                                                    var value5 = {
                                                        statusCode: 400,
                                                        status: "Failure",
                                                        message: "No properties Found"
                                                    }
                                                    return cb(value5);
                                                }
                                            });
                                        }
                                    });

                                }
                            });
                            //  //.log("No data Found");
                        }
                    });
                    // var value = {
                    //       statusCode: 404,
                    //       status: "Failure",
                    //       message: "No Properties Found"
                    // }
                    // return cb(value);
                }


                // return cb(value);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Add Mortgage
var addMortgage = function (payloadData, UserData, callbackRoute) {
    async.auto({
        addMortgageInDB: [(cb) => {
            //.log("Add Mortgage ==init");
            var dataToSave = payloadData;
            //.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++", dataToSave);
            Service.mortgage.addMortgage(dataToSave, function (err, result) {
                if (err) return cb(err);

                return cb(result);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Delete Mortgage
var deleteMortgage = function (payloadData, UserData, callbackRoute) {
    //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Deleting Mortgage data From DB==init");

            //var criteriaId = payloadData.id;
            var criteria = {
                _id: payloadData.mortgageId
            }

            Service.mortgage.deleteMortgage(criteria, function (err, result) {
                if (err) return cb(err);
                return cb(result);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Mortgage Public API
var getMortgage = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Categories From DB==init");
            var criteria = {
                siteId: payloadData.siteId
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria)
            Service.mortgage.getMortgage(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Mortgages Found'
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: result
                    }

                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Rate for mortgage
var getRate = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Categories From DB==init");
            var criteria = {
                _id: payloadData.rateId
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria)
            Service.mortgage.getRate(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result) {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Mortgage Found'
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: result
                    }

                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Mortgage rate search API
var mortgageRateSearch = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            var criteria = {};
            if (payloadData.type) {
                criteria.type = payloadData.type
            }
            if (payloadData.term) {
                criteria.term = payloadData.term
            }
            if (payloadData.provider) {
                criteria.provider = payloadData.provider
            }

            if (payloadData.location) {
                criteria.location = { $regex: payloadData.location, $options: "$i" }
            }

            if (payloadData.rate) {
                criteria.rate = payloadData.rate
            }

            Service.mortgage.getMortgage(criteria, function (err, result) {
                if (err) return cb(err);
                if (!result.length) {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Mortgages Found'
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: result
                    }

                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};
//Update Company Address
var editMortgage = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }
            //.log(criteria);
            Service.mortgage.editMortgage(criteria, payloadData, { new: true }, function (err, result) {
                if (err) return cb(err);
                //.log(result);
                return cb();
            })
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute();
    })
}

var getCities = function (callbackRoute) {
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Categories From DB==init");
            Service.mortgage.getCity(function (err, result) {
                if (err) return cb(err);
                var value = {
                    statusCode: 200,
                    status: "success",
                    data: result
                }
                return cb(value);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getAllCitiesList = function (callbackRoute) {
    //.log("getAllCityList===init");
    var finalData = [];
    async.auto({
        getDistinctCity: [function (cb) {
            //.log("getDistinctArea===init");
            var match = {
                $match: {
                    "l_city": {
                        $nin: ["", " ", null]
                    }
                }
            };
            var groupBy = {
                $group: { _id: null, uniqueValues: { $addToSet: "$l_city" } }
            }; //'retspropertyrd_1'
            DBCommonFunction.aggregate(Models.REST_PROPERY_RD_1, [match, groupBy], (err, data) => {  // //.log("err,data",err,data);
                if (err) return cb(err);
                finalData = _.sortBy(data[0].uniqueValues); //_.sortBy(myArray, 'total');
                return cb();
            });
        }],
    }, function (err, result) {
        //.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            finalData: finalData,
        });
    })
}

//Get Favourites
var getFavourites = function (payloadData, callbackRoute) {
    //.log("getFavourites===init");
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Categories From DB==init");
            var criteria = {
                user: payloadData.id
            }
            Service.MARK_FAVORITE_SERVICE.getFavs(criteria, function (err, result) {
                if (err) return cb(err);

                if (result.length > 0) {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: result
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 400,
                        status: "No Favs Found",
                        data: ""
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
}

//Add Home Worth API new
var addHomeWorth = function (payloadData, callbackRoute) {
    //.log("ADD Home Worth-------------------------------->  ", payloadData);
    var location, postImageUrl, returnedDatas;
    var funneltemplateData = [];
    var templateId;
    var alreadySendOrNot = false
    var ThemeData = {};
    var updateUserData;
    var dataToSave = {};
    var userData
    //  //.log("User Data -------------------------------------->",UserData);
    async.auto({

        // registerUser: [ (cb) => {
        //     var dataToSet = {

        //         email:payloadData.email,
        //         firstName:payloadData.firstName,
        //         lastName:payloadData.lastName,
        //         siteId:payloadData.siteId,


        //     }
        //     if (payloadData.ContactNumber) {
        //             dataToSet.phone = payloadData.ContactNumber;
        //         }

        //         if (!payloadData.password) {

        //             var password = generator.generate({
        //                 length: 8,
        //                 numbers: true
        //             });

        //             var password_latest = Utils.universalfunctions.encryptpassword(password);  //UniversalFunctions.CryptData(res + res1);
        //             dataToSet.password = password_latest;
        //         }


        //     dataToSet.isEmailVerified = true;
        //     dataToSet.userType = "Seller"
        //     Service.UserService.createUser(dataToSet, function (err,user ) { console.log("createUser======err",err);
        //         if (err && err.customMessage == 'Email already exists'){
        //             return cb();
        //         }
        //         else if(user){

        //             var criteria = {
        //                 siteId: payloadData.siteId
        //             }
        //             // var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
        //             //                 var fileReadStream = fs.createReadStream(templatepath + 'newLeadAssigned.html');
        //             //                 var emailTemplate = '';
        //             Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) {
        //             //     console.log('result of theme settingssss',result)
        //             //     var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
        //             //                         fileReadStream.on('end', function (res) {
        //             //                             var message = "New Email and Password : <br><br>Email : " + payloadData.email + "<br> password : " + password_latest;
        //             //                             var sendStr = emailTemplate.replace('{{imagePath}}', imagePath).replace('{{name}}', payloadData.firstName || "Agent").replace('{{message}}', message).replace('{{signature}}', result[0].signature);
        //                                         // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
        //                                         var email_data = { // set email variables for user
        //                                             to: payloadData.email,
        //                                             from: result[0].fromName + '<' + result[0].fromEmail + '>',
        //                                             subject: 'New email and password',
        //                                             html: '<strong>'+ payloadData.email +'  '+ password +'</strong>'
        //                                         };
        //                                         Utils.universalfunctions.send_email(email_data, (err, res) => {
        //                                             if (err){
        //                                                 console.log('errrrrrr',err)
        //                                                 return cb(err);
        //                                             }
        //                                             return cb();
        //                                             //.log("homeWorth Lead Assigned to agent successfully");
        //                                         });
        //                                     // });
        //              })
        //         }else{
        //             return cb(err);
        //         }

        //     });
        // }],

        addHomeWorthInDB: [(cb) => {
            //.log("AddHomeworthInDB==init");
            dataToSave = payloadData;
            Service.homeWorth.checkId(payloadData.siteId, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                }
                if (result.length == 0) {
                    //.log('hfhfhfhffhhfhfhfhfhfhf')
                    return cb(Responses.selectfunnel);
                }
                // //.log("++++++++++++++++++++++++++++++RESULT+++++++++++++++++++++++++++",result);

                // Models.retspropertyrd_1.find({},function(err,resultForList){
                //     console.log(resultForList,"resultForList")
                // var isListed ;   
                // if(resultForList){
                //     isListed = true;
                // }else{
                //     isListed = false;
                //  }
                if (result.length > 0) {
                    dataToSave.sellerEmail = payloadData.email
                    dataToSave.funnelId = result[0].funnelId;
                    payloadData.funnelId = result[0].funnelId;
                    payloadData.status = "No Contact";
                    // payloadData.isListed = false;


                    //.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    Service.homeWorth.assignHomeWorthLead(dataToSave, function (err, leadAssigned) {
                        if (err) {
                            //.log(err);
                        } else if (leadAssigned) {
                            updateUserData = leadAssigned;
                            //  //.log("Everything fine till here 1");
                            var value = {
                                statusCode: 200,
                                status: "Home worth data saved successfully",
                                data: leadAssigned
                            }
                            var cr = {
                                _id: leadAssigned.assignedTo
                            }
                            Service.homeWorth.sendEmail(cr, function (err, details) {
                                if (err) {
                                    //.log("Error While Sending EMail");
                                } else if (details) {
                                    //Sending EMail To Agent
                                    var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                                    var fileReadStream = fs.createReadStream(templatepath + 'new_lead.html');
                                    var emailTemplate = '';
                                    fileReadStream.on('data', function (buffer) {
                                        emailTemplate += buffer.toString();
                                    });
                                    // var path = Configs.CONSTS.accountconfirmationUrl+ '/' + payloadData.email + '/' + verificationToken;

                                    // var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                                    var criteria = {
                                        siteId: payloadData.siteId
                                    }

                                    Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) {
                                        if (err) {
                                            //.log(err);
                                            fileReadStream.on('end', function (res) {
                                                var message = "A new Lead is assigned to you with following details : <br><br>Name : " + leadAssigned.firstName + "<br> Phone : " + leadAssigned.phoneNumber +
                                                    "<br> email : " + leadAssigned.email + "<br> ";
                                                var sendStr = emailTemplate.replace('{{message}}', message);
                                                // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                                var email_data = { // set email variables for user
                                                    to: details.email,
                                                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                    subject: 'Lead Assigned',
                                                    html: sendStr
                                                };
                                                Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                    if (err) return cb(err);
                                                    console.log("homeWorth Lead Assigned to agent successfully0");
                                                });
                                            });
                                        } else if (result.length > 0) {
                                            //.log("Reachhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                                            var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                                            fileReadStream.on('end', function (res) {

                                                var message = "A new Lead is assigned to you with following details : <br><br>Name : " + leadAssigned.firstName + "<br> Phone : " + leadAssigned.phoneNumber +
                                                    "<br> email : " + leadAssigned.email + "<br> ";

                                                var sendStr = emailTemplate.replace('{{imagePath}}',
                                                    imagePath)
                                                    .replace('{{name}}', details.firstName || "Agent")
                                                    .replace('{{message}}', message)
                                                    .replace('{{signature}}', result[0].signature)
                                                    .replace('{{logo}}', result[0].logoUrl);
                                                // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                                var email_data = { // set email variables for user
                                                    to: details.email,
                                                    from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                                    subject: 'Lead Assigned',
                                                    html: sendStr
                                                };
                                                console.log('emailData', email_data)
                                                Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                    if (err) return cb(err);
                                                    console.log("homeWorth Lead Assigned to agent successfully1");
                                                });
                                            });
                                        } else {
                                            fileReadStream.on('end', function (res) {
                                                var message = "A new Lead is assigned to you with following details : <br><br>Name : " + leadAssigned.firstName + "<br> Phone : " + leadAssigned.phoneNumber +
                                                    "<br> email : " + leadAssigned.email + "<br> ";
                                                var sendStr = emailTemplate.replace('{{message}}', message);
                                                // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                                var email_data = { // set email variables for user
                                                    to: details.email,
                                                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                    subject: 'Lead Assigned',
                                                    html: sendStr
                                                };
                                                Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                    if (err) return cb(err);
                                                    console.log("homeWorth Lead Assigned to agent successfully2");
                                                });
                                            });
                                        }
                                    });

                                    //Sending EMail TO Agent
                                    payloadData.userId = leadAssigned._id
                                    return cb();
                                } else {
                                    return cb();
                                }
                            });

                            //Sending Email to Agent
                            // return cb(value)
                        } else {
                            //.log("Something went wrong while assigning leads. Please try again later");
                        }
                    });
                } else {

                    return cb();
                }

            });

            //}],checkFunnelGetData:[(cb)=>{

        }], checkFunnelGetData: ['addHomeWorthInDB', (ag1, cb) => {

            //  //.log("+++++++++++++++++++++++++++++++++++++");
            //  //.log(dataToSave);
            //  //.log("====================================");
            if (payloadData.funnelId) {
                var criteria = {
                    funnelId: payloadData.funnelId,
                    emailTimeInterval: 0
                }
                var dataToSave = payloadData;
                Service.FUNNEL_TEMPLATE_SERVICE.getData(criteria, {}, { new: true }, function (err, result) {
                    if (err) return cb(err);
                    //.log("***************************************************************");
                    //.log(result);
                    //.log("****************************************************************");
                    funneltemplateData = result;
                    return cb();
                });

            } else {
                return cb();
            }
        }], getThemeData: ['checkFunnelGetData', (ag1, cb) => {
            if (payloadData.funnelId && updateUserData.siteId) {
                var criteria = {
                    siteId: updateUserData.siteId
                }
                var options = { lean: true };
                Service.ThemeSetting_SERVICE.getData(criteria, {}, options, (err, data) => {
                    if (err) return cb(err);
                    if (data.length > 0) {
                        ThemeData = data[0]
                    }
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        checkEmailSendORNot: ['checkFunnelGetData', (ag1, cb) => {
            if (payloadData.funnelId && funneltemplateData.length > 0) {
                var criteria = {
                    funnelId: payloadData.funnelId,
                    userId: payloadData._id,
                    funneltemplateId: funneltemplateData[0]._id,
                }
                Service.EmailSendDetail_SERVICE.getData(criteria, {}, { new: true }, function (err, result) {
                    if (err) {
                        //  //.log("Pen testing");
                        return cb(err);
                    }
                    if (result.length > 0) {
                        alreadySendOrNot = true;
                    }
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        InsertLastemailSendDetail: ['checkEmailSendORNot', (ag1, cb) => { // //.log("item===funneltemplateData===init",funneltemplateData.length);
            if (payloadData.funnelId && funneltemplateData.length > 0 && alreadySendOrNot == false) {
                var dataToSave = {
                    userId: payloadData.userId,
                    funnelId: funneltemplateData[0].funnelId,
                    funneltemplateId: funneltemplateData[0]._id,
                    emailSendDate: new Date().toISOString()
                }
                Service.EmailSendDetail_SERVICE.InsertData(dataToSave, function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        sendEmailToUser: ['checkEmailSendORNot', 'getThemeData', (ag2, cb) => { // //.log("item===sendEmailToUser===init",payloadData.email);
            if (payloadData.funnelId && funneltemplateData.length > 0 && alreadySendOrNot == false) {
                var firstName = Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var emailTemplateHtml = funneltemplateData[0].emailTemplateHtml;
                var subject = funneltemplateData[0].subject;
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'funnelTemplate.html');
                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });
                //.log("ThemeData", ThemeData);
                if (ThemeData.logoUrl) {
                    var imagePath = "http://api.uat.djt.ca/Assets/" + ThemeData.logoUrl;
                } else {
                    var imagePath = "http://dev.citruscow.com/assets/email_Images/logo.png";
                }
                var criteria = {
                    siteId: payloadData.siteId
                }

                Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) {
                    if (err) {
                        //.log(err);
                        fileReadStream.on('end', function (res) { //logopath
                            // var sendStr = emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                            var messageToSend = eb(emailTemplateHtml, { SIGNATURE: " ", FIRSTNAME: payloadData.firstName, LASTNAME: payloadData.lastName, EMAIL: payloadData.email, PHONE: payloadData.phoneNumber })
                            // var sendStr = emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                            var subject = funneltemplateData[0].subject;
                            var email_data = { // set email variables for user
                                to: payloadData.email, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                subject: subject,
                                // html: sendStr
                                html: messageToSend
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if (err) return cb(err);
                                return cb()
                            });
                        })
                        return cb();
                    } else if (result.length > 0) {
                        fileReadStream.on('end', function (res) { //logopath
                            // var sendStr = emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)

                            // var messageToSend = eb(emailTemplateHtml,{signature : result[0].signature })
                            var messageToSend = eb(emailTemplateHtml, { SIGNATURE: result[0].signature, FIRSTNAME: payloadData.firstName, LASTNAME: payloadData.lastName, EMAIL: payloadData.email, PHONE: payloadData.phoneNumber })
                            var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{logopath}}', imagePath).replace('{{message}}', emailTemplateHtml)
                            var subject = funneltemplateData[0].subject;
                            var email_data = { // set email variables for user
                                to: payloadData.email, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                // from: 'Southsurrey <' + result[0].fromEmail + '>',
                                from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                subject: subject,
                                // html: sendStr
                                html: messageToSend
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if (err) return cb(err);
                                return cb()
                            });
                        })
                    } else {
                        fileReadStream.on('end', function (res) { //logopath
                            // var sendStr = emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                            var messageToSend = eb(emailTemplateHtml, { SIGNATURE: " ", FIRSTNAME: payloadData.firstName, LASTNAME: payloadData.lastName, EMAIL: payloadData.email, PHONE: payloadData.phoneNumber })

                            // var sendStr = emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                            var subject = funneltemplateData[0].subject;
                            var email_data = { // set email variables for user
                                to: payloadData.email, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                // from: 'Southsurrey <' + result[0].fromEmail + '>',
                                from: 'Southsurrey <' + result[0].fromEmail + '>',
                                subject: subject,
                                // html: sendStr
                                html: messageToSend
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                if (err) return cb(err);
                                return cb()
                            });
                        })
                    }
                });

            } else {
                return cb()
            }
        }],

    }, (err, result) => {
        if (err) {
            //.log(err);
            return callbackRoute(err);

        }
        var value = {
            statusCode: 200,
            status: "success",
            data: payloadData
        }
        return callbackRoute(value);
    });
};
//Add Home APi Ends Here

// Terms and Condtions
var addTerms = function (payloadData, UserData, callbackRoute) {
    async.auto({
        addTermsInDb: [(cb) => {
            //.log("Add Terms and conditions in database==init");
            var dataToSave = payloadData;
            dataToSave.siteId = UserData._id;
            //.log("Data to save --------------------->", dataToSave);
            Service.termsService.checkId(UserData._id, function (err, result) {
                if (err) return cb(err);

                if (!result.length) {
                    Service.termsService.addTermsService(dataToSave, function (err, result) {
                        if (err) return cb(err);
                        var value = {
                            statusCode: 200,
                            status: "success",
                            data: result
                        }
                        return callbackRoute(value);
                    });
                } else {
                    //   //.log("IN ELSE  LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPPPPPPPPPPPPPPPPp");
                    var criteria = {
                        siteId: UserData._id
                    }
                    Service.termsService.updateTermsService(criteria, payloadData, { new: true }, function (err, result) {
                        if (err) return cb(err);
                        var value = {
                            statusCode: 200,
                            status: "success",
                            data: result
                        }
                        return callbackRoute(value);
                    });

                }
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Get Terms API
var getTerms = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting Terms From DB==init");
            var criteria = {
                siteId: payloadData.siteId
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria)
            Service.termsService.getTerms(criteria, function (err, result) {
                if (err) return cb(err);
                if (result) {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: result
                    }

                    return cb(value);

                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Terms Found for this agent'
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


var addHomeWorthFunnel = function (payloadData, UserData, callbackRoute) {


    async.auto({
        addHomeWorthFunnelInDb: [(cb) => {

            var dataToSave = payloadData;

            dataToSave.siteId = UserData._id;

            Service.homeWorth.checkId(UserData._id, function (err, result) {
                if (err) return cb(err);

                if (!result.length) {

                    Service.homeWorth.addHomeWorthFunnel(dataToSave, function (err, result) {
                        if (err) return cb(err);
                        var value = {
                            statusCode: 200,
                            status: "Funnel for homeWorth changed successfully",
                            data: result
                        }
                        return callbackRoute(value);
                    });

                } else {

                    var criteria = {
                        siteId: UserData._id
                    }
                    Service.homeWorth.updateHomeWorthFunnel(criteria, payloadData, { new: true }, function (err, result) {
                        if (err) return cb(err);
                        var value = {
                            statusCode: 200,
                            status: "Funnel for homeWorth changed successfully",
                            data: result
                        }
                        return callbackRoute(value);
                    });

                }
                //  //.log("Result on admin controller :",result);
                // return cb(result);
            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


// Get Home Worth Funnels
var getHomeWorthFunnel = function (UserData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Get homeWorth funnels from DB");
            var criteria = {
                siteId: UserData._id
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria)
            Service.homeWorth.getHomeWorthFunnel(criteria, function (err, result) {
                if (err) return cb(err);
                if (result) {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        data: result
                    }

                    return cb(value);

                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Terms Found for this agent'
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};



// Get All Agents API
var getAllAgents = function (payloadData, UserData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Agents From DB==init");
            var criteria = {
                siteId: UserData._id,
                userType: "Agent"
            }


            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = { email: 1, firstName: 1, lastName: 1, funnelId: 1, address: 1, siteId: 1, phone: 1 }
            Service.UserService.getAgents(criteria, pro, { lean: true }, payloadData.skip, payloadData.limit, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                }
                if (result.length > 0) {
                    var value = {
                        statusCode: 200,
                        status: "All Agents Data",
                        data: result
                    }

                    return cb(value);

                } else {
                    var value = {
                        statusCode: 200,
                        status: "No agents found",
                        data: []
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Get Site Agents
var getAllSiteAgents = function (payloadData, UserData, callbackRoute) {
    console.log(UserData._id);
    var siteAgents;
    var frontData = [];
    async.auto({
        getDataFromDb: [(callback) => {
            //.log("Getting All Agents From DB==init");
            var criteria = {
                siteId: UserData._id,
                userType: "SITE_AGENT"
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = { email: 1, firstName: 1, lastName: 1, funnelId: 1, address: 1, siteId: 1, buildPath: 1, serviceusername: 1, domain: 1 }
            Service.UserService.getAgents(criteria, pro, { lean: true }, payloadData.skip, payloadData.limit, function (err, result) {
                if (err) {
                    //.log(err);
                    return callback(err);
                }
                if (result.length > 0) {
                    siteAgents = result;
                    return callback();

                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Agents Found'
                    }
                    return callback(value);
                }

            });
        }],
        getThemeDetails: ['getDataFromDb', (ag1, callback) => {
            //.log("Getting Theme Details");
            async.each(siteAgents, (items, cb) => {
                var criteria_1 = {
                    siteId: items._id
                }
                Service.ThemeSetting_SERVICE.getSingleData(criteria_1, {}, { lean: true }, function (err, output) {
                    if (err) {
                        //.log("Error in get All site Agents API", err);
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": items.serviceusername,
                            "siteUrl": items.domain,
                            "siteId": items.siteId,
                            "buildPath": items.buildPath,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                        //.log("Internal DB error", err);
                    } else if (output) {
                        console.log("+==========================================================================");
                        console.log("+==========================================================================");
                        console.log("OUT:::::::::", output);
                        console.log("+==========================================================================");
                        console.log("+==========================================================================");
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": items.serviceusername,
                            "siteUrl": items.domain,
                            "siteId": items.siteId,
                            "buildPath": items.buildPath,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                    } else {
                        //.log("No data found in get All site Agents API");
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": items.serviceusername,
                            "siteUrl": items.domain,
                            "siteId": items.siteId,
                            "buildPath": items.buildPath,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                    }
                });

            }, function () {
                var details1 = arraySort(frontData, 'createdAt', { reverse: true });
                var value = {
                    "statusCode": 200,
                    "status": "success",
                    "message": details1,
                    "data": []
                }
                return callback(value);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var deleteSellers = function (payloadData, UserData, callbackRoute) {
    //.log("===deleteSeller payloadData ===", payloadData);
    //.log("===deleteSeller UserData ===", UserData);

    async.auto({
        deleteData: [(cb) => {
            //.log("+++++++++++++++++++++++++++++++++++++++++++++++");
            //.log(payloadData.siteId);
            //.log("+++++++++++++++++++++++++++++++++++++++++++++++");
            //.log(UserData._id);
            //.log("++++++++++++++++++++++++++++++++++++++++++");
            var idd = payloadData.siteId.toString();
            var idd2 = UserData._id.toString();
            if (idd === idd2) {
                //.log("reaching here");
                var criteria = {
                    _id: payloadData.id
                }
                Service.ContactFormService.deleteData(criteria, function (err, result) {
                    if (err) return cb(err);
                    if (result) {
                        var value = {
                            statusCode: 200,
                            status: "success",
                            message: 'Seller Deleted successfully'
                        }
                        return cb(value);
                    } else {
                        var value = {
                            statusCode: 200,
                            status: "success",
                            message: 'No Data Found'
                        }
                        return cb(value);
                    }

                })
            } else {
                //.log("reaching in else");
                var value = {
                    statusCode: 403,
                    status: "unauthorized",
                    message: 'invalid access'
                }
                return cb(value);
            }

        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    })
}



//Delete Agent
var deleteAgent = function (payloadData, UserData, callbackRoute) {
    //.log("===deleteAgent payloadData ===", payloadData);
    //  //.log("===deleteAgent UserData ===",UserData);

    async.auto({
        deleteData: [(cb) => {
            //.log("+++++++++++++++++++++++++++++++++++++++++++++++");
            //.log(payloadData.siteId);
            //  //.log(UserData._id);
            //.log("++++++++++++++++++++++++++++++++++++++++++");
            //.log("reaching here");
            var criteria = {
                _id: payloadData.id,
            }
            Service.UserService.deleteData(criteria, function (err, result) {
                if (err) return cb(err);
                if (result) {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        message: 'Seller Deleted successfully'
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 200,
                        status: "success",
                        message: 'No Data Found'
                    }
                    return cb(value);
                }

            })


        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    })
}

// //Cloud CMA API for testing
var cloudcmaAPI = function (payload, callbackRoute) {
    var apiUrl = 'http://cloudcma.com/cmas/widget';
    //.log("payload=======", payload);
    var val = item.firstName + "-";
    var jobId = uniqid(val);
    var args = {
        //data: {
        api_key: 'e0fc9d73a78351fbb516a35cab7cb15d',
        name: payload.name,
        email_to: payload.email,
        address: payload.address,
        callback_url: 'http://api.citruscow.com/v1/admin/cloudCmaCallback',
        job_id: jobId
    }
    request.post(apiUrl, { form: args }, function (err, httpResponse, body) {
        //  //.log("err",err);
        //     // //.log("httpResponse",httpResponse);
        //      //.log("body==========",body);
        if (err) return callbackRoute(err);
        //.log(httpResponse.statusCode);
        //.log(body);
        return callbackRoute(null, body);
    })
    // return callbackRoute();
}

//Change Funnel
var buyerFunnel = function (payloadData, UserData, callbackRoute) { // //.log("sadasdas",payloadData);
    //.log(payloadData);
    //.log(UserData);
    async.auto({
        changeFunnel: [(cb) => {
            //.log("Change Funnel Template==init");
            var criteria = {
                _id: payloadData.userId
            }
            console.log('payloadData', payloadData)
            var dataToSave = {}
            // if(payloadData.funnelId == ""){
            // dataToSave.funnelId= ""

            // }
            // else if(payloadData.funnelId != ""){

            //             dataToSave.funnelId = payloadData.funnelId

            // }

            dataToSave = payloadData;

            // if(payloadData.hasOwnProperty('isFunnelEnable')){
            //     dataToSave.isFunnelEnable = payloadData.isFunnelEnable
            // }

            //  //.log(criteria);
            console.log('dataToSave', dataToSave);
            Service.UserService.updateUser(criteria, dataToSave, { new: true }, function (err, result) {
                if (err) return cb(err);
                // ContactId= result._id;
                //  //.log("result,result,result,result,result,result",result);
                var value = {
                    "statusCode": 200,
                    "status": "success",
                    "message": "Data updated successfully"
                }
                return cb(value)
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        var value = {
            "statusCode": 200,
            "status": "success",
            "message": result
        }
        // return cb(value)
        return callbackRoute(value);
    });
};


//Change Funnel
var changeFunnel = function (payloadData, UserData, callbackRoute) { // //.log("sadasdas",payloadData);
    //.log(payloadData);
    //.log(UserData);
    async.auto({
        changeFunnel: [(cb) => {
            //.log("Change Funnel Template==init");
            var criteria = {
                _id: payloadData.contactId
            }
            var dataToSave = {
                funnelId: payloadData.funnelId
            }
            // dataToSave.funnelId = payloadData.funnelId;

            if (payloadData.hasOwnProperty('isFunnelEnable')) {
                dataToSave.isFunnelEnable = payloadData.isFunnelEnable
            }
            //  //.log(criteria);
            //.log(criteria);
            Service.ContactFormService.updateData(criteria, dataToSave, { new: true }, (err, result) => {
                if (err) return cb(err);
                // ContactId= result._id;
                //  //.log("result,result,result,result,result,result",result);
                var value = {
                    "statusCode": 200,
                    "status": "success",
                    "message": result
                }
                return cb(value)
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        var value = {
            "statusCode": 200,
            "status": "success",
            "message": result
        }
        // return cb(value)
        return callbackRoute(value);
    });
};


// Delete Buyer
var deleteBuyer = function (payloadData, UserData, callbackRoute) {
    // var buyerData={}
    //.log("______________________________________________________________________________________________________");
    //.log(payloadData);
    //.log("______________________________________________________________________________________________________");

    if (payloadData.userType === "Buyer") {
        async.auto({
            deleteMyListing: [(cb) => {
                var criteria_1 = {
                    user: payloadData.userId
                }
                //.log("Delete My Listings Criteria : ", criteria_1);
                Service.deleteBuyerServices.deleteListing(criteria_1, (err, data) => {
                    if (err) {
                        //.log("err in My Listing Criteria : ", err);
                        return cb(err);
                    } else {
                        //.log(data);
                        return cb();
                    }
                });
            }],
            deleteMySearchDatas: ['deleteMyListing', (ag1, cb) => {
                var criteria_2 = {
                    user: payloadData.userId
                }
                //.log("Delete My Search Datas Criteria : ", criteria_2);
                Service.deleteBuyerServices.deleteSearchDatas(criteria_2, (err, data) => {
                    if (err) {
                        //.log("err in delete my search Datas : ", err);
                        return cb(err);
                    } else {
                        //.log("Reaching here in delete my search datas");
                        //.log(data);
                        return cb();
                    }
                });
            }],
            deleteMyFavourites: ['deleteMySearchDatas', (ag1, cb) => {
                var criteria_3 = {
                    user: payloadData.userId
                }
                //.log("Delete My Search Datas Criteria : ", criteria_3);
                Service.deleteBuyerServices.deleteFavourites(criteria_3, (err, data) => {
                    if (err) {
                        //.log("err in delete Favourites : ", err);
                        return cb(err);
                    } else {
                        //.log("Reaching here in delete Favourites");
                        //.log(data);
                        return cb();
                    }
                });
            }],
            deleteMainUser: ['deleteMyFavourites', (ag1, cb) => {
                var criteria_4 = {
                    _id: payloadData.userId
                }
                //.log("Delete My Contact Details Criteria : ", criteria_4);
                Service.deleteBuyerServices.deleteUser(criteria_4, (err, data) => {
                    if (err) {
                        //.log("err in delete User : ", err);
                        return cb(err);
                    } else {
                        //.log("Reaching here in delete User");
                        //.log(data);
                        return cb();
                    }
                });
            }]
        }, function (err, result) {
            if (err) {
                var value = {
                    "statusCode": 400,
                    "message": "Failure",
                    "data": err
                }
                return callbackRoute(err);
            } else {
                var value = {
                    "statusCode": 200,
                    "message": "Success",
                    "data": result
                }
                return callbackRoute(value);
            }

        })
    } else {
        var value = {
            "statusCode": 400,
            "message": "Failure. Only Buyer can be deleted using this API",
            "data": ""
        }
        return callbackRoute(value);
    }
}


//Cloud cma callback add data
var cloudCmaCallback = function (payloadData, callbackRoute) {
    console.log('in clou d cma callback ---------------------- ')
    console.log("sadasdas", payloadData);
    //.log(payloadData);
    async.auto({
        updateData: [(cb) => {
            //.log("Callback URL for cloudCMA==init");
            var criteria = {
                id: payloadData.id,
                user_id: payloadData.user_id
            }
            //.log("Critria", criteria);

            var dataToSave = {
                pdf_url: payloadData.pdf_url,
                status: "Success",
                updatedAt: Date.now()
            }
            //.log("Data To Save", dataToSave);

            console.log(criteria);
            //  //.log(criteria);
            Service.cloudcma.updateData(criteria, dataToSave, { new: true }, (err, result) => {
                if (err) return cb(err);
                if (result) {
                    console.log('we got result ', result);
                    if (result.pdf_url != null && result.isEmailSent === false) {

                        //CloudCMA callback Send Email
                        var criteria_1 = {
                            _id: result.funneltemplateId
                        }
                        Service.FUNNEL_TEMPLATE_SERVICE.getData(criteria_1, {}, { new: true }, function (err, templateDetails) {
                            if (err) {
                                return cb(err);
                            } else if (templateDetails) {
                                if (templateDetails[0].sendCmaAutomatically === true) {
                                    var criteria_2 = {
                                        siteId: result.siteId
                                    }

                                    console.log("TEMPLATE DETAILS ::", templateDetails);
                                    //Sening EMail to CMA User
                                    // var firstName = Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                                    var emailTemplateHtml = templateDetails[0].emailTemplateHtml;
                                    var subject = templateDetails[0].subject;
                                    //.log(subject);
                                    Service.ThemeSetting_SERVICE.getData(criteria_2, {}, {}, function (err, output) {
                                        //.log("OUTPUT :;", output);
                                        if (err) {
                                            //.log(err);
                                            var sendStr = emailTemplateHtml
                                            var subject = subject;
                                            var messageToSend = eb(emailTemplateHtml, { SIGNATURE: " ", FIRSTNAME: result.firstName, LASTNAME: result.lastName, EMAIL: result.email_to, PHONE: result.phoneNumber, CLOUDCMA_LINK: result.pdf_url })

                                            var email_data = { // set email variables for user
                                                to: result.email_to, //"anurag@devs.matrixmarketers.com",//  payloadData.email,
                                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                subject: templateDetails[0].subject,
                                                // html: sendStr
                                                html: messageToSend
                                            };
                                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                console.log('errrororrororor in sending mail')
                                                if (err) {
                                                    console.log('errrororrororor in sending mail')
                                                    return cb(err);
                                                }
                                                return cb()
                                            });

                                            // return cb();
                                        } else if (templateDetails.length > 0) {

                                            var TextToReplace = "<a href='" + result.pdf_url + "'>" + result.pdf_url + "</a>";

                                            emailTemplateHtml = emailTemplateHtml
                                            var messageToSend = eb(emailTemplateHtml, { SIGNATURE: output[0].signature, FIRSTNAME: result.firstName, LASTNAME: result.lastName, EMAIL: result.email_to, PHONE: result.phoneNumber, CLOUDCMA_LINK: TextToReplace })
                                            var subject = subject;
                                            var email_data = {
                                                to: result.email_to,
                                                from: output[0].fromName + '<' + output[0].fromEmail + '>',
                                                subject: templateDetails[0].subject,
                                                html: messageToSend
                                            };
                                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                if (err) return cb(err);
                                                return cb()
                                            });

                                        } else {
                                            // var sendStr = emailTemplateHtml
                                            var messageToSend = eb(emailTemplateHtml, { SIGNATURE: " ", FIRSTNAME: result.firstName, LASTNAME: result.lastName, EMAIL: result.email_to, PHONE: result.phoneNumber, CLOUDCMA_LINK: result.pdf_url })
                                            var subject = subject;
                                            var email_data = {
                                                to: result.email_to,
                                                from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                                subject: templateDetails[0].subject,
                                                html: messageToSend
                                            };
                                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                                                if (err) return cb(err);
                                                return cb()
                                            });

                                        }
                                    });
                                } else {

                                }
                                //Sending EMail to CMA manually

                            } else {
                                return cb("Funnel Template not found")
                            }
                            // funneltemplateData = result;
                            // return cb();
                        });

                        //CloudCMA callback Send EMail Ends here
                    } else {
                        return cb();
                    }

                } else {
                    //  //.log("CLoud CMA Failed Permanentlys");
                    // var value = {
                    //   "statusCode": 400,
                    //   "status": "CloudCMA failed Permanently for this value",
                    //   "message": dataToSave
                    // }
                    return cb();
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        var value = {
            "statusCode": 200,
            "status": "success",
            "message": result
        }
        // return cb(value)
        return callbackRoute(value);
    });
};


// Get all funnel Templates
var getAllTemplates = function (payloadData, UserData, callbackRoute) {
    //.log(payloadData);
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Templates From DB==init");
            var criteria = {
                funnelId: {
                    $ne: payloadData.funnelId
                }
            }

            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            Service.FUNNEL_TEMPLATE_SERVICE.getAllFunnels(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                }
                if (result.length > 0) {
                    // var value = {
                    //       statusCode: 200,
                    //       status: "All Template Data",
                    //       data: result
                    // }
                    finalData = result
                    return cb();

                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "message": "No Data Found"
                    }
                    return cb(value);
                }

            });
        }],
        setDataFormat: ['getDataFromDb', (ag1, cb) => {
            var i = 0;
            for (i = 0; i < finalData.length; i++) {
                //.log("In For Loop");
                //  //.log(finalData);
                //.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                //.log("IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", finalData[i]._id);
                //.log("IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", finalData[i].emailTimeInterval);

                var tempIndex = _.findLastIndex(emailTimeIntervalArray, { name: finalData[i].emailTimeInterval.toString() });
                var newObject = emailTimeIntervalArray[tempIndex]
                // tempData.emailTimeInterval_new = newObject.displayName;
                if (newObject.displayName) {
                    var val = newObject.displayName;
                    var tempVar = {
                        _id: finalData[i]._id,
                        funnelTemplateAutoIncrement: finalData[i].funnelTemplateAutoIncrement,
                        title: finalData[i].title,
                        emailTemplateHtml: finalData[i].emailTemplateHtml,
                        funnelId: finalData[i].funnelId,
                        emailType: finalData[i].emailType,
                        status: finalData[i].status,
                        subject: finalData[i].subject,
                        emailTimeInterval: finalData[i].emailTimeInterval,
                        isDeleted: finalData[i].isDeleted,
                        createdAt: finalData[i].createdAt,
                        sendCmaAutomatically: finalData[i].sendCmaAutomatically,
                        displayName: val
                    };

                    finalData_new.push(tempVar);
                } else {
                    var val = newObject.displayName;
                    var tempVar = {
                        _id: finalData[i]._id,
                        funnelTemplateAutoIncrement: finalData[i].funnelTemplateAutoIncrement,
                        title: finalData[i].title,
                        emailTemplateHtml: finalData[i].emailTemplateHtml,
                        funnelId: finalData[i].funnelId,
                        emailType: finalData[i].emailType,
                        status: finalData[i].status,
                        subject: finalData[i].subject,
                        emailTimeInterval: finalData[i].emailTimeInterval,
                        isDeleted: finalData[i].isDeleted,
                        createdAt: finalData[i].createdAt,
                        sendCmaAutomatically: finalData[i].sendCmaAutomatically,
                        displayName: finalData[i].emailTimeInterval
                    };
                    finalData_new.push(tempVar);
                }
                //.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            }

            //.log("THIS SHOULD BE EXECUTED LATER");
            return cb();
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute({
            status: "success",
            totalRecord: finalData_new.length,
            funnel: finalData_new
        });
    });
};


// Get All Buyers
var getAllBuyers = function (payloadData, UserData, callbackRoute) {

    //.log("*********************************************************");

    //.log('User data ', payloadData, UserData);
    // //.log("UserData",UserData.userType);
    var totalRecord = 0;
    var userData = [];
    var propertyData = [];
    var propertyData2 = [];
    var finalData = [];
    var criteria = {
        userType: { $in: ['Buyer', 'landingPageBuyer'] },
        $or: [{ siteId: UserData._id }, { assignedTo: UserData._id }]

    };

    var projection = {
        password: 0,
        emailVerificationToken: 0,
        accessToken: 0,
        forgetpasswordVerifyToken: 0,
        __v: 0,
    };
    var populateModel = [
        {
            path: "LookedPropertiesId",
            match: {},
            select: 'l_askingprice ',
            model: 'retspropertyrd_1',
            options: { lean: true }
        },
        {
            path: "markfavoriteId",
            match: { IsFavorited: true },
            select: 'PropertyId IsFavorited',
            model: 'markfavorite',
            options: { lean: true }
        }
    ];
    async.auto({
        getData: [(cb) => {
            if (payloadData.userType) {
                var options = {
                    skip: payloadData.skip,
                    limit: payloadData.limit,
                    lean: true,
                    sort: {
                        firstName: 1
                    }
                };

            } else {
                var options = {
                    skip: payloadData.skip,
                    limit: payloadData.limit,
                    lean: true,
                    sort: {
                        createdAt: -1
                    }
                };
            }

            DBCommonFunction.getDataPopulateOneLevel(Models.users, criteria, projection, options, populateModel, (err, data) => {
                var i = 0;
                async.eachSeries(data, (item, next) => {
                    Models.REST_PROPERY_RD_1.find({ agentId: item._id }, (err1, foundListings) => {
                        if (err1) callback(Responses.systemError);
                        propertyData = foundListings
                        var countListings = foundListings.length;
                        data[i]['propertiesCount'] = countListings;
                        i++;
                        next();
                    })
                }, function (err, response) {
                    if (err) return cb(err);
                    userData = data
                    return cb(null, { criteria: criteria, dt: data });
                });
            });
        }],
        calculataAveragePrice: ['getData', (ag1, cb) => { // finalData
            //userData.forEach
            userData.forEach(function (element) { // //.log("element",element);
                var sum = 0;
                var temp = element;
                //var averagePrice= 0
                if (element.LookedPropertiesId && element.LookedPropertiesId.length > 0) {
                    //var newArray = _.rest(element.LookedPropertiesId,'l_askingprice')
                    var cx = _.forEach(element.LookedPropertiesId, function (regex, key) {
                        sum = sum + regex.l_askingprice;
                    });
                    temp.averagePrice = parseFloat(sum / element.LookedPropertiesId.length);//averagePrice;
                    temp.noOfpropertiesLooked = element.LookedPropertiesId.length;
                    //cb({averagePrice:temp.averagePrice,sum:sum,newArray:newArray})
                } else {
                    temp.averagePrice = 0;
                    temp.noOfpropertiesLooked = 0;
                }
                if (temp.markfavoriteId) {
                    temp.IsFavorited = temp.markfavoriteId.length
                    delete temp.markfavoriteId;
                } else {
                    temp.IsFavorited = 0
                }
                // if (temp.LookedPropertiesId) {
                //     if (temp.LookedPropertiesId.length > 0) {
                //         //.log("asdasd==if");
                //         var avgPerVist = temp.LookedPropertiesId.length / temp.countOfVisitingWebsite
                //         avgPerVist = parseFloat(avgPerVist.toFixed(2))
                //         if (avgPerVist < 1) {
                //             avgPerVist = 1
                //         }
                //         //.log("avgPerVist==if", avgPerVist);
                //         temp.averagePropertyPerVisit = avgPerVist
                //     } else {
                //         temp.averagePropertyPerVisit = 0
                //     }
                // } else {
                temp.averagePropertyPerVisit = 0
                // }
                finalData.push(temp);
            });
            return cb();
        }],
        coutTotalRecord: [(cb) => {
            var options = {
                lean: true
            };
            Service.UserService.getUser(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        // var details1 = arraySort(finalData,'userAutoIncrement',{reverse: true});
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            userListing: finalData.sort((a, b) => (a.lastVisitedDate < b.lastVisitedDate) ? 1 : -1)
        });
    })
}





var assignAgentToBuyer = function (payloadData, UserData, callbackRoute) {
    console.log("payloadData", payloadData);
    async.auto({
        updateAgentId: [(cb) => {
            var dataToSet = {
                assignedTo: payloadData.assignedTo
            }
            var criteria = {
                _id: payloadData.id
            }
            var options = {
                new: true
            }
            Service.UserService.updateUser(criteria, dataToSet, options, function (err, result) {
                if (err) return cb(err);

                else if (result) {
                    var criteria1 = {
                        _id: payloadData.agentId
                    }

                    Service.UserService.getUser(criteria1, {}, {}, (err, data) => {

                        console.log('data', data)
                        console.log('payloadData', payloadData)

                        // new lead template
                        var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                        var fileReadStream = fs.createReadStream(templatepath + 'new_lead.html');
                        var emailTemplate = '';
                        fileReadStream.on('data', function (buffer) {
                            emailTemplate += buffer.toString();
                        });
                        // var path = Configs.CONSTS.accountconfirmationUrl+ '/' + payloadData.email + '/' + verificationToken;

                        // var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                        var criteria = {
                            siteId: payloadData.siteId
                        }

                        Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function (err, result) {
                            if (err) {
                                //.log(err);
                                fileReadStream.on('end', function (res) {
                                    var message = "A new Lead is assigned to you with following details : <br><br>Name : " + payloadData.firstName + "<br> Phone : " + payloadData.phoneNumber +
                                        "<br> email : " + payloadData.email + "<br> ";
                                    var sendStr = emailTemplate.replace('{{message}}', message);
                                    // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                    var email_data = { // set email variables for user
                                        to: data[0].email,
                                        from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                        subject: 'Lead Assigned',
                                        html: sendStr
                                    };
                                    Utils.universalfunctions.send_email(email_data, (err, res) => {
                                        if (err) return cb(err);
                                        console.log("homeWorth Lead Assigned to agent successfully0");
                                        return cb()

                                    });
                                });
                            } else if (result.length > 0) {
                                //.log("Reachhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                                var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                                fileReadStream.on('end', function (res) {

                                    var message = "A new Lead is assigned to you with following details : <br><br>Name : " + payloadData.firstName + "<br> Phone : " + payloadData.phoneNumber +
                                        "<br> email : " + payloadData.email + "<br> ";
                                    // to: data[0].email,
                                    //     from: data[0].firstName + '<' + data[0].email + '>',
                                    //     subject: subject,
                                    //     //html: sendStr,
                                    //     body: Message
                                    var sendStr = emailTemplate.replace('{{imagePath}}',
                                        imagePath)
                                        .replace('{{name}}', data[0].firstName || "Agent")
                                        .replace('{{message}}', message)
                                        .replace('{{signature}}', result[0].signature)
                                        .replace('{{logo}}', result[0].logoUrl);
                                    // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                    var email_data = { // set email variables for user
                                        to: data[0].email,
                                        from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                        subject: 'Lead Assigned',
                                        html: sendStr
                                    };
                                    console.log('emailData', email_data)
                                    Utils.universalfunctions.send_email(email_data, (err, res) => {
                                        if (err) return cb(err);
                                        console.log("homeWorth Lead Assigned to agent successfully1");
                                        return cb()

                                    });
                                });
                            } else {
                                fileReadStream.on('end', function (res) {
                                    var message = "A new Lead is assigned to you with following details : <br><br>Name : " + payloadData.firstName + "<br> Phone : " + payloadData.phoneNumber +
                                        "<br> email : " + payloadData.email + "<br> ";
                                    var sendStr = emailTemplate.replace('{{message}}', message);
                                    // emailTemplate.replace('{{name}}',firstName).replace('{{logopath}}',imagePath).replace('{{message}}',emailTemplateHtml)
                                    var email_data = { // set email variables for user
                                        to: data[0].email,
                                        from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                        subject: 'Lead Assigned',
                                        html: sendStr
                                    };
                                    Utils.universalfunctions.send_email(email_data, (err, res) => {
                                        if (err) return cb(err);
                                        console.log("homeWorth Lead Assigned to agent successfully2");
                                        return cb()

                                    });
                                });
                            }
                        });


                        // old lead template
                        // var Message = "assigned agent changed";
                        // var subject = 'assigned agent changed';
                        // //var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{imagePath}}', imagePath).replace('{{signature}}', result[0].signature).replace('{{site_link}}', result[0].siteUrl).replace('{{siteName}}',result[0].siteName);
                        // var email_data = { // set email variables for user
                        //     to: data[0].email,
                        //     from: data[0].firstName + '<' + data[0].email + '>',
                        //     subject: subject,
                        //     //html: sendStr,
                        //     body: Message
                        // };
                        // Utils.universalfunctions.send_email(email_data, (err, res) => {
                        //     if (err) return cb(err);
                        //     return cb();
                        // });


                    })
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Get All Sellers

// var getAllSellers = function (payloadData, UserData, callbackRoute) {
//     console.log('hieeeeeeeeeeeeeeeeeeeeeeeeee')
//     //console.log(payloadData);
//     var fullCount;
//     var fullData = [];
//     var projection = {
//         __v: 0
//     };
//     async.auto({
//         getCount: [(cb) => {
//             var criteria = {
//                 $or: [{ siteId: payloadData.siteId }, { assignedTo: UserData._id }],
//                 formType: { $in: ['homeworth', 'landingPageSeller'] },
//             }

//             Service.ContactFormService.getData(criteria, projection, (err, data) => {
//                 console.log(err)
//                 if (err) return cb(err);
//                 fullCount = data.length
//                 //.log(fullCount);
//                 return cb();
//             });
//         }],
//         getDataFromDb: [(cb) => {
//             //.log("Getting All Sellers From DB==init");
//             var criteria = {
//                 $or: [{ siteId: payloadData.siteId }, { assignedTo: UserData._id }],
//                 formType: { $in: ['homeworth', 'landingPageSeller'] }
//             }

//             var options = {
//                 lean: true,
//                 // collation:({locale: "en" })
//             };

//             if (payloadData.sortBy == 'email') {
//                 if (payloadData.sortOrder) {
//                     options.sort = {
//                         email: payloadData.sortOrder
//                     }
//                 } else {
//                     options.sort = {
//                         email: 1
//                     }
//                 }

//             }
//             if (payloadData.sortBy == 'name') {
//                 if (payloadData.sortOrder) {
//                     // options.collation={
//                     //     locale: "en"
//                     // }
//                     options.sort = {
//                         firstName: payloadData.sortOrder,
//                         //lastName:payloadData.sortOrder
//                     }
//                 } else {
//                     // options.collation={
//                     //     locale: "en"
//                     // }
//                     options.sort = {
//                         firstName: 1,
//                         //lastName:-1,
//                     }
//                 }

//             }
//             if (payloadData.sortBy == 'date') {
//                 if (payloadData.sortOrder) {
//                     options.sort = {
//                         createdAt: payloadData.sortOrder
//                     }
//                 } else {
//                     options.sort = {
//                         createdAt: -1
//                     }
//                 }
//             }
//             //.log('+++++++++++++++++++++++++++++++++++', criteria);
//             Service.ContactFormService.getAllData(criteria, payloadData.skip, payloadData.limit, options, (err, data) => {
//                 if (err) {
//                     //.log(err);
//                     return cb(err);
//                 } else if (data.length > 0) {
//                     // var value = {
//                     //       statusCode: 200,
//                     //       status: "All Seller details",
//                     //       data: data
//                     //   }
//                     fullData = data
//                     return cb();

//                 } else {
//                     // var value = {
//                     //       statusCode: 401,
//                     //       status: "warning",
//                     //       message: 'No Seller Found'
//                     // }
//                     fullData = [];
//                     return cb();
//                 }

//             });
//         }]
//     }, (err, result) => {
//         //var details1 = arraySort(fullData,'createdAt',{reverse: true});
//         if (err) return callbackRoute(err);
//         return callbackRoute(null, {
//             totalRecord: fullCount,
//             userType: UserData.userType,
//             datalist: fullData
//         });
//     });
// };



var getAllSellers = function (payloadData, UserData, callbackRoute) {
    console.log('hieeeeeeeeeeeeeeeeeeeeeeeeee')
    //console.log(payloadData);
    var fullCount;
    var fullData = [];
    var projection = {
        __v: 0
    };
    var data1
    async.auto({
        getCount: [(cb) => {
            var criteria = {
                $or: [{ siteId: payloadData.siteId }, { assignedTo: UserData._id }],
                formType: { $in: ['homeworth', 'landingPageSeller'] },
            }


            Models.CONTACTFORM.distinct("sellerEmail", criteria, (err, data) => {
                console.log(err)
                if (err) return cb(err);
                fullCount = data.length
                //.log(fullCount);
                return cb();
            });
            // var criteria = {
            //     $or: [{ siteId: payloadData.siteId }, { assignedTo: UserData._id }],
            //     userType: { $in: ['Seller', 'landingPageSeller'] },
            // }
            // var options = {
            //     lean: true
            // };
            // Service.UserService.getUser(criteria, projection, options, (err, data) => {
            //     if (err) return cb(err);
            //     totalRecord = data.length;
            //     return cb();
            // });
        }],
        getDataFromDb: [(cb) => {
            //.log("Getting All Sellers From DB==init");
            var criteria = {
                $or: [{ siteId: payloadData.siteId }, { assignedTo: UserData._id }],
                formType: { $in: ['homeworth', 'landingPageSeller'] },
                // isMovedToCMS:false
            }


            var options = {
                lean: true,
                // collation:({locale: "en" })
            };

            if (payloadData.sortBy == 'email') {
                // if (payloadData.sortOrder) {
                //     options.sort = {
                //         email: payloadData.sortOrder
                //     }
                // } else {
                options.sort = {
                    email: -1
                }
                // }

            }
            if (payloadData.sortBy == 'name') {
                // if (payloadData.sortOrder) {
                //     // options.collation={
                //     //     locale: "en"
                //     // }
                //     options.sort = {
                //         firstName: -1,
                //         //lastName:payloadData.sortOrder
                //     }
                // } else {
                // options.collation={
                //     locale: "en"
                // }
                options.sort = {
                    firstName: -1,
                    //lastName:-1,
                }
                // }

            }
            if (payloadData.sortBy == 'date') {
                // if (payloadData.sortOrder) {
                //     options.sort = {
                //         createdAt: payloadData.sortOrder
                //     }
                // } else {
                console.log('sort the data')
                options.sort = {
                    createdAt: -1
                }
                // }
            }
            // console.log('+++++++++++++++++++++++++++++++++++', criteria);
            //Service.ContactFormService.getAllData(criteria, payloadData.skip, payloadData.limit, options, (err, data) => {
            // console.log('payloadData.siteId', payloadData.siteId)
            var match = {
                $match: {
                    $or: [
                        { siteId: mongoose.Types.ObjectId(payloadData.siteId) },
                        { assignedTo: mongoose.Types.ObjectId(UserData._id) }
                    ],
                    formType: { $in: ['homeworth', 'landingPageSeller'] },
                    // isMovedToCMS:false
                }
            };
            var groupBy = {
                $group: {
                    _id: "$sellerEmail",
                    "id": { "$last": "$_id" },
                    "firstName": { "$last": "$firstName" },
                    "lastName": { "$last": "$lastName" },
                    "phoneNumber": { "$last": "$phoneNumber" },
                    "email": { "$last": "$sellerEmail" },
                    "address": { "$last": "$address" },
                    "createdAt": { "$last": "$createdAt" },
                    "status": { "$last": "$status" },
                    "emailSendDate": { "$last": "$emailSendDate" },
                    "funnelId": { "$last": "$funnelId" },
                    "isFunnelEnable": { "$last": "$isFunnelEnable" },
                    "isMovedToCMS": { "$last": "$isMovedToCMS" },
                    "isListed": { "$last": "$isListed" },

                    properties: {
                        $push: {
                            isListed: "$isListed",
                            address: "$address",
                            bedrooms: "$bedrooms",
                            bathrooms: "$bathrooms",
                            squareFeet: "$squareFeet",
                            sellingIn: "$sellingIn",
                            type: "$type",
                            isStillOwnIt: "isStillOwnIt"
                        }
                    },
                }
            };

            var addFields = {
                $project:
                {
                    // sellerEmail: 1,
                    //  email:1,
                    //  firstName : 1,
                    //  ContactFormAutoIncrement: 1,
                    //  address:1,
                    //  bedrooms: 1,
                    //  bathrooms: 1,
                    //  squareFeet: 1,
                    //  sellingIn: 1,
                    //  lastName : "$lastName",
                    //  phoneNumber: "$phoneNumber",
                    //   siteId : 1,
                    //  funnelId: "$funnelId",
                    //  assignedTo : "$assignedTo",
                    //  newsletter: "$newsletter",
                    //  greetingCards : "$greetingCards",
                    //  landingPageDetails : "$landingPageDetails",
                    //  dealStatus: "$dealStatus",
                    //  unsubscribe : "$unsubscribe",
                    //  isCMASent: "$isCMASent",
                    //  contactDetailId : "$contactDetailId",
                    //  pets : "$pets",
                    //  family : "$family",
                    //  formType: "$formType",
                    //  unsubscribe : "$unsubscribe",
                    //  isMovedToCMS: "$isMovedToCMS",
                    //  isDeleted : "$isDeleted",
                    //  isRead: "$isRead",
                    //  emailSendDate : "$emailSendDate",
                    //  status : "$status",
                    //  updatedAt : "$updatedAt",
                    //  createdAt : "$createdAt",
                    _id: 0,
                }
            }


            //console.log(match,groupBy,addFields)
            var sort = {
                $sort: options.sort
            }
            //   console.log(JSON.stringify(sort),"pppppppppppppppppppp")
            Models.CONTACTFORM.aggregate([match, groupBy, addFields, { $skip: payloadData.skip },
                { $limit: payloadData.limit }, sort], (err, data) => {
                    // console.log('datatatatatatatatatatattatattata', data)
                    if (err) {
                        console.log(err);
                        return cb(err);
                    } else if (data.length > 0) {
                        var contactData = [];
                        async.eachSeries(data, function (item, cb) {
                            // console.log(item,"item",{leadId:item.id})
                            SellerLogs.find({ leadId: item.id }).sort({ contactDate: -1 }).exec(function (err, result) {
                                // SellerLogs.findOne({leadId:item.id},function(err,result){
                                console.log(result, "resultiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
                                if (result.length > 0) {
                                    contactData.push(result)
                                    cb();
                                } else {
                                    cb();
                                }

                            })

                        }, function (err) {
                            // console.log('#1 Final call ', contactData);
                            fullData = data
                            // console.log('data', contactData)
                            // fullData = data

                            // contactData.map(item => {
                            //     item["leadId"] = item.leadId
                            // })

                            fullData.map(item => {
                                var resultrrrrr = contactData.reduce((r, e) => (r.push(...e), r), [])

                                console.log(contactData, "contactData")
                                let z = resultrrrrr.filter(item2 => item2.leadId.toString() == item.id.toString());
                                console.log(z[0], "----------------------------------------------", z.includes(item.id))
                                if (z.map(item => item.leadId == item.id)) {
                                    // console.log(z[0].contactDate, "----------------------------------------------")
                                    item["lastContactLogs"] = z[0]

                                }

                                // item["_id"] = item.id

                            })

                            // data1 = reduce_data(fullData)

                            return cb()

                        });

                        //console.log(contactData,"outside callback")
                        //var value = {
                        //statusCode: 200,
                        //status: "All Seller details",
                        //data: data
                        //}

                    } else {
                        // var value = {
                        //       statusCode: 401,
                        //       status: "warning",
                        //       message: 'No Seller Found'
                        // }
                        fullData = [];
                        return cb();
                    }

                });

            // Models.users.find(criteria, projection, options, (err, data) => {
            //     var i = 0;
            //     async.eachSeries(data, (item, next) => {

            //         Models.CONTACTFORM.find({ sellerEmail: item.email }, (err1, foundListings) => {
            //             if (err1) callback(Responses.systemError);
            //             propertyData = foundListings
            //             var countListings = foundListings;

            //             data[i]['properties'] = countListings;
            //             i++;
            //             next();
            //         })
            //     }, function (err, response) {
            //         if (err) return cb(err);
            //         userData = data
            //         return cb(null, { criteria: criteria, dt: data });
            //     });
            // }).skip(payloadData.skip).limit(payloadData.limit);

        }]
    }, (err, result) => {
        //var details1 = arraySort(fullData,'createdAt',{reverse: true});
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: fullCount,
            userType: UserData.userType,
            datalist: fullData
        });
    });
};

// function reduce_data (fullData){
//     var result = [];
//     fullData.forEach(function (hash) {
//         return function (a) {
//             if (!hash[a.sellerEmail]) {
//                 hash[a.sellerEmail] = { 
//                     sellerEmail: a.sellerEmail,
//                     email:a.email,
//                     firstName : a.firstName,
//                     ContactFormAutoIncrement: a.ContactFormAutoIncrement,
//                     lastName : a.lastName,
//                     phoneNumber: a.phoneNumber,
//                     siteId : a.siteId,
//                     funnelId: a.funnelId,
//                     assignedTo : a.assignedTo,
//                     newsletter: a.newsletter,
//                     greetingCards : a.greetingCards,
//                     landingPageDetails : a.landingPageDetails,
//                     dealStatus: a.dealStatus,
//                     unsubscribe : a.unsubscribe,
//                     isCMASent: a.isCMASent,
//                     contactDetailId : a.contactDetailId,
//                     pets : a.pets,
//                     family : a.family,
//                     formType: a.formType,
//                     unsubscribe : a.unsubscribe,
//                     isMovedToCMS: a.isMovedToCMS,
//                     isDeleted : a.isDeleted,
//                     isRead: a.isRead,
//                     emailSendDate : a.emailSendDate,
//                     status : a.status,
//                     updatedAt : a.updatedAt,
//                     createdAt : a.createdAt,
//                     _id : a._id,
//                      properties: []};
//                 result.push(hash[a.sellerEmail]);
//             }
//             hash[a.sellerEmail].properties.push({ 
//                 address: a.address,
//                 bedrooms: a.bedrooms,
//                 bathrooms: a.bathrooms,
//                 squareFeet: a.squareFeet,
//                 sellingIn: a.sellingIn

//                  });
//         };
//     }(Object.create(null)));

//     return result;
// }


//Get Agents New API
// var addAgentsOrder = function (payloadData,UserData,callbackRoute) {
var addAgentsOrder = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Agents From DB==init");
            var criteria = {
                siteId: payloadData.siteId
            }

            Service.UserService.checkDisplayAgent(criteria, (err, result) => {
                if (err) {
                    //.log(err);
                    return cb(err);
                } else if (result) {
                    Service.UserService.updateDisplayAgent(criteria, payloadData, { new: true }, function (error, updatedAgentsOrder) {
                        if (error) {
                            //.log(err);
                            return cb(err);
                        } else {
                            var value = {
                                statusCode: 200,
                                status: "Agents order updated",
                                data: updatedAgentsOrder
                            }
                            return cb(value);
                        }
                    });
                } else {
                    Service.UserService.createDisplayAgent(payloadData, function (error, addedAgentsOrder) {
                        if (error) {
                            //.log(err);
                            return cb(err);
                        } else {
                            var value = {
                                statusCode: 200,
                                status: "Agents order Added",
                                data: addedAgentsOrder
                            }
                            return cb(value);
                        }
                    });
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get All Agents New API
// Get Site Agents
var getAllAgentsNew = function (payloadData, callbackRoute) {
    console.log('hieieihehieihehiehieiheeeeeeeeeeeeeeeeeeeeeeeeeee')
    //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Agents From DB==init");
            var criteria = {
                siteId: payloadData.siteId
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = { password: 0, accessToken: 0, emailVerificationToken: 0 }
            // Service.UserService.getAgentsNew(criteria, pro, { lean: true }, payloadData.skip, 
            Service.UserService.getAgentsNews(criteria, pro, { lean: true }, payloadData.skip,
                payloadData.limit, function (err, result) {
                    if (err) {
                        //.log(err);
                        return cb(err);
                    }
                    if (result) {

                        var value = {
                            statusCode: 200,
                            status: "All Agents Data",
                            data: {
                                totalRecord: result.length,
                                agentsOrder: result
                            }
                        }

                        return cb(value);

                    } else {
                        var value = {
                            statusCode: 401,
                            status: "warning",
                            message: 'No Agents Found'
                        }
                        return cb(value);
                    }

                });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


var getContactLeads = function (payloadData, UserData, callbackRoute) {
    //.log(payloadData);
    var criteria = {};
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Contact Leads From DB==init");
            if (payloadData.type === "Admin") {
                criteria = {
                    siteId: payloadData.siteId,
                    formType: "Contact Us"
                }
            } else {
                criteria = {
                    siteId: payloadData.siteId,
                    formType: "Contact Us",
                    assignedTo: payloadData.assignedTo
                }
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            Service.ContactFormService.getAllContactLeads(criteria, payloadData.skip, payloadData.limit, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                }
                if (result) {
                    var value = {
                        statusCode: 200,
                        status: "Contact Leads Details",
                        data: result
                    }

                    return cb(value);

                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Contact Leads Found'
                    }
                    return cb(value);
                }

            });

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getAgentsForListings = function (payloadData, callbackRoute) {
    // //.log(payloadData);
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Agents From DB==init");
            var criteria = {
                siteId: payloadData.siteId,
                userType: "Agent",
                rotateInListingDetails: true
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = { _id: 1 }
            Service.UserService.getAgents(criteria, pro, { lean: true }, payloadData.skip, payloadData.limit, function (err, result) {
                //  //.log(val);
                if (err) {
                    //.log(err);
                    return cb(err);
                } else if (result.length > 0) {
                    var val = result.map(a => a._id);
                    var value = {
                        statusCode: 200,
                        status: "All Agents Data",
                        data: val
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Agents Found'
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Funnel template Update
var unsubscribeFromFunnel = function (payloadData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb) => {
            var criteria = {
                _id: payloadData.funnelId
            }
            var options = {
                new: true,
            }
            var dataToSave = payloadData.userId;
            Service.FUNNEL_SERVICE.addUnsubscribeUser(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                //.log(result);
                return cb();
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getAgentsWithoutOrder = function (callbackRoute) {
    // //.log(payloadData);
    var payloadData = {};
    async.auto({
        getDataFromDb: [(cb) => {
            //.log("Getting All Agents From DB==init");
            var criteria = {
                userType: "Agent"
            }

            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = {
                email: 1,
                firstName: 1,
                lastName: 1,
                phone: 1,
                profile_pic: 1,
                userType: 1,
                siteId: 1
            }
            Service.UserService.getAgentsWithoutOrder(criteria, pro, { lean: true }, function (err, result) {
                //  //.log(val);
                if (err) {
                    //.log(err);
                    return cb(err);
                } else if (result.length > 0) {
                    // var val = result.map(a => a._id);
                    var value = {
                        statusCode: 200,
                        status: "All Agents Data",
                        data: result
                    }
                    return cb(value);
                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Agents Found'
                    }
                    return cb(value);
                }
            });
        }],

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


//Get Agents of all website
var getAllAgentsData = function (payloadData, UserData, callbackRoute) {
    var allAgents;
    var frontData = [];
    async.auto({
        getDataFromDb: [(callback) => {
            //  //.log("Getting All Agents From DB==init");
            var criteria = {
                siteId: UserData._id,
                userType: "Agent"
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = { email: 1, firstName: 1, lastName: 1, funnelId: 1, address: 1, siteId: 1 }
            Service.UserService.getAgents(criteria, pro, { lean: true }, payloadData.skip, payloadData.limit, function (err, result) {
                if (err) {
                    //.log(err);
                    return callback(err);
                }
                if (result.length > 0) {
                    //  //.log(result);
                    // return callback(result);
                    allAgents = result;
                    return callback();
                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Agents Found'
                    }
                    return callback(value);
                }

            });
        }],
        getThemeDetails: ['getDataFromDb', (ag1, callback) => {
            //.log("Getting Theme Details");
            async.each(allAgents, (items, cb) => {
                var criteria_1 = {
                    siteId: items.siteId
                }
                Service.ThemeSetting_SERVICE.getSingleData(criteria_1, {}, { lean: true }, function (err, output) {
                    if (err) {
                        //.log("Error in get All site Agents API", err);
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": "",
                            "siteUrl": "",
                            "siteId": items.siteId,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                        //.log("Internal DB error", err);
                    } else if (output) {
                        //.log("+==========================================================================");
                        //.log("+==========================================================================");
                        //.log("OUT:::::::::", output);
                        //.log("+==========================================================================");
                        //.log("+==========================================================================");
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": output.siteName,
                            "siteUrl": output.siteUrl,
                            "siteId": items.siteId,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                    } else {
                        //.log("No data found in get All site Agents API");
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": "",
                            "siteUrl": "",
                            "siteId": items.siteId,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                    }
                });

            }, function () {

                var value = {
                    "statusCode": 200,
                    "status": "success",
                    "totalRecord": frontData.length,
                    "data": frontData
                }
                return callback(value);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Get Agents for a particular siteAgent
var refineAgents = function (payloadData, UserData, callbackRoute) {
    var allAgents;
    var frontData = [];
    async.auto({
        getDataFromDb: [(callback) => {
            //  //.log("Getting All Agents From DB==init");
            var criteria = {
                userType: "Agent",
                siteId: payloadData.siteId
            }
            //.log('+++++++++++++++++++++++++++++++++++', criteria);
            var pro = { email: 1, firstName: 1, lastName: 1, funnelId: 1, address: 1, siteId: 1 }
            Service.UserService.getAgents(criteria, pro, { lean: true }, payloadData.skip, payloadData.limit, function (err, result) {
                if (err) {
                    //.log(err);
                    return callback(err);
                }
                if (result.length > 0) {
                    //  //.log(result);
                    // return callback(result);
                    allAgents = result;
                    return callback();
                } else {
                    var value = {
                        statusCode: 401,
                        status: "warning",
                        message: 'No Agents Found'
                    }
                    return callback(value);
                }

            });
        }],
        getThemeDetails: ['getDataFromDb', (ag1, callback) => {
            //.log("Getting Theme Details");
            async.each(allAgents, (items, cb) => {
                var criteria_1 = {
                    siteId: items.siteId
                }
                Service.ThemeSetting_SERVICE.getSingleData(criteria_1, {}, { lean: true }, function (err, output) {
                    if (err) {
                        //.log("Error in get All site Agents API", err);
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": "",
                            "siteUrl": "",
                            "siteId": items.siteId,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                        //.log("Internal DB error", err);
                    } else if (output) {
                        //.log("+==========================================================================");
                        //.log("+==========================================================================");
                        //.log("OUT:::::::::", output);
                        //.log("+==========================================================================");
                        //.log("+==========================================================================");
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": output.siteName,
                            "siteUrl": output.siteUrl,
                            "siteId": items.siteId,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                    } else {
                        //.log("No data found in get All site Agents API");
                        var value = {
                            "firstName": items.firstName,
                            "lastName": items.lastName,
                            "email": items.email,
                            "userType": items.userType,
                            "siteName": "",
                            "siteUrl": "",
                            "siteId": items.siteId,
                            "_id": items._id
                        }
                        frontData.push(value);
                        return cb();
                    }
                });

            }, function () {
                var value = {
                    "statusCode": 200,
                    "status": "success",
                    "message": frontData
                }
                return callback(value);
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

//Add Family Member
var addFamilyMember = function (payloadData, callbackRoute) {
    async.auto({
        addLogData: [(cb) => {
            //.log("Payload Data", payloadData);
            var criteria = {
                _id: payloadData.leadId
            }
            var data = {};
            var dataToSet = {};
            // if (payloadData.pets) {
            //     dataToSet = {
            //         $set: { pets: payloadData.pets }
            //     }
            // } else {
            data = {
                firstName: payloadData.firstName,
                lastName: payloadData.lastName,
                relation: payloadData.relation,
                age: payloadData.age,
                gender: payloadData.gender,
                dob: payloadData.dob,
                pet: payloadData.pet
            }
            dataToSet = {
                $push: { family: data }
            }
            // }
            //.log(dataToSet);

            var options = {
                new: true,
            }
            //Service.ContactFormService.updateData(criteria, dataToSet, options, function (err, result) {
            Service.UserService.updateUser(criteria, dataToSet, options, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Update Family Member Data Or Delete Family member data
var updateFamilyMember = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addLogData: [(cb) => {
            var criteria = {
                _id: payloadData.leadId
            }


            var data = {};
            var dataToSet = {};
            if (payloadData.pets) {
                dataToSet = {
                    $set: { pets: payloadData.pets }
                }
            } else {
                dataToSet = {
                    $set: { family: payloadData.family }
                }
            }
            //.log(dataToSet);

            var options = {
                new: true,
            }
            // if(payloadData.type == "crm"){
            Users.updateMany(criteria, dataToSet, options, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                }

            });
            // }else{
            //     Service.ContactFormService.updateData(criteria, dataToSet, options, function (err, result) {
            //         if (err) {
            //             //.log(err);
            //             return cb(err);
            //         } else {
            //             var value = {
            //                 "statusCode": 200,
            //                 "status": "success",
            //                 "data": result
            //             }
            //             return cb(value);
            //         }

            //     });
            // }

        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};
// Add Lead Logs
var addLeadLogs = function (payloadData, userData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addLogData: [(cb) => {
            var criteria = {
                _id: payloadData.leadId
            }
            payloadData.createdBy = userData._id
            Service.LOGS.addData(payloadData, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


// Get Logs API
var getLeadLogs = function (payloadData, userData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    var count = 0;
    async.auto({
        countLogData: [(cb) => {
            var criteria = {
                _id: payloadData.leadId
            }
            console.log()

            // Service.LOGS.countLeadLogs(criteria, function (err, result) {Models.user(criteria, function (err, result)
            Users.find(criteria).populate('propertiesId').exec(function (err, result) {
                // Users.find(criteria,function(err,result)
                //  {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    console.log("Rsult", result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    count = result.length;
                    //.log("COunt value is ", count);
                    cb();
                }
            });
        }],
        addLogData: ['countLogData', (ag1, cb) => {
            var criteria = {
                _id: payloadData.leadId
            }
            var skip;
            if (payloadData.skip) {
                skip = payloadData.skip;
            } else {
                skip = 0;
            }
            var limit;
            if (payloadData.limit) {
                limit = payloadData.limit;
            } else {
                limit = 25;
            }
            Users.find(criteria).populate('propertiesId').skip(skip).limit(limit).exec(function (err, result) {
                // Users.find(criteria, skip, limit, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    //.log("Rsult", result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result,
                        "count": count
                    }
                    return cb(value);
                }
            });
        }],

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    });
};


// Add Client Retention template module
var addCRTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addCRTemplateData: [(cb) => {
            Service.crTemplate.addData(payloadData, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};
//Update Client retention Template
var updateCRTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updateCRTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.crId
            }


            var dataToSet = payloadData;
            var options = {
                new: true,
            }
            Service.crTemplate.updateData(criteria, dataToSet, options, function (err, result) {
                if (err) {
                    //.log(err);
                    return cb(err);
                } else if (result) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": "No Data Found"
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


// Get Client Retention Template
var getCRTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        addLogData: [(cb) => {
            var criteria = {
                _id: payloadData.crId
            }
            Service.crTemplate.getData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    //  //.log("Rsult",result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": "No Data Found"
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

//Delete Client Retention Template

var removeCRTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        addLogData: [(cb) => {
            var criteria = {
                _id: payloadData.crId
            }
            Service.crTemplate.removeData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    //  //.log("Rsult",result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": "No Data Found"
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Get All Client Retention templates

var getAllCRTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        addLogData: [(cb) => {
            var criteria = {
                siteId: payloadData.siteId
            }
            if (payloadData.type) {
                criteria.type = payloadData.type
            }
            Service.crTemplate.getAllData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result.length > 0) {
                    var details1 = arraySort(result, 'createdAt', { reverse: true });
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": details1
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": "No Data Found"
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Add Property Deal API
var addPropertyDeal = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addPropertyDealData: [(cb) => {
            Service.propertyDeals.addData(payloadData, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Update Property Deals Template
var updatePropertyDeal = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updatePropertyDealData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }
            var dataToSet = payloadData;
            var options = {
                new: true,
            }
            Service.propertyDeals.updateData(criteria, dataToSet, options, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//update property 

var updateProperty = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updateProperty: [(cb) => {
            var criteria = {
                _id: payloadData._id
            }

            var dataToSet = payloadData;
            var options = {
                new: true,
            }
            console.log(dataToSet, "ooooooooooooooooooooooo", criteria)
            Models.CONTACTFORM.updateMany(criteria, dataToSet, options, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//remove property 

var removeProperty = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        removeProperty: [(cb) => {
            var criteria = {
                _id: payloadData._id
            }

            // var dataToSet = payloadData;
            // var options = {
            //     new: true,
            // }
            // console.log(dataToSet,"ooooooooooooooooooooooo",criteria)
            Models.CONTACTFORM.remove(criteria, function (err, removed) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (removed) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

//Get All Property Deals

var getAllPropertyDeals = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getAllData: [(cb) => {
            var criteria = {
                siteId: payloadData.siteId
            }
            if (payloadData.status) {
                criteria.status = payloadData.status
            }
            Service.propertyDeals.getAllData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result.length > 0) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": []
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//Get Property Deals
var getPropertyDeal = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getData: [(cb) => {
            var criteria = {
                leadId: payloadData.id
            }

            Service.propertyDeals.getData_new(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    console.log('result', result)
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": ""
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Remove Property Deal API
var removePropertyDeal = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updatePropertyDealData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.propertyDeals.removeData(criteria, function (err, removed) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (removed) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": removed
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while deleting data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


// Deal Template APIs start here
var addDealTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addDealTemplate: [(cb) => {
            Service.dealTemplates.addData(payloadData, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Update Deal Template
var updateDealTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updateDealTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }
            var dataToSet = payloadData;
            var options = {
                new: true,
            }
            Service.dealTemplates.updateData(criteria, dataToSet, options, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//Get All Deal Templates
var getAllDealTemplates = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getAllData: [(cb) => {
            var criteria = {
                siteId: payloadData.siteId
            }
            if (payloadData.status) {
                criteria.status = payloadData.status
            }
            Service.dealTemplates.getAllData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result.length > 0) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": []
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//Get Property Deals
var getDealTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.dealTemplates.getData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": ""
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Remove Property Deal API
var removeDealTemplate = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        removeDealTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.dealTemplates.removeData(criteria, function (err, removed) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (removed) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": removed
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while deleting data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

//Deal Template APIs Ends here
//Get Feilds
//Get Property Deals
var getAllPropertyTags = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    var arr = ['l_addressunit', 'l_addressnumber', 'l_addressstreet', 'l_city', 'l_askingprice', 'lm_dec_7', 'lm_int1_4', 'lm_int1_19', 'l_displayid', 'lo1_organizationname', 'lr_remarks22']
    var value = {
        "statusCode": 200,
        "status": "success",
        "data": arr
    }
    return callbackRoute(value);

};

// Get List Of MLS
var getMlsList = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getData: [(cb) => {
            Service.REST_PROPERY_RD_1_Service.getMLSData({}, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result.length > 0) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": []
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


// Seller Leads Log

var addSellerLogs = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addDealTemplate: [(cb) => {
            Service.sellerLogs.addData(payloadData, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    console.log(inserted, "lllllllllllllllllllllll")









                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Update Deal Template
var updateSellerLogs = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updateDealTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }
            var dataToSet = payloadData;
            var options = {
                new: true,
            }
            Service.sellerLogs.updateData(criteria, dataToSet, options, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while Updating data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//Get All Deal Templates
var getAllSellerLogs = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    var count = 0;
    async.auto({
        countLogData: [(cb) => {
            var criteria = {
                leadId: payloadData.leadId
            }

            Service.sellerLogs.countLeadLogs(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    //.log("Rsult", result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    count = result.length;
                    //.log("COunt value is ", count);
                    cb();
                }
            });
        }],
        addLogData: ['countLogData', (ag1, cb) => {
            var criteria = {
                leadId: payloadData.leadId
            }
            var skip;
            if (payloadData.skip) {
                skip = payloadData.skip;
            } else {
                skip = 0;
            }
            var limit;
            if (payloadData.limit) {
                limit = payloadData.limit;
            } else {
                limit = 25;
            }

            Service.sellerLogs.getLeadLogs(criteria, skip, limit, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    //.log("Rsult", result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result,
                        "count": count
                    }
                    return cb(value);
                }
            });
        }],

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    });
};

//Get Property Deals
var getSellerLog = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.sellerLogs.getData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": ""
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Remove Property Deal API
//Get Property Deals
var getSellerLog = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.sellerLogs.getData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": ""
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Remove Seller logs
var removeSellerLog = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        removeDealTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.sellerLogs.removeData(criteria, function (err, removed) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (removed) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": removed
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while deleting data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

//Get Favourite Property Details
var getFavouritePropertyDetails = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        removeDealTemplate: [(cb) => {
            var options = {
                lean: true
            };
            var criteria = {
                user: payloadData.userId,
                IsFavorited: true
            };
            Service.MARK_FAVORITE_SERVICE.getFavDetails(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": []
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//Buyer Logs API
var addBuyerLogs = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        addDealTemplate: [(cb) => {
            Service.buyerLogs.addData(payloadData, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Update Deal Template
var updateBuyerLogs = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        updateDealTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }
            var dataToSet = payloadData;
            var options = {
                new: true,
            }
            Service.buyerLogs.updateData(criteria, dataToSet, options, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while Updating data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


//Get All Deal Templates
var getAllBuyerLogs = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    var count = 0;
    async.auto({
        countLogData: [(cb) => {
            var criteria = {
                leadId: payloadData.leadId
            }

            Service.buyerLogs.countLeadLogs(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    //.log("Rsult", result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    count = result.length;
                    //.log("COunt value is ", count);
                    cb();
                }
            });
        }],
        addLogData: ['countLogData', (ag1, cb) => {
            var criteria = {
                leadId: payloadData.leadId
            }
            var skip;
            if (payloadData.skip) {
                skip = payloadData.skip;
            } else {
                skip = 0;
            }
            var limit;
            if (payloadData.limit) {
                limit = payloadData.limit;
            } else {
                limit = 25;
            }

            Service.buyerLogs.getLeadLogs(criteria, skip, limit, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else {
                    //.log("Rsult", result);
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result,
                        "count": count
                    }
                    return cb(value);
                }
            });
        }],

    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    });
};

//Get Property Deals
var getBuyerLog = function (payloadData, callbackRoute) {
    //.log("Payload Data", payloadData);
    async.auto({
        getData: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.buyerLogs.getData(criteria, function (err, result) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (result) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": ""
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

// Remove Seller logs
var removeBuyerLog = function (payloadData, callbackRoute) {
    //.log("Payload Dta", payloadData);
    async.auto({
        removeDealTemplate: [(cb) => {
            var criteria = {
                _id: payloadData.id
            }

            Service.buyerLogs.removeData(criteria, function (err, removed) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (removed) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": removed
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "status": "failure",
                        "data": "Something went wrong while deleting data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};


var polygonSearch = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = {};
    var PropertyArray = [];
    var criteriaPro = {};
    var arr = [];
    var PropertyCount = 0;
    async.auto({
        setProCriteria: [(cb) => {
            var coordinate_db = payloadData.location.coordinates;

            var tempLocation = {
                $geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: coordinate_db
                    }
                }
            }

            criteriaPro = {
                "location.coordinates": tempLocation
            }
            return cb();


        }],
        getProperty: ['setProCriteria', (ag2, cb) => {
            //.log("Reaching in This get Property Table", finalData);
            var projectionPro = {
                l_listingid: 1,
                propertyAutoIncrement: 1,
                l_area: 1,
                lm_int1_19: 1,
                lm_int1_4: 1,
                l_askingprice: 1,
                lm_dec_11: 1,
                lo1_organizationname: 1,
                lo1_shortname: 1,
                la3_phonenumber1: 1,
                la1_loginname: 1,
                lm_char10_12: 1,
                lm_char1_36: 1,
                lm_dec_16: 1,
                lm_int2_3: 1,
                lm_int4_2: 1,
                l_remarks: 1,
                lr_remarks22: 1,
                l_pricepersqft: 1,
                lr_remarks22: 1,
                location: 1,
                propertyImages: 1,
                lo1_organizationname: 1,
                l_askingprice: 1,
                l_city: 1, l_state: 1, l_zip: 1,
                l_addressunit: 1,
                l_streetdesignationid: 1,
                l_addressnumber: 1,
                l_addressstreet: 1,
                l_displayid: 1,
                lm_dec_7: 1,
                lm_char10_11: 1,
                images_count: 1
            };
            var optionsPro = {
                lean: true,
                limit: 500
            };
            //.log(criteriaPro);

            if (payloadData.propertyType) {
                criteriaPro.lm_char1_36 = payloadData.propertyType
            }

            if (payloadData.typeOfDwelling) {
                criteriaPro.lm_char10_11 = payloadData.typeOfDwelling
            }

            if (payloadData.listingid) {
                criteriaPro.l_displayid = payloadData.listingid
            }

            /*if(payloadData.listingid){
                criteriaPro.l_listingid = payloadData.listingid
            }*/

            if (payloadData.area) {
                var area_array = payloadData.area.split(',');
                if (area_array.length > 0) {
                    criteriaPro.l_area = { $in: area_array }
                }

            }

            if (payloadData.minbathRoom && payloadData.maxbathRoom) {
                var lm_int1_19 = {
                    $gte: payloadData.minbathRoom,
                    $lte: payloadData.maxbathRoom
                }
                criteriaPro.lm_int1_19 = lm_int1_19;
            } else {
                if (payloadData.minbathRoom) {
                    var lm_int1_19 = {
                        $gte: payloadData.minbathRoom,
                    }
                    criteriaPro.lm_int1_19 = lm_int1_19;
                }
                if (payloadData.maxbathRoom) {
                    var lm_int1_19 = {
                        $lte: payloadData.maxbathRoom
                    }
                    criteriaPro.lm_int1_19 = lm_int1_19;
                }
            }

            if (payloadData.minbedRoom && payloadData.maxbedRoom) {
                var lm_int1_4 = {
                    $gte: payloadData.minbedRoom,
                    $lte: payloadData.maxbedRoom
                }
                criteriaPro.lm_int1_4 = lm_int1_4;
            } else {
                if (payloadData.minbedRoom) {
                    var lm_int1_4 = {
                        $gte: payloadData.minbedRoom,
                    }
                    criteriaPro.lm_int1_4 = lm_int1_4;
                }
                if (payloadData.maxbedRoom) {
                    var lm_int1_4 = {
                        $lte: payloadData.maxbedRoom
                    }
                    criteriaPro.lm_int1_4 = lm_int1_4;
                }
            }

            if (payloadData.minAskingprice && payloadData.maxAskingprice) {
                var price = {
                    $gte: payloadData.minAskingprice,
                    $lte: payloadData.maxAskingprice
                }
                criteriaPro.l_askingprice = price;
            } else {
                if (payloadData.minAskingprice) {
                    var price = {
                        $gte: payloadData.minAskingprice,
                    }
                    criteriaPro.l_askingprice = price;
                }
                if (payloadData.maxAskingprice) {
                    var price = {
                        $lte: payloadData.maxAskingprice
                    }
                    criteriaPro.l_askingprice = price;
                }
            };
            if (payloadData.min_lot && payloadData.max_lot) {
                var lm_dec_11 = {
                    $gte: payloadData.min_lot,
                    $lte: payloadData.max_lot
                }
                criteriaPro.lm_dec_11 = lm_dec_11;
            } else {
                if (payloadData.min_lot) {
                    var lm_dec_11 = {
                        $gte: payloadData.min_lot,
                    }
                    criteriaPro.lm_dec_11 = lm_dec_11;
                }
                if (payloadData.max_lot) {
                    var lm_dec_11 = {
                        $lte: payloadData.max_lot
                    }
                    criteriaPro.lm_dec_11 = lm_dec_11;
                }
            }
            if (payloadData.minFloorSpace && payloadData.maxFloorSpace) {
                var lm_dec_7 = {
                    $gte: payloadData.minFloorSpace,
                    $lte: payloadData.maxFloorSpace
                }
                criteriaPro.lm_dec_7 = lm_dec_7;
            } else {
                if (payloadData.minFloorSpace) {
                    var lm_dec_7 = {
                        $gte: payloadData.minFloorSpace,
                    }
                    criteriaPro.lm_dec_7 = lm_dec_7;
                }
                if (payloadData.maxFloorSpace) {
                    var lm_dec_7 = {
                        $lte: payloadData.max_lot
                    }
                    criteriaPro.lm_dec_7 = lm_dec_7;
                }
            }
            if (criteriaPro) {
                Service.REST_PROPERY_RD_1_Service.getData(criteriaPro, projectionPro, optionsPro, (err, data) => {
                    if (err) {
                        //.log("Reaching in IF");
                        return cb(err);
                    } else if (data.length > 0) {
                        arr = data;
                        return cb();
                    } else {
                        //.log("Coming In else loop. No data found");
                        return cb();
                    }
                });
            } else {
                return cb();
            }

        }],
        getPropertyCount: [(cb) => { // //.log("cvcvvcvc===",finalData);
            Service.REST_PROPERY_RD_1_Service.getDataCount({}, (err, data) => {
                if (err) {
                    return cb(err);
                } else {
                    PropertyCount = data
                    return cb();
                }

            });
        }],
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        //  //.log(err,result);
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            // totalRecord: totalRecord,
            PropertyCount: PropertyCount,
            foundListingLength: arr.length,
            PropertyArray: arr
        });
    })
}

//Get Schools API
var getSchools = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var criteria = {
        displayInNavigation: true
    };
    var projection = {
        location2: 0,
        _v: 0
    };
    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true
            };
            Service.SCHOOL_SERVICE.getData(criteria, projection, options, (err, data) => {
                if (err) {
                    var value = {
                        "statusCode": 500,
                        "status": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (data.length > 0) {
                    var value = {
                        "statusCode": 200,
                        "status": "success",
                        "data": data
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "status": "No data found",
                        "data": []
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    })
}


var addFaq = function (payloadData, userData, callbackRoute) {
    console.log('hiehiehieehiehi')
    //.log("Payload Dta", payloadData);
    async.auto({
        addFaq: [(cb) => {
            payloadData.createdBy = userData._id
            if (payloadData.is_published == true) {
                payloadData.publishedAt = new Date().toISOString();
            }
            Service.faq.addInfo(payloadData, function (err, inserted) {
                if (err) {
                    //.log(err);
                    var value = {
                        "statusCode": 400,
                        "message": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "message": "Added Successfully",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "message": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        console.log(err)
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

var showFaq = function (query, callbackRoute) {
    console.log('in show faq')

    var totalRecord = 0;
    var finalData = [];

    var projection = {
        _v: 0
    };
    async.auto({
        getData: [(cb) => {
            if (query.accessToken) {

                //console.log(userdata)

                jwt.verify(query.accessToken, Configs.CONSTS.jwtkey, function (err, decode) { // checking token expiry
                    if (err) {

                        var value = {
                            "statusCode": 500,
                            "message": "failure",
                            "data": err
                        }
                        return cb(value);

                    } else {
                        console.log('token verified')
                        if (query.role == 'SITE_AGENT') {
                            console.log('in site agent')
                            var criteria = {

                                createdBy: decoded.id
                            };
                            var options = {
                                lean: true
                            };
                            Service.faq.getInfo(criteria, projection, options, (err, data) => {
                                if (err) {
                                    var value = {
                                        "statusCode": 500,
                                        "message": "failure",
                                        "data": err
                                    }
                                    return cb(value);
                                } else if (data.length > 0) {
                                    var value = {
                                        "statusCode": 200,
                                        "message": "Fetched Successfully",
                                        "data": data
                                    }
                                    return cb(value);
                                } else {
                                    var value = {
                                        "statusCode": 200,
                                        "message": "No data found",
                                        "data": []
                                    }
                                    return cb(value);
                                }
                            });

                        }
                        else if (query.role == 'Admin') {
                            console.log('in admin')
                            console.log(decode);
                            var criteria = {

                            };
                            var options = {
                                lean: true
                            };
                            Service.faq.getInfo(criteria, projection, options, (err, data) => {
                                if (err) {
                                    var value = {
                                        "statusCode": 500,
                                        "message": "failure",
                                        "data": err
                                    }
                                    return cb(value);
                                } else if (data.length > 0) {
                                    var value = {
                                        "statusCode": 200,
                                        "message": "Fetched Successfully",
                                        "data": data
                                    }
                                    return cb(value);
                                } else {
                                    var value = {
                                        "statusCode": 200,
                                        "message": "No data found",
                                        "data": []
                                    }
                                    return cb(value);
                                }
                            });

                        }
                    }
                });

            }
            else if (query.siteId) {
                console.log('in user')
                var criteria = {
                    $or: [
                        { createdBy: query.siteId }, { is_global: true }
                    ],
                    is_published: true
                };
                var options = {
                    lean: true
                };
                Service.faq.getInfo(criteria, projection, options, (err, data) => {
                    console.log('data', data),
                        console.log('err', err)
                    if (err) {
                        var value = {
                            "statusCode": 500,
                            "message": "failure",
                            "data": err
                        }
                        return cb(value);
                    } else if (data.length > 0) {
                        var value = {
                            "statusCode": 200,
                            "message": "Fetched Successfully",
                            "data": data
                        }
                        return cb(value);
                    } else {
                        var value = {
                            "statusCode": 200,
                            "message": "No data found",
                            "data": []
                        }
                        return cb(value);
                    }
                });

            }
        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    })

}

var deleteFaq = function (payloadData, UserData, callbackRoute) {
    async.auto({
        deleteFaq: [(cb) => {
            var criteria = {
                _id: payloadData.faqId
            }
            Service.faq.deleteInfo(criteria, { new: true }, function (err, result) {
                if (err) return cb(err);
                return cb();
            })
        }],
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var updateFaq = function (payloadData, callbackRoute) {
    async.auto({
        updatefaq: [(cb) => {
            var dataToSave = {
                // question: payloadData.question,
                // answer: payloadData.answer,
                // is_global: payloadData.is_global,
            };
            var options = {
                lean: true,
                new: true
            };
            var criteria = {
                _id: payloadData.faqId
            }
            if (payloadData.type) {

                dataToSave["type"] = payloadData.type

            }

            if (payloadData.hasOwnProperty("is_published")) {
                if (payloadData.is_published == true) {
                    dataToSave["is_published"] = payloadData.is_published,
                        dataToSave["publishedAt"] = new Date().toISOString();
                }
                else {

                    dataToSave["is_published"] = payloadData.is_published
                }

            }

            if (payloadData.question) {

                dataToSave["question"] = payloadData.question

            }
            if (payloadData.answer) {
                dataToSave["answer"] = payloadData.answer

            }
            if (payloadData.hasOwnProperty("is_global")) {
                dataToSave["is_global"] = payloadData.is_global

            }
            console.log('dataToSave', dataToSave)
            Service.faq.updateInfo(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                if (result) {

                    var value = {
                        "statusCode": 200,
                        "message": "Updated Successfully",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "message": "Data not found",
                        "data": ""
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    });
};


// Not in use
var setAreaList = function (payloadData, callbackRoute) {

    async.auto({
        setAreaList: [(cb) => {
            payloadData.createdAt = new Date().toISOString();
            payloadData.modifiedOn = new Date().toISOString();
            console.log("CONTROLLER:", payloadData)

            Service.setAreaList.addInfo(payloadData, function (err, inserted) {
                if (err) {
                    var value = {
                        "statusCode": 400,
                        "message": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (inserted) {
                    var value = {
                        "statusCode": 200,
                        "message": "Added Successfully",
                        "data": inserted
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 400,
                        "message": "failure",
                        "data": "Something went wrong while saving data. Please try again later."
                    }
                    return cb(value);
                }
            });
        }]
    }, (err, result) => {
        console.log(err)
        if (err) return callbackRoute(err);

        return callbackRoute(result);
    });
};

var getAreaList = function (query, callbackRoute) {
    console.log('QUERY:', query)

    var totalRecord = 0;
    var finalData = [];

    var projection = {
        _v: 0
    };
    async.auto({
        getAreaList: [(cb) => {

            var criteria = {
                siteId: query.siteId
            };
            var options = {
                lean: true
            };
            Service.setAreaList.getInfo(criteria, projection, options, (err, data) => {
                console.log('data', data),
                    console.log('err', err)
                if (err) {
                    var value = {
                        "statusCode": 500,
                        "message": "failure",
                        "data": err
                    }
                    return cb(value);
                } else if (data) {
                    var value = {
                        "statusCode": 200,
                        "message": "Fetched Successfully",
                        "data": data
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "message": "No data found",
                        "data": []
                    }
                    return cb(value);
                }
            });

        }]
    }, (err, result) => { // //.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    })

}

var updateAreaList = function (payloadData, callbackRoute) {
    async.auto({
        updateAreaList: [(cb) => {
            var dataToSave = payloadData;
            var options = {
                lean: true,
                new: true
            };

            var criteria = {
                siteId: payloadData.siteId
            }


            dataToSave["modifiedOn"] = new Date().toISOString();

            // console.log('dataToUpdate', dataToSave);
            Service.setAreaList.updateInfo(criteria, dataToSave, options, function (err, result) {
                if (err) return cb(err);
                if (result) {
                    var value = {
                        "statusCode": 200,
                        "message": "Updated Successfully",
                        "data": result
                    }
                    return cb(value);
                } else {
                    var value = {
                        "statusCode": 200,
                        "message": "Data not found",
                        "data": ""
                    }
                    return cb(value);
                }

            });
        }]
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute(result);
    });
}


module.exports = {
    setAreaList: setAreaList,
    getAreaList: getAreaList,
    updateAreaList: updateAreaList,
    updateProperty: updateProperty,
    updateFaq: updateFaq,
    deleteFaq: deleteFaq,
    showFaq: showFaq,
    login: login,
    ChangedPassword: ChangedPassword,
    setFeatured: setFeatured,
    CretePost: CretePost,
    updatePost: updatePost,
    getAllpost: getAllpost,
    deletepost: deletepost,
    addSchool: addSchool,
    getAllSchool: getAllSchool,
    editSchool: editSchool,
    getAllUser: getAllUser,
    getAllUserWithoutTokenContr: getAllUserWithoutTokenContr,
    getSaveListingOfUser: getSaveListingOfUser,
    editUserProfile: editUserProfile,
    getAllContact: getAllContact,
    ProfileUpload: ProfileUpload,
    userDetail: userDetail,
    agentDetails: agentDetails,
    PostImageUpload: PostImageUpload,
    createUser: createUser,
    moveLeadToCrm: moveLeadToCrm,
    crmUserLead: crmUserLead,
    crmPropertyofUserLead: crmPropertyofUserLead,
    crmUserProfile: crmUserProfile,
    createFunnel: createFunnel,
    getAllFunnel: getAllFunnel,
    assignedFunnelIdToCrmProperty: assignedFunnelIdToCrmProperty,
    updateFunnel: updateFunnel,
    getFunnelDetail: getFunnelDetail,
    updateCatgoryOfLead: updateCatgoryOfLead,
    CsvFileUpload: CsvFileUpload,
    contactDetail: contactDetail,
    assignedAgent: assignedAgent,
    crmUserLead_new: crmUserLead_new,
    crmPropertyofUserLead_new: crmPropertyofUserLead_new,
    crmUserProfile_new: crmUserProfile_new,
    updatesellerperofile: updatesellerperofile,
    moveLeadToCrm_new: moveLeadToCrm_new,
    getallSearchPopertyUsingMlsNumber: getallSearchPopertyUsingMlsNumber,
    setLogoAndOtherThemeOption: setLogoAndOtherThemeOption,
    uploadLogo: uploadLogo,
    getAllThemeData: getAllThemeData,
    setHoliday: setHoliday,
    getHoliday: getHoliday,
    deleteHoliday: deleteHoliday,
    getPostCard: getPostCard,
    getAllFunnelTemplate: getAllFunnelTemplate,
    sendMessageToAgent: sendMessageToAgent,
    activateDeactivatedUser: activateDeactivatedUser,
    addSchoolPolygon: addSchoolPolygon,
    getSchoolPolygon: getSchoolPolygon,
    getAllFrontPages: getAllFrontPages,
    createFrontPage: createFrontPage,
    createPage: createPage,
    getAllPages: getAllPages,
    editPage: editPage,
    getPageData: getPageData,
    deletepage: deletepage,
    deleteNavigtion: deleteNavigtion,
    deleteFunnelTemplate: deleteFunnelTemplate,
    deleteFunnel: deleteFunnel,
    createDuplicateFunnel: createDuplicateFunnel,
    updateTitleFunnel: updateTitleFunnel,
    deleteSchool: deleteSchool,
    addPropertyAgent: addPropertyAgent,
    getManuallyInsertedPropertyList: getManuallyInsertedPropertyList,
    deletePropertyAgent: deletePropertyAgent,
    createSubscriptionPlan: createSubscriptionPlan,
    subscriptionPlanDetail: subscriptionPlanDetail,
    addCardToAgent: addCardToAgent,
    StripeAddPlan: StripeAddPlan,
    subscriptionPlanList: subscriptionPlanList,
    StripeAddPlanList: StripeAddPlanList,
    deleteSubscriptionPlan: deleteSubscriptionPlan,
    editSubscriptionPlan: editSubscriptionPlan,
    addTestimonial: addTestimonial,
    editTestimonial: editTestimonial,
    deleteTestimonial: deleteTestimonial,
    getTestimonials: getTestimonials,
    getTestimonialById: getTestimonialById,
    featuredPropertyAlgorithm: addFeaturedPropertyAlgorithm,
    getFeaturedProperties: getFeaturedProperties,
    addUsefulLinks: addUsefulLinks,
    deleteUsefulLinks: deleteUsefulLinks,
    getUsefulLinks: getUsefulLinks,
    getContactInfo: getContactInfo,
    addContactInfo: addContactInfo,
    addContactInfoListing: addContactInfoListing,
    getListedContactInfo: getListedContactInfo,
    addAboutUs: addAboutUs,
    getAboutUs: getAboutUs,
    addComment: addComment,
    getComments: getComments,
    deleteComment: deleteComment,
    validateComment: validateComment,
    deleteCommentsAdmin: deleteCommentsAdmin,
    getCommentsAdmin: getCommentsAdmin,
    addCategory: addCategory,
    deleteCategory: deleteCategory,
    getCategory: getCategory,
    getFeaturedPropertyAlgorithm: getFeaturedPropertyAlgorithm,
    getRecentProperties: getRecentProperties,
    addMortgage: addMortgage,
    deleteMortgage: deleteMortgage,
    getMortgage: getMortgage,
    getRate: getRate,
    mortgageRateSearch: mortgageRateSearch,
    editMortgage: editMortgage,
    getCities: getCities,
    getAllCitiesList: getAllCitiesList,
    getFavourites: getFavourites,
    addHomeWorth: addHomeWorth,
    addTerms: addTerms,
    getTerms: getTerms,
    addHomeWorthFunnel: addHomeWorthFunnel,
    getHomeWorthFunnel: getHomeWorthFunnel,
    getAllAgents: getAllAgents,
    deleteSellers: deleteSellers,
    deleteAgent: deleteAgent,
    cloudcmaAPI: cloudcmaAPI,
    changeFunnel: changeFunnel,
    deleteBuyer: deleteBuyer,
    cloudCmaCallback: cloudCmaCallback,
    getAllTemplates: getAllTemplates,
    assignAgentToBuyer: assignAgentToBuyer,
    getAllSiteAgents: getAllSiteAgents,
    getAllBuyers: getAllBuyers,
    getAllSellers: getAllSellers,
    addAgentsOrder: addAgentsOrder,
    getAllAgentsNew: getAllAgentsNew,
    getContactLeads: getContactLeads,
    getAgentsForListings: getAgentsForListings,
    unsubscribeFromFunnel: unsubscribeFromFunnel,
    getGlobalUsefulLinks: getGlobalUsefulLinks,
    getAgentsWithoutOrder: getAgentsWithoutOrder,
    getAllAgentsData: getAllAgentsData,
    refineAgents: refineAgents,
    removeLeadFromCRM: removeLeadFromCRM,
    addFamilyMember: addFamilyMember,
    updateFamilyMember: updateFamilyMember,
    addLeadLogs: addLeadLogs,
    getLeadLogs: getLeadLogs,
    addCRTemplate: addCRTemplate,
    getCRTemplate: getCRTemplate,
    removeCRTemplate: removeCRTemplate,
    getAllCRTemplate: getAllCRTemplate,
    updateCRTemplate: updateCRTemplate,
    addPropertyDeal: addPropertyDeal,
    updatePropertyDeal: updatePropertyDeal,
    getAllPropertyDeals: getAllPropertyDeals,
    getPropertyDeal: getPropertyDeal,
    removePropertyDeal: removePropertyDeal,
    removeDealTemplate: removeDealTemplate,
    getDealTemplate: getDealTemplate,
    getAllDealTemplates: getAllDealTemplates,
    updateDealTemplate: updateDealTemplate,
    addDealTemplate: addDealTemplate,
    getAllPropertyTags: getAllPropertyTags,
    getMlsList: getMlsList,
    addSellerLogs: addSellerLogs,
    updateSellerLogs: updateSellerLogs,
    getAllSellerLogs: getAllSellerLogs,
    getSellerLog: getSellerLog,
    removeSellerLog: removeSellerLog,
    getFavouritePropertyDetails: getFavouritePropertyDetails,
    addBuyerLogs: addBuyerLogs,
    updateBuyerLogs: updateBuyerLogs,
    getAllBuyerLogs: getAllBuyerLogs,
    getBuyerLog: getBuyerLog,
    removeBuyerLog: removeBuyerLog,
    polygonSearch: polygonSearch,
    updateSchool: updateSchool,
    getSchools: getSchools,
    createnewPage: createnewPage,
    editUsefulLinks: editUsefulLinks,
    addFaq: addFaq,
    editFrontPage: editFrontPage,
    createUserCrm: createUserCrm,
    updateGreetingCards: updateGreetingCards,
    automaticMeeting: automaticMeeting,
    birthdayGreeting: birthdayGreeting,
    crmUserFilter: crmUserFilter,
    dealSendReminder: dealSendReminder,
    sellerDetails: sellerDetails,
    buyerFunnel: buyerFunnel,
    removeProperty: removeProperty,
    // upatemany:upatemany
}
