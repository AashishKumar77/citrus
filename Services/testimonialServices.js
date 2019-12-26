'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.TESTIMONIALS;

var getTestimonials = function (criteria,callback) {
    table_name.find(criteria, (err, data) => {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        //console.log(data);
        if(data.length > 0){
          ////console.log("124233",data);
          var value = {
                statusCode: 200,
                status: "success",
                data: data
          }

          return callback(null,value);
        }else{
          ////console.log("55555555555555555555555555",data);
          var value = {
                statusCode: 401,
                status: "warning",
                message: 'Testimonials Not Found'
          }
          return callback(null,value);
        }

    }).skip().limit().sort({createdAt:-1})
};

var insertTestimonial = function (objToSave, callback) {
    //console.log('In insert testimonial');
    new table_name(objToSave).save(function(err,result){
        if(err) {
            //console.log(err);
            if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.TESTIMONIAL_ALREADY_EXIST);
            return callback(err);
        }
        return callback(null,result);
    })
};

var updateTestimonial = function (criteria,objToSave,options, callback) {
    table_name.findOneAndUpdate(criteria, objToSave, options, function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};

var deleteTestimonial = function (idToDelete, callback) {
    table_name.findByIdAndRemove(idToDelete, (err, todo) => {
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,todo);
    });
};

module.exports = {
    insertTestimonial   : insertTestimonial,
    updateTestimonial   : updateTestimonial,
    deleteTestimonial   : deleteTestimonial,
    getTestimonials     : getTestimonials
};
