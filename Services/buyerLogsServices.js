'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.buyerLogs;

var addData = function (objToSave, callback) {
    //console.log('In Add Buyer Logs API');
    new table_name(objToSave).save(function(err,result){
        if(err){
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    });
};


//Get Data
var getLeadLogs = function (criteria, skip, limit, callback) {
    table_name.find(criteria).sort({ contactDate : -1 }).skip(skip).limit(limit).exec( function(err,result){ ////console.log("criteria_err",err);
        if(err){
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

//Count Data
var countLeadLogs = function (criteria, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

//Remove Data
var removeData = function (criteria, callback) {
    table_name.findOneAndRemove(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            return callback(err);
        }
        return callback(null,result);
    });
};

var updateData = function (criteria, dataToSet, options, callback) { ////console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) { ////console.log("==========updateData===========",err);
            return callback(err);
        }
        return callback(null,result);
    });
};

//Get Data
var getData = function (criteria, callback) {
    table_name.findOne(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            return callback(err);
        }
        return callback(null,result);
    });
};

module.exports = {
       addData                      : addData,
       getLeadLogs                  : getLeadLogs,
       countLeadLogs                : countLeadLogs,
       updateData                   : updateData,
       removeData                   : removeData,
       getData                      : getData
};
