'use strict';
var UniversalFunctions = require('../Utils/');
var responses   =  require('../Utils/responses') //UniversalFunctions.responses;
var Models = require('../Models');
var table_name = Models.users;
var table_name_new = Models.displayAgents;

//Get Users from DB

var getUser = function (criteria, projection, options, callback){

  Models.users.find(criteria, projection, options, function(err,result){
      if(err) {
          if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
          return callback(err);
      }

      return callback(null,result);
    });
};

//Insert User in DB
var createUser = function (objToSave, callback) {
    objToSave.passwordLastUpdated = Date.now();
    //console.log("_________________________________________________________________");
    //console.log(objToSave);
    //console.log("_________________________________________________________________");
    new table_name(objToSave).save(function(err,result){
        if(err) { ////console.log("==========createUser==============",err);
            //if (err.code == 11000 && err.message.indexOf('email_1') > -1) return  callback(responses.EMAIL_ALREADY_EXIST);
            //console.log(err);
            if (err.code == 11000 && err.message.indexOf('email_1_siteId_1') > -1) return  callback(responses.EMAIL_ALREADY_EXIST);
            if (err.code == 11000 && err.message.indexOf('licenseNumber_1') > -1) return  callback(responses.LICENSE_NUMBER_ALREADY_EXIST);
            if (err.code == 11000 && err.message.indexOf('facebookId_1') > -1) return  callback(responses.FACEBOOK_ID_EXIST);
            if (err.code == 11000 && err.message.indexOf('linkedinId_1') > -1) return  callback(responses.LINKEDINID_ID_EXIST);
            //if (err.code == 11000 && err.message.indexOf('socialId_1') > -1) return  callback(responses.SOCIAL_ID_ALREADY_EXIST);
            return callback(err);
        }
        //console.log(result,"==========createUser==============")
        return callback(null,result);
    })
};

//Update User in DB ============================================
var updateUser = function (criteria, dataToSet, options, callback) { //console.log("here+++++++xxxx++++",criteria,dataToSet);
  console.log(criteria,dataToSet,"dataToSetdataToSetdataToSetdataToSet")
    table_name.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) { //console.log("==========updateUser===========",err);
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            if (err.code == 11000 && err.message.indexOf('email_1') > -1) return  callback(responses.EMAIL_ALREADY_EXIST);
            if (err.code == 11000 && err.message.indexOf('licenseNumber_1') > -1) return  callback(responses.LICENSE_NUMBER_ALREADY_EXIST);
            if (err.code == 11000 && err.message.indexOf('facebookId_1') > -1) return  callback(responses.FACEBOOK_ID_EXIST);
            if (err.code ==11000 && err.message.indexOf('linkedinId_1') > -1) return  callback(responses.LINKEDINID_ID_EXIST);
            //if (err.code == 11000 && err.message.indexOf('socialId_1') > -1) return  callback(responses.SOCIAL_ID_ALREADY_EXIST);
            return callback(err);
        }
        console.log(result,"in model")
        return callback(null,result);
    });
};

var updateContactUser = function (criteria, dataToSet, options, callback) { //console.log("here+++++++xxxx++++",criteria,dataToSet);
//console.log(dataToSet,"dataToSetdataToSetdataToSetdataToSet",criteria)
  Models.CONTACTFORM.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
      if(err) { //console.log("==========updateUser===========",err);
          if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
          if (err.code == 11000 && err.message.indexOf('email_1') > -1) return  callback(responses.EMAIL_ALREADY_EXIST);
          if (err.code == 11000 && err.message.indexOf('licenseNumber_1') > -1) return  callback(responses.LICENSE_NUMBER_ALREADY_EXIST);
          if (err.code == 11000 && err.message.indexOf('facebookId_1') > -1) return  callback(responses.FACEBOOK_ID_EXIST);
          if (err.code ==11000 && err.message.indexOf('linkedinId_1') > -1) return  callback(responses.LINKEDINID_ID_EXIST);
          //if (err.code == 11000 && err.message.indexOf('socialId_1') > -1) return  callback(responses.SOCIAL_ID_ALREADY_EXIST);
          return callback(err);
      }
      //console.log(result,"oooooiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiooooooooooooooooooooo")
      return callback(null,result);
  });
};





var getAgents = function (criteria, projection, options,skip,limit, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            //console.log(err);
            return callback(err);
        }

        return callback(null,result);
    }).skip(skip).limit(limit);
};

var getAgentsNew = function (criteria, projection, options,skip,limit, callback) {
    table_name_new.findOne(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    }).populate('agentsOrder','email firstName lastName phone profile_pic userType userAutoIncrement slug');
};

var getAgentsNews = function (criteria, projection, options,skip,limit, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    }).populate('agentsOrder','email firstName lastName phone profile_pic userType userAutoIncrement slug');
};

var getAgentsWithoutOrder = function (criteria,projection, options, callback) {
    table_name.find(criteria,projection, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            //console.log(err);
            return callback(err);
        }
        return callback(null,result);
    });
};

//Delete Seller
var deleteData = function (criteria, callback) {
    table_name.findOneAndRemove(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            // if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }
        return callback(null,result);
    });
};



//Agents Orders API
var createDisplayAgent = function (objToSave, callback) {
    //console.log("_________________________________________________________________");
    //console.log(objToSave);
    //console.log("_________________________________________________________________");
    new table_name_new(objToSave).save(function(err,result){
        if(err) { ////console.log("==========createUser==============",err);
            return callback(err);
        }
        return callback(null,result);
    })
};

