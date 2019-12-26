'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.logs;
//var table_name_new = Models.contactInfoListing;

var addData = function (objToSave, callback) {
    //console.log('In Add Lead Logs API');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    });
};


//Get Data
var getLeadLogs = function (criteria, skip, limit, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    }).skip(skip).limit(limit);
};

//Get Data
var countLeadLogs = function (criteria, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};
module.exports = {
       addData                      : addData,
       getLeadLogs                  : getLeadLogs,
       countLeadLogs                : countLeadLogs
};
