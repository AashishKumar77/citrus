'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.ThemeSetting_MODEL;

//Get Users from DB

var getData = function (criteria, projection, options, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        console.log(result,"resultresult")
        return callback(null,result);
    });
};

var getSingleData = function (criteria, projection, options, callback) {
    table_name.findOne(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};
//Insert User in DB
var InsertData = function (objToSave, callback) { //console.log("==========objToSave==============",objToSave);
    new table_name(objToSave).save(function(err,result){
        if(err) { ////console.log("==========objToSave==============",err);
             if (err.code == 11000 && err.message.indexOf('schoolTitle_1') > -1) return  callback(responses.SCHOOL_ALREADY_EXIST);
            return callback(err);
        }
        return callback(null,result);
    })
};
var updateData = function (criteria, dataToSet, options, callback) { ////console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) { ////console.log("==========updateUser===========",err);
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            if (err.code == 11000 && err.message.indexOf('schoolTitle_1') > -1) return  callback(responses.SCHOOL_ALREADY_EXIST);
            return callback(err);
        }
        return callback(null,result);
    });
};


module.exports = {
    getData     : getData,
    InsertData  : InsertData,
    updateData  : updateData,
    getSingleData : getSingleData
};
