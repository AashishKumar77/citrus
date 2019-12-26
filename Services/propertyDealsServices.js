'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.propertyDeals;
//var table_name_new = Models.contactInfoListing;

var addData = function (objToSave, callback) {
    new table_name(objToSave).save(function(err,result){
        if(err){
            //console.log(err);
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

var getData_new= function (criteria, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            return callback(err);
        }
        return callback(null,result);
    });
};
//getAllData
var getAllData = function (criteria, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
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

var getAllDataWithLeadDetails = function (criteria, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err){
            return callback(err);
        }
        return callback(null,result);
    }).populate('leadId');
};

module.exports = {
       addData        :       addData,
       getData        :       getData,
       getAllData     :       getAllData,
       removeData     :       removeData,
       updateData     :       updateData,
       getAllDataWithLeadDetails  : getAllDataWithLeadDetails,
       getData_new    :       getData_new
};
