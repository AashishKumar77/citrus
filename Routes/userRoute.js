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

var checkAccessToken    = require('../Utils/universalfunctions').getTokenFromDB;
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
const RESPONSES = Utils.responses;

/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
var Joi = require('joi');


var registerAgent = {
    method: 'POST',
    path: '/v1/user/registerAgent',
    config: {
        description: 'Add User',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                // firstName: Joi.string().optional(),
                // lastName: Joi.string().optional(),
                // email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("sghsdjk"),
                // password: Joi.string().optional().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: ' should be between 8-14 characters and must be alphanumeric.'}}}}).label('Password'),
                // siteId: Joi.string().trim().length(24).required(),
                // userType: Joi.string().required().valid([USER_TYPE.AGENT]),
                // stripePlanId  :  Joi.string().length(24).optional(),
                // cardExpMonth  :  Joi.number().optional(),
                // cardNumber    :  Joi.number().optional(),
                // cardExpYear   :  Joi.number().optional(),
                // cardCvc       :  Joi.number().optional(),
                // phone         :  Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {

        Controller.UserController.registerUser(request.payload, {}, (err, data)=> {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {////console.log("xxxxx", data);
                if (!data.userDetails.isEmailVerified) {
                    var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.EMAILNOTVERIFY
                } else {
                    var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT
                }
                reply(sendSuccess(messageObject, data.userDetails)).header('accessToken', data.accessToken);
            }
        });
    },
}

var registerUser = {
    method: 'POST',
    path: '/v1/user/registerUser',
    config: {
        description: 'Add User',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                password: Joi.string().optional().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: ' should be between 8-14 characters and must be alphanumeric.'}}}}).label('Password'),
                siteId: Joi.string().trim().length(24).required(),
                phoneNumber : Joi.string().required(),
                //linkedinId: Joi.string().optional().trim(),
                //socialMode: Joi.string().optional().valid([SOCIAL_MODE.FACEBOOK, SOCIAL_MODE.LINKEDIN]),
                userType: Joi.string().required().valid([USER_TYPE.SELLER,USER_TYPE.BUYER]),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.registerUser(request.payload, {}, (err, data)=> {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {////console.log("xxxxx", data);
                if (!data.userDetails.isEmailVerified) {
                    var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.EMAILNOTVERIFY
                } else {
                    var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT
                }
                reply(sendSuccess(messageObject, data.userDetails)).header('accessToken', data.accessToken);
                // reply(sendSuccess("Success"));
            }
        });
    },
}

var login = {
    method: 'POST',
    path: '/v1/user/login',
    config: {
        description: 'login',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                // email: Joi.string().email().lowercase().optional(),
                email: Joi.string().trim().optional().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                siteId: Joi.string().optional().label('siteId'),
                password: Joi.string().optional().label('Password'),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.login(request.payload, {}, (err, data)=> {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else { //console.log("data.userDetails.isEmailVerified", data.userDetails.isEmailVerified);
                if (!data.userDetails.isEmailVerified) {
                    //console.log("if", data.userDetails);
                    var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.EMAILNOTVERIFY
                } else {
                    //console.log("else");
                    var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT
                }
                var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT
                reply(sendSuccess(messageObject, data.userDetails)).header('accessToken', data.accessToken);
            }
        });
    },
}

var changedPasword = {
    method: 'POST',
    path: '/v1/user/changedPasword',
    config: {
        description: 'changed Pasword',
        tags: ['api', 'user'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.UserController.ChangedPassword(request.payload,userData, function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                //newPassword: Joi.string().min(8).required(),
                // email : Joi.string().required(),
                newPassword: Joi.string().required().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: 'should be between 8-14 characters and must be alphanumeric.'}}}}).label('newPassword'),
                //oldPassword: Joi.string().required().trim().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: 'should be between 8-14 characters and must be alphanumeric.'}}}}).label('oldPassword'),
                oldPassword: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}


var forgotPassword = {
    method: 'POST',
    path: '/v1/user/forgotPassword',
    config: {
        description: 'api to send forgot password link to user',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                // email: Joi.string().email().lowercase().required(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}),

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.forgotPassword(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                //reply(data);
                reply(sendSuccess(data)).code(200)
            }
        });
    },
}

var resetForgotPassword = { //reset forgot password api
    method: 'POST',
    path: '/v1/user/resetForgotPassword',
    config: {
        description: 'api to reset forgot password ',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                forgotPasswordToken: Joi.string().required().label('Token'),
                password: Joi.string().required().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: ' should be between 8-14 characters and must be alphanumeric'}}}}).label('Password'),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.resetForgotPassword(request.payload,function (err, data) {  ////console.log("errRoute",err,data);
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                        "statusCode": 200,
                        "status": "success",
                        "message": "Password updated successfully.",data:null
                })
            }
        });
    },
}

