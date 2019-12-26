/*--------------------------------------------
 * Include internal modules.
 ---------------------------------------------*/
//var UniversalFunctions = require('../Utils/commonfunctions');
const Utils = require('../Utils');
var Config = require('../Configs');
var APP_CONSTANTS = Config.CONSTS;
var SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;
var DEVICE_TYPE = APP_CONSTANTS.DEVICE_TYPE;
var USER_TYPE = APP_CONSTANTS.USER_TYPE;
var IMG_SIZE = APP_CONSTANTS.IMG_SIZE;
var Controller = require('../Controllers');
var FailActionFunction = require('../Utils/universalfunctions').failActionFunction;
var sendSuccess = require('../Utils/universalfunctions').sendSuccess;
var sendError = require('../Utils/universalfunctions').sendError;
var allowAccessTokenInHeader = require('../Utils/universalfunctions').allowAccessTokenInHeader;

var checkAccessToken = require('../Utils/universalfunctions').getTokenFromDB;


/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
var Joi = require('joi');
const path = require('path')


var restPropertyRD_1 = {
    method: 'GET',
    path: '/v1/cronRoute/restPropertyRD_1',
    config: {
        description: 'api to get list of all the users',
        tags: ['api', 'Cron'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.CronController.restPropertyRD_1(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}

var restPropertyRD_1 = {
    method: 'GET',
    path: '/v1/cronRoute/RD_1_Properties',
    config: {
        description: 'api to get list of all the users',
        tags: ['api', 'Cron'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.CronController.RD_1_Properties(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}


var PropertyClass = {
    method: 'GET',
    path: '/v1/cronRoute/PropertyClass',
    config: {
        description: 'api to get list of all the users',
        tags: ['api', 'Cron'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.CronController.PropertyClass(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}

var sendEmailToUser = {
    method: 'GET',
    path: '/v1/cronRoute/sendEmailToUser',
    config: {
        description: 'api to send email to user (buyer or seller)',
        tags: ['api', 'Cron'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        // //console.log("REQUEST",request);
        Controller.CronController.FunnelsendEmail(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}

var sendEmailToAgent = {
    method: 'GET',
    path: '/v1/cronRoute/sendEmailToAgent',
    config: {
        description: 'api to send email to user (buyer or seller)',
        tags: ['api', 'Cron'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.CronController.sendEmailToUser_new(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}
var InsertSchool = {
    method: 'GET',
    path: '/v1/cronRoute/InsertSchool',
    config: {
        description: 'api to import school',
        tags: ['api', 'Cron'],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        //var file_path =  path.join(__dirname, '../Assets/elementary_school_catchments.json');
        var file_path =''  //require('../Assets/elementary_school_catchments.json');
        Controller.CronController.Insertschool(file_path, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}
var cloudcmaAPI = {
    method: 'GET',
    path: '/v1/cronRoute/cloudcmaAPI',
    config: {
        description: 'Create and deliver a Quick CMA',
        tags: ['api', 'Cron'],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var tempData = {
            name:"Anurag",
            email:'anurag@devs.matrixmarketers.com',
            address:'2020 E BROADWAY',
            //address:'sadasasd'
        }
        Controller.CronController.cloudcmaAPI(tempData, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}


var deleteProperty = {
    method: 'GET',
    path: '/v1/cronRoute/deleteProperty',
    config: {
        description: 'Create and deliver a Quick CMA',
        tags: ['api', 'Cron'],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.CronController.deleteProperty({}, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data || {}
                })
            }
        });
    },
}


module.exports = [
    restPropertyRD_1,
    PropertyClass,
    sendEmailToUser,
    sendEmailToAgent,
    //InsertSchool,
    cloudcmaAPI,
    //deleteProperty
]