//Update User in DB
var updateDisplayAgent = function (criteria, dataToSet, options, callback) { ////console.log("here+++++++xxxx++++",criteria,dataToSet);
    table_name_new.findOneAndUpdate(criteria, dataToSet, options, function(err,result){
        if(err) { ////console.log("==========updateUser===========",err);
            return callback(err);
        }
        return callback(null,result);
    });
};

//Check Whether email already exists or not
var checkDisplayAgent = function (criteria, callback) {
    table_name_new.findOne(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }

        return callback(null,result);
    });
};

// Assign Leads to Buyer Automatically
var assignBuyerLead = function (newBuyer, callback){
  // //console.log(newBuyer);
  var criteria_1 = {
      "siteId" : newBuyer.siteId,
      "userType" : "Agent"
  }
  var assignedTo;
  table_name.find(criteria_1).distinct('_id', function(err1, ids) {
      if(err1){
        return callback(err);
      }else if(ids.length > 0){
        var id_s = [];
        ids.forEach(function(element) {
          id_s.push(element.toString())
        });
          //Getting all the previously assigned Buyers
          //console.log("+++++++++++++++++++++++++++++++");
          //console.log("++++++++++++++++++++++++++++++++");
          var criteria_2 = {
            "siteId" : newBuyer.siteId,
            "userType" : "Buyer"
          }
          table_name.find(criteria_2,function(err2, buyers){
              if(err2){
                  return callback(err);
              }else if(buyers.length > 0 ){
                  //console.log("Buyers Length :: ",buyers.length);
                  var newLength = (buyers.length) - 2
                  var lastAssigned = buyers[newLength].assignedTo;
                  // //console.log("IDS",id_s);
                  // //console.log("lastAssigned :",lastAssigned);
                  // //console.log(typeof lastAssigned);
                  // //console.log(typeof ids);
                  if(lastAssigned){


                  // //console.log("Array Index",ids.indexOf(lastAssigned));

                  var arrayIndex = id_s.indexOf(lastAssigned.toString());
                  if(arrayIndex > -1 ){
                      if( arrayIndex < (id_s.length)-1 ){
                            //console.log(3);
                            var val = arrayIndex + 1;
                            //console.log("val",val);
                            assignedTo = ids[val];
                            //Updating DB
                            var criteria_3 = {
                                email : newBuyer.email
                            }
                            var dataToSet = {
                                assignedTo:assignedTo
                            }
                            table_name.findOneAndUpdate(criteria_3, dataToSet, {new : true}, function(err,result){
                                if(err) {
                                      return callback(err);
                                }
                                return callback(null,result);
                            });
                      }else{
                        //console.log(2);
                          assignedTo = ids[0];
                          //Updating DB
                          var criteria_3 = {
                              email : newBuyer.email
                          }
                          var dataToSet = {
                              assignedTo:assignedTo
                          }
                          table_name.findOneAndUpdate(criteria_3, dataToSet, {new : true}, function(err,result){
                              if(err) {
                                    return callback(err);
                              }
                              return callback(null,result);
                          });
                      }
                    }else{
                      //console.log(1);
                      assignedTo = ids[0];
                      //Updating DB
                      var criteria_3 = {
                          email : newBuyer.email
                      }
                      var dataToSet = {
                          assignedTo:assignedTo
                      }
                      table_name.findOneAndUpdate(criteria_3, dataToSet, {new : true}, function(err,result){
                          if(err) {
                                return callback(err);
                          }
                          return callback(null,result);
                      });
                    }
                  }else{
                      //console.log(1);
                      assignedTo = ids[0];
                      //Updating DB
                      var criteria_3 = {
                          email : newBuyer.email
                      }
                      var dataToSet = {
                          assignedTo:assignedTo
                      }
                      table_name.findOneAndUpdate(criteria_3, dataToSet, {new : true}, function(err,result){
                          if(err) {
                                return callback(err);
                          }
                          return callback(null,result);
                      });
                  }


              }else{
                  return callback("No Buyers Found");
              }
          });
      }else{
        //console.log("No Agents Found");
        return callback();
      }
  });
}


//Check Whether email already exists or not
var checkEmail = function (criteria, callback) {
    table_name.findOne(criteria, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            return callback(err);
        }

        return callback(null,result);
    });
};

var getSiteAgents = function (criteria, projection, options,skip,limit, callback) {
    table_name.find(criteria, projection, options, function(err,result){ ////console.log("criteria_err",err);
        if(err) {
            if(err.name=="CastError") return callback(responses.INVALID_USER_ID);
            //console.log(err);
            return callback(err);
        }

        return callback(null,result);
    }).skip(skip).limit(limit);
};


module.exports = {
    updateContactUser:updateContactUser,
    getUser     : getUser,
    createUser  : createUser,
    updateUser  : updateUser,
    getAgents   : getAgents,
    deleteData  : deleteData,
    assignBuyerLead   : assignBuyerLead,
    checkEmail  : checkEmail,
    createDisplayAgent : createDisplayAgent,
    updateDisplayAgent : updateDisplayAgent,
    checkDisplayAgent : checkDisplayAgent,
    getAgentsNew  : getAgentsNew,
    getAgentsNews:getAgentsNews,
    getAgentsWithoutOrder : getAgentsWithoutOrder
};
