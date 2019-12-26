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
var RESIDENTIAL_TYPE = APP_CONSTANTS.RESIDENTIAL_TYPE;

/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
var Joi = require('joi');

var getNumberOfPropertiesInEachType = {
    method: 'GET',
    path: '/v1/residential/getNumberOfPropertiesInEachType',
    config: {
        description: 'get number of properties in each property type',
        tags: ['api', 'Residential'],
        validate: {
        	query: {

           },
          failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getNumberOfPropertiesInEachType(request.query,function (err, data) {
            if (err) {
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


var getCountSingleDetached = {
    method: 'GET',
    path: '/v1/residential/getCountSingleDetached',
    config: {
        description: 'get number of properties in each property type',
        tags: ['api', 'Residential'],
        validate: {
        	query: {

           },
          failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getCountOfParams(request.query,function (err, data) {
            if (err) {
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


var getAllResidentialProperty = {
    method: 'GET',
    path: '/v1/residential/getAllResidentialProperty',
    config: {
        description: 'api to get list of all the propert',
        tags: ['api', 'Residential'],
        validate: {
          options: {
            allowUnknown: true
          },
        	query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                listingid: Joi.string().optional(),
                searchValue: Joi.string().optional(),
                // latitude: Joi.number().optional(),
                // longtitude: Joi.number().optional(),

                minbathRoom: Joi.number().optional().label('bathRoom'),
                maxbathRoom: Joi.number().optional().label('bathRoom'),

                minbedRoom: Joi.number().optional().label('bedRoom'),
                maxbedRoom: Joi.number().optional().label('bedRoom'),

                minAskingprice: Joi.number().optional().label('Minprice'),
                maxAskingprice: Joi.number().optional().label('Maxprice'),

                area: Joi.string().optional().allow(null).allow('').label('Area'),
                sortBy: Joi.string().trim().required(),
                sortOrder: Joi.number().optional(),
                min_lot: Joi.number().optional().label('min_lot'),
                max_lot: Joi.number().optional().label('max_lot'),

                minFloorSpace: Joi.number().optional().label('minFloorSpace'),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace'),

                typeOfDwelling: Joi.string().optional().label('typeOfDwelling'),


                propertyType:  Joi.string().optional().valid([
                	RESIDENTIAL_TYPE.RESIDENTIAL_DETACHED,
                	RESIDENTIAL_TYPE.RESIDENTIAL_ATTACHED,
                	RESIDENTIAL_TYPE.MULTI_FAMILY,
                    RESIDENTIAL_TYPE.LOST_AND_LAND,
                    RESIDENTIAL_TYPE.LAND_ONLY,
                    'Apartment/Condo','Townhouse','Apartment/Townhouse'
                ]),
                schoolId: Joi.string().trim().optional().length(24),
                accessToken: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getAllResidentialProperty(request.query,function (err, data) {
            if (err) {
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

var PropertyDetails = {
    method: 'GET',
    path: '/v1/residential/PropertyDetails',
    config: {
        description: 'api to get Detail of the property',
        tags: ['api', 'Residential'],
        validate: {
        	query: {
               PropertyId: Joi.string().trim().required().length(24)
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.PropertyDetails(request.query,function (err, data) {
            if (err) {
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

var PropertyDetailsusingMls = {
    method: 'GET',
    path: '/v1/residential/PropertyDetailsusingMls',
    config: {
        description: 'api to get Detail of the property using mls',
        tags: ['api', 'Residential'],
        validate: {
            query: {
               mls: Joi.number().required()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.PropertyDetailsusingMls(request.query,function (err, data) {
            if (err) {
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

var featuredProperties = {
    method: 'GET',
    path: '/v1/residential/featuredProperties',
    config: {
        description: 'api to get Detail of the property using mls',
        tags: ['api', 'Residential'],
        validate: {
            query: {

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.featuredProperties(request.query,function (err, data) {
            if (err) {
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

var homePageSilderData = {
    method: 'GET',
    path: '/v1/residential/homePageSilderData',
    config: {
        description: 'api to get slider images',
        tags: ['api', 'Residential'],
        validate: {
            query: {

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.homePageSilderData(request.query,function (err, data) {
            if (err) {
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

var homePagebottomData = {
    method: 'GET',
    path: '/v1/residential/homePagebottomData',
    config: {
        description: 'api to get slider images',
        tags: ['api', 'Residential'],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.homePagebottomData(request.query,function (err, data) {
            if (err) {
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
var getAllAreaList = {
    method: 'GET',
    path: '/v1/residential/getAllAreaList',
    config: {
        description: 'api to get slider images',
        tags: ['api', 'Residential'],
        validate: {
            query: {

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getAllAreaList(request.query,function (err, data) {
            if (err) {
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


var getAllCityList = {
    method: 'GET',
    path: '/v1/residential/getAllCityList',
    config: {
        description: 'api to get slider images',
        tags: ['api', 'Residential'],
        validate: {
            query: {

            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getAllCityList(request.query,function (err, data) {
            if (err) {
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

var getAlllocation = {
    method: 'GET',
    path: '/v1/residential/getAlllocation',
    config: {
        description: 'api to get Detail of the property using mls',
        tags: ['api', 'Residential'],
        validate: {
            query: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                listingid: Joi.string().optional(),
                minbathRoom: Joi.number().optional().label('bathRoom'),
                maxbathRoom: Joi.number().optional().label('bathRoom'),
                minbedRoom: Joi.number().optional().label('bedRoom'),
                maxbedRoom: Joi.number().optional().label('bedRoom'),
                minAskingprice: Joi.number().optional().label('Minprice'),
                maxAskingprice: Joi.number().optional().label('Maxprice'),
                area: Joi.string().trim().optional(),
                sortBy: Joi.string().trim().optional(),
                sortOrder: Joi.number().optional(),
                min_lot: Joi.number().optional().label('min_lot'),
                max_lot: Joi.number().optional().label('max_lot'),

                minFloorSpace: Joi.number().optional().label('minFloorSpace'),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace'),
                typeOfDwelling: Joi.string().optional().label('typeOfDwelling'),
                propertyType:  Joi.string().optional().valid([
                    RESIDENTIAL_TYPE.RESIDENTIAL_DETACHED,
                    RESIDENTIAL_TYPE.RESIDENTIAL_ATTACHED,
                    RESIDENTIAL_TYPE.MULTI_FAMILY,
                    RESIDENTIAL_TYPE.LOST_AND_LAND,
                    RESIDENTIAL_TYPE.LAND_ONLY,
                ]),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getAlllocation(request.query,function (err, data) {
            if (err) {
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

var PropertyDetailsusingl_displayid = {
    method: 'GET',
    path: '/v1/residential/PropertyDetailsusingl_displayid',
    config: {
        description: 'api to get Detail of the property using l_displayid',
        tags: ['api', 'Residential'],
        validate: {
            query: {
               l_displayid: Joi.string().required(),
               accessToken: Joi.string().optional(),
               rotateAgentId : Joi.string().optional()
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.PropertyDetailsusingl_displayid(request.query,function (err, data) {
            if (err) {
                reply(sendError(err));
            }else {
                reply({
                    "statusCode": 200,
                    "message": "Success",
                    data:data
                })
            }
        });
    },
}

var getAlllocationNorthAndSouthCoordinate = {
    method: 'POST',
    path: '/v1/residential/getAlllocationNorthAndSouthCoordinate',
    config: {
        description: 'api to get Detail of the property using mls',
        tags: ['api', 'Residential'],
        validate: {
            payload: {
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                listingid: Joi.string().optional(),
                minbathRoom: Joi.number().optional().label('bathRoom'),
                maxbathRoom: Joi.number().optional().label('bathRoom'),
                minbedRoom: Joi.number().optional().label('bedRoom'),
                maxbedRoom: Joi.number().optional().label('bedRoom'),
                minAskingprice: Joi.number().optional().label('Minprice'),
                maxAskingprice: Joi.number().optional().label('Maxprice'),
                area: Joi.string().trim().optional(),
                sortBy: Joi.string().trim().optional(),
                sortOrder: Joi.number().optional(),
                min_lot: Joi.number().optional().label('min_lot'),
                max_lot: Joi.number().optional().label('max_lot'),

                minFloorSpace: Joi.number().optional().label('minFloorSpace'),
                maxFloorSpace: Joi.number().optional().label('maxFloorSpace'),
                typeOfDwelling: Joi.string().optional().label('typeOfDwelling'),
                propertyType:  Joi.string().optional().valid([
                    RESIDENTIAL_TYPE.RESIDENTIAL_DETACHED,
                    RESIDENTIAL_TYPE.RESIDENTIAL_ATTACHED,
                    RESIDENTIAL_TYPE.MULTI_FAMILY,
                    RESIDENTIAL_TYPE.LOST_AND_LAND,
                    RESIDENTIAL_TYPE.LAND_ONLY,
                ]),
                northEast:Joi.array().required(),
                southWest:Joi.array().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getAlllocationNorthAndSouthCoordinate(request.payload,function (err, data) {
            if (err) {
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
var relatedProperties = {
    method: 'GET',
    path: '/v1/residential/relatedProperties',
    config: {
        description: 'api to get related property',
        tags: ['api', 'Residential'],
        validate: {
            query: {
                minSqft: Joi.number().required(),
                _id: Joi.string().required(),
                maxSqft: Joi.number().required(),
                minPrice: Joi.number().required(),
                maxPrice: Joi.number().required(),
                bedRoom: Joi.number().required(),
                bathRoom: Joi.number().required(),
                area: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getRelatedProperties(request.query,function (err, data) {
            if (err) {
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


var getRecentProperties = {
    method: 'GET',
    path: '/v1/residential/getRecentProperties',
    config: {
        description: 'api to get list recent Properties',
        tags: ['api', 'Residential'],
        validate: {
          options: {
            allowUnknown: true
          },
        	query: {
                skip: Joi.number().optional(),
                limit: Joi.number().optional(),
                accessToken: Joi.string().optional(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
      // //console.log("request.query")
      // //console.log(request.query)
        Controller.RetsPropertyRD_1_Controller.getRecentProperties(request.query,function (err, data) {
            if (err) {
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
///Get Favourites
var getFavourites = {
    method: 'GET',
    path: '/v1/residential/getFavourites',
    config: {
        description: 'api to get list of Favourites',
        tags: ['api', 'Residential'],
        //pre: [{method: checkAccessToken, assign: 'verify'}],
        validate: {
          options: {
            allowUnknown: true
          },
        	query: {
                userid: Joi.string().required(),
            },
            failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        //var UserData = request.pre.verify.userData[0];
        Controller.RetsPropertyRD_1_Controller.getFavourites(request.query,function (err, data) {
            if (err) {
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

var getNumberOfDwelling = {
    method: 'GET',
    path: '/v1/residential/getNumberOfDwelling',
    config: {
        description: 'get number of Dwellings',
        tags: ['api', 'Residential'],
        validate: {
        	query: {

           },
          failAction: FailActionFunction
        }
    },
    handler: function (request, reply) {
        Controller.RetsPropertyRD_1_Controller.getNumberOfDwellings(request.query,function (err, data) {
            if (err) {
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


module.exports = [
  getAllResidentialProperty,
  getNumberOfPropertiesInEachType,
  PropertyDetails,
  PropertyDetailsusingMls,
  featuredProperties,
  homePageSilderData,
  homePagebottomData,
  getAllAreaList,
  getAllCityList,
  getAlllocation,
  PropertyDetailsusingl_displayid,
  getAlllocationNorthAndSouthCoordinate,
  relatedProperties,
  getRecentProperties,
  getFavourites,
  getNumberOfDwelling,
  getCountSingleDetached
]
