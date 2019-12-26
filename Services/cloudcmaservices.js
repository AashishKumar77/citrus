'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.cloudcma;

// //Get Users from DB
//
// var getUser = function (criteria, projection, options, callback) {
//     table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
//         if(err) {
//             if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
//             return callback(err);
//         }
//
//         return callback(null,result);
//     });
// };

//Insert User in DB
var createCloudCMA = function (objToSave, callback) {
    // objToSave.passwordLastUpdated = Date.now();
    //console.log("_________________________________________________________________");
    //console.log(objToSave);
    //console.log("_________________________________________________________________");
    new table_name(objToSave).save(function(err,result){
        if(err) {
            return callback(err);
        }else{
            return callback(null,result);
        }
    })
};

//Update User in DB
var updateData = function (criteria, dataToSet, options, callback) { ////console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) {
            return callback(err);
        }
        return callback(null,result);
    });
};
//
// var getAgents = function (criteria, projection, options,skip,limit, callback) {
//     table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
//         if(err) {
//             if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
//             //console.log(err);
//             return callback(err);
//         }
//
//         return callback(null,result);
//     }).skip(skip).limit(limit);
// };
//
//
// //Delete Seller
// var deleteData = function (criteria, callback) {
//     table_name.findOneAndRemove(criteria, function(err,result){ ////console.log("criteria_err",err);
//         if(err) {
//             // if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
//             return callback(err);
//         }
//         return callback(null,result);
//     });
// };
module.exports = {
    createCloudCMA     : createCloudCMA,
    updateData         : updateData
};
