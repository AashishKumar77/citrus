'use strict';
var UniversalFunctions = require('../Utils/');
var responses = require('../Utils/responses');
var Models = require('../Models');
var table_name = Models.setArea;

var updateInfo = function (criteria, objToSave, options, callback) {

    table_name.findOneAndUpdate(criteria, objToSave, options, function (err, result) {

        //console.log("CRITERIA {UPDATE}:", criteria);
        //console.log("ERR {UPDATE}:", err);
        //console.log("RESULT {UPDATE}:", result);
        if (!result) {
            objToSave["createdAt"] = new Date().toISOString();
            new table_name(objToSave).save(function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            });
        } else {
            return callback(null, result);
        }
    });
};

var getInfo = function (criteria, options, projection, callback) {
    //console.log("setArea {GET}:", criteria)
    table_name.findOne(criteria, (err, data) => {
        if (err) {
            if (err.name == "CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null, data);
    });
};

var addInfo = function (objToSave, callback) {
    //console.log("setArea {ADD}:", objToSave)
    new table_name(objToSave).save(function (err, result) {
        if (err) {
            //console.log(err);
            return callback(err);
        }
        return callback(null, result);
    });
};

module.exports = {
    updateInfo: updateInfo,
    getInfo: getInfo,
    addInfo: addInfo
};
