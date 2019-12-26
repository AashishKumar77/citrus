'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.MARK_FAVORITE; ////console.log("x",table_name)

var getData = function (criteria, projection, options, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
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
var getFavs = function (criteria,callback) {
    table_name.find(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            // if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

var getFavDetails = function (criteria,callback) {
    table_name.find(criteria).populate('PropertyId','_id propertyAutoIncrement lo1_organizationname lo1_shortname la3_phonenumber1 la1_loginname lm_dec_16 lm_dec_11 lm_char1_36 lm_dec_7 lm_int4_2 lm_int2_3 lm_int1_19 lm_int1_4 lm_char10_12 lm_char10_11 l_pricepersqft l_streetdesignationid l_addressunit l_displayid l_remarks l_zip l_state l_city l_addressstreet l_addressnumber l_askingprice l_area l_listingid images_count lr_remarks22 location isDeleted newAddress IsFavorited').lean().exec(function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            // if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

module.exports = {
    getData     : getData,
    InsertData  : InsertData,
    updateData  : updateData,
    delteRecord : delteRecord,
    getFavs     :getFavs,
    getFavDetails : getFavDetails
};
