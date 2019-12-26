'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.aboutUs;
//var table_name_new = Models.contactInfoListing;


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


var updateInfo = function (criteria,objToSave,options, callback) {
    //console.log("Reaching here");
    //console.log('In Update About us information');

    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        // //console.log(result);
        // //console.log("+++++++++++++++++++++++++++++++++++++++++")
        return callback(null,result);
    });
};

var getInfo = function (criteria,callback) {

    table_name.find(criteria, (err, data) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        return callback(null,data);
    });
};

var addInfo = function (objToSave, callback) {
    //console.log('In Update About Us info');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    });
};


module.exports = {
    updateInfo                   : updateInfo,
    getInfo                      : getInfo,
    addInfo                      : addInfo,
    checkId                      : checkId

};