var logOut = {
    method: 'PUT',
    path: '/v1/user/logout',          //logout api
    config: {
        description: 'User Logout',
        notes: 'Logout from the system',
        tags: ['api'],
        pre: [{ method: checkAccessToken, assign: 'verify'  }],
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().optional()}).options({allowUnknown: true}),
            payload: {
                accessToken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        //console.log("asdasd", request);
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.Logout(request.payload, UserData, function (err, res) {
            if (err) reply(sendError(err));
            reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT)).code(200);
        });
    }
}

var accessUserImagesOnServer = {
    method: 'GET',
    path: '/v1/user/accessUserImagesOnServer',
    config: {
        description: 'user get  Images',
        tags: ['api', 'User'],
        handler: function (request, reply) {
            Utils.universalfunctions.fetchImagePath(request.query.fileName, function(err, res) {
                if (err) {
                    reply(err);
                } else {
                  //console.log(' IN ELSE HERE ');
                    return reply.file('./' + res)
                }
            })
        },
        validate: {
            query: {
                fileName: Joi.string().required(),
            },
            failAction: FailActionFunction,
        }
    }
}



var downloadZip = {
    method: 'GET',
    path: '/v1/user/downloadZip',
    config: {
        description: 'user get  Images',
        tags: ['api', 'User'],
        handler: function (request, reply) {
          return reply.file('/home/matrix/2019/Citrus_backend/dist.zip');

            // Utils.universalfunctions.downloadZip(request.query.fileName, function(err, res) {
            //     if (err) {
            //         //console.log("__dirname",__dirname);
            //         //console.log(err);
            //         reply(err);
            //     } else {
            //       //console.log(' IN ELSE HERE ');
            //
            //         //console.log(res);
            //         // return path.resolve(res)
            //         return reply.file('/home/matrix/2019/angular/builds/dist.zip')
            //     }
            // })
        },
        validate: {
            query: {
                fileName: Joi.string().required(),
            },
            failAction: FailActionFunction,
        }
    }
}
var getAllPost = {
    method: 'GET',
    path: '/v1/user/getAllPost',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                siteId: Joi.string().length(24).required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.getAllpost(request.query,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}


var getPostDetail = {
    method: 'GET',
    path: '/v1/user/getPostDetail',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'user'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                postAutoIncrement: Joi.number().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.getPostDetail(request.query,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}



var getPostDetail = {
    method: 'GET',
    path: '/v1/user/getPostDetail',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'user'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                postAutoIncrement: Joi.number().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.getPostDetail(request.query,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}
//verify forgot password link
var verifyForgotPasswordToken = {
    method: 'POST',
    path: '/v1/user/verifyForgotPasswordToken',
    config: {
        description: 'Api to verify forgot password Token ',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                forgotPasswordToken: Joi.string().required().label('Token'),
                // email: Joi.string().required().label('Token'),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.verifyForgotPasswordToken(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "status": "success",
                    "message": "Token verified successfully."
                })
            }
        });
    },
}

//resent email verification link
var resentEmailVerificationLink = {
    method: 'POST',
    path: '/v1/user/resentEmailVerificationLink',
    config: {
        description: 'Api to sent email verification link again.',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                // email: Joi.string().email().lowercase().required()
                email:Joi.string().trim().required()

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
      // //console.log("+++++++++++++++++======^%$#&^&%$");
      //console.log(request.payload);
        Controller.UserController.resentEmailVerificationLink(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(data)
            }
        });
    }

}

//verify email
var emailVerification = {
    method: 'POST',
    path: '/v1/user/emailVerification',
    config: {
        description: 'Api to verify email token ',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                emailVerificationToken: Joi.string().required().label('Token'),
                // email: Joi.string().lowercase().required().label('Email'),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),


            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.verifyEmailToken(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err)); //reply(err);
            } else {
                reply(data)
            }
        });
    },
}

var getAllUsers = {
    method: 'GET',
    path: '/v1/user/getAllUsers',
    config: {
        description: 'api to get list of all the users',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.getAllUsers(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply(data)
            }
        });
    },
}

var editConsumerProfile = {
    method: 'PUT',
    path: '/v1/user/editConsumerProfile',
    config: {
        description: 'Api route to edit profile of Consumer (Test this API On postman as it contains multipart data).',
        tags: ['api', 'User'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },
        validate: {
            payload: {
                name: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('Name'),
                //email: Joi.string().email().required().lowercase().label('Email'),
                phone: Joi.string().required().required().label('Contact number'),
                //phone: Joi.string().required().regex(/^\+(?:[0-9\-] ?){10,14}[0-9 ]$/).options({language: {string: {regex: {base: "should be valid (Eg: +44 12 3456 7890)"}}}}).required().label('Contact number'),
                longitude: Joi.number().required().label('Longitude'),
                lattitude: Joi.number().required().label('Lattitude'),
                location_name: Joi.string().optional().label('Location name'),
                about_yourself: Joi.string().optional().allow('').label('About Yourself'),
                profile_pic: Joi.any().optional().allow('').label('Profile pic')
            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.editConsumerProfile(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply(data)
            }
        });
    },
}



