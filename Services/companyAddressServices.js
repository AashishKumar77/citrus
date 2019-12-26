'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.companyAddress;
var table_name_new = Models.contactInfoListing;

var updateInfo = function (criteria,objToSave,options, callback) {
    //console.log("Reaching here");
    //console.log('In insert testimonial');

    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        // //console.log(result);
        // //console.log("+++++++++++++++++++++++++++++++++++++++++")
        return callback(null,result);
    });
};

var getInfo = function (criteria,callback) {
    table_name.find(criteria, (err, data) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        return callback(null,data);
    });
};

var addInfo = function (objToSave, callback) {
    //console.log('In add Info for company address');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            //if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.TESTIMONIAL_ALREADY_EXIST);
            return callback(err);
        }
        return callback(null,result);
    });
};

var checkId = function (userId, callback) {
    //console.log('In Check Id Function');
    //console.log(result);
    var criteria = {
        siteId : userId
    }
    //console.log("criteria",criteria);
    table_name.find(criteria, (err, data) => {
            if(err) {
                if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
                return callback(err);
            }
            return callback(null,data);
    });
};

var checkIdListing = function (userId, callback) {
    var criteria = {
        siteId : userId
    }
    //console.log("criteria",criteria);
    table_name_new.find(criteria, (err, data) => {
            if(err) {
                //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
                return callback(err);
            }else if(!data.length){
                return callback(null,data);
            }else{
                table_name_new.findOneAndRemove(criteria, (err, value) => {
                  if(err) {
                      //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
                      return callback(err);
                  }
                  return callback(null,value);
            });
        }
    });
};

var addListing = function (objToSave, callback) {
    //console.log('In add Listing Property');
    new table_name_new(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            //if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.TESTIMONIAL_ALREADY_EXIST);
            return callback(err);
        }
        return callback(null,result);
    });
};

var updateListing = function (criteria,objToSave,options,opts, callback) {
    //console.log("Reaching here");
    //console.log('In Update ');


    table_name_new.findOneAndUpdate(criteria,objToSave, opts, options, function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        // //console.log(result);
        // //console.log("+++++++++++++++++++++++++++++++++++++++++")
        return callback(null,result);
    });
};


var getListing = function (criteria,callback) {
    table_name_new.find(criteria, (err, data) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        if(data.length > 0){
          ////console.log("124233",data);
            return callback(null,data);
        }else{
          ////console.log("55555555555555555555555555",data);
          var value = {
                statusCode: 401,
                status: "warning",
                message: 'Listed Contact Information Not Found'
          }
          return callback(null,value);
        }

    });
};

module.exports = {
    updateInfo                   : updateInfo,
    getInfo                      : getInfo,
    addInfo                      : addInfo,
    checkId                      : checkId,
    addListing                   : addListing,
    updateListing                : updateListing,
    checkIdListing               : checkIdListing,
    getListing                   : getListing

};
