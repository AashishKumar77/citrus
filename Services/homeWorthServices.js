'use strict';
var UniversalFunctions = require('../Utils/');
const Utils = require('../Utils');
// const Util s = require('../Utils');
const Configs = require('../Configs');
var APP_CONSTANTS = Configs.CONSTS;
var responses   =  require('../Utils/responses'); //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.CONTACTFORM;
var table_name_new = Models.homeWorth;
var newT = Models.users;
var propertyRites = Models.REST_PROPERY_RD_1

var addHomeWorth = function (objToSave, callback) {
   //console.log('In Add Home Worth Service');
   new table_name(objToSave).save(function(err,result){
       if(err) {
           //console.log(err);
           return callback(err);
       }
       return callback(null,result);
   });
};
var updateHomeWorth = function (criteria,objToSave,options, callback) {
   //console.log('In Add Home Worth Service');
   table_name_new.findOneAndUpdate(criteria, objToSave, options, function(err,data){
           if(err) {
               if(err.name=="CastError") return callback(err);
               return callback(err);
           }
           return callback(null,data);
   });
};

var checkId = function (userId, callback) {    
    var criteria = {
        siteId : userId
    }    
    table_name_new.find(criteria, (err, data) => {
            if(err) {
                if(err.name=="CastError") 
                {
                    return callback(responses.INVALID_POST_ID);
                }
                
            }
            return callback(null,data);
    });
};


var addHomeWorthFunnel = function (objToSave, callback) {
   //console.log('In Add Home Worth Service');
   new table_name_new(objToSave).save(function(err,result){
       if(err) {
           //console.log(err);
           //if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.TESTIMONIAL_ALREADY_EXIST);
           return callback(err);
       }
       return callback(null,result);
   });
};

var updateHomeWorthFunnel = function (criteria,objToSave,options, callback) {
    //console.log('In update Terms Service');
    //console.log("criteria",criteria);
    table_name_new.findOneAndUpdate(criteria, objToSave, options, function(err,data){
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,data);
    });
};

var getHomeWorthFunnel = function (criteria, callback) {
    //console.log('In get Terms');
    table_name_new.findOne(criteria, (err, result) => {
            if(err) {
                if(err.name=="CastError") return callback(err);
                return callback(err);
            }
            return callback(null,result);
    }).populate('funnelId');
};