var getLoggedInUserData = {
    method: 'GET',
    path: '/v1/user/getLoggedInUserData',
    config: {
        description: 'Api to get details of logged in user.',
        tags: ['api', 'User'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        //auth: 'CustomerAuth',
        validate: {
            headers: Joi.object({
                'accesstoken': Joi.string().trim().required()
            }).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.getUserDataApi(UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.Data_fetched, data)).code(200)
            }
        });
    },
}
var contactUs = {
    method: 'POST',
    path: '/v1/user/contactUs',
    config: {
        description: 'Api for contact us page(admin emails will be sent to derek@derekthornton.com).',
        tags: ['api'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                firstName:Joi.string().trim().required().lowercase(),
                lastName:Joi.string().trim().optional().lowercase(),
                phoneNumber:Joi.number().required(),
                siteId :Joi.string().trim().length(24).required(),
                PropertyId:Joi.string().optional(),
                email:Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                message :Joi.string().required().label('messagess').lowercase(),
                siteId :Joi.string().trim().length(24).optional(),
                formType:Joi.string().optional().valid([
                    CONTACT_FORM_TYPE.LEAD,
                    CONTACT_FORM_TYPE.CONTACT_FORM,
                    CONTACT_FORM_TYPE.REQUESTCALLBACK,
                    CONTACT_FORM_TYPE.PROPERTY_DETAIL
                ]),
                userType : Joi.string().trim().required()
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }

        }
    },
    handler: function (request, reply) {
        var UserData =  {};//console.log("here===");
        Controller.UserController.contactUs(request.payload, UserData, function (err, data) {
            if(err){
                reply(err);
            }else{
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}
var schedule = {
    method: 'POST',
    path: '/v1/user/schedule',
    config: {
        description: 'Api for schedule  page.',
        tags: ['api'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                firstName: Joi.string().trim().required().lowercase(),
                lastName: Joi.string().trim().required().lowercase(),
                phoneNumber: Joi.number().required(),
                PropertyId: Joi.string().required(),
                agentEmail: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                message: Joi.string().required().label('messagess').lowercase(),
                siteId: Joi.string().trim().length(24).required(),
                formType:Joi.string().optional().valid([
                    CONTACT_FORM_TYPE.LEAD,
                    CONTACT_FORM_TYPE.CONTACT_FORM,
                    CONTACT_FORM_TYPE.REQUESTCALLBACK,
                    CONTACT_FORM_TYPE.PROPERTY_DETAIL
                ]),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) {
        var UserData =  {};//console.log("here===");
        Controller.UserController.saveSchedule(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}

var notification = {
    method: 'GET',
    path: '/v1/user/notification',
    config: {
        description: 'get notification.',
        tags: ['api', 'Consumer'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                //userType: Joi.string().optional().valid([USER_TYPE.CONSUMER,USER_TYPE.TRADEMEN]),
                searchKeyWord: Joi.string().optional()

            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.notification(request.query, UserData, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
            }
        });
    },
}

var readNotification = {
    method: 'PUT',
    path: '/v1/user/readNotification',
    config: {
        description: 'get notification.',
        tags: ['api', 'Consumer'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                notificationId: Joi.string().length(24).required().label('notificationId')
            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.readNotification(request.payload, UserData, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
            }
        });
    },
}

var testPushNotifications = {
    method: 'POST',
    path: '/v1/test/testPushNotifications',
    config: {
        description: 'get notification.',
        tags: ['api', 'test'],
        validate: {
            payload: {
                message: Joi.string().required().label('Message'),
                device_token: Joi.string().required().label('device_token'),
                server_key: Joi.string().required().label('server key')
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.testPushNotifications(request.payload, function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply({
                    statusCode: "400",
                    status: "error",
                    err: err
                });
            } else {
                reply({
                    statusCode: "200",
                    status: "success",
                    result: data
                })
            }
        });
    },
}

var turnOnOffNotification = {
    method: 'PUT',
    path: '/v1/user/toggleNotification',
    config: {
        description: 'Api route to toggle notification settings of a user',
        notes: 'Api route to toggle notification settings of a user',
        tags: ['api'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                is_notification: Joi.boolean().required().label('Notification')
            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.toggleNotification(request.payload, UserData, function (err, res) {
            if (err) {
                reply(err);
            } else {
                reply({
                    statusCode: "200",
                    status: "success",
                    message: "Your notifications are turned " + ((res == true) ? "on" : "off") + " successfully",
                    results: {
                        "notification": res
                    }
                });
            }
        })
    }
};
var updateDeviceToken = {
    method: 'PUT',
    path: '/v1/user/updateDeviceToken',
    config: {
        description: 'Api Route to update device token.',
        notes: 'Api Route to update device token.',
        tags: ['api'],
        pre: [{method: checkAccessToken, assign: 'verify'}], //Login token verification
        validate: {
            payload: {
                device_token: Joi.string().label('device token'),
                device_type: Joi.string().label('device_type')
            },
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        request.payload.user_id = request.pre.verify.userData[0]._id;
        Controller.UserController.updateDeviceToken(request.payload, function (err, res) {
            if (err)
                reply(err);
            else
                reply({
                    statusCode: 200,
                    status: "success",
                    message: "Token updated successfully."
                });
        })
    }
};

var deletePreviousWorkImage = {
    method: 'delete',
    path: '/v1/user/deletePreviousWorkImage',
    config: {
        description: 'delete Work Images',
        tags: ['api'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                previous_work_image: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var userData = request.pre.verify.userData[0]; ////console.log("userData", userData);
        Controller.UserController.deletePreviousWorkImage(request.payload, userData, (err, data)=> {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({statusCode: 200, status: "success", message: "Image deleted successfully"})
            }
        });
    },
}

var saveListing = {
    method: 'POST',
    path: '/v1/user/saveListing',
    config: {
        description: 'changed Pasword',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
            Controller.UserController.saveListing(request.payload, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    if(data.IsSavedlisting == true){
                        reply(sendSuccess(RESPONSES.YOUR_LISTING_HAS_BEEN_SAVED, data)).code(200)
                    }
                   else{
                    reply(sendSuccess(RESPONSES.REMOVE_LISTING, data)).code(200)
                   }
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                accessToken: Joi.string().required(),
                PropertyId: Joi.string().trim().required().length(24),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}


var getSaveListing = {
    method: 'GET',
    path: '/v1/user/getSaveListing',
    config: {
        description: 'api to get SaveListing',
        tags: ['api', 'Residential'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken: Joi.string().required(),
                skip: Joi.number().required(),
                limit: Joi.number().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
        Controller.UserController.getsaveListing(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}
var getSavedlisting = {
    method: 'GET',
    path: '/v1/user/getSavedListing',
    config: {
        description: 'api to get SaveListing',
        tags: ['api', 'Residential'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken: Joi.string().optional(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
        Controller.UserController.getsavedListing(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}

var deletListing = {
    method: 'DELETE',
    path: '/v1/user/deletListing',
    config: {
        description: 'api to delete user  SaveListing',
        tags: ['api', 'Residential'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken: Joi.string().required(),
                saveListingId: Joi.string().trim().required().length(24),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
        Controller.UserController.deleteListing(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Deleted Successfully",
                })
            }
        });
    },
}

var saveSearch = {
    method: 'POST',
    path: '/v1/user/saveSearch',
    config: {
        description: 'changed Pasword',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.UserController.saveSearch(request.payload, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                    reply(sendSuccess(RESPONSES.YOUR_SEARCH_HAS_BEEN_SAVED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                
                accessToken: Joi.string().required(),
                searchTitle: Joi.string().required().label('Search Title'),
                listingid: Joi.number().optional().allow(null).allow(''),
                minbathRoom: Joi.number().optional().label('bathRoom').allow(null).allow(''),
                maxbathRoom: Joi.number().optional().label('bathRoom').allow(null).allow(''),
                minbedRoom: Joi.number().optional().label('bedRoom').allow(null).allow(''),
                maxbedRoom: Joi.number().optional().label('bedRoom').allow(null).allow(''),
                minAskingprice: Joi.number().optional().label('Minprice').allow(null).allow(''),
                maxAskingprice: Joi.number().optional().label('Maxprice').allow(null).allow(''),
                userId:Joi.string().optional().allow(null).allow(''),
                min_lot: Joi.number().optional().label('min_lot').allow(null).allow(''),
                max_lot: Joi.number().optional().label('max_lot').allow(null).allow(''),

                minFloorSpace: Joi.number().optional().label('minFloorSpace').allow(null).allow(''),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace').allow(null).allow(''),
                typeOfDwelling:Joi.string().optional().allow(null).allow(''),
                // area: Joi.string().trim().optional(),
                area: Joi.array().items().optional().allow('').allow(null).allow(''),
                propertyType: Joi.string().trim().optional().allow(null).allow(''),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}


var updateSaveSearch = {
    method: 'PUT',
    path: '/v1/user/updateSaveSearch',
    config: {
        description: 'Update the saved Search',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.UserController.updateSaveSearch(request.payload, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                    reply(sendSuccess(RESPONSES.YOUR_SEARCH_HAS_BEEN_SAVED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                accessToken: Joi.string().required(),
                id : Joi.string().required(),
                searchTitle: Joi.string().required().label('Search Title'),
                listingid: Joi.number().optional().allow('').allow(null),
                minbathRoom: Joi.number().optional().label('bathRoom').allow('').allow(null),
                maxbathRoom: Joi.number().optional().label('bathRoom').allow('').allow(null),
                minbedRoom: Joi.number().optional().label('bedRoom').allow('').allow(null),
                maxbedRoom: Joi.number().optional().label('bedRoom').allow('').allow(null),
                minAskingprice: Joi.number().optional().label('Minprice').allow('').allow(null),
                maxAskingprice: Joi.number().optional().label('Maxprice').allow('').allow(null),

                min_lot: Joi.number().optional().label('min_lot').allow('').allow(null),
                max_lot: Joi.number().optional().label('max_lot').allow('').allow(null),

                minFloorSpace: Joi.number().optional().label('minFloorSpace').allow('').allow(null),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace').allow('').allow(null),

                // area: Joi.string().trim().optional(),
                area: Joi.array().items().optional().allow('').allow(null),
                propertyType: Joi.string().trim().optional().allow('').allow(null)
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}

var getSearchData = {
    method: 'GET',
    path: '/v1/user/getSearchData',
    config: {
        description: 'api to get SaveListing',
        tags: ['api', 'Residential'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken: Joi.string().required(),
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                id:Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
        Controller.UserController.getSearchData(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}

var deletSearchData = {
    method: 'DELETE',
    path: '/v1/user/deletSearchData',
    config: {
        description: 'api to delete user  SaveListing',
        tags: ['api', 'Residential'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken: Joi.string().required(),
                searchId: Joi.string().trim().required().length(24),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
        Controller.UserController.deletSearchData(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Deleted Successfully",
                })
            }
        });
    },
}

var getAllContact = {
    method: 'GET',
    path: '/v1/user/getAllContact',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getAllpost(request.query,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Successfully",
                    data:data
                })
            }
        });
    },
}

var updateProfile = {
    method: 'POST',
    path: '/v1/user/updateProfile',
    config: {
        description: 'updateProfile',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.UserController.updateProfile(request.payload, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            payload: {
                fullName: Joi.string().optional(),
                // lastName: Joi.string().optional(),
                email: Joi.string().optional(),
                password: Joi.string().optional().label('password'),
                accessToken: Joi.string().required(),
                phone : Joi.string().optional(),
                phoneNumber : Joi.string().optional(),
                biography : Joi.string().optional(),
                profile_pic : Joi.string().optional(),
                oldPassword: Joi.string().optional().allow('').allow(null),
                facebookId : Joi.string().optional().allow('').allow(null),
                linkedinId : Joi.string().optional().allow('').allow(null),
                twitterId : Joi.string().optional().allow('').allow(null),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}

var savePropertiesLooked = {
    method: 'POST',
    path: '/v1/user/savePropertiesLooked',
    config: {
        description: 'savePropertiesLooked',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.UserController.savePropertiesLooked(request.payload, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            payload: {
                mls: Joi.string().required(),
                accessToken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}

var getAllSchool = {
    method: 'GET',
    path: '/v1/user/getAllSchool',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'user'],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),

            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getAllSchool(request.query,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}

var markfavoriteListing = {
    method: 'POST',
    path: '/v1/user/markfavoriteListing',
    config: {
        description: 'changed Pasword',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.UserController.markfavoriteListing(request.payload, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                    if(data.IsFavorited){
                        reply(sendSuccess(RESPONSES.YOUR_LISTING_HAS_BEEN_MARKED_AS_FAVORITE, data)).code(200)
                    }else{
                        reply(sendSuccess(RESPONSES.YOUR_LISTING_HAS_BEEN_MARKED_AS_UNFAVORITE, data)).code(200)
                    }

                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                PropertyId: Joi.string().trim().required().length(24),
                accessToken: Joi.string().required(),
                //IsFavorited: Joi.boolean().required().label('IsFavorited')
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var landingPageApi = {
    method: 'POST',
    path: '/v1/user/landingPageApi',
    config: {
        description: 'Api for contact us page(admin emails will be sent to anurag@devs.matrixmarketers.com).',
        tags: ['api'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                name: Joi.string().trim().required().lowercase(),
                email: Joi.string().trim().required().lowercase(),
                phoneNumber: Joi.number().required(),
                brokerage: Joi.string().required().label('Brokerage').lowercase(),
                yearsInBusiness: Joi.string().required().label('yearsInBusiness').lowercase(),
                Propertylisting: Joi.string().required().label('Propertylisting').lowercase(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }

        }
    },
    handler: function (request, reply) {
        var UserData =  {};//console.log("here===");
        Controller.UserController.landingPageApi(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}


var propertyValuation = {
    method: 'POST',
    path: '/v1/user/propertyValuation',
    config: {
        description: 'propertyValuation',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            Controller.UserController.propertyValuation(request.payload, {},function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else { //console.log("xxx",APP_CONSTANTS.STATUS_MSG.SUCCESS.SAVE_SUCCESSFULLY);
                    //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.SAVE_SUCCESSFULLY, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                firstName: Joi.string().trim().required().lowercase(),
                lastName: Joi.string().trim().required().lowercase(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                phoneNumber: Joi.number().required(),
                //address: Joi.string().trim().required().lowercase(),
                state: Joi.string().trim().required().lowercase(),
                zip: Joi.string().trim().required().lowercase(),
                addressLine1: Joi.string().trim().required().lowercase(),
                addressLine2: Joi.string().trim().optional().lowercase(),
                city: Joi.string().trim().required().lowercase(),
                propertyType: Joi.string().trim().required(),
                propertySize: Joi.string().trim().required(),
                siteId: Joi.string().trim().length(24).optional(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var savePolygon = {
    method: 'POST',
    path: '/v1/user/savePolygon',
    config: {
        description: "add Location || geofencing",
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0]; //console.log("UserData", UserData);
            Controller.UserController.savePolygon(request.payload,UserData,function (error, data) {
                if (error) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
                }
            });
        },
        validate: {
            //headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                accessToken: Joi.string().required(),
                coordinates: Joi.array().items(Joi.array().items(Joi.number().required()).required()).min(4).required()
            },
            failAction:FailActionFunction
        },
        plugins: {

        }
    }
}

var socialLogin = {
    method: 'POST',
    path: '/v1/user/socialLogin',
    config: {
        description: 'login',
        tags: ['api', 'User'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {
            payload: {
                facebookId: Joi.string().optional(),
                firstName: Joi.string().optional(),
                googleId: Joi.string().optional(),
                email: Joi.string().trim().optional().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.socialLogin(request.payload, {}, (err, data)=> {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT
                reply(sendSuccess(messageObject, data.userDetails)).header('accessToken', data.accessToken);
            }
        });
    },
}

var getFavouriteProperties = {
    method: 'GET',
    path: '/v1/user/getFavouriteProperties',
    config: {
        description: 'get Favourite',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
            Controller.UserController.getFavouriteProperties(request.query, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(RESPONSES.YOUR_LISTING_HAS_BEEN_SAVED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accessToken: Joi.string().required(),
                id:Joi.string().optional()
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}

var getPageData = {
    method: 'GET',
    path: '/v1/user/getPageData',
    config: {
        description: 'api to get list of all the page data',
        tags: ['api', 'user'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                pageAutoIncrement: Joi.any().optional(),
                // slug : Joi.string().optional()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.UserController.getPageData(request.query,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}

var landingPageFormApi = {
    method: 'POST',
    path: '/v1/user/landingPageFormApi',
    config: {
        description: 'Api for contact us page(admin emails will be sent to anurag@devs.matrixmarketers.com).',
        tags: ['api', 'user'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                name: Joi.string().trim().optional().lowercase(),
                email: Joi.string().trim().optional().lowercase(),
                phonenumber: Joi.string().optional(),
                address: Joi.string().optional().label('address').lowercase(),
                message: Joi.string().optional().label('Message').lowercase(),
                siteId: Joi.string().trim().length(24).required(),
                landingPageId: Joi.string().trim().length(24).required(),
                type :  Joi.string().optional()
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) {
        var UserData =  {};////console.log("here===");
        Controller.UserController.landingPageFormApi(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}

var subscriptionPlanList = {
    method: 'GET',
    path: '/v1/user/subscriptionPlanList',
    config: {
        description: 'Subscription Plan',
        tags: ['api', 'user'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { ////console.log("request.payload",request.payload);
        Controller.AdminController.subscriptionPlanList(request.query,{}, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var contactUsForm = {
    method: 'POST',
    path: '/v1/user/contactUsForm',
    config: {
        description: 'Api for contact us page(admin emails will be sent to anurag@devs.matrixmarketers.com).',
        tags: ['api'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                firstName: Joi.string().trim().required().lowercase(),
                lastName: Joi.string().trim().optional().lowercase(),
                phoneNumber: Joi.number().required(),
                adminEmail: Joi.string().required(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                message: Joi.string().required().label('messagess').lowercase(),
                agentId: Joi.string().trim().length(24).required(),
                formType:Joi.string().optional(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }

        }
    },
    handler: function (request, reply) {
      //  var UserData =  {};//console.log("here===");
        Controller.UserController.contactUsForm(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}

var scheduleShowing = {
    method: 'POST',
    path: '/v1/user/scheduleShowing',
    config: {
        description: 'Api for schedule showing',
        tags: ['api'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                firstName: Joi.string().trim().required().lowercase(),
                lastName: Joi.string().trim().optional().lowercase(),
                phoneNumber: Joi.number().optional(),
                adminEmail: Joi.string().required(),
                PropertyId: Joi.string().optional(),
                propertyName: Joi.string().optional(),
                message: Joi.string().optional(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                date: Joi.string().required(),
                time : Joi.array().items().optional(),
                agentId: Joi.string().trim().length(24).optional(),
                mlsNumber : Joi.string().required(),
                userType : Joi.string().required().valid(USER_TYPE.BUYER),
                siteId : Joi.string().required()
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }

        }
    },
    handler: function (request, reply) {
      //  var UserData =  {};//console.log("here===");
        Controller.UserController.scheduleShowing(request.payload, function (err, data) {
            if(err){
                // //console.log(err);
                reply(err);
            }else{
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}

//ExpirePassword Change
var ChangeExpirePassword = {
  method: 'POST',
  path: '/v1/user/ChangeExpirePassword',
  config: {
      description: 'Api for Changing Expired Password',
      tags: ['api'],
      //pre: [{method: checkAccessToken, assign: 'verify'}],
      validate: {
          failAction: FailActionFunction,
          // headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
          payload: {
              //newPassword: Joi.string().min(8).required(),
              email : Joi.string().required(),
              newPassword: Joi.string().required().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: 'should be between 8-14 characters and must be alphanumeric.'}}}}).label('newPassword'),
              //oldPassword: Joi.string().required().trim().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: 'should be between 8-14 characters and must be alphanumeric.'}}}}).label('oldPassword'),
              oldPassword: Joi.string().required(),
          }
      },
      plugins: {
          'hapi-swagger': {
          }

      }
  },
  handler: function (request, reply) {
      // var UserData = request.pre.verify.userData[0];
      Controller.UserController.ChangeExpirePassword(request.payload, function (err, data) {
          if (err) {
              reply(sendError(err));
          } else {
              reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
          }
      })
  }
}

// Get All schedules for a certain USER
var getSchedules = {
    method: 'GET',
    path: '/v1/user/getSchedules',
    config: {
        description: 'api to get list of all the schedules for a certain Agent/User/Admin',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken : Joi.string().required(),
                id: Joi.string().optional(),
            },
            // headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.getSchedules(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}




//Get Single Schedule
var getSchedule = {
    method: 'GET',
    path: '/v1/user/getSchedule',
    config: {
        description: 'api to get list of all the schedules for a certain Agent/User/Admin',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                accessToken : Joi.string().required(),
                id : Joi.string().required()
            },
            // headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.UserController.getSchedule(request.query,UserData,function (err, data) {
            if (err) { ////console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}

// var buyerGetSchedules = {
//     method: 'GET',
//     path: '/v1/user/buyerGetSchedules',
//     config: {
//         description: 'api to get list of all the schedules for a certain Agent/User/Admin',
//         tags: ['api', 'user'],
//         pre: [{method: checkAccessToken, assign: 'verify'}],
//         validate: {
//             query: {
//                 accessToken : Joi.string().required(),
//                 id:Joi.string().required(),
//             },
//             // headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
//             failAction: FailActionFunction
//         }
//     },
//     handler: function (request, reply) {
//         var UserData = request.pre.verify.userData[0];
//         Controller.UserController.buyerGetSchedules(request.query,UserData,function (err, data) {
//             if (err) { ////console.log("errRoute",err);
//                 reply(err);
//             } else {
//                 reply({
//                     "statusCode": 200,
//                     "message": "Success",
//                     data:data
//                 })
//             }
//         });
//     },
// }

//Test Leads
var testLeads = {
    method: 'POST',
    path: '/v1/user/testLeads',
    config: {
        description: 'Api for schedule showing',
        tags: ['api'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                firstName: Joi.string().trim().required().lowercase(),
                lastName: Joi.string().trim().optional().lowercase(),
                phoneNumber: Joi.number().optional(),
                adminEmail: Joi.string().required(),
                PropertyId: Joi.string().optional(),
                propertyName: Joi.string().optional(),
                message: Joi.string().optional(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({language: {string: {regex: {base: 'email.'}}}}).label("Invalid"),
                date: Joi.string().required(),
                time : Joi.array().items().optional(),
                siteId: Joi.string().trim().length(24).required(),
                mlsNumber : Joi.string().required()
                // assignedTo : Joi.string().required()
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }

        }
    },
    handler: function (request, reply) {
      //  var UserData =  {};//console.log("here===");
        Controller.UserController.testLeads(request.payload, function (err, data) {
            if (err) {
                reply(err);
            }else{
                reply({
                    'statusCode': 200,
                    'status': 'success',
                    'message': 'Message sent successfully.'
                })
            }
        });
    },
}


//Create Password
var createPassword = {
    method: 'POST',
    path: '/v1/user/createPassword',
    config: {
        description: 'api to create password',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
              createPasswordToken : Joi.string().required().label('Token'),
              password : Joi.string().required().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({language: {string: {regex: {base: ' should be between 8-14 characters and must be alphanumeric'}}}}).label('Password'),

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { ////console.log("errRoute",request.headers);
        // var UserData = request.pre.verify.userData[0];

        Controller.UserController.createPassword(request.payload,function (err, data) {  ////console.log("errRoute",err,data);
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                        "statusCode": 200,
                        "status": "success",
                        "message": "Password created successfully", data:null
                })
            }
        });
    },
  }


  // API to delete Buyers favourites API
  var deleteFavouriteListings = {
      method: 'POST',
      path: '/v1/user/deleteFavouriteListings',
      config: {
          description: 'get Favourite',
          tags: ['api', 'user'],
          pre: [{method: checkAccessToken, assign: 'verify'}],
          handler: function (request, reply) {
              var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
              Controller.UserController.deleteFavouriteListings(request.payload, UserData,function (err, data) {
                  if (err) {
                      reply(sendError(err));
                  } else {
                      reply(sendSuccess(RESPONSES.YOUR_LISTING_HAS_BEEN_SAVED, data)).code(200)
                  }
              })
          },
          validate: {
              failAction: FailActionFunction,
              //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
              payload: {
                  favId : Joi.string().trim().optional().length(24),
                  accessToken: Joi.string().required(),
              }
          },
          plugins: {
              'hapi-swagger': {
                  //payloadType: 'form',
              }
          }
      }
  }

// var deleteFavouriteListings = {
//       method: 'POST',
//       path: '/v1/user/deleteFavouriteListings',
//       config: {
//           description: 'API to delete favourite listings',
//           tags: ['api', 'user'],
//           pre: [{method: checkAccessToken, assign: 'verify'}],
//           validate: {
//               payload: {
//
//                   accesstoken : Joi.string().required(),
//               },
//               failAction: FailActionFunction
//           }
//       },
//       handler: function (request, reply) { ////console.log("errRoute",request.headers);
//           var UserData = request.pre.verify.userData[0];
//           Controller.UserController.deleteFavouriteListings(request.payload,UserData,function (err, data) {
//               if(err){
//                   reply(err);
//               }else{
//                   reply(sendSuccess(data)).code(200)
//               }
//           });
//       },
//   }

// Get User Details API
var getUser = {
    method: 'GET',
    path: '/v1/user/getUser',
    config: {
        description: 'get Favourite',
        tags: ['api', 'user'],
        pre: [{method: checkAccessToken, assign: 'verify'}],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0]; ////console.log("headers", request.headers);
            Controller.UserController.getUser(request.query, UserData,function (err, data) {
                if (err) {
                    reply(sendError(err));
                } else {
                    // reply(sendSuccess(RESPONSES.YOUR_LISTING_HAS_BEEN_SAVED, data)).code(200)
                    reply({
                        "statusCode": 200,
                        "message": "Success",
                        "data" : data.userDetails
                    })
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            query: {
                accessToken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}

module.exports = [
    registerUser,
    registerAgent,
    login,
    changedPasword,
    logOut,
    forgotPassword,
    resetForgotPassword,
    contactUs,
    accessUserImagesOnServer,
    getAllPost,
    getPostDetail,
    saveListing,
    getSaveListing,
    deletListing,
    saveSearch,
    getSearchData,
    deletSearchData,
    updateProfile,
    savePropertiesLooked,
    emailVerification,
    getAllSchool,
    markfavoriteListing,
    landingPageApi,
    propertyValuation,
    savePolygon,
    socialLogin,
    getFavouriteProperties,
    getPageData,
    landingPageFormApi,
    subscriptionPlanList,
    schedule,
    contactUsForm,
    scheduleShowing,
    ChangeExpirePassword,
    //buyerGetSchedules,
    getSchedules,
    getSchedule,
    updateSaveSearch,
    resentEmailVerificationLink,
    testLeads,
    createPassword,
    deleteFavouriteListings,
    getUser,
    downloadZip,
    getSavedlisting
]
