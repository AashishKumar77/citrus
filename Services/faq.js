'use strict';
var UniversalFunctions = require('../Utils/');
var responses = require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.faq;
//var table_name_new = Models.contactInfoListing;


// var checkId = function (userId, callback) {
//     //console.log('In Check Id Function');
//     //console.log(result);
//     var criteria = {
//         siteId : userId
//     }
//     //console.log("criteria",criteria);
//     table_name.find(criteria, (err, data) => {
//             if(err) {
//                 if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
//                 return callback(err);
//             }
//             return callback(null,data);
//     });
// };


var updateInfo = function (criteria, objToSave, options, callback) {
    //console.log("Reaching here");
    //console.log('In Update About us information');
    //console.log(objToSave)
    table_name.findOneAndUpdate(criteria, objToSave, options, function (err, result) {
        if (err) {
            if (err.name == "CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        // //console.log(result);
        // //console.log("+++++++++++++++++++++++++++++++++++++++++")
        return callback(null, result);
    });
};

var getInfo = function (criteria, options, projection, callback) {
    //console.log('criteria', criteria)
    // //console.log('callback',callback)

    table_name.find(criteria, (err, data) => {
        if (err) {
            if (err.name == "CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        //console.log('data', data);
        return callback(null, data);
    });
};

var addInfo = function (objToSave, callback) {
    //console.log('In Faq ADDDDD');
    new table_name(objToSave).save(function (err, result) {
        if (err) {
            //console.log(err);
            return callback(err);
        }
        return callback(null, result);
    });
};

var deleteInfo = function (dataToRemove, options, callback) {
    //console.log("dataToRemove", dataToRemove);
    table_name.remove(dataToRemove, function (err) {
        if (err) return callback(err);
        return callback();
    });
}

module.exports = {
    updateInfo: updateInfo,
    getInfo: getInfo,
    addInfo: addInfo,
    deleteInfo: deleteInfo
};
