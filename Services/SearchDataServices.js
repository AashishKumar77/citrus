'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.SEARCHDATA;
var t_name = Models.REST_PROPERY_RD_1;

//Get Users from DB

var getData = function (criteria, projection, options, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log("resultttttttttttttttttttttttttttttttttttt",result)
        return callback(null,result);
    });
};

// Get Data from DB for cron

var getSearchData = function (criteria, callback) {
    table_name.find({}).populate('user','firstName lastName siteId email userType').lean().exec(function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};


var getPropertyCount = function (criteria, projection, options, callback) {
    t_name.count(criteria, function(err, cnt) {
      if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,cnt);
    });
};


//Insert User in DB
var InsertData = function (objToSave, callback) {
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
var delteRecord = function (dataToRemove, options, callback) {  //{ _id: req.body.id }
    table_name.remove(dataToRemove, function(err) {
        if (err) return callback(err);
        return callback();
    });
}

module.exports = {
    getData     : getData,
    InsertData  : InsertData,
    updateData  : updateData,
    delteRecord : delteRecord,
    getPropertyCount  : getPropertyCount,
    getSearchData     : getSearchData
};
