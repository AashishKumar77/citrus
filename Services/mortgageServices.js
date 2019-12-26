'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.mortgage;
var table_n = Models.city;

var getCity = function (callback) {
   table_n.find({}, (err, data) => {
       if(err) {
           return callback(err);
       }
       return callback(null,data);
   });
};

var addMortgage = function (objToSave, callback) {
   //console.log('In Add Category Service');
   new table_name(objToSave).save(function(err,result){
       if(err) {
           //console.log(err);
           return callback(err);
       }
       return callback(null,result);
   });
};

var deleteMortgage = function(criteria, callback) {
  table_name.findByIdAndRemove(criteria, function(err,result){
      if(err) {
          // if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
          return callback(err);
      }
      return callback(null,result);
  });
};

var getMortgage = function (criteria,callback) {

   table_name.find(criteria, (err, data) => {
       if(err) {
           //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
           return callback(err);
       }
       ////console.log(todo);
       return callback(null,data);
   });
};
var getRate = function (criteria,callback) {

   table_name.findOne(criteria, (err, data) => {
       if(err) {
           return callback(err);
       }
       return callback(null,data);
   });
};


var editMortgage = function (criteria,objToSave,options, callback) {
    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

module.exports = {
   // updateInfo                   : updateInfo,
   // getInfo                      : getInfo,
   addMortgage                     : addMortgage,
   deleteMortgage                  : deleteMortgage,
   getMortgage                     : getMortgage,
   getRate                     : getRate,
   editMortgage                    : editMortgage,
   getCity                         : getCity
   // getCategory                     : getCategory
   // checkId                      : checkId

};
