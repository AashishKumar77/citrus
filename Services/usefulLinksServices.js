'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.usefulLinks;

var addUsefulLinks = function (objToSave, callback) {
    //console.log('In Check Id Function',objToSave);
    //console.log('In add Featured Property');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    })
};

var editUsefulLinks = function (objToSave, callback) {
    
    table_name.findByIdAndUpdate(objToSave._id,objToSave, {new: true}, (err, todo) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        //console.log(todo);
        return callback(null,todo);
    });
};



var deleteUsefulLinks = function (idToDelete, callback) {
    table_name.findByIdAndRemove(idToDelete, (err, todo) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        //console.log(todo);
        return callback(null,todo);
    });
};

var getUsefulLinks = function (criteria,payloadData,callback) {
        var limitValue;
        var skipValue;

        limitValue = payloadData.limit || 7;
        skipValue = payloadData.skip || 0;

    table_name.find(criteria, (err, data) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        return callback(null,data);
    }).skip(skipValue).limit(limitValue);
};

var getGlobalUsefulLinks = function (criteria,payloadData,callback) {
        var limitValue;
        var skipValue;

        limitValue = payloadData.limit || 7;
        skipValue = payloadData.skip || 0;

    table_name.find(criteria, (err, data) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        return callback(null,data);
    }).skip(skipValue).limit(limitValue);
};
module.exports = {

    addUsefulLinks                : addUsefulLinks,
    deleteUsefulLinks             : deleteUsefulLinks,
    getUsefulLinks                : getUsefulLinks,
    getGlobalUsefulLinks          : getGlobalUsefulLinks,
    editUsefulLinks               :editUsefulLinks
};