var assignHomeWorthLead = function (newLead, callback){
    //console.log(newLead,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    var criteria = {
        siteId : newLead.siteId
    }
    // //console.log("New Lead",newLead._id);
    table_name_new.findOne(criteria, (err, result) => {
        if(err){
            // return callback(err);
            //console.log("Error",err);
        }else if(result){
            //console.log("+++++++++++Rsult of query 1++++++++++++++++++++++++");
            //console.log("Result",result);
            //console.log("Home Worth Agents : ",result.homeWorthAgents);
            //console.log("+++++++++++Rsult of query 1++++++++++++++++++++++++");
            var length = result.homeWorthAgents.length;
            var criteria_1 = {};
            var assignToAgent;
            table_name.find({}).exec((err, lastAssignedLead) => {
                if(err){
                    //console.log("Error",err);
                }else if(lastAssignedLead.length > 0){
                  // //console.log(4);
                  var le = lastAssignedLead.length;
                  // //console.log("++++++++++++++++++++++++++++++");
                  // //console.log("LEAD assigned Details");
                  // //console.log(lastAssignedLead);
                  // //console.log("+++++++++++++++++++++++++++++");
                  var ind = le - 1;
                  var indexId = lastAssignedLead[ind].assignedTo;
                  //console.log("IndexId",indexId);
                  // var arr = [];
                  // arr.concat(result.homeWorthAgents);
                  // //console.log("arr",arr);
                  var arrayIndex = result.homeWorthAgents.indexOf(indexId);
                  // //console.log("array Index",arrayIndex);
                  // //console.log(length);
                  if(arrayIndex > -1 ){
                      if( arrayIndex < length-1 ){
                            // //console.log(3);
                            var val = arrayIndex + 1;
                            //console.log("val",val);
                            assignToAgent = result.homeWorthAgents[val];
                            // //console.log("In Loop 3");
                            // //console.log(assignToAgent);
                      }else{
                          //console.log(2);
                          assignToAgent = result.homeWorthAgents[0];
                      }
                  }else{
                      //console.log(1);
                      assignToAgent = result.homeWorthAgents[0];
                  }

                  // //console.log("+++++++++++++++++++++++++++++++++++++++++");
                  // //console.log(assignToAgent);
                  var criteria = {
                      _id : newLead._id
                  }
                  // var objToSave = {
                  //   newassignedTo : assignToAgent
                  // }
                  newLead.assignedTo = assignToAgent
                  //console.log({l_address:newLead.address},"{l_address:newLead.address}")
                  Models.REST_PROPERY_RD_1.findOne({l_address:newLead.address},function(err,resRites){
                     
                     var isListed; 
                    if(resRites){
                        isListed = true;
                     }else{
                        isListed = false;
                     }
                 if(newLead.userId){
                     //console.log('in if condition')
                     newLead.isListed = isListed;
                    new table_name(newLead).save(function(err,result){
                        if(err){
                          //console.log(err);
                        }else{
                            //   return callback(null,result);
                            newT.findOne({_id:newLead.userId},function(err,leadresult){
                                // //console.log(result,"oooooooooooooooooooooooooooo")
                                if(leadresult){
                                    if(leadresult.propertiesId.length == 0){
                                        var myquery =  {_id:newLead.userId}
                                        // //console.log(myquery)
                                        var myvalues = {$set: { propertiesId:[result._id] }}
                                        // //console.log(myvalues)
                                        newT.updateMany(myquery,myvalues,function(err,res){
                                            if(err){
                                               //console.log(err);
                                            }else{
                                               return callback(null,res);
                                            }
                                        })
                                    } else{
                                        //console.log('push the values in  properties id ')
                                         var myquery =  {_id:newLead.userId}
                                         var myvalues = {$push: { propertiesId:result._id }}
                                         newT.updateMany(myquery,myvalues,function(err,res){
                                             if(err){
                                                //console.log(err);
                                             }else{
                                                return callback(null,res);
                                             }
                                         })
                                    }     
                                                                   
                                }else{
                                    //console.log(err ,"error in new table");
                                }
                            }) 

                        }
                    });
                     
                 }else{
                //   //console.log(newLead,"pppppppppppppppppppppppppppppppppppppppppp====================")
                  newLead.isListed = isListed;
                  //console.log(newLead,"lllllllllllllllllllllllllllll")
                  new table_name(newLead).save(function(err,result){
                      if(err){
                        //console.log(err);
                      }else{
                            return callback(null,result);
                      }
                  });
                }
            })
                  // table_name.findOneAndUpdate(criteria, objToSave,{new:true},function(err,data){
                  //     if(err){
                  //       //console.log("Err",err);
                  //     }else if(data){
                  //       //console.log("Data",data);
                  //     }else{
                  //       //console.log("Something went Wrong and lead is not Assigned");
                  //     }
                  //
                  // });
                  // //console.log("+++++++++++++++++++++++++++++++++++++++++");


                }else {
                  // var objToSave = {
                  //   assignedTo : result.homeWorthAgents[0]
                  // }
                  newLead.assignedTo = result.homeWorthAgents[0];
                  //console.log(newLead,"else casepppppppppppppppppppppppppppppppppppppppppp====================")

                  new table_name(newLead).save(function(err,result){
                      if(err){
                        //console.log(err);
                      }else{
                            return callback(null,result);
                      }
                  });
                  // table_name.findOneAndUpdate(criteria, objToSave,{new:true},function(err,data){
                  //     if(err){
                  //       //console.log("Err",err);
                  //     }else if(data){
                  //       //console.log("Data",data);
                  //     }else{
                  //       //console.log("Something went Wrong and lead is not Assigned");
                  //     }
                  // });
                  //console.log("+++++++++++++++++++++++++++++++++++++++++");
                  // //console.log("No details found");
                }
            });
        }else{
            //console.log("No Criteria Found to assign lead");
        }

    });
}



// var deleteCategory = function(criteria,objToSave,options, callback) {
//   table_name.findOneAndUpdate(criteria, objToSave, options, function(err,result){
//       if(err) {
//           // if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
//           return callback(err);
//       }
//       return callback(null,result);
//   });
// };
//
var sendEmail = function (criteria,callback) {

   newT.findOne(criteria, (err, data) => {
       if(err) {
           //if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
           return callback(err);
       }
       ////console.log(todo);
       return callback(null,data);
   });
};


module.exports = {
   checkId                          : checkId,
   addHomeWorth                     : addHomeWorth,
   addHomeWorthFunnel               : addHomeWorthFunnel,
   updateHomeWorthFunnel            : updateHomeWorthFunnel,
   getHomeWorthFunnel               : getHomeWorthFunnel,
   assignHomeWorthLead              : assignHomeWorthLead,
   sendEmail                        : sendEmail,
   updateHomeWorth                  : updateHomeWorth
};
