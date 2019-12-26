'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.terms;

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

var addTermsService = function (objToSave, callback) {
    //console.log('In add Terms Service');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback("Duplication error");
            return callback(err);
        }
        return callback(null,result);
    })
};

var updateTermsService = function (criteria,objToSave,options, callback) {
    //console.log('In update Terms Service');
    //console.log("criteria",criteria);
    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,data){
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,data);
    });
};

var getTerms = function (criteria, callback) {
    //console.log('In get Terms');
    table_name.findOne(criteria, (err, result) => {
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,result);
    });
};

module.exports = {
    addTermsService     :     addTermsService,
    checkId             :     checkId,
    updateTermsService  :     updateTermsService,
    getTerms            :     getTerms
};
