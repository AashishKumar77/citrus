/*--------------------------------------------
 * Include internal modules.
 ---------------------------------------------*/
//var UniversalFunctions = require('../Utils/commonfunctions');
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


var CreateCustomer = {
    method: 'POST',
    path: '/v1/payment/CreateCustomer',
    config: {
        description: 'Create customer.',
        tags: ['api', 'Payment'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            failAction: FailActionFunction
        }
    },
    handler: function(request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.paymentController.createCustomer(UserData, function(err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({ statusCode: 200, status: "success", message: "Customer created successfully" })
            }
        });
    }
}

var CreateSource = {
    method: 'PUT',
    path: '/v1/payment/CreateSource',
    config: {
        description: 'Create source is used to link cards to users using customer id.',
        tags: ['api', 'Payment'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            //headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            payload: {
                token: Joi.string().required().label('Stripe card')
            },
            failAction: FailActionFunction
        }
    },
    handler: function(request, reply) {
        request.payload.userData = request.pre.verify.userData[0];
        Controller.paymentController.createSource(request.payload, function(err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({ statusCode: 200, status: "success", message: "Customer linked successfully" })
            }
        });
    },
}

var CreateCharge = {
    method: 'PUT',
    path: '/v1/payment/CreateCharge',
    config: {
        description: 'Create charge to deduct amount from user card',
        tags: ['api', 'Payment'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            payload: {
                token: Joi.string().required().label('Stripe card')
            },
            failAction: FailActionFunction
        }
    },
    handler: function(request, reply) {
        request.payload.userData = request.pre.verify.userData[0];
        Controller.paymentController.createSource(request.payload, function(err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({ statusCode: 200, status: "success", message: "Customer linked successfully" })
            }
        });
    },
}

var ListCards = {
    method: 'PUT',
    path: '/v1/payment/listCards',
    config: {
        description: 'List all cards associated to user',
        tags: ['api', 'Payment'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            failAction: FailActionFunction
        }
    },
    handler: function(request, reply) {
        var userData = request.pre.verify.userData[0];
        Controller.paymentController.listCards(userData, function(err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({ statusCode: 200, status: "success", message: "Cards listed successfully", result: data })
            }
        });
    },
}

var SetDefaultCards = {
    method: 'PUT',
    path: '/v1/payment/setDefaultCard',
    config: {
        description: 'Set default card amongst multiple cards',
        tags: ['api', 'Payment'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            payload:{
                card_id: Joi.string().required().label('Card id')
            },
            failAction: FailActionFunction
        }
    },
    handler: function(request, reply) {
        request.payload.userData = request.pre.verify.userData[0];
        Controller.paymentController.setDefaultCard(request.payload, function(err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({ statusCode: 200, status: "success", message: "Cards set as default successfully" })
            }
        });
    },
}


module.exports = [
    CreateCustomer,
    CreateSource,
    //ListCards,
    //SetDefaultCards,
]