'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_n = Models.Testimonial;
var table_name = Models.featuredProperties;
var xyz = Models.REST_PROPERY_RD_1;
var user_Table = Models.users;;


var getAgentIds = function (criteria, callback) {
  console.log("Calling Get Agent IDs API");
  user_Table.find(criteria).distinct('realtoragentid',function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};
var checkId = function (userId, callback) {
    console.log('In Check Id Function');
    console.log(result);
    var criteria = {
        siteId : userId.id,
        type:userId.type
    }
    console.log("criteria",criteria);
    table_name.find(criteria, (err, data) => {
            if(err) {
                if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
                return callback(err);
            }
            return callback(null,data);
    });
};

var addFeaturedPropertyAlgorithm = function (objToSave, callback) {
    console.log('In add Featured Property');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            console.log(err);
            if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.TESTIMONIAL_ALREADY_EXIST);
            return callback(err);
        }
        return callback(null,result);
    })
};

var updateFeaturedPropertyAlgorithm = function (criteria,objToSave,options, callback) {
    console.log('In update Featured Property');
    console.log("criteria",criteria);
    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,data){
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,data);
    });
};

// var upatemany = function (criteria,objToSave,options, callback) {
//     console.log('In update Featured Property');
//     console.log("criteria",criteria);
//     table_name.findOneAndUpdate(criteria, objToSave, options, function(err,data){
//             if(err) {
//                 if(err.name=="CastError") return callback(err);
//                 return callback(err);
//             }
//             return callback(null,data);
//     });
// };


var getFeaturedPropertyCriteria1 = function (criteria, callback) {
    console.log('In get Featured Property');
    table_name.find(criteria, (err, result) => {
            if(err) {
                console.log(err);
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            console.log(result,"llllllllllllllllllll")
            return callback(null,result);
    });
};



var getFeaturedPropertyCriteria = function (criteriaId, callback) {
    console.log('In get Featured Property');
    table_name.find({siteId : criteriaId}, (err, result) => {
            if(err) {
                console.log(err);
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            // console.log(result,"llllllllllllllllllll")
            return callback(null,result);
    });
};

var getProperties = function (criteria,limitValue,skipValue, callback) {
    console.log('In get Properties Function');
    // console.log("LIMITVALUE : ",limitValue);
 console.log("SKIP VALUE : ",criteria);
    xyz.find(criteria).sort({l_listingdate : -1 }).limit(limitValue).skip(skipValue).exec( (err, data) => {
              if(err) {
                  if(err.name=="CastError") return callback('No properties found');
                  return callback(err);
              }

              // console.log(data);
              return callback(null,data);
      });
};


module.exports = {
    addFeaturedPropertyAlgorithmService   : addFeaturedPropertyAlgorithm,
    getFeaturedPropertyCriteria           : getFeaturedPropertyCriteria,
    getFeaturedPropertyCriteria1         :getFeaturedPropertyCriteria1,
    getProperties                         : getProperties,
    checkId                               : checkId,
    updateFeaturedPropertyAlgorithmService: updateFeaturedPropertyAlgorithm,
    getAgentIds                           : getAgentIds,
    // upatemany:                            upatemany
};
