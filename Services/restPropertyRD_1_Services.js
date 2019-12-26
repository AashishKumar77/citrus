'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.REST_PROPERY_RD_1;
////console.log("responses",responses.INVALID_PROPERTY_ID);
//Get Users from DB

var getData = function (criteria, projection, options,callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //console.log(err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        // //console.log("From GET DATA API",err,result);
        return callback(null,result);
    })
};

var getData_limit = function (criteria, projection, options,limit,callback) {
    var limit2 = 0
    if(limit){
        limit2 = limit
    }
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //console.log(err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        // //console.log("From GET DATA API",err,result);
        return callback(null,result);
    }).limit(limit2);
};


var getDataCount = function (criteria, callback) {
    table_name.count({}, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //console.log(err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        // //console.log("From GET DATA API",err,result);
        return callback(null,result);
    });
};
var getDataSchools = function (criteria, projection, options,skip,limit, callback) {
    var skip2 = 0;
    var limit2 = 500;
    if(skip){
        skip2 = skip
    }

    if(limit){
        limit2 = limit
    }
    //console.log(skip2);
    //console.log(limit2);
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //console.log(err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        // //console.log("From GET DATA API",err,result);
        return callback(null,result);
    }).skip(skip2).limit(limit2);
};
var getData_test = function (criteria,projection, callback) {
    table_name.find(criteria,projection, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //console.log(err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        // //console.log("From GET DATA API",err,result);
        return callback(null,result);
    });
};

var getRelatedProperties = function (criteria, projection, options, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};


var getPropertiesCount = function (callback) {
      table_name.aggregate([
      {"$group" : {_id:"$lm_char1_36", count:{$sum:1}}}
      ]).exec((err, returnedCount) => {
      if(err) {
          if(err.name=="CastError") return callback(responses.NO_DATA_FOUND);
          return callback(err);
      }
      return callback(null,returnedCount);
      })
};

var getDwellingCount = function (callback) {
      table_name.aggregate([
      {"$group" : {_id:"$lm_char10_11", count:{$sum:1}}}
      ]).exec((err, returnedCount) => {
      if(err) {
          if(err.name=="CastError") return callback(responses.NO_DATA_FOUND);
          return callback(err);
      }
      return callback(null,returnedCount);
      })
};


var getCountOnTwoParams = function (callback) {
  var criteria = {
    lm_char1_36 : "Residential Detached",
    lm_char10_11 : "House/Single Family"
  }
  // //console.log("criteria",criteria);
  table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
      if(err) {
          if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
          return callback(err);
      }
      if(result.length > 0){
        var data = result.length;
        // //console.log(data);
        return callback(null,data);
      }else{
        var data = "No Data Found";
        return callback(null,data);
      }

  });
};

//Insert User in DB
var InsertData = function (objToSave, callback) {  ////console.log("==========here==services=======");
    new table_name(objToSave).save(function(err,result){
        if(err) {  ////console.log("==========hereeexxx=========",err);
            if (err.code == 11000 && err.message.indexOf('l_listingid_1') > -1) return  callback(responses.LISTING_ID_ALREADY_EXISTS);
            return callback(err);
        };
        return callback(null,result);
    })
};

