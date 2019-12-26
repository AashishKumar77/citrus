'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.SCHEDULE;

//Get Users from DB

var getData = function (criteria, projection, options, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

var getAllData = function (criteria, callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    }).populate('PropertyId').sort({createdAt : -1});
};


var getSingleData = function (criteria, callback) {
    table_name.findOne(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};
//Insert User in DB
var InsertData = function (objToSave, callback) {
  // for(var i=0;i<50;i++){
  //   //console.log(objToSave);
  // }
    new table_name(objToSave).save(function(err,result){
        if(err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null,result);
    })
};
var updateData = function (criteria, dataToSet, options, callback) { ////console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) { ////console.log("==========updateUser===========",err);
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};
//.insert()
var InsertMultiple = function (objToSave, callback) {
    table_name.insertMany(objToSave,function(err,result){
        if(err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null,result);
    })
};

module.exports = {
    getData        : getData,
    InsertData     : InsertData,
    updateData     : updateData,
    InsertMultiple : InsertMultiple,
    getAllData     : getAllData,
    getSingleData  : getSingleData
};
