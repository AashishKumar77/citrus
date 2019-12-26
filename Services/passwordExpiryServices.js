'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.passwordExpiry;

// var xyz = Models.terms;

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

var addService = function (objToSave, callback) {
    //console.log('In add Service');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback("Duplication error");
            return callback(err);
        }
        return callback(null,result);
    })
};

var updateService = function (criteria,objToSave,options, callback) {
    //console.log('In update Service');
    //console.log("criteria",criteria);
    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,data){
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,data);
    });
};

var getService = function (criteria, callback) {
    //console.log('In get Password Expiry Days');
    table_name.findOne(criteria, (err, result) => {
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,result);
    });
};


module.exports = {
    addService   : addService,
    checkId      : checkId,
    updateService: updateService,
    getService   : getService
};
