const Utils = require('../Utils');
var Config = require('../Configs');
var APP_CONSTANTS = Config.CONSTS;
var SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;
var DEVICE_TYPE = APP_CONSTANTS.DEVICE_TYPE;
var USER_TYPE = APP_CONSTANTS.USER_TYPE;
var CRM_USER_RATING = APP_CONSTANTS.CRM_USER_RATING;
const POST_STATUS = APP_CONSTANTS.POST_STATUS;
var IMG_SIZE = APP_CONSTANTS.IMG_SIZE;
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
var RESIDENTIAL_TYPE = APP_CONSTANTS.RESIDENTIAL_TYPE;

var Controller = require('../Controllers');
var FailActionFunction = require('../Utils/universalfunctions').failActionFunction;
var sendSuccess = require('../Utils/universalfunctions').sendSuccess;
var sendError = require('../Utils/universalfunctions').sendError;
var allowAccessTokenInHeader = require('../Utils/universalfunctions').allowAccessTokenInHeader;

var checkAccessToken = require('../Utils/universalfunctions').getAdminTokenFromDBNew;
var checkUserAccessToken = require('../Utils/universalfunctions').getTokenFromDB;

const CATEGORY_OF_LEAD = APP_CONSTANTS.CATEGORY_OF_LEAD;
const SUBSCRIPTION_PLAN_TYPE = APP_CONSTANTS.SUBSCRIPTION_PLAN_TYPE;
var fs = require('fs');
/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
//var Joi = require('joi');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
var login = {
    method: 'POST',
    path: '/v1/admin/login',
    config: {
        description: 'login',
        tags: ['api', 'Admin'],
        //pre: [{ method: accessToken, assign: 'verify' }],
        validate: {

            payload: {
                siteId: Joi.string().required().label('SiteId'),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({ language: { string: { regex: { base: 'email.' } } } }).label("Invalid"),
                password: Joi.string().required().label('Password')
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
        Controller.AdminController.login(request.payload, {}, (err, data) => {
            if (err) {
                console.log("errRoute", err);
                reply(sendError(err));
            } else { //console.log("data.userDetails.isEmailVerified", data.userDetails.isEmailVerified);
                var messageObject = APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT
                reply(sendSuccess(messageObject, data.userDetails)).header('accessToken', data.accessToken);
            }
        });
    },
}




var crmUserFilter = {
    method: 'POST',
    path: '/v1/admin/crmUserFilter',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                sortby: Joi.string().optional().valid([
                    'email',
                    'name',
                ]),
                accesstoken: Joi.string().required(),
                rating: Joi.any().optional(),
                sourceofContact: Joi.any().optional(),
                userType: Joi.any().optional(),
                typeofResidence: Joi.any().optional(),
                assignedFunnel: Joi.any().optional(),
                whenAdded: Joi.any().optional(),
                characteristics: Joi.any().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.crmUserFilter(request.payload, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                /*reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })*/
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var createUserCrm = {
    method: 'POST',
    path: '/v1/admin/createUserCrm',
    config: {
        description: 'create new User',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                firstName: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('firstName'),
                lastName: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('lastName'),
                ContactNumber: Joi.string().required().optional().label('Contact number'),
                profilePicUrl: Joi.string().optional(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({ language: { string: { regex: { base: 'email.' } } } }).label(" email Invalid"),
                password: Joi.string().required().label('Password'),
                clientType: Joi.string().optional().valid([
                    "Buyer",
                    "Buyer/Seller",
                    "Seller",
                    "Builder",
                    "Invester"
                ]),
                userType: Joi.string().required(),
                type: Joi.string().required(),
                siteId: Joi.string().trim().length(24).optional(),
                accesstoken: Joi.string().required(),
                phone: Joi.number().optional().allow(''),
                retypePassword: Joi.string().trim().optional().allow(''),
                lastSoldProperty: Joi.string().trim().optional().allow(''),
                propertiesSold: Joi.string().trim().optional().allow(''),
                website: Joi.string().trim().optional().allow(''),
                averagePrice: Joi.string().trim().optional().allow(''),
                biography: Joi.string().trim().optional().allow(''),
                profile_pic: Joi.string().trim().optional().allow(''),
                realtorcontactbox: Joi.string().trim().optional().allow(''),
                realtoragentid: Joi.string().trim().optional().allow(''),
                cloudcmaapi: Joi.string().trim().optional().allow(''),
                rotateInFeaturedListing: Joi.boolean().optional().allow(''),
                rotateInContactBox: Joi.boolean().optional().allow(''),
                receiveContactFormSubmissions: Joi.boolean().optional().allow(''),
                receiveShowingRequests: Joi.boolean().optional().allow(''),
                r_contactForm: Joi.boolean().optional().allow(''),
                r_showingRequests: Joi.boolean().optional().allow(''),
                r_building: Joi.boolean().optional().allow(''),
                r_settings: Joi.boolean().optional().allow(''),
                r_realtors: Joi.boolean().optional().allow(''),
                r_members: Joi.boolean().optional().allow(''),
                r_blog: Joi.boolean().optional().allow(''),
                r_school: Joi.boolean().optional().allow(''),
                r_leads: Joi.boolean().optional().allow(''),
                s_facebook: Joi.string().trim().optional().allow(''),
                s_twitter: Joi.string().trim().optional().allow(''),
                s_linkedin: Joi.string().trim().optional().allow(''),
                s_google: Joi.string().trim().optional().allow(''),
                s_instagram: Joi.string().trim().optional().allow(''),
                signature: Joi.string().trim().optional().allow(''),
                rotateInListingDetails: Joi.boolean().optional().allow(''),
                baseUrl: Joi.string().trim().optional().allow(''),
                facebookPixelId: Joi.string().trim().optional().allow(''),
                facebookAppId: Joi.string().trim().optional().allow(''),
                domain: Joi.string().trim().optional().allow(''),
                serviceusername: Joi.string().trim().optional().allow(''),
                servicepassword: Joi.string().trim().optional().allow('')
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) {
        console.log("request.payload----------------------------------", request.payload);
        Controller.AdminController.createUserCrm(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}





var setFeatured = {
    method: 'PUT',
    path: '/v1/admin/setFeatured',
    config: {
        description: 'api to set property Featured',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.setFeatured(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            payload: {
                PropertyId: Joi.string().trim().required().length(24),
                isFeatured: Joi.boolean().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var createPost = {
    method: 'POST',
    path: '/v1/admin/createPost',
    config: {
        description: 'Api to create post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                title: Joi.string().lowercase().trim().min(2).required().allow('').label('title'),
                //slug: Joi.string().required().required(),
                textData: Joi.string().optional().label('textData'),
                //category : Joi.string().required(),
                category: Joi.array().items().required(),
                isFeatured: Joi.boolean().required(),
                status: Joi.string().required().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                postImage: Joi.string().optional().label('postImage'),
                accesstoken: Joi.string().required(),
                globalView: Joi.boolean().required(),
                siteId: Joi.string().optional(),
                tags: Joi.array().optional()

            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.CretePost(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var UpdatePost = {
    method: 'PUT',
    path: '/v1/admin/UpdatePost',
    config: {
        description: 'Api to update post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /* payload: {
             maxBytes: IMG_SIZE.SIZE,
             output: 'stream',
             parse: true,
             allow: 'multipart/form-data'
         },*/
        validate: {
            payload: {
                postId: Joi.string().trim().required().length(24),
                title: Joi.string().lowercase().trim().min(2).required().allow('').label('Name'),
                //slug: Joi.string().required().required(),
                textData: Joi.string().optional().label('textData'),
                isFeatured: Joi.boolean().required(),
                status: Joi.string().required().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                accesstoken: Joi.string().required(),
                category: Joi.array().items().optional(),
                globalView: Joi.boolean().optional(),
                postImage: Joi.string().optional().label('postImage'),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.updatePost(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var getAllPost = {
    method: 'GET',
    path: '/v1/admin/getAllPost',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        Controller.AdminController.getAllpost(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}


var getTestimonials = {
    method: 'GET',
    path: '/v1/admin/getTestimonials',
    config: {
        description: 'api to get testimonials',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                id: Joi.string().required(),
                type: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                accesstoken: Joi.string().optional()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("IN TESTIMONIALS", request.headers);
        Controller.AdminController.getTestimonials(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var getTestimonialById = {
    method: 'GET',
    path: '/v1/admin/getTestimonialById',
    config: {
        description: 'api to get testimonial By Id',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                id: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("IN TESTIMONIALS", request.headers);
        Controller.AdminController.getTestimonialById(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var deletePost = {
    method: 'POST',
    path: '/v1/admin/deletePost',
    config: {
        description: 'api to delete post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.deletepost(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                postId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var addSchool = {
    method: 'POST',
    path: '/v1/admin/addSchool',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                schools: Joi.any().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addSchool(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Update School
var updateSchool = {
    method: 'PUT',
    path: '/v1/admin/updateSchool',
    config: {
        description: 'api to Update school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                displayInNavigation: Joi.boolean().required(),
                schoolId: Joi.string().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateSchool(request.payload, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//get All schools
var getAllSchool = {
    method: 'GET',
    path: '/v1/admin/getAllSchool',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().optional()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getAllSchool(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var editSchool = {
    method: 'PUT',
    path: '/v1/admin/editSchool',
    config: {
        description: 'api to update school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                schoolId: Joi.string().length(24).required(),
                schoolTitle: Joi.string().lowercase().required(),
                accesstoken: Joi.string().required(),
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
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.editSchool(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "updated",
                    data: data || null
                })
            }
        });
    },
}

var getAllUser = {
    method: 'GET',
    path: '/v1/admin/getAllUser',
    config: {
        description: 'api to get list of users excluding admin',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                userType: Joi.string().optional().valid([
                    USER_TYPE.SELLER,
                    USER_TYPE.BUYER,
                    USER_TYPE.AGENT,
                    USER_TYPE.SITE_AGENT
                    // USER_TYPE.SUPER_ADMIN
                ]),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllUser(request.query, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var getAllUserWithoutToken = {
    method: 'GET',
    path: '/v1/admin/getAllUserWithoutToken',
    config: {
        description: 'api to get list of users excluding admin without access token',
        tags: ['api'],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                siteId: Joi.string().required(),
                userType: Joi.string().optional().valid([
                    USER_TYPE.SELLER,
                    USER_TYPE.BUYER,
                    USER_TYPE.AGENT
                ])
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllUserWithoutTokenContr(request.query, {}, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}




var getSaveListingOfUser = {
    method: 'GET',
    path: '/v1/admin/getSaveListingOfUser',
    config: {
        description: 'api to get  save list of users',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                userId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        Controller.AdminController.getSaveListingOfUser(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}



var getAllContact = {
    method: 'GET',
    path: '/v1/admin/getAllContact',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                Type: Joi.string().optional().valid([
                    CONTACT_FORM_TYPE.LEAD,
                    CONTACT_FORM_TYPE.CONTACT_FORM
                ]),
                isMovedToCMS: Joi.boolean().optional(),
                sortby: Joi.string().optional().valid([
                    'email',
                    'name',
                    'date'
                ]),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];

        Controller.AdminController.getAllContact(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var setFeatured = {
    method: 'PUT',
    path: '/v1/admin/setFeatured',
    config: {
        description: 'api to set property Featured',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.setFeatured(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                PropertyId: Joi.string().trim().required().length(24),
                isFeatured: Joi.boolean().required(),
                accesstoken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}
var changedPasword = {
    method: 'POST',
    path: '/v1/admin/changedPasword',
    config: {
        description: 'changed Pasword',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.ChangedPassword(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                firstName: Joi.string().lowercase().trim().min(2).max(30).required().allow('').label('firstName'),
                lastName: Joi.string().lowercase().trim().min(2).max(30).required().allow('').label('lastName'),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({ language: { string: { regex: { base: 'email.' } } } }).label(" email Invalid"),
                ContactNumber: Joi.string().required().optional().label('Contact number'),
                newPassword: Joi.string().optional().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({ language: { string: { regex: { base: 'should be between 8-14 characters and must be alphanumeric.' } } } }).label('newPassword'),
                oldPassword: Joi.string().optional(),
                startHour: Joi.number().required(),
                startMinute: Joi.number().required(),
                endHour: Joi.number().required(),
                endMinute: Joi.number().required(),
                accesstoken: Joi.string().required(),
                biography: Joi.string().optional(),
                profile_pic: Joi.string().optional()
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var editUserProfile = {
    method: 'PUT',
    path: '/v1/admin/editUserProfile',
    config: {
        description: 'update user profile',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                firstName: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('firstName').allow('').allow(null),
                lastName: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('firstName').allow('').allow(null),
                phoneNumber: Joi.string().required().optional().label('Contact number').allow('').allow(null),
                // profile_pic: Joi.any().optional().allow('').label('Profile pic'),
                status: Joi.string().optional(),
                userId: Joi.string().trim().optional().length(24),
                password: Joi.string().optional().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]{8,14}$/).options({ language: { string: { regex: { base: 'should be between 8-14 characters and must be alphanumeric.' } } } }).label('newPassword').allow('').allow(null),
                userType: Joi.string().optional().valid([USER_TYPE.SELLER, USER_TYPE.BUYER, USER_TYPE.AGENT, USER_TYPE.SITE_AGENT, USER_TYPE.SUPER_ADMIN]),
                accesstoken: Joi.string().required(),
                agentSince: Joi.string().trim().optional().allow(''),
                propertiesRented: Joi.string().trim().optional().allow(''),
                lastSoldProperty: Joi.string().trim().optional().allow(''),
                propertiesSold: Joi.string().trim().optional().allow(''),
                website: Joi.string().trim().optional().allow(''),
                averagePrice: Joi.number().optional().allow(''),
                biography: Joi.string().trim().optional().allow(''),
                profile_pic: Joi.string().trim().optional().allow(''),
                realtorcontactbox: Joi.string().trim().optional().allow(''),
                realtoragentid: Joi.string().trim().optional().allow(''),
                cloudcmaapi: Joi.string().trim().optional().allow(''),
                rotateInFeaturedListing: Joi.boolean().optional().allow(''),
                rotateInContactBox: Joi.boolean().optional().allow(''),
                receiveContactFormSubmissions: Joi.boolean().optional().allow(''),
                receiveShowingRequests: Joi.boolean().optional().allow(''),
                r_contactForm: Joi.boolean().optional().allow(''),
                r_showingRequests: Joi.boolean().optional().allow(''),
                r_building: Joi.boolean().optional().allow(''),
                r_settings: Joi.boolean().optional().allow(''),
                r_realtors: Joi.boolean().optional().allow(''),
                r_members: Joi.boolean().optional().allow(''),
                r_blog: Joi.boolean().optional().allow(''),
                fromEmail:Joi.string().trim().optional().allow(''),
                fromName:Joi.string().trim().optional().allow(''),
                signature:Joi.string().trim().optional().allow(''),
                startHour:Joi.string().trim().optional().allow(''),
                startMinute:Joi.string().trim().optional().allow(''),
                endHour:Joi.string().trim().optional().allow(''),
                endMinute:Joi.string().trim().optional().allow(''),
                serviceusername:Joi.string().trim().optional().allow(''),
                domain:Joi.string().trim().optional().allow(''),
                r_school: Joi.boolean().optional().allow(''),
                r_leads: Joi.boolean().optional().allow(''),
                s_facebook: Joi.string().trim().optional().allow(''),
                s_twitter: Joi.string().trim().optional().allow(''),
                s_linkedin: Joi.string().trim().optional().allow(''),
                s_google: Joi.string().trim().optional().allow(''),
                s_instagram: Joi.string().trim().optional().allow(''),
                retypePassword: Joi.string().trim().optional().allow(''),
                signature: Joi.string().trim().optional().allow(''),
                currentpassword:Joi.string().trim().optional().allow(''),
                rotateInListingDetails: Joi.boolean().optional().allow(''),
                ContactNumber: Joi.string().required().optional().label('Contact number'),
                baseUrl: Joi.string().trim().optional().allow(''),
                facebookPixelId: Joi.string().trim().optional().allow(''),
                facebookAppId: Joi.string().trim().optional().allow('')
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request);
        Controller.AdminController.editUserProfile(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(err);
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}



var ProfileUpload = {
    method: 'PUT',
    path: '/v1/admin/ProfileUpload',
    config: {
        description: 'update user profile',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },
        validate: {
            payload: {
                userId: Joi.string().trim().optional().length(24),
                profile_pic: Joi.any().required().allow('').label('Profile pic'),
                //accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.ProfileUpload(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(data)
            }
        });
    },
}


var agentDetails = {
    method: 'GET',
    path: '/v1/admin/agentDetails',
    config: {
        description: 'Api to get agent details along with attached properties',
        tags: ['api'],
        validate: {
            query: {
                slug: Joi.string().required(),
                id: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.agentDetails(request.query, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


var userDetail = {
    method: 'GET',
    path: '/v1/admin/userDetail',
    config: {
        description: 'api to get list of users excluding admin',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                userId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.userDetail(request.query, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var PostImageUpload = {
    method: 'PUT',
    path: '/v1/admin/PostImageUpload',
    config: {
        description: 'update user profile',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },
        validate: {
            payload: {
                userId: Joi.string().trim().optional().length(24),
                profile_pic: Joi.any().required().allow('').label('PostImage'),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.PostImageUpload(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(data)
            }
        });
    },
}

var createUser = {
    method: 'POST',
    path: '/v1/admin/createUser',
    config: {
        description: 'create new User',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                firstName: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('firstName'),
                lastName: Joi.string().lowercase().trim().min(2).max(30).optional().allow('').label('lastName'),
                ContactNumber: Joi.string().required().optional().label('Contact number'),
                profilePicUrl: Joi.string().optional(),
                email: Joi.string().trim().required().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({ language: { string: { regex: { base: 'email.' } } } }).label(" email Invalid"),
                password: Joi.string().optional().label('Password'),
                userType: Joi.string().optional().valid([
                    USER_TYPE.AGENT,
                    USER_TYPE.BUYER,
                    USER_TYPE.SELLER,
                    USER_TYPE.SITE_AGENT,
                    USER_TYPE.SUPER_ADMIN
                ]),
                siteId: Joi.string().trim().length(24).optional(),
                accesstoken: Joi.string().required(),
                agentSince: Joi.string().trim().optional().allow(''),
                propertiesRented: Joi.string().trim().optional().allow(''),
                lastSoldProperty: Joi.string().trim().optional().allow(''),
                propertiesSold: Joi.string().trim().optional().allow(''),
                website: Joi.string().trim().optional().allow(''),
                averagePrice: Joi.string().trim().optional().allow(''),
                biography: Joi.string().trim().optional().allow(''),
                profile_pic: Joi.string().trim().optional().allow(''),
                realtorcontactbox: Joi.string().trim().optional().allow(''),
                realtoragentid: Joi.string().trim().optional().allow(''),
                cloudcmaapi: Joi.string().trim().optional().allow(''),
                rotateInFeaturedListing: Joi.boolean().optional().allow(''),
                rotateInContactBox: Joi.boolean().optional().allow(''),
                receiveContactFormSubmissions: Joi.boolean().optional().allow(''),
                receiveShowingRequests: Joi.boolean().optional().allow(''),
                r_contactForm: Joi.boolean().optional().allow(''),
                r_showingRequests: Joi.boolean().optional().allow(''),
                r_building: Joi.boolean().optional().allow(''),
                r_settings: Joi.boolean().optional().allow(''),
                r_realtors: Joi.boolean().optional().allow(''),
                r_members: Joi.boolean().optional().allow(''),
                r_blog: Joi.boolean().optional().allow(''),
                r_school: Joi.boolean().optional().allow(''),
                r_leads: Joi.boolean().optional().allow(''),
                s_facebook: Joi.string().trim().optional().allow(''),
                s_twitter: Joi.string().trim().optional().allow(''),
                s_linkedin: Joi.string().trim().optional().allow(''),
                s_google: Joi.string().trim().optional().allow(''),
                s_instagram: Joi.string().trim().optional().allow(''),
                signature: Joi.string().trim().optional().allow(''),
                rotateInListingDetails: Joi.boolean().optional().allow(''),
                baseUrl: Joi.string().trim().optional().allow(''),
                facebookPixelId: Joi.string().trim().optional().allow(''),
                facebookAppId: Joi.string().trim().optional().allow(''),
                fromEmail:Joi.string().trim().optional().allow(''),
                fromName:Joi.string().trim().optional().allow(''),
                startHour:Joi.string().trim().optional().allow(''),
                startMinute:Joi.string().trim().optional().allow(''),
                endHour:Joi.string().trim().optional().allow(''),
                endMinute:Joi.string().trim().optional().allow(''),
                domain: Joi.string().trim().optional().allow(''),
                serviceusername: Joi.string().trim().optional().allow(''),
                servicepassword: Joi.string().trim().optional().allow('')
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.createUser(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}

var moveLeadToCrm = {
    method: 'PUT',
    path: '/v1/admin/moveLeadToCrm',
    config: {
        description: 'api to update school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                leadlId: Joi.string().required(),
                accesstoken: Joi.string().required(),
                id: Joi.string().required()
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
        var UserData = request.pre.verify.userData[0];
        console.log(UserData, "UserDataUserDataUserData")
        Controller.AdminController.moveLeadToCrm_new(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "updated",
                    data: data || null
                })
                //reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}


console.log('start from here ')

//Remove Lead From CRM
var removeLeadFromCRM = {
    method: 'PUT',
    path: '/v1/admin/removeLeadFromCRM',
    config: {
        description: 'api to update school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                leadlId: Joi.string().required(),
                accesstoken: Joi.string().required(),
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
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removeLeadFromCRM(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                /*reply({
                    "statusCode": 200,
                    "message": "updated",
                    data:data || null
                })*/
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var crmUserLead = {
    method: 'GET',
    path: '/v1/admin/crmUserLead',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                sortby: Joi.string().optional().valid([
                    'email',
                    'name',
                ]),
                accesstoken: Joi.string().required(),
                search: Joi.any().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.crmUserLead_new(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                /*reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })*/
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var crmPropertyofUserLead = {
    method: 'GET',
    path: '/v1/admin/crmPropertyofUserLead',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                //skip: Joi.number().required(),
                //limit: Joi.number().required(),
                crmUserId: Joi.string().length(24).required(),
                //email: Joi.string().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.crmPropertyofUserLead_new(request.query, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var sellerData = {
    method: 'GET',
    path: '/v1/admin/sellerData',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                //skip: Joi.number().required(),
                //limit: Joi.number().required(),
                crmUserId: Joi.string().length(24).required(),
                //email: Joi.string().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.sellerDetails(request.query, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var crmUserProfile = {
    method: 'PUT',
    path: '/v1/admin/crmUserProfile',
    config: {
        description: 'crm user profile',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                firstName: Joi.string().trim().optional(),
                lastName: Joi.string().trim().optional(),
                typeofResidence: Joi.string().trim().optional(),
                spousefirstName: Joi.string().trim().optional(),
                spouselastName: Joi.string().trim().optional(),
                recordofContact: Joi.string().trim().optional(),
                sourceofContact: Joi.string().trim().optional(),
                dob: Joi.string().trim().optional(),
                status: Joi.string().trim().optional(),
                assignedTo: Joi.string().trim().optional(),
                userType: Joi.string().trim().optional(),
                Wedding_Anniversary: Joi.string().trim().optional(),
                email: Joi.string().trim().optional().lowercase().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/).options({ language: { string: { regex: { base: 'email.' } } } }).label("Invalid"),
                kids: Joi.array().items({
                    name: Joi.string().optional(),
                    age: Joi.string().optional(),
                    gender: Joi.string().optional(),
                }).optional(),
                rating: Joi.string().optional().valid([
                    CRM_USER_RATING.BRONZE,
                    CRM_USER_RATING.GOLD,
                    CRM_USER_RATING.RED,
                    CRM_USER_RATING.GREEN,
                    CRM_USER_RATING.SILVER,
                ]),
                funnelId: Joi.string().trim().optional().length(24),
                assignedFunnel: Joi.array().optional(),
                moving_day: Joi.string().trim().optional(),
                city: Joi.string().trim().optional(),
                state: Joi.string().trim().optional(),
                zip: Joi.string().trim().optional(),
                address: Joi.string().trim().optional(),
                phoneNumber: Joi.string().trim().optional(),
                accesstoken: Joi.string().required(),
                profile_pic: Joi.string().optional(),
                dealStatus: Joi.string().optional().valid([
                    "Pending", "Closed"
                ]),
                // status: Joi.string().optional(),
                contactPreference: Joi.string().optional(),
                mailingAddress: Joi.string().optional(),
                automatic_meeting_request_frequency: Joi.string().optional(),
                newsletter_frequency: Joi.string().optional(),
                moving_date: Joi.string().optional(),
                greetingCards: Joi.array().optional(),
                newsletter: Joi.array().optional(),
                automatic_meeting_request: Joi.string().optional(),
                automatic_meeting_request_date: Joi.date().optional(),
                automatic_meeting_request_sent: Joi.number().integer().optional(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.crmUserProfile_new(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

//update seller data 

var updateSeller = {
    method: 'PUT',
    path: '/v1/admin/updatesellerdata',
    config: {
        description: 'crm user profile',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                assignedFunnel: Joi.array().optional(),
                accesstoken: Joi.string().trim().optional(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.updatesellerperofile(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}







var automaticMeeting = {
    method: 'PUT',
    path: '/v1/admin/automaticMeeting',
    config: {
        description: 'crm user profile',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                automatic_meeting_request: Joi.string().required(),
                accesstoken: Joi.string().required(),
                automatic_meeting_request_frequency: Joi.number().optional(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.automaticMeeting(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var birthdayGreeting = {
    method: 'POST',
    path: '/v1/admin/birthdayGreeting',
    config: {
        description: 'crm user profile',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.birthdayGreeting(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}


var createFunnel = {
    method: 'POST',
    path: '/v1/admin/createFunnel',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                title: Joi.string().lowercase().required().error(new Error('Title should not be blank')),
                funnelType: Joi.string().lowercase().optional(),
                globalView: Joi.boolean().required(),
                accesstoken: Joi.string().required(),
                unsubscribe: Joi.boolean().optional(),
                siteId: Joi.string().optional(),
                unsubscribeText: Joi.string().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.createFunnel(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Funnel added successfully",
                    data: data || null
                })
            }
        });
    },
}

var getAllFunnel = {
    method: 'GET',
    path: '/v1/admin/getAllFunnel',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllFunnel(request.query, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}


var assignedFunnelIdToCrmProperty = {
    method: 'PUT',
    path: '/v1/admin/assignedFunnelIdToCrmProperty',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                PropertyId: Joi.string().trim().required().length(24),
                funnelId: Joi.string().trim().required().length(24),
                crmUserId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.assignedFunnelIdToCrmProperty(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var updateFunnel = {
    method: 'POST',
    path: '/v1/admin/updateFunnel',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                funnelId: Joi.string().trim().required().length(24),
                funnelTemplateId: Joi.string().trim().optional().length(24),
                emailType: Joi.string().required(),
                status: Joi.string().required(),
                title: Joi.string().required(),
                subject: Joi.string().required(),
                sendCmaAutomatically: Joi.boolean().optional(),
                emailTimeInterval: Joi.number().required().label("emailTimeInterval"),
                emailTemplateHtml: Joi.string().optional(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateFunnel(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}
var deleteFunnelTemplate = {
    method: 'POST',
    path: '/v1/admin/deleteFunnelTemplate',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                funnelTemplateId: Joi.string().trim().optional().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteFunnelTemplate(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var deleteFunnel = {
    method: 'POST',
    path: '/v1/admin/deleteFunnel',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                funnelId: Joi.string().trim().optional().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteFunnel(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var getFunnelDetail = {
    method: 'GET',
    path: '/v1/admin/getFunnelDetail',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                funnelId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getFunnelDetail(request.query, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var updateCatgoryOfLead = {
    method: 'POST',
    path: '/v1/admin/updateCatgoryOfLead',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                leadlId: Joi.string().trim().required().length(24),
                //catgory: Joi.string().lowercase().required(),
                category: Joi.string().required().valid([
                    CATEGORY_OF_LEAD.HOT,
                    CATEGORY_OF_LEAD.COLD,
                    CATEGORY_OF_LEAD.QUALIFIED,
                    CATEGORY_OF_LEAD.NURTURED,
                ]),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateCatgoryOfLead(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var CsvFileUpload = {
    method: 'PUT',
    path: '/v1/admin/CsvFileUpload',
    config: {
        description: 'CsvFileUpload',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },
        validate: {
            payload: {
                //userId: Joi.string().trim().optional().length(24),
                CsvFile: Joi.any().required().allow('').label('CsvFile'),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().optional(),
                type: Joi.string().optional()
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.CsvFileUpload(request.payload, {}, function (err, data) {
            if (err) {
                reply(err);
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.ADDED, data)).code(200)
            }
        });
    },
}

var contactDetail = {
    method: 'GET',
    path: '/v1/admin/contactDetail',
    config: {
        description: 'api to get list of conatct or lead',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                ContactId: Joi.string().trim().required().length(24),
                Type: Joi.string().optional().valid([
                    CONTACT_FORM_TYPE.LEAD,
                    CONTACT_FORM_TYPE.CONTACT_FORM
                ]),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.contactDetail(request.query, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}
var assignedAgent = {
    method: 'POST',
    path: '/v1/admin/assignedAgent',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                ContactId: Joi.string().trim().required().length(24),
                agentId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().trim().required().length(24),
                phoneNumber: Joi.number().required(),
                firstName: Joi.string().required(),
                email: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.assignedAgent(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var getallPotentialPopertyUsingMlsNumber = {
    method: 'POST',
    path: '/v1/admin/getallPotentialPopertyUsingMlsNumber',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                mlsNumber: Joi.string().optional(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getallSearchPopertyUsingMlsNumber(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
                //reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var setLogoAndOtherThemeOption = {
    method: 'POST',
    path: '/v1/admin/setLogoAndOtherThemeOption',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                facebookpageUrl: Joi.string().required(),
                twitterpageUrl: Joi.string().optional(),
                logoUrl: Joi.any().optional().allow('').label('logo'),
                fromEmail: Joi.any().required().label('from email'),
                fromName: Joi.string().required().label('from Name'),
                signature: Joi.string().required().label('signature'),
                ContactNumber: Joi.string().required().label('Contact number'),
                passwordExpireDays: Joi.number().required().label('password expire days'),
                siteName: Joi.string().required().label('SiteName'),
                copyrightYear: Joi.string().optional(),
                siteUrl: Joi.string().required().label('Website Url'),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.setLogoAndOtherThemeOption(request.payload, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var uploadLogo = {
    method: 'POST',
    path: '/v1/admin/uploadLogo',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },
        validate: {
            payload: {
                logo: Joi.any().optional().allow('').label('logo'),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.uploadLogo(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
                //reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var getAllThemeData = {
    method: 'GET',
    path: '/v1/admin/getAllThemeData',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                siteId: Joi.string().length(24).required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("errRoute", request.headers);
        Controller.AdminController.getAllThemeData(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var setHoliday = {
    method: 'PUT',
    path: '/v1/admin/setHoliday',
    config: {
        description: 'setHoliday',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                holidayDate: Joi.date().format('YYYY-MM-DD').required(),
                title: Joi.string().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.setHoliday(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}

var getHoliday = {
    method: 'GET',
    path: '/v1/admin/getHoliday',
    config: {
        description: 'setHoliday',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getHoliday(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var deleteHoliday = {
    method: 'POST',
    path: '/v1/admin/deleteHoliday',
    config: {
        description: 'api to delete post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.deleteHoliday(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                holidayId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    }
}

var createLobPostCard = {
    method: 'POST',
    path: '/v1/admin/createLobPostCard',
    config: {
        description: 'Api to create post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                userId: Joi.string().trim().optional().length(24),
                address_line1: Joi.string().lowercase().trim().min(2).required().label('address_line1'),
                address_line2: Joi.string().lowercase().allow('').trim().optional().label('address_line2'),
                address_city: Joi.string().lowercase().trim().required().label('address_city'),
                address_state: Joi.string().lowercase().trim().required().label('address_state'),
                address_zip: Joi.string().trim().required().label('address_zip'),
                front: Joi.string().trim().required().label('front'),
                back: Joi.string().trim().optional().label('back'),
                accesstoken: Joi.string().required(),
                rating: Joi.array().items(Joi.string())
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.LobController.createPostCard(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var retrievePostCard = {
    method: 'GET',
    path: '/v1/admin/retrievePostCard',
    config: {
        description: 'Api to create post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                postcardId: Joi.string().trim().required().label('postcardId'),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.LobController.retrievePostCard(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}
var getPostCard = {
    method: 'GET',
    path: '/v1/admin/getPostCard',
    config: {
        description: 'Api to create post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                userId: Joi.string().trim().required().length(24),
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getPostCard(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var getAllFunnelTemplate = {
    method: 'GET',
    path: '/v1/admin/getAllFunnelTemplate',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                funnelId: Joi.string().trim().required().length(24),
                funnelTemplateId: Joi.string().trim().optional().length(24),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getAllFunnelTemplate(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var sendMessageToAgent = {
    method: 'POST',
    path: '/v1/admin/sendMessageToAgent',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                agentId: Joi.string().trim().required().length(24),
                message: Joi.string().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.sendMessageToAgent(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}
var activateDeactivatedUser = {
    method: 'PUT',
    path: '/v1/admin/activateDeactivatedUser',
    config: {
        description: 'Api to update post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.activateDeactivatedUser(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var addSchoolPolygon = {
    method: 'POST',
    path: '/v1/admin/addSchoolPolygon',
    config: {
        description: "add Location || geofencing",
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.addSchoolPolygon(request.payload, UserData, function (error, data) {
                console.log("asdasd", data);
                if (error) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
                }
            });
        },
        validate: {
            payload: {
                schoolId: Joi.string().length(24).required(),
                coordinates: Joi.array().items(Joi.array().items(Joi.number().required()).required()).min(4).required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        },
        plugins: {

        }
    }
}

var getSchoolPolygons = {
    method: 'GET',
    path: '/v1/admin/getSchoolPolygon',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                schoolId: Joi.string().length(24).required(),
                accesstoken: Joi.string().optional(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                //New fields
                listingid: Joi.string().optional(),
                minbathRoom: Joi.number().optional().label('bathRoom'),
                maxbathRoom: Joi.number().optional().label('bathRoom'),

                minbedRoom: Joi.number().optional().label('bedRoom'),
                maxbedRoom: Joi.number().optional().label('bedRoom'),

                minAskingprice: Joi.number().optional().label('Minprice'),
                maxAskingprice: Joi.number().optional().label('Maxprice'),

                area: Joi.string().optional().allow(null).allow('').label('Area'),
                sortBy: Joi.string().trim().optional(),
                sortOrder: Joi.number().optional(),
                min_lot: Joi.number().optional().label('min_lot'),
                max_lot: Joi.number().optional().label('max_lot'),

                minFloorSpace: Joi.number().optional().label('minFloorSpace'),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace'),

                typeOfDwelling: Joi.string().optional().label('typeOfDwelling'),
                propertyType: Joi.string().optional().valid([
                    RESIDENTIAL_TYPE.RESIDENTIAL_DETACHED,
                    RESIDENTIAL_TYPE.RESIDENTIAL_ATTACHED,
                    RESIDENTIAL_TYPE.MULTI_FAMILY,
                    RESIDENTIAL_TYPE.LOST_AND_LAND,
                    RESIDENTIAL_TYPE.LAND_ONLY,
                ])
                //New fields ends here
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getSchoolPolygon(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    }
}

var getAllFrontPages = {
    method: 'GET',
    path: '/v1/admin/getAllFrontPages',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                siteId: Joi.string().trim().required().length(24)
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllFrontPages(request.query, {}, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var createFrontPage = {
    method: 'POST',
    path: '/v1/admin/createFrontPage',
    config: {
        description: 'api to create Front Page',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                pageTitle: Joi.string().lowercase().required().error(new Error('Title should not be blank')),
                routerLink: Joi.string().lowercase().optional(),
                pageId: Joi.string().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.createFrontPage(request.payload, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}

var editFrontPage = {
    method: 'PUT',
    path: '/v1/admin/editFrontPage',
    config: {
        description: 'Api to edit front page',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                pageTitle: Joi.string().lowercase().optional(),
                routerLink: Joi.string().lowercase().optional(),
                pageId: Joi.string().required(),
                //accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.editFrontPage(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}


var createPage = {
    method: 'POST',
    path: '/v1/admin/createPage',
    config: {
        description: 'Api to create post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                title: Joi.string().lowercase().trim().min(2).required().allow('').label('title'),
                funnelId: Joi.string().trim().optional(),
                textData: Joi.string().optional().label('textData'),
                status: Joi.string().required().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                isLandingPage: Joi.boolean().required(),
                slug: Joi.string().lowercase().required().label('slug'),
                templateName: Joi.string().optional().label('templateName'),
                landingPageForm: Joi.array().items({
                    fieldName: Joi.string().lowercase().required(),
                    fieldRequired: Joi.boolean().required(),
                    isenable: Joi.boolean().required(),
                    fieldType: Joi.string().required()
                }).optional(),
                accesstoken: Joi.string().required(),
                pageAgents: Joi.array().items().required(),
                globalView: Joi.boolean().optional(),
                type: Joi.string().required().valid([
                    "landingPageBuyer",
                    "landingPageSeller"
                ])
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.createPage(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}

var createNewPage = {
    method: 'POST',
    path: '/v1/admin/createnewPage',
    config: {
        description: 'Api to create post (Test this API On postman as it contains multipart data).',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                title: Joi.string().lowercase().trim().min(2).required().allow('').label('title'),
                textData: Joi.string().optional().label('textData'),
                status: Joi.string().required().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                isLandingPage: Joi.boolean().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.createnewPage(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}

var getAllPages = {
    method: 'GET',
    path: '/v1/admin/getAllPages',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                isdefaultNavigation: Joi.boolean().optional(),
                isLandingPage: Joi.boolean().optional(),
                accesstoken: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        Controller.AdminController.getAllPages(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                console.log("errRoute", err);
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var editPage = {
    method: 'POST',
    path: '/v1/admin/editPage',
    config: {
        description: 'Api to edit page',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                pageId: Joi.string().trim().required().length(24),
                title: Joi.string().lowercase().trim().min(2).required().allow('').label('title'),
                funnelId: Joi.string().trim().optional(),
                textData: Joi.string().optional().label('textData'),
                slug: Joi.string().lowercase().optional().label('slug'),
                templateName: Joi.string().optional().label('templateName'),
                status: Joi.string().required().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                landingPageForm: Joi.array().items({
                    fieldName: Joi.string().lowercase().required(),
                    fieldRequired: Joi.boolean().required(),
                    isenable: Joi.boolean().optional(),
                    fieldType: Joi.string().required(),
                }).optional(),
                isLandingPage: Joi.boolean().required(),
                accesstoken: Joi.string().required(),
                pageAgents: Joi.array().items().optional(),
                globalView: Joi.boolean().optional(),
                type: Joi.string().optional().valid([
                    "landingPageBuyer",
                    "landingPageSeller"
                ])
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.editPage(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var getPageData = {
    method: 'GET',
    path: '/v1/admin/getPageData',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                pageId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        Controller.AdminController.getPageData(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var deletePage = {
    method: 'POST',
    path: '/v1/admin/deletePage',
    config: {
        description: 'api to delete post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.deletepage(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                postId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var deleteNavigtion = {
    method: 'POST',
    path: '/v1/admin/deleteNavigtion',
    config: {
        description: 'api to delete Navigtion',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.deleteNavigtion(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            payload: {
                navigtionId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}

var createDuplicateFunnel = {
    method: 'POST',
    path: '/v1/admin/createDuplicateFunnel',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                funnelId: Joi.string().trim().optional().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.createDuplicateFunnel(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var updateTitleFunnel = {
    method: 'POST',
    path: '/v1/admin/updateTitleFunnel',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                funnelId: Joi.string().trim().required().length(24),
                title: Joi.string().lowercase().required(),
                accesstoken: Joi.string().required(),
                unsubscribe: Joi.boolean().optional(),
                unsubscribeText: Joi.string().optional(),
                globalView: Joi.boolean().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateTitleFunnel(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var deleteSchool = {
    method: 'POST',
    path: '/v1/admin/deleteSchool',
    config: {
        description: 'api to delete School',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                schoolId: Joi.string().trim().optional().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteSchool(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var addPropertyAgent = {
    method: 'POST',
    path: '/v1/admin/addPropertyAgent',
    config: {
        description: 'create new User',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                l_listingid: Joi.number().optional(),
                lm_int1_19: Joi.number().optional(),//baths
                lm_int1_4: Joi.number().optional(),
                l_askingprice: Joi.number().optional(),
                l_pricepersqft: Joi.number().optional(),
                lm_int2_3: Joi.number().optional(),
                lm_dec_7: Joi.number().optional(),
                //lm_dec_13       : Joi.number().required(),
                lm_dec_11: Joi.number().optional(),
                lm_dec_16: Joi.number().optional(),
                l_displayid: Joi.string().trim().required(),
                l_zip: Joi.string().trim().optional(),
                l_addressnumber: Joi.string().trim().optional(),
                lm_char1_36: Joi.string().trim().optional(),
                lm_char10_11: Joi.string().trim().optional(),
                l_state: Joi.string().trim().optional(),
                l_city: Joi.string().trim().optional(),
                l_area: Joi.string().trim().optional(),
                l_addressstreet: Joi.string().trim().optional(),
                lm_char10_12: Joi.string().trim().optional(),
                lm_int2_5: Joi.string().trim().optional(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.addPropertyAgent(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(200)
            }
        });
    },
}

var getManuallyInsertedPropertyList = {
    method: 'GET',
    path: '/v1/admin/getManuallyInsertedPropertyList',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        Controller.AdminController.getManuallyInsertedPropertyList(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                /*reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })*/
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var deletePropertyAgent = {
    method: 'POST',
    path: '/v1/admin/deletePropertyAgent',
    config: {
        description: 'create new User',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                propertyId: Joi.string().length(24).required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                //payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.deletePropertyAgent(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                //reply(data)
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED, data)).code(200)
            }
        });
    },
}

var createSubscriptionPlan = {
    method: 'POST',
    path: '/v1/admin/createSubscriptionPlan',
    config: {
        description: 'create Subscription Plan',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                planName: Joi.string().required(),
                planAmount: Joi.number().required(),
                numberOfMonths: Joi.number().required(),
                interval: Joi.string().required().valid([SUBSCRIPTION_PLAN_TYPE.MONTH]),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.createSubscriptionPlan(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var subscriptionPlanDetail = {
    method: 'POST',
    path: '/v1/admin/subscriptionPlanDetail',
    config: {
        description: 'Subscription Plan Detail',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                stripePlanId: Joi.string().length(24).required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.subscriptionPlanDetail(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}
//CreateSource
var addCardToAgent = {
    method: 'POST',
    path: '/v1/admin/addCardToAgent',
    config: {
        description: 'add Card To Agent account',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                cardToken: Joi.string().required().label('Stripe card'),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.addCardToAgent(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var StripeAddPlan = {
    method: 'PUT',
    path: '/v1/admin/StripeAddPlan',
    config: {
        description: 'Create charge to deduct amount from user card',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            //headers: Joi.object({ 'accesstoken': Joi.string().trim().required() }).options({ allowUnknown: true }),
            payload: {
                stripePlanId: Joi.string().length(24).required(),
                cardExpMonth: Joi.number().required(),
                cardNumber: Joi.number().required(),
                cardExpYear: Joi.number().required(),
                cardCvc: Joi.number().required(),
                accesstoken: Joi.string().required(),
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
        var userData = request.pre.verify.userData[0];
        Controller.AdminController.StripeAddPlan(request.payload, userData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

var StripeAddPlanList = {
    method: 'GET',
    path: '/v1/admin/StripeAddPlanList',
    config: {
        description: 'Subscription Plan list',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.StripeAddPlanList(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var subscriptionPlanList = {
    method: 'GET',
    path: '/v1/admin/subscriptionPlanList',
    config: {
        description: 'Subscription Plan',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                planId: Joi.string().length(24).optional(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.subscriptionPlanList(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

var editSubscriptionPlan = {
    method: 'POST',
    path: '/v1/admin/editSubscriptionPlan',
    config: {
        description: 'create Subscription Plan',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                planName: Joi.string().required(),
                planAmount: Joi.number().required(),
                numberOfMonths: Joi.number().required(),
                interval: Joi.string().required().valid([SUBSCRIPTION_PLAN_TYPE.MONTH]),
                planId: Joi.string().length(24).required(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.editSubscriptionPlan(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}
var deleteSubscriptionPlan = {
    method: 'POST',
    path: '/v1/admin/deleteSubscriptionPlan',
    config: {
        description: 'api to delete Subscription Plan',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        handler: function (request, reply) {
            var UserData = request.pre.verify.userData[0];
            Controller.AdminController.deleteSubscriptionPlan(request.payload, UserData, function (err, data) { //console.log("IsDeleted",data);
                if (err) {
                    reply(sendError(err));
                } else {
                    reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DELETED, data)).code(200)
                }
            })
        },
        validate: {
            failAction: FailActionFunction,
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            payload: {
                stripePlanId: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
            }
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    }
}


var addTestimonial = {
    method: 'POST',
    path: '/v1/admin/addTestimonial',
    config: {
        description: 'api to insert testimonial',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                name: Joi.string().required(),
                designation: Joi.string().required(),
                textData: Joi.string().optional().label('textData'),
                status: Joi.string().required().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                postImage: Joi.string().required().label('postImage'),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().optional(),
                globalView: Joi.boolean().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addTestimonial(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
//Delete Testimonial API
var deleteTestimonial = {
    method: 'POST',
    path: '/v1/admin/deleteTestimonial',
    config: {
        description: 'api to delete testimonials',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                testimonialId: Joi.string().trim().optional().length(24),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("errRoute", request.headers);
        console.log("Request", request);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteTestimonial(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

//Edit Testimonials
var editTestimonial = {
    method: 'POST',
    path: '/v1/admin/editTestimonial',
    config: {
        description: 'api to Edit or update testimonials',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                testimonialId: Joi.string().trim().optional().length(24),
                name: Joi.string().optional(),
                designation: Joi.string().optional(),
                textData: Joi.string().optional().label('textData'),
                isFeatured: Joi.boolean().optional(),
                siteId: Joi.string().optional(),
                createdAt: Joi.string().optional(),
                isDeleted: Joi.any().optional(),
                updatedAt: Joi.any().optional(),
                __v: Joi.any().optional(),
                status: Joi.string().optional().valid([
                    POST_STATUS.PUBLISH,
                    POST_STATUS.DRAFT,
                ]),
                postImage: Joi.string().optional().label('postImage'),
                accesstoken: Joi.string().required(),
                globalView: Joi.boolean().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("errRoute", request.headers);
        console.log("Request", request);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.editTestimonial(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}



var featuredPropertyAlgorithm = {
    method: 'POST',
    path: '/v1/admin/featuredPropertyAlgorithm',
    config: {
        description: 'Create Featured Property via algorithm',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                accesstoken: Joi.string().required(),
                minbathRoom: Joi.number().allow('').optional(),
                maxbathRoom: Joi.number().allow('').optional(),
                minbedRoom: Joi.number().allow('').optional(),
                maxbedRoom: Joi.number().allow('').optional(),
                minAskingprice: Joi.number().allow('').optional(),
                maxAskingprice: Joi.number().allow('').optional(),
                area: Joi.any().allow('').optional(),
                propertyType: Joi.any().allow('').optional(),
                city: Joi.any().allow('').optional(),
                boardUserName: Joi.any().allow('').optional(),
                includeOwnListing: Joi.any().allow('').optional(),
                prioritizedListing: Joi.any().allow('').optional(),
                type: Joi.string().allow('').optional()
            },
            failAction: FailActionFunction
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            }
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.featuredPropertyAlgorithm(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}


//Get Featured Properties implemented via used ID
var getFeaturedProperties = {
    method: 'GET',
    path: '/v1/admin/getFeaturedProperties',
    config: {
        description: 'api to get list of all featured properties',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                siteId: Joi.string().required(),
                 type : Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        // console.log("In Get Featured Properties", request.headers);
        Controller.AdminController.getFeaturedProperties(request.query, function (err, data) {
            console.log("errRoute:", err);
            if (err.data) {
                reply(err);
            } else {
                console.log('********  ', data)

                // Get recent properties when featured properties not exist or featured properties algo is not set.
                Controller.AdminController.getRecentProperties(request.query, function (err, data) {
                    if (err) {
                        reply(err);
                    } else {
                        reply({
                            "statusCode": 200,
                            "message": "Success",
                            data: data || null
                        })
                    }
                });

                /* reply({
                    "statusCode": data.statusCode,
                    "message": "Error",
                    data: data || null
                }) */
            }
        });
    },
}

//Add Useful Links API
var addUsefulLinks = {
    method: 'POST',
    path: '/v1/admin/addUsefulLinks',
    config: {
        description: 'api to add Useful links',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                text: Joi.string().required(),
                url: Joi.string().required(),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().optional(),
                globalView: Joi.boolean().required(),
                type: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("errRoute+++++++++++++++++++++++ ", request.payload);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addUsefulLinks(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var editUsefulLinks = {
    method: 'PUT',
    path: '/v1/admin/editUsefulLinks',
    config: {
        description: 'api to edit Useful links',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                _id: Joi.string().required(),
                text: Joi.string().required(),
                url: Joi.string().required(),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().optional(),
                globalView: Joi.boolean().required(),
                type: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("errRoute+++++++++++++++++++++++ ", request.payload);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.editUsefulLinks(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}



//Delete User Links
var deleteUsefulLinks = {
    method: 'POST',
    path: '/v1/admin/deleteUsefulLinks',
    config: {
        description: 'api to delete Useful links',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                linkId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteUsefulLinks(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
//Get all Useful Links

var getUsefulLinks = {
    method: 'GET',
    path: '/v1/admin/getUsefulLinks',
    config: {
        description: 'api to get list of all the Useful links',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                id: Joi.string().length(24).optional(),
                type: Joi.string().optional(),
                role: Joi.string().optional()

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getUsefulLinks(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}


var getGlobalUsefulLinks = {
    method: 'GET',
    path: '/v1/admin/getGlobalUsefulLinks',
    config: {
        description: 'api to get list of all the Global Useful links',
        tags: ['api', 'Admin'],
        validate: {
            query: {
                skip: Joi.number().optional(),
                limit: Joi.number().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        // console.log("Reaching here");
        Controller.AdminController.getGlobalUsefulLinks(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

var getContactInfo = {
    method: 'GET',
    path: '/v1/admin/getContactInfo',
    config: {
        description: 'api to get contact info',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                id: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("In Get Listed Contact Information", request.headers);
        Controller.AdminController.getContactInfo(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

//Add Contact Information
var addContactInfo = {
    method: 'POST',
    path: '/v1/admin/addContactInfo',
    config: {
        description: 'api to add Contact Information',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            options: {
                allowUnknown: true
            },
            payload: {
                companyName: Joi.string().optional(),
                //type :Joi.string().optional(),//it is not needed for now
                phone: Joi.string().optional(),
                email: Joi.string().optional(),
                addressLine1: Joi.string().required(),
                addressLine2: Joi.string().optional(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                zip: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addContactInfo(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//Add Contact Information Listings
var addContactInfoListing = {
    method: 'POST',
    path: '/v1/admin/addContactInfoListing',
    config: {
        description: 'api to add Contact Information',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                companyName: Joi.string().optional(),
                type: Joi.string().optional(),
                phone: Joi.string().optional(),
                email: Joi.string().optional(),
                address: Joi.string().optional(),
                addressLine1: Joi.string().optional(),
                addressLine2: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                zip: Joi.string().optional(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addContactInfoListing(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//Get Listed Contact Info.
var getListedContactInfo = {
    method: 'GET',
    path: '/v1/admin/getListedContactInfo',
    config: {
        description: 'api to get listed contact info',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                id: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("In Get Listed Contact Information", request.headers);
        Controller.AdminController.getListedContactInfo(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

// ADD ABout Us Page
var addAboutUsContent = {
    method: 'POST',
    path: '/v1/admin/aboutus-content',
    config: {
        description: 'api to add ABout Us',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                content: Joi.string().required(),
                url: Joi.number().optional(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addAboutUs(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Content updated successfully",
                    data: data || null
                })
            }
        });
    },
}
//Api to get about us
var aboutUs = {
    method: 'GET',
    path: '/v1/admin/aboutUs',
    config: {
        description: 'api to get about us',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                id: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("In about Us", request.headers);
        Controller.AdminController.getAboutUs(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

// Add Comments
var addComment = {
    method: 'POST',
    path: '/v1/admin/comments',
    config: {
        description: 'api to add Comments',
        tags: ['api', 'Admin'],
        pre: [{ method: checkUserAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                postId: Joi.string().required(),
                comment: Joi.string().required(),
                siteId: Joi.string().required(),
                accessToken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addComment(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Api to get comments
var getComments = {
    method: 'GET',
    path: '/v1/admin/comments',
    config: {
        description: 'api to get Comments',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                id: Joi.string().required(),
                postId: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("In about Us", request.headers);
        Controller.AdminController.getComments(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

//Delete Comments
var deleteComment = {
    method: 'DELETE',
    path: '/v1/admin/comments',
    config: {
        description: 'api to Delete Comments',
        tags: ['api', 'Admin'],
        pre: [{ method: checkUserAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                userId: Joi.string().required(),
                commentId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteComment(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Validate Comment Admin
var validateComment = {
    method: 'POST',
    path: '/v1/admin/validateComment',
    config: {
        description: 'api to Delete Comments',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                accesstoken: Joi.string().required(),
                isVisible: Joi.boolean().required(),
                commentId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.validateComment(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
//Delete Comments API
//Delete Comments ADMIN
var deleteCommentsAdmin = {
    method: 'DELETE',
    path: '/v1/admin/deleteCommentsAdmin',
    config: {
        description: 'api to Delete Comments',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                commentId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteCommentsAdmin(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Api to get all comments ADMIN
var getCommentsAdmin = {
    method: 'GET',
    path: '/v1/admin/getCommentsAdmin',
    config: {
        description: 'api to get about us',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                id: Joi.string().required(),
                //postId : Joi.string().required(),
                //accesstoken : Joi.string().required(),

            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("In Get Comments ADMIN ", request.query);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getCommentsAdmin(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}
//Add Category
var addCategory = {
    method: 'POST',
    path: '/v1/admin/category',
    config: {
        description: 'api to add Category',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                category: Joi.string().required(),
                description: Joi.string().optional(),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addCategory(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Delete Category API
var deleteCategory = {
    method: 'DELETE',
    path: '/v1/admin/category',
    config: {
        description: 'api to Delete Category',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                categoryId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteCategory(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var getFeaturedPropertyAlgorithm = {
    method: 'GET',
    path: '/v1/admin/getFeaturedPropertyAlgorithm',
    config: {
        description: 'api to get list of all featured property algorithms',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                id: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("In Get Featured Properties", request.headers);
        Controller.AdminController.getFeaturedPropertyAlgorithm(request.query, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {

                console.log('********  ', data)

                reply({
                    "statusCode": data.statusCode,
                    "message": "Error",
                    data: data || null
                })
            }
        });
    },
}

// Get categories
//Delete Category API
var getCategory = {
    method: 'GET',
    path: '/v1/admin/category',
    config: {
        description: 'api to Get categories',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                //Agent or Site ID
                id: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getCategory(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var getRecentProperties = {
    method: 'GET',
    path: '/v1/admin/getRecentProperties',
    config: {
        description: 'api to Get recent properties nearest to me',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                //Agent or Site ID
                latitude: Joi.number().optional().allow(null).allow(''),
                longitude: Joi.number().optional().allow(null).allow(''),
                siteId: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getRecentProperties(request.query, function (err, data) {
            // console.log("errRouteX:", err);
            // console.log("dataRouteX:", data);

            Controller.AdminController.getAreaList(request.query, function (data1, err1) {
                // console.log("errRoute1:", err1);
                // console.log("dataRoute1:", data1);

                if (data1.data.area) {
                    let filteredData = err.data.filter((item) => data1.data.area.includes(item.l_area));

                    if (filteredData.length > 0) {
                        err.data = filtereddata;
                    }
                    reply(err);

                } else {
                    if (err) {
                        reply(err);
                    } else {
                        reply({
                            "statusCode": 200,
                            "message": "Success",
                            data: data || null
                        })
                    }
                }
            });
        });
    },
}

// Add Category
var addMortgage = {
    method: 'POST',
    path: '/v1/admin/mortgage',
    config: {
        description: 'api to add Mortgage',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                type: Joi.string().required(),
                term: Joi.number().required(),
                provider: Joi.string().required(),
                rate: Joi.number().required(),
                location: Joi.string().required(),
                siteId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addMortgage(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//Delete Category API
var deleteMortgage = {
    method: 'DELETE',
    path: '/v1/admin/mortgage',
    config: {
        description: 'api to Delete Mortgage data',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                mortgageId: Joi.string().required(),
                siteId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteMortgage(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var getMortgage = {
    method: 'GET',
    path: '/v1/admin/mortgage',
    config: {
        description: 'api to Get all mortgages',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                siteId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getMortgage(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
var getRate = {
    method: 'GET',
    path: '/v1/admin/mortgage-rate',
    config: {
        description: 'api to Get the rate of single mortgages',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                rateId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getRate(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var mortgageRateSearch = {
    method: 'GET',
    path: '/v1/admin/mortgageRateSearch',
    config: {
        description: 'api to Get all mortgages',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                //Agent or Site ID
                type: Joi.string().optional(),
                term: Joi.number().optional(),
                provider: Joi.string().optional(),
                rate: Joi.number().optional(),
                location: Joi.string().optional(),
                siteId: Joi.string().optional(),

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.mortgageRateSearch(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var editMortgage = {
    method: 'PUT',
    path: '/v1/admin/mortgage',
    config: {
        description: 'api to Get all mortgages',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                //Agent or Site ID
                type: Joi.string().optional(),
                term: Joi.number().optional(),
                provider: Joi.string().optional(),
                rate: Joi.number().optional(),
                location: Joi.string().optional(),
                siteId: Joi.string().optional(),
                id: Joi.string().required(),
                accesstoken: Joi.string().required()

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        var UserData = "123456"
        Controller.AdminController.editMortgage(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
var getCities = {
    method: 'GET',
    path: '/v1/admin/getCities',
    config: {
        description: 'api to Get Cities',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getCities(function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


var getAllCitiesList = {
    method: 'GET',
    path: '/v1/admin/getAllCitiesList',
    config: {
        description: 'api to Get list of all cities',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllCitiesList(function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

var getUserFavourites = {
    method: 'GET',
    path: '/v1/admin/getUserFavourites',
    config: {
        description: 'api to Get User Favourites',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                id: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getFavourites(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


var homeWorth = {
    method: 'post',
    path: '/v1/admin/homeWorth',
    config: {
        description: 'api to Get Homeworth',
        tags: ['api', 'Public'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                userId: Joi.string().optional(),
                address: Joi.string().required(),
                bedrooms: Joi.string().required(),
                bathrooms: Joi.string().required(),
                squareFeet: Joi.string().required(),
                email: Joi.string().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                sellingIn: Joi.string().optional(),
                phoneNumber: Joi.string().required(),
                siteId: Joi.string().required(),
                formType: Joi.string().required(),
                type: Joi.string().optional(),
                lot_size: Joi.string().optional(),
                isStillOwnIt: Joi.boolean().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addHomeWorth(request.payload, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Terms and conditions
var addTerms = {
    method: 'POST',
    path: '/v1/admin/addTerms',
    config: {
        description: 'Add terms in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                accesstoken: Joi.string().required(),
                terms: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("request.payload",request.payload);
        Controller.AdminController.addTerms(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

//Get Terms
var getTerms = {
    method: 'GET',
    path: '/v1/admin/getTerms',
    config: {
        description: 'api to Get Terms',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                siteId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        //var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getTerms(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
//Add Home Worth Funnel
var homeWorthFunnel = {
    method: 'post',
    path: '/v1/admin/homeWorthFunnel',
    config: {
        description: 'api to Get Homeworth',
        tags: ['api', 'Public'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                accesstoken: Joi.string().required(),
                funnelId: Joi.string().required(),
                homeWorthAgents: Joi.array().items(Joi.string().required()).required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addHomeWorthFunnel(request.payload, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Funnel for homeWorth changed successfully",
                    data: data || null
                })
            }
        });
    },
}

//Get Home Worth Funnel
var getHomeWorthFunnel = {
    method: 'GET',
    path: '/v1/admin/getHomeWorthFunnel',
    config: {
        description: 'api to Get Home worth funnel',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getHomeWorthFunnel(UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//get ALl Agents
var getAgents = {
    method: 'GET',
    path: '/v1/admin/getAgents',
    config: {
        description: 'api to Get Agents of the current website',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                skip: Joi.number().required(),
                limit: Joi.number().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllAgents(request.query, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Get Buyers
var getBuyers = {
    method: 'GET',
    path: '/v1/admin/getBuyers',
    config: {
        description: 'api to get list of users excluding admin',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                userType: Joi.string().optional().valid([
                    USER_TYPE.BUYER
                ]),
                accesstoken: Joi.string().required(),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllBuyers(request.query, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

// Delete Seller
var deleteSeller = {
    method: 'POST',
    path: '/v1/admin/deleteSeller',
    config: {
        description: 'api to delete seller Leads for admin',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                id: Joi.string().required(),
                siteId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteSellers(request.payload, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(data)).code(200);
            }
        });
    },
}

// Delete Seller
var deleteAgent = {
    method: 'POST',
    path: '/v1/admin/deleteAgent',
    config: {
        description: 'api to delete seller Leads for admin',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        /*payload: {
            maxBytes: IMG_SIZE.SIZE,
            output: 'stream',//'file',
            parse: true,
            allow: 'multipart/form-data'
        },*/
        validate: {
            payload: {
                id: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteAgent(request.payload, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(data)).code(200);
            }
        });
    },
}

//Get Site Agents

//get ALl Site Agents
var getSiteAgents = {
    method: 'GET',
    path: '/v1/admin/getSiteAgents',
    config: {
        description: 'api to Get Site Agents of the current website',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                skip: Joi.number().required(),
                limit: Joi.number().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllSiteAgents(request.query, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//change funnels
var changeFunnel = {
    method: 'PUT',
    path: '/v1/admin/changeFunnel',
    config: {
        description: 'Api to update Funnels',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                contactId: Joi.string().trim().required().length(24),
                funnelId: Joi.string().optional().allow('').allow(null),
                accesstoken: Joi.string().required(),
                isFunnelEnable: Joi.boolean().optional().allow('').allow(null),
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.changeFunnel(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },

}


//change funnels
var buyerFunnel = {
    method: 'POST',
    path: '/v1/admin/buyerFunnel',
    config: {
        description: 'Api to update Funnels',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                funnelId: Joi.string().optional().allow('').allow(null),
                isFunnelEnable: Joi.boolean().optional().allow('').allow(null),
                accesstoken: Joi.string().required(),
                assignedFunnel: Joi.array().optional(),
                firstName: Joi.string().optional(),
                phoneNumber: Joi.string().optional(),
                lastName: Joi.string().optional(),
                email: Joi.string().optional(),
                password: Joi.string().optional(),
                userType: Joi.string().optional(),

            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.buyerFunnel(request.payload, request.pre.verify.userData[0], function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

//Delete Buyers
var deleteBuyer = {
    method: 'POST',
    path: '/v1/admin/deleteBuyer',
    config: {
        description: 'Api to update Funnels',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                userId: Joi.string().trim().required().length(24),
                siteId: Joi.string().required(),
                accesstoken: Joi.string().required(),
                userType: Joi.string().required()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.deleteBuyer(request.payload, request.pre.verify.userData[0], function (err, data) {
            // Controller.AdminController.deleteBuyer(request.payload, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply(value);
            }
        });
    },
}

//CLoud CMA API
var cloudcmaAPI = {
    method: 'POST',
    path: '/v1/admin/cloudcmaapi',
    config: {
        description: 'api to delete seller Leads for admin',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required(),
                address: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        // var UserData = request.pre.verify.userData[0];

        Controller.AdminController.cloudcmaAPI(request.payload, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(data)).code(200);
            }
        });
    },
}

//Cloud CMA callback URL
var cloudCmaCallback = {
    method: 'POST',
    path: '/v1/admin/cloudCmaCallback',
    handler: function (request, reply) {
        console.log("XOX");
        Controller.AdminController.cloudCmaCallback(request.payload, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(data)).code(200);
            }
        });
    }
}

//Get All Funnel Templates
var getAllTemplates = {
    method: 'GET',
    path: '/v1/admin/getAllTemplates',
    config: {
        description: 'api to Get all templates of the current website',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                funnelId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllTemplates(request.query, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}



var assignAgentToBuyer = {
    method: 'POST',
    path: '/v1/admin/assignAgentToBuyer',
    config: {
        description: 'api to update Catgory Of Lead',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().trim().required().length(24),
                assignedTo: Joi.string().trim().required().length(24),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().trim().required().length(24),
                phoneNumber: Joi.number().required(),
                firstName: Joi.string().required(),
                email: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.assignAgentToBuyer(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}

//Get Sellers API
var getAllSellers = {
    method: 'GET',
    path: '/v1/admin/getAllSellers',
    config: {
        description: 'api to get list of all sellers',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                accesstoken: Joi.string().required(),
                siteId: Joi.string().optional(),
                sortBy: Joi.string().trim().optional(),
                sortOrder: Joi.number().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllSellers(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}

//Add Agent Orders API
var addAgentsOrder = {
    method: 'POST',
    path: '/v1/admin/addAgentsOrder',
    config: {
        description: 'api to add and update agents order',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                siteId: Joi.string().required(),
                agentsOrder: Joi.array().items().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addAgentsOrder(request.payload, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(data)).code(200);
            }
        });
    },
}

//Get all Agents Order New
var getAllAgentsNew = {
    method: 'GET',
    path: '/v1/admin/getAllAgentsNew',
    config: {
        description: 'api to get list of all Agents',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                siteId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        // var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllAgentsNew(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}


//Get All contact us Form Details
var getContactLeads = {
    method: 'GET',
    path: '/v1/admin/getContactLeads',
    config: {
        description: 'api to get contact leads',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                siteId: Joi.string().required(),
                type: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                accesstoken: Joi.string().required(),
                assignedTo: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log("IN Get Contact Leads API", request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getContactLeads(request.query, UserData, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}


//Get All contact us Form Details
var getAgentsForListings = {
    method: 'GET',
    path: '/v1/admin/getAgentsForListings',
    config: {
        description: 'api to get contact leads',
        tags: ['api', 'Admin'],
        validate: {
            query: {
                siteId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getAgentsForListings(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}

//Add User to unsubscribe list
var unsubscribeUser = {
    method: 'POST',
    path: '/v1/admin/unsubscribeUser',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        validate: {
            payload: {
                funnelId: Joi.string().trim().required().length(24),
                userId: Joi.string().trim().required().length(24)
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        Controller.AdminController.unsubscribeFromFunnel(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.UPDATED, data)).code(200)
            }
        });
    },
}


//get ALl Agents
var getAgentsWithoutOrder = {
    method: 'GET',
    path: '/v1/admin/getAgentsWithoutOrder',
    config: {
        description: 'api to Get Agents of the current website',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                // accesstoken : Joi.string().required(),
                // skip : Joi.number().required(),
                // limit : Joi.number().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        // var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAgentsWithoutOrder(function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Get all Agents Data
var getAllAgentsData = {
    method: 'GET',
    path: '/v1/admin/getAllAgentsData',
    config: {
        description: 'api to get list of all sellers',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        console.log("REQUEST:", request)
        console.log("DATAX::", UserData)
        Controller.AdminController.getAllAgentsData(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}


// Refine Agents
var refineAgents = {
    method: 'GET',
    path: '/v1/admin/refineAgents',
    config: {
        description: 'api to get list of all sellers',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                siteId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.refineAgents(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    },
}


//Add Lead Logs API
var addLeadLogs = {
    method: 'POST',
    path: '/v1/admin/addLeadLogs',
    config: {
        description: 'api to insert school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                siteId: Joi.string().required(),
                leadId: Joi.string().required(),
                contactDate: Joi.string().required(),
                contactMethod: Joi.string().required(),
                leadEmail: Joi.string().required(),
                message: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addLeadLogs(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


var addFamilyMember = {
    method: 'POST',
    path: '/v1/admin/addFamilyMember',
    config: {
        description: 'api to insert a family member in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                leadId: Joi.string().required(),
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                relation: Joi.string().required(),
                age: Joi.number().optional(),
                gender: Joi.string().optional(),
                pets: Joi.array().items(Joi.object({
                    id: Joi.number().optional(),
                    pet: Joi.string().optional()
                })),
                pet: Joi.string().optional(),     //Just for pet
                accesstoken: Joi.string().required(),
                dob: Joi.string().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addFamilyMember(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Update Family member for CRM user Lead
var updateFamilyMember = {
    method: 'PUT',
    path: '/v1/admin/updateFamilyMember',
    config: {
        description: 'api to update a family member in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload:
            {
                leadId: Joi.string().required(),
                type: Joi.string().optional(),
                accesstoken: Joi.string().required(),
                family: Joi.array().items(Joi.object({
                    firstName: Joi.string().optional(),
                    lastName: Joi.string().optional(),
                    relation: Joi.string().optional(),
                    age: Joi.number().optional(),
                    gender: Joi.string().optional(),
                    dob: Joi.string().optional(),
                    pet: Joi.string().optional(),

                })),
                pets: Joi.array().items(Joi.object({
                    id: Joi.number().optional(),
                    pet: Joi.string().optional()
                }))
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateFamilyMember(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


var updateGreetingCards = {
    method: 'PUT',
    path: '/v1/admin/updateGreetingCards',
    config: {
        description: 'api to update a family member in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload:
            {
                leadId: Joi.string().required(),
                accesstoken: Joi.string().required(),
                greetingCards: Joi.array().optional(),
                newsletter: Joi.array().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateGreetingCards(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}
// Get Lead Logs
var getLeadLogs = {
    method: 'GET',
    path: '/v1/admin/getLeadLogs',
    config: {
        description: 'api to get list of all sellers',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                siteId: Joi.string().required(),
                leadId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getLeadLogs(request.query, UserData, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//Add Client retention Template API
var addCRTemplate = {
    method: 'POST',
    path: '/v1/admin/addCRTemplate',
    config: {
        description: 'api to insert a Client retention template Value in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                type: Joi.string().required(),
                criteriaField: Joi.string().required(),
                rating: Joi.array().items(Joi.string()),
                title: Joi.string().required(),
                subject: Joi.string().required(),
                content: Joi.string().required(),
                siteId: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addCRTemplate(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Update CRT template
var updateCRTemplate = {
    method: 'PUT',
    path: '/v1/admin/updateCRTemplate',
    config: {
        description: 'api to insert a Client retention template Value in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                crId: Joi.string().required(),
                type: Joi.string().optional(),
                criteriaField: Joi.string().optional(),
                rating: Joi.array().items(Joi.string()),
                title: Joi.string().optional(),
                subject: Joi.string().optional(),
                content: Joi.string().optional(),
                siteId: Joi.string().optional(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateCRTemplate(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Get Client Retention template Data
var getCRTemplate = {
    method: 'GET',
    path: '/v1/admin/getCRTemplate',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required(),
                crId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getCRTemplate(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Delete Client Retention API
var removeCRTemplate = {
    method: 'POST',
    path: '/v1/admin/removeCRTemplate',
    config: {
        description: 'api to remove the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                accesstoken: Joi.string().required(),
                crId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removeCRTemplate(request.payload, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

// Get All Client retention Templates
var getAllCRTemplate = {
    method: 'GET',
    path: '/v1/admin/getAllCRTemplate',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required(),
                type: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllCRTemplate(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

//Add property Deal
var addPropertyDeal = {
    method: 'POST',
    path: '/v1/admin/addPropertyDeal',
    config: {
        description: 'api to insert a property Deal in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                leadId: Joi.string().required(),
                status: Joi.string().optional(),

                mlsNumber: Joi.string().optional(),
                isStillOwnIt: Joi.boolean().optional(),
                siteId: Joi.string().required(),
                acceptance_date: Joi.string().optional(),
                subject_removal_date: Joi.string().optional(),
                completion_date: Joi.string().optional(),
                possession_date: Joi.string().optional(),
                includeInFunnel: Joi.boolean().optional(),
                accesstoken: Joi.string().required(),

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addPropertyDeal(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}





// {"leadId":"5dad587d67052d136845bbcd","siteId":"5c48410224e28a42a8514985","accesstoken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNDg0MTAyMjRlMjhhNDJhODUxNDk4NSIsImVtYWlsIjoiaW5mb0Bzb3V0aHN1cnJleS5jYSIsImlhdCI6MTU3NTYwNzc3NCwiZXhwIjoxNTc1NzgwNTc0fQ.3cWOTQWNnmcOOQKYLzgKvrqMCHnFbC7HK-uQRPaS9OU","status":"Pending","includeInFunnel":true,acceptance_date:"2019-06-03T18:30:00.000Z",subject_removel_date:"2019-06-03T18:30:00.000Z",completion_date:"2019-06-03T18:30:00.000Z",possession_date:"2019-06-03T18:30:00.000Z"


//Update Property Deals
var updatePropertyDeal = {
    method: 'PUT',
    path: '/v1/admin/updatePropertyDeal',
    config: {
        description: 'api to Update a property Deal in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                leadId: Joi.string().optional(),
                // propertyId: Joi.string().optional(),
                status: Joi.string().optional(),
                mlsNumber: Joi.string().optional(),
                siteId: Joi.string().optional(),
                acceptance_date: Joi.string().optional(),
                subject_removal_date: Joi.string().optional(),
                completion_date: Joi.string().optional(),
                possession_date: Joi.string().optional(),
                includeInFunnel: Joi.boolean().optional(),
                accesstoken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updatePropertyDeal(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}
//  update property
var updateProperty = {
    method: 'PUT',
    path: '/v1/admin/updateProperty',
    config: {
        description: 'api to Update a property Deal in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                _id: Joi.string().required(),
                leadId: Joi.string().optional(),
                address: Joi.string().optional(),
                siteId: Joi.string().optional(),
                type: Joi.string().optional(),
                bedrooms: Joi.string().optional(),
                bathrooms: Joi.string().optional(),
                squareFeet: Joi.string().optional(),
                sellingIn: Joi.string().optional(),
                funnelId: Joi.string().optional(),
                status: Joi.string().optional(),
                assignedTo: Joi.string().optional(),
                dealStatus: Joi.string().optional(),
                accesstoken: Joi.string().optional(),
                isStillOwnIt: Joi.boolean().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateProperty(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

// Remove property 

var removeProperty = {
    method: 'POST',
    path: '/v1/admin/removeProperty',
    config: {
        description: 'api to Update a property Deal in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                _id: Joi.string().required(),
                accesstoken: Joi.string().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removeProperty(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}


// Get All Property Deals
var getAllPropertyDeals = {
    method: 'GET',
    path: '/v1/admin/getAllPropertyDeals',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required(),
                status: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllPropertyDeals(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Get Property Deals Data
var getPropertyDeal = {
    method: 'GET',
    path: '/v1/admin/getPropertyDeal',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required(),
                id: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getPropertyDeal(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


// Remove Property Deals
var removePropertyDeal = {
    method: 'POST',
    path: '/v1/admin/removePropertyDeal',
    config: {
        description: 'api to remove a property Deal in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removePropertyDeal(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}




// Deal Templates Start here
var addDealTemplate = {
    method: 'POST',
    path: '/v1/admin/addDealTemplate',
    config: {
        description: 'api to insert a property Deal in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                siteId: Joi.string().required(),
                title: Joi.string().required(),
                subject: Joi.string().required(),
                status: Joi.string().required(),
                emailTimeInterval: Joi.number().optional(),
                content: Joi.string().required(),
                accesstoken: Joi.string().required(),
                daysOfCompletion: Joi.string().optional(),
                emailToBeTriggeredForCompletion: Joi.number().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addDealTemplate(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

//Update Property Deals
var updateDealTemplate = {
    method: 'PUT',
    path: '/v1/admin/updateDealTemplate',
    config: {
        description: 'api to Update a deal template in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                siteId: Joi.string().optional(),
                title: Joi.string().optional(),
                subject: Joi.string().optional(),
                status: Joi.string().optional(),
                emailTimeInterval: Joi.number().optional(),
                content: Joi.string().optional(),
                accesstoken: Joi.string().required(),
                daysOfCompletion: Joi.number().optional(),
                emailToBeTriggeredForCompletion: Joi.number().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateDealTemplate(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

// Get All Property Deals
var getAllDealTemplates = {
    method: 'GET',
    path: '/v1/admin/getAllDealTemplates',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required(),
                status: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllDealTemplates(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Get Property Deals Data
var getDealTemplate = {
    method: 'GET',
    path: '/v1/admin/getDealTemplate',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                siteId: Joi.string().required(),
                id: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getDealTemplate(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


// Remove Deal Template
var removeDealTemplate = {
    method: 'POST',
    path: '/v1/admin/removeDealTemplate',
    config: {
        description: 'api to remove a Deal Template from the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removeDealTemplate(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}


//Get All Property tags
var getAllPropertyTags = {
    method: 'GET',
    path: '/v1/admin/getAllPropertyTags',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllPropertyTags(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//Get MLS list
var getMlsList = {
    method: 'GET',
    path: '/v1/admin/getMlsList',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getMlsList(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Seller log APIs
var addSellerLogs = {
    method: 'POST',
    path: '/v1/admin/addSellerLogs',
    config: {
        description: 'api to insert a Seller log in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                siteId: Joi.string().required(),
                leadId: Joi.string().required(),
                contactDate: Joi.string().required(),
                contactMethod: Joi.string().required(),
                logs: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addSellerLogs(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

//Update Property Deals
var updateSellerLogs = {
    method: 'PUT',
    path: '/v1/admin/updateSellerLogs',
    config: {
        description: 'api to Update a deal template in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                siteId: Joi.string().optional(),
                leadId: Joi.string().optional(),
                contactDate: Joi.string().optional(),
                contactMethod: Joi.string().optional(),
                logs: Joi.string().optional(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateSellerLogs(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

// Get All seller Logs
var getAllSellerLogs = {
    method: 'GET',
    path: '/v1/admin/getAllSellerLogs',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                leadId: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllSellerLogs(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Get Seller Log
var getSellerLog = {
    method: 'GET',
    path: '/v1/admin/getSellerLog',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                id: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getSellerLog(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


// Remove Seller log
var removeSellerLog = {
    method: 'POST',
    path: '/v1/admin/removeSellerLog',
    config: {
        description: 'api to remove a Seller log from the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removeSellerLog(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

//getFavouritePropertyDetails

// Get Seller Log
var getFavouritePropertyDetails = {
    method: 'GET',
    path: '/v1/admin/getFavouritePropertyDetails',
    config: {
        description: 'api to get the Favourite Property Details',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                userId: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getFavouritePropertyDetails(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}


//BuyerLogs
var addBuyerLogs = {
    method: 'POST',
    path: '/v1/admin/addBuyerLogs',
    config: {
        description: 'api to insert a Seller log in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                siteId: Joi.string().required(),
                leadId: Joi.string().required(),
                contactDate: Joi.string().required(),
                contactMethod: Joi.string().required(),
                logs: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addBuyerLogs(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

//Update Property Deals
var updateBuyerLogs = {
    method: 'PUT',
    path: '/v1/admin/updateBuyerLogs',
    config: {
        description: 'api to Update a deal template in the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                siteId: Joi.string().optional(),
                leadId: Joi.string().optional(),
                contactDate: Joi.string().optional(),
                contactMethod: Joi.string().optional(),
                logs: Joi.string().optional(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateBuyerLogs(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

// Get All Buyer Logs
var getAllBuyerLogs = {
    method: 'GET',
    path: '/v1/admin/getAllBuyerLogs',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                leadId: Joi.string().required(),
                skip: Joi.number().optional(),
                limit: Joi.number().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getAllBuyerLogs(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data || null
                })
            }
        });
    },
}

// Get Buyer Log
var getBuyerLog = {
    method: 'GET',
    path: '/v1/admin/getBuyerLog',
    config: {
        description: 'api to get the CRTemplate',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            query: {
                accesstoken: Joi.string().required(),
                id: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.getBuyerLog(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}


// Remove Seller log
var removeBuyerLog = {
    method: 'POST',
    path: '/v1/admin/removeBuyerLog',
    config: {
        description: 'api to remove a Seller log from the database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                id: Joi.string().required(),
                accesstoken: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.removeBuyerLog(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

//Polygon Search
var polygonSearch = {
    method: 'POST',
    path: '/v1/admin/polygonSearch',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            payload: {
                "location": Joi.any().required(),
                listingid: Joi.string().optional(),
                minbathRoom: Joi.number().optional().label('bathRoom'),
                maxbathRoom: Joi.number().optional().label('bathRoom'),
                minbedRoom: Joi.number().optional().label('bedRoom'),
                maxbedRoom: Joi.number().optional().label('bedRoom'),
                minAskingprice: Joi.number().optional().label('Minprice'),
                maxAskingprice: Joi.number().optional().label('Maxprice'),
                area: Joi.string().optional().allow(null).allow('').label('Area'),
                sortBy: Joi.string().trim().optional(),
                sortOrder: Joi.number().optional(),
                min_lot: Joi.number().optional().label('min_lot'),
                max_lot: Joi.number().optional().label('max_lot'),

                minFloorSpace: Joi.number().optional().label('minFloorSpace'),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace'),

                typeOfDwelling: Joi.string().optional().label('typeOfDwelling'),
                propertyType: Joi.string().optional().valid([
                    RESIDENTIAL_TYPE.RESIDENTIAL_DETACHED,
                    RESIDENTIAL_TYPE.RESIDENTIAL_ATTACHED,
                    RESIDENTIAL_TYPE.MULTI_FAMILY,
                    RESIDENTIAL_TYPE.LOST_AND_LAND,
                    RESIDENTIAL_TYPE.LAND_ONLY,
                ])
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.polygonSearch(request.payload, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply(sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)).code(200)
            }
        });
    }
}

//Get Schools API
var getSchools = {
    method: 'GET',
    path: '/v1/admin/getSchools',
    config: {
        description: 'api to get list of all the post',
        tags: ['api', 'Admin'],
        // pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                skip: Joi.number().optional(),
                limit: Joi.number().optional()
            },
            //headers: Joi.object({'accesstoken': Joi.string().trim().required()}).options({allowUnknown: true}),
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.AdminController.getSchools(request.query, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data: data
                })
            }
        });
    },
}
// faq api added in citrus on 13/06/2019 ******************************************

var addFaq = {
    method: 'POST',
    path: '/v1/admin/addFaq',
    config: {
        description: 'api to add Faq in database',
        tags: ['api', 'Admin'],
        pre: [{ method: checkUserAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                accessToken: Joi.string().required(),
                question: Joi.string().required(),
                answer: Joi.string().required(),
                is_global: Joi.boolean().optional(),
                is_published: Joi.boolean().required(),
                type: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.addFaq(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Added Successfully",
                    "data": data || null
                })
            }
        });
    },
}


var showFaq = {

    method: 'GET',
    path: '/v1/admin/showFaq',
    config: {
        description: 'api to get the Faq',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {

                accessToken: Joi.string().optional(),
                siteId: Joi.string().optional(),
                role: Joi.string().optional()

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {

        Controller.AdminController.showFaq(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}


var deleteFaq = {
    method: 'POST',
    path: '/v1/admin/deleteFaq',
    config: {
        description: 'api to delete Faq',
        tags: ['api', 'Admin'],
        pre: [{ method: checkUserAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                faqId: Joi.string().trim().optional().length(24),
                accessToken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.deleteFaq(request.payload, UserData, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Deleted Successfully",
                    data: data || null
                })
            }
        });
    },
}


//Update School
var updateFaq = {
    method: 'PUT',
    path: '/v1/admin/updateFaq',
    config: {
        description: 'api to Update school',
        tags: ['api', 'Admin'],
        pre: [{ method: checkUserAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                question: Joi.string().optional(),
                answer: Joi.string().optional(),
                is_global: Joi.boolean().optional(),
                faqId: Joi.string().required(),
                is_published: Joi.boolean().optional(),
                type: Joi.string().optional(),
                accessToken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) { //console.log("errRoute",request.headers);
        var UserData = request.pre.verify.userData[0];
        Controller.AdminController.updateFaq(request.payload, function (err, data) {
            if (err) { //console.log("errRoute",err);
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Updated Successfully",
                    data: data || null
                })
            }
        });
    },
}

var setAreaListing = {
    method: 'POST',
    path: '/v1/admin/setAreaListing',
    config: {
        description: 'api to set area listing',
        tags: ['api', 'Admin'],
        // pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {
                area: Joi.array().items(Joi.string()),
                siteId: Joi.string().required(),
                accessToken: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {

        Controller.AdminController.updateAreaList(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Area filter updated successfully",
                    data: data || null
                })
            }
        });
    },
}


var getAreaListing = {
    method: 'GET',
    path: '/v1/admin/getAreaListing',
    config: {
        description: 'api to get the Faq',
        tags: ['api', 'Admin'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
            query: {
                siteId: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        console.log(request.query);
        Controller.AdminController.getAreaList(request.query, function (err, data) {
            if (err) {
                reply(sendError(err));
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    "data": data || null
                })
            }
        });
    },
}

var dealSendReminder = {
    method: 'POST',
    path: '/v1/admin/dealSendReminder',
    config: {
        description: 'api to set area listing',
        tags: ['api', 'Admin'],
        // pre: [{ method: checkAccessToken, assign: 'verify' }],
        validate: {
            payload: {


                accesstoken: Joi.string().required(),
                mlsNumber: Joi.number().required(),
                _id: Joi.string().required(),
                template_id: Joi.string().required(),
                status: Joi.string().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {

        Controller.AdminController.dealSendReminder(request.payload, function (err, data) {
            if (err) {
                reply(err);
            } else {
                reply({
                    "statusCode": 200,
                    "message": "Area filter updated successfully",
                    data: data || null
                })
            }
        });
    },
}


module.exports = [
    updateProperty,
    login,
    changedPasword,
    setFeatured,
    createPost,
    UpdatePost,
    getAllPost,
    deletePost,
    addSchool,
    getAllSchool,
    editSchool,
    getAllUser,
    getAllUserWithoutToken,
    getSaveListingOfUser,
    editUserProfile,
    getAllContact,
    ProfileUpload,
    userDetail,
    agentDetails,
    PostImageUpload,
    createUser,
    moveLeadToCrm,
    crmUserLead,
    crmPropertyofUserLead,
    crmUserProfile,
    createFunnel,
    setAreaListing,
    getAreaListing,
    getAllFunnel,
    assignedFunnelIdToCrmProperty,
    updateFunnel,
    getFunnelDetail,
    updateCatgoryOfLead,
    CsvFileUpload,
    contactDetail,
    assignedAgent,
    getallPotentialPopertyUsingMlsNumber,
    setLogoAndOtherThemeOption,
    uploadLogo,
    getAllThemeData,
    setHoliday,
    getHoliday,
    deleteHoliday,
    createLobPostCard,
    retrievePostCard,
    getPostCard,
    getAllFunnelTemplate,
    sendMessageToAgent,
    activateDeactivatedUser,
    addSchoolPolygon,
    getSchoolPolygons,
    getAllFrontPages,
    createFrontPage,
    createPage,
    getAllPages,
    editPage,
    getPageData,
    deletePage,
    deleteNavigtion,
    deleteFunnel,
    deleteFunnelTemplate,
    createDuplicateFunnel,
    updateTitleFunnel,
    deleteSchool,
    addPropertyAgent,
    getManuallyInsertedPropertyList,
    deletePropertyAgent,
    getTestimonials,
    getTestimonialById,
    createSubscriptionPlan,
    subscriptionPlanList,
    subscriptionPlanDetail,
    addCardToAgent,
    StripeAddPlan,
    StripeAddPlanList,
    editSubscriptionPlan,
    deleteSubscriptionPlan,
    addTestimonial,
    deleteTestimonial,
    editTestimonial,
    featuredPropertyAlgorithm,
    getFeaturedProperties,
    addUsefulLinks,
    deleteUsefulLinks,
    getUsefulLinks,
    getContactInfo,
    addContactInfo,
    addContactInfoListing,
    getListedContactInfo,
    aboutUs,
    addAboutUsContent,
    addComment,
    getComments,
    deleteComment,
    validateComment,
    deleteCommentsAdmin,
    getCommentsAdmin,
    addCategory,
    deleteCategory,
    getCategory,
    getFeaturedPropertyAlgorithm,
    getRecentProperties,
    addMortgage,
    deleteMortgage,
    getMortgage,
    mortgageRateSearch,
    editMortgage,
    getCities,
    getRate,
    getAllCitiesList,
    getUserFavourites,
    homeWorth,
    addTerms,
    getTerms,
    homeWorthFunnel,
    getHomeWorthFunnel,
    getAgents,
    getSiteAgents,
    deleteSeller,
    deleteAgent,
    cloudcmaAPI,
    changeFunnel,
    deleteBuyer,
    cloudCmaCallback,
    getAllTemplates,
    assignAgentToBuyer,
    getBuyers,
    getAllSellers,
    addAgentsOrder,
    getAllAgentsNew,
    getContactLeads,
    getAgentsForListings,
    unsubscribeUser,
    getGlobalUsefulLinks,
    getAgentsWithoutOrder,
    getAllAgentsData,
    refineAgents,
    removeLeadFromCRM,
    addFamilyMember,
    updateFamilyMember,
    addLeadLogs,
    getLeadLogs,
    addCRTemplate,
    getCRTemplate,
    removeCRTemplate,
    getAllCRTemplate,
    updateCRTemplate,
    addPropertyDeal,
    updatePropertyDeal,
    getAllPropertyDeals,
    getPropertyDeal,
    removePropertyDeal,
    getDealTemplate,
    removeDealTemplate,
    getAllDealTemplates,
    updateDealTemplate,
    addDealTemplate,
    getAllPropertyTags,
    getMlsList,
    addSellerLogs,
    updateSellerLogs,
    getAllSellerLogs,
    getSellerLog,
    removeSellerLog,
    getFavouritePropertyDetails,
    addBuyerLogs,
    updateBuyerLogs,
    getAllBuyerLogs,
    getBuyerLog,
    removeBuyerLog,
    polygonSearch,
    updateSchool,
    getSchools,
    createNewPage,
    editUsefulLinks,
    addFaq,
    showFaq,
    deleteFaq,
    updateFaq,
    editFrontPage,
    createUserCrm,
    updateGreetingCards,
    automaticMeeting,
    birthdayGreeting,
    crmUserFilter,
    dealSendReminder,
    sellerData,
    buyerFunnel,
    removeProperty,
    updateSeller
]
