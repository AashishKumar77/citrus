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
const DBCommonFunction = Utils.DBCommonFunction;
const paymentController = require("./paymentController");
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
const LOB_API_KEY = APP_CONSTANTS.LOB_API_KEY;
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

const Lob = require('lob')(LOB_API_KEY);//('test_fe291adade83121b498f1d1710c2b5ebbbf');

var createPostCard = (payloadData,UserData,callbackRoute)=> {
	var userData;
	var postcardId,postcardToId;
	async.auto({
        getUserData:[(cb)=>{
       	    var Criteria  = {
       	    	_id:payloadData.userId
       	    }
	       	Service.ContactFormService.getData(Criteria, {}, {}, (err, data)=> {
	       		if(err) return cb(err);
	       		userData = data[0]
	       		return cb(null,userData);
	       	})
        }],
        apiCreatePostCard:['getUserData',(ag1,cb)=>{
       	    var userDataTo={}
       	    userDataTo.name = userData.firstName;
       	    userDataTo.email = userData.email;
       	    userDataTo.address_city   =  payloadData.address_city;
       	    userDataTo.address_state  =  payloadData.address_state;
       	    userDataTo.address_zip    =  payloadData.address_zip;
       	    userDataTo.address_line1  =  payloadData.address_line1;

       	    if(userData.lastName){
       	    	userDataTo.name = userDataTo.name+' '+userData.lastName
       	    }

       	    if(payloadData.address_line2){
       	    	userDataTo.address_line2 = payloadData.address_line2
       	    }

       	    if(userData.sourceofContact){
       	    	userDataTo.phone = userData.sourceofContact
       	    }
            Lob.postcards.create({
								description: 'Southsurrey  Postcard',
								to: userDataTo,
								front: payloadData.front,//'<html style="padding: 1in; font-size: 50;">Front HTML for {{name}}</html>',
								back: payloadData.front,//'<html  style="padding: 1in; font-size: 20;">Back HTML for {{name}}</html>',
								merge_variables: {
									name: userData.firstName,
									//phone:userData.phone
								}
            }, function (err, res) {
            	if(err) { ////console.log("here====",err.status_code,err._response);
            	    var apiError =  Utils.universalfunctions.jsonParseStringify(err);
            	    var errr_message = apiError._response.body.error.message;
                  if(errr_message =='to.address_zip is not a valid ZIP code or to must be a string'){
                    errr_message = 'Zip Code is not Valid'
                  };
                  if(errr_message =='to.address_state is not valid. Please ensure you are using either the proper 2 character state or the correct full state name or to must be a string'){
                    errr_message = 'State is not valid'
                  };
                  if(errr_message =="The 'to' address does not meet your minimum deliverability strictness. To change your deliverability strictness, see https://dashboard.lob.com/#/settings/account"){
                    errr_message = 'Address1 is not valid'
                  };
                   //console.log("errr_message",errr_message);
                  var errorObject={
                        statusCode: 400,
                        lob_statusCode:apiError.status_code,
                        //"error": "Bad Request",
                        customMessage: errr_message,//apiError._response.body.error.message,
                        type: "API_ERROR",
            	    }
            		return cb(errorObject);
            	}
            	if(res.id){
            		postcardId= res.id;
            		if(res.to.id){
            			postcardToId= res.to.id;
            		}
            	}
            	return cb(null,{
            		postcardId:postcardId,
            		postcardToId:postcardToId,
            		res:res,
            	}) ////console.log(err, res);
            });
        }],
        saveDataInDB:['getUserData','apiCreatePostCard',(ag2,cb)=>{ //console.log("saveDataInDB====init");
            var dataToSave = {
                PostCardLob: postcardId,
                ContactId: userData._id,
            };
            if(userData.userId){
            	dataToSave.userId = userData.userId
            }
            Service.PostCardLobService.InsertData(dataToSave,function (err, result) { //console.log("saveDataInDB====err",err,result);
                if (err) return cb(err);
                return cb();
            });
        }]
	},function(err,result){
       if(err) return callbackRoute(err);
       return callbackRoute();
	})
}

var retrievePostCard = (payloadData,UserData,callbackRoute)=> {
	var finalData={};
	async.auto({
		getPostCardData:[(cb)=>{//'psc_5c002b86ce47537a'
			Lob.postcards.retrieve(payloadData.postcardId, function (err, res) { ////console.log("errr",err);
			    if (err) return cb(err);
			    finalData = res;
                return cb();
			});
		}]
	},function(err,result){
       if(err) return callbackRoute(err);
       return callbackRoute(null,finalData);
	})
}

module.exports = {
 createPostCard:createPostCard,
 retrievePostCard:retrievePostCard
}