//Update User in DB
var updateData = function (criteria, dataToSet, options, callback) { ////console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) { ////console.log("==========updateUser===========",err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

var getDistinctData = function (field,query,options,callback) { ////console.log("getDistinctData==services===init");
    table_name.find().distinct(field, {}, options, function(err,result){ ////console.log("criteria_err=====ss====s===",err,result);
    //table_name.distinct(field, {}, options, function(err,result){ //console.log("criteria_err=====ss====s===",err);
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

var deleteRecord = function (dataToRemove, options, callback) {  //{ _id: req.body.id }
    table_name.remove(dataToRemove, function(err) {
        if (err) return callback(err);
        return callback();
    });
}


var getRecentProperties = function (criteria, projection,options, callback) {
    var limitValue = 6;
    table_name.find(criteria,projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        return callback(null,result);
    }).limit(limitValue);
};

var getRecent = function (criteria,projection,options, callback) {
    var limitValue = 6;
    // //console.log("limit valueee");
    // //console.log(criteria);
    table_name.find(criteria,projection,options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            //console.log(err);
            return callback(err);
        }
        ////console.log(result);
        return callback(null,result);
    }).limit(limitValue);
};


// var getRecentLoop = function (criteria,projection,options, callback) {
//     var limitValue = 6;
//     //console.log("limit valueee");
//     //console.log(criteria);
//     table_name.aggregate([
//         {
//             $group: {
//                 _id: '$l_city',
//                 count: {$sum: 1}
//             }
//         }
//     ],function (err, res) {
//         if(err) {
//             //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
//             //console.log(err);
//             return callback(err);
//         }
//         ////console.log(result);
//         return callback(null,result);
//     }).limit(limitValue);
// };
var getRecentLoop = function (criteria,projection,options, callback) {
    var limitValue = 6;
    //console.log("REACHINg HRE LOOP");
    ////console.log(criteria);
    table_name.aggregate([
          {
            $group: {

                _id: '$l_city',
                count: { $sum: 1 }

              }
        },
        {
          $sort : { "count": -1 }
        }
    ],function (err, result) {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            //console.log(err);
            return callback(err);
        }else if(result.length > 0){

            //console.log(result[0]._id);
            criteria.l_city = result[0]._id;
            //console.log(criteria);
            table_name.find(criteria,projection,options, function(err,cities){ ////console.log("criteria_err",err);
                if(err) {
                    //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
                    //console.log(err);
                    return callback(err);
                }
                return callback(null,cities);
                ////console.log(result);
                //return callback(null,result);
            }).limit(limitValue);

        }else{
          //console.log("No data Found");
        }
      //  //console.log(result);
        //return callback(null,result);
    });
};
//GET RECENT 4
var getRecentLoopNEW = function (criteria,projection,options, callback) {
    var limitValue = 6;
    //console.log("REACHINg HRE LOOP");
    ////console.log(criteria);
    table_name.aggregate([
          {
            $group: {

                _id: '$l_city',
                count: { $sum: 1 }

              }
        },
        {
          $sort : { "count": -1 }
        }
    ],function (err, result) {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            //console.log(err);
            return callback(err);
        }else if(result.length > 0){

            //console.log(result[0]._id);
            criteria.l_city = result[0]._id;
            //console.log(criteria);
            table_name.find(criteria,projection,options, function(err,cities){ ////console.log("criteria_err",err);
                if(err) {
                    //if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
                    //console.log(err);
                    return callback(err);
                }
                return callback(null,cities);
                ////console.log(result);
                //return callback(null,result);
            }).limit(limitValue);

        }else{
          //console.log("No data Found");
        }
      //  //console.log(result);
        //return callback(null,result);
    });
};

// Remove Outdated properties
var deleteOutdatedProperties = function (criteria, callback) {  //{ _id: req.body.id }
    // //console.log("CRITERIAAAAAAAAAAAAAAAAAAAAA",criteria);
    // var criteria = {
    //  l_listingid : 262344792
    // }
    table_name.remove(criteria, function(err,data) {
        if (err) return callback(err);
        // //console.log("DELETED",data);
        return callback();
    });
}


var getMLSData = function (criteria,callback) {
    table_name.find().distinct('l_displayid').exec( function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            //console.log(err);
            if(err.name=="CastError") return callback(responses.INVALID_PROPERTY_ID);
            return callback(err);
        }
        // //console.log("From GET DATA API",err,result);
        return callback(null,result);
    });
};
module.exports = {
    getData             : getData,
    InsertData          : InsertData,
    updateData          : updateData,
    getDistinctData     : getDistinctData,
    deleteRecord        : deleteRecord,
    getPropertiesCount  : getPropertiesCount,
    getRelatedProperties: getRelatedProperties,
    getRecentProperties : getRecentProperties,
    getRecent           : getRecent,
    getRecentLoop       : getRecentLoop,
    getRecentLoopNEW    : getRecentLoopNEW,
    getDwellingCount    : getDwellingCount,
    getCountOnTwoParams : getCountOnTwoParams,
    deleteOutdatedProperties : deleteOutdatedProperties,
    getData_test        : getData_test,
    getMLSData          : getMLSData,
    getDataSchools      : getDataSchools,
    getDataCount        : getDataCount,
    getData_limit       : getData_limit

};
