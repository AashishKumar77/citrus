'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.category;
//var table_name_new = Models.contactInfoListing;

var addCategory = function (objToSave, callback) {
   //console.log('In Add Category Service');
   new table_name(objToSave).save(function(err,result){
       if(err) {
           //console.log(err);
           //if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.TESTIMONIAL_ALREADY_EXIST);
           return callback(err);
       }
       return callback(null,result);
   });
};

var deleteCategory = function(criteria,objToSave,options, callback) {
  table_name.findOneAndUpdate(criteria, objToSave, options, function(err,result){
      if(err) {
          // if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
          return callback(err);
      }
      return callback(null,result);
  });
};

var getCategory = function (criteria,callback) {

   table_name.find(criteria, (err, data) => {
       if(err) {
           return callback(err);
       }
       return callback(null,data);
   });
};


module.exports = {
   addCategory                     : addCategory,
   deleteCategory                  : deleteCategory,
   getCategory                     : getCategory
};
