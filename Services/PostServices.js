'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.POST;
var new_table = Models.postComments;

//Get Users from DB

var getData = function (criteria, projection, options, callback) {
    //console.log("criteria_err",criteria);
    table_name.find(criteria, projection, options, function(err,result){
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,result);
    }).populate('category');
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

var addComments = function (objToSave, callback) { 
    new new_table(objToSave).save(function(err,result){
        if(err) {
            return callback(err);
        }

        //console.log('comment added ',result );

        return callback(null,result);
    });
};

var getComments = function (criteria,callback) {
    new_table.find(criteria, (err, data) => {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        return callback(null,data);
    }).skip().limit();
};

var deleteComments = function (criteria, callback) {
    new_table.findOneAndRemove(criteria, (err, todo) => {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,todo);
    });
};

var validateComment = function (criteria,objToSave,options, callback) {
    //console.log("Reaching here");
    //console.log('In Validate Comment');
    var value = {
        isVisible : objToSave.isVisible
    }
    new_table.findOneAndUpdate(criteria, value, options, function(err,result){
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        // //console.log(result);
        // //console.log("+++++++++++++++++++++++++++++++++++++++++")
        return callback(null,result);
    });
};

var deleteCommentsAdmin = function (criteria, callback) {
    new_table.findOneAndRemove(criteria, (err, todo) => {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        return callback(null,todo);
    });
};

var getCommentsAdmin = function (criteria,callback) {
    new_table.find(criteria, (err, data) => {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        return callback(null,data);
    }).skip().limit();
};

var getCommentsCount = function (criteria,callback) {
    new_table.find(criteria, (err, data) => {
        if(err) {
            //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
            return callback(err);
        }
        ////console.log(todo);
        if(data){
          var count = data.length;
          return callback(null,count);
        }else{
          var count = 0;
          return callback(null,count);
        }

    }).skip().limit();
};


module.exports = {
    getData     :  getData,
    InsertData  :  InsertData,
    updateData  :  updateData,
    addComments :  addComments,
    getComments :  getComments,
    deleteComments : deleteComments,
    validateComment:validateComment,
    deleteCommentsAdmin : deleteCommentsAdmin,
    getCommentsAdmin : getCommentsAdmin,
    getCommentsCount  : getCommentsCount
};
