/*--------------------------------------------
 * Include internal modules.
 ---------------------------------------------*/

const Models = require('../Models');
const Shedule = require('../Models/schedule');
const Utils = require('../Utils');
const Configs = require('../Configs');
var APP_CONSTANTS = Configs.CONSTS;
const env = require('../env');
const logger = Utils.logger;
const STATUS_MSG = Utils.responses.STATUS_MSG.SUCCESS //Configs.app.STATUS_MSG.SUCCESS;
var Responses = Utils.responses
var Service = require("../Services");
var USER_TYPE = APP_CONSTANTS.USER_TYPE;
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;
const DBCommonFunction = Utils.DBCommonFunction;
const paymentController = require("./paymentController");
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
const PAYMENT_CONTROLLER = require("./paymentController");
var arraySort = require('array-sort');
/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
const async = require('async');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const moment = require('moment');
const Mongoose = require('mongoose');
var mongoose = require('mongoose');
var Path = require('path');

var t_name = Models.REST_PROPERY_RD_1;

var registerUser = function (payloadData, userData, CallbackRoute) {

    //console.log("In payload data ",payloadData);
    //console.log("In User data ",userData);
    //console.log('user Role',payloadData.userType);
    // payloadData.passwordLastUpdated = new Date;
    var returnedData, token, verificationToken, registerSocialId;
    var RunQuery = "Insert", socialIdExits = false, isEmailUpdate = false;
    var ContactId =null;
    var stripeCustomerId;
    var cardTokenId,planData;
    async.auto({
        verifyEmailAddress: [(cb)=> {
            if (!Utils.universalfunctions.verifyEmailFormat(payloadData.email)) return cb(Responses.INVALID_EMAIL);
            return cb();
        }],
        createUser: ['verifyEmailAddress', (r2, Incb)=> {
            if (RunQuery == "Insert") {
                var dataToSet = payloadData;
                if (payloadData.isEmailVerify) {
                    dataToSet.isEmailVerified = true;
                }
                if (payloadData.socialMode) {
                    dataToSet.socialMode = payloadData.socialMode
                }
                if (payloadData.password) {
                    var password = Utils.universalfunctions.encryptpassword(payloadData.password);  //UniversalFunctions.CryptData(res + res1);
                    dataToSet.password = password;
                }
                if(!payloadData.name){
                    var temp = payloadData.email.split('@');
                    dataToSet.name = temp[0];
                }
                if (payloadData.firstName) {
                    dataToSet.first = payloadData.firstName.toLowerCase();
                    dataToSet.firstName = payloadData.firstName.toLowerCase();
                }
                if (payloadData.lastName) {
                    dataToSet.last = payloadData.lastName.toLowerCase();
                    dataToSet.lastName = payloadData.lastName.toLowerCase();
                }
                dataToSet.customer_id = stripeCustomerId
                Service.UserService.createUser(dataToSet, (err, data)=> { ////console.log("===errerrerr===", err)
                    if (err)  return Incb(err);
                    returnedData = data;
                    return Incb();
                });
            } else {
                return Incb();
            }
        }],
        checkUserExistORNot:[(cb)=> {
            var criteria ={
                email:payloadData.email
            }
            var projection= {
                _id:1,
            }
            var options = {
                lean:true
            }
            Service.ContactFormService.getData(criteria, projection, options,(err, data)=> {
                if (err)  return cb(err);
                if(data.length){
                    ContactId= data[0]._id
                }
                return cb();
            });
        }],
        InsertIntoContactForm:['checkUserExistORNot','createUser',(r5, cb)=> { //console.log("InsertIntoContactForm ==init",ContactId);
            if(ContactId==null){ //console.log("InsertIntoContactForm ==init==if");
                var dataToSet ={
                    userId:returnedData._id,
                    firstName:returnedData.firstName,
                    lastName:returnedData.lastName,
                    email:returnedData.email,
                    userType : "Non-Member"
                }
                Service.ContactFormService.InsertData(dataToSet, (err, data)=> {
                    if (err)  return cb(err);
                    return cb();
                });
            }else{ //console.log("InsertIntoContactForm ==init==else");
                 return cb();
            }
        }],
        UpdateUserIdInContact:['checkUserExistORNot','createUser',(r5, cb)=> { //console.log("UpdateUserIdInContact ==init");
            if(ContactId!=null){ //console.log("UpdateUserIdInContact ==init==if");
                var criteria = {
                    _id:ContactId,
                    email:returnedData.email
                }
                var dataToSet ={
                    userId:returnedData._id,
                    firstName:returnedData.firstName,
                    lastName:returnedData.lastName,
                    email:returnedData.email,
                    userType : "Member"
                }
                Service.ContactFormService.updateData(criteria, dataToSet, {}, (err, data)=> {
                    if (err)  return cb(err);
                    return cb();
                });
            }else{ //console.log("UpdateUserIdInContact ==init==else");
                 return cb();
            }
        }],
        generateEmailVerifyToken: ['createUser', (r6, cb)=> {
            //console.log("generateEmailVerifyToken");
            // verificationToken = Utils.universalfunctions.generateRandomString(10) + returnedData.email + moment().valueOf() + returnedData._id;
            // verificationToken = Utils.universalfunctions.encryptpassword(verificationToken);
            verificationToken = jwt.sign({ //generating email verification token
                    email: returnedData.email
                },
                Configs.CONSTS.jwtkey, {algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '24h'} //setting expiry of 3 days
            );
            return cb();
        }],
        setAccesToken: [ 'generateEmailVerifyToken', (r6, cb)=> { ////console.log("updateUser init")
            var setCriteria = {email: returnedData.email};
            token = jwt.sign({
                    id: returnedData._id,
                    email: returnedData.email,
                    isEmailVerified : returnedData.isEmailVerified
                },
                Configs.CONSTS.jwtkey, {
                    algorithm: Configs.CONSTS.jwtAlgo,
                    //expiresIn: '2 days'
                }
            );

            var setQuery = {
                updatedAt: new Date(),
                accessToken: token,
                emailVerificationToken: verificationToken
            };////console.log("setQuery", RunQuery, payloadData.facebookId, setQuery);
            Service.UserService.updateUser(setCriteria, setQuery, {}, (err, data)=> {
                if (err) return cb(err)
                returnedData = data;
                return cb(null, data);
            });
        }],
        getUserDataofRegisterUser: ['setAccesToken', (r4, cb)=> {
            var getCriteria = {
                email: payloadData.email,
                userType: payloadData.userType
            };
            Service.UserService.getUser(getCriteria, {password: 0}, {}, function (err, data) { ////console.log("data++++",getCriteria,data)
                if (err) return cb({errorMessage: 'DB Error: ' + err})
                if (data && data.length > 0 && data[0].email) {
                    returnedData = data[0];
                    return cb()
                } else {
                    return cb()
                }
            });
        }],
        sendverification: ['getUserDataofRegisterUser', (r1, cb)=> { // send verification email to user

            var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
            var fileReadStream = fs.createReadStream(templatepath + 'verify_email.html');

            var emailTemplate = '';
            fileReadStream.on('data', function (buffer) {
                emailTemplate += buffer.toString();
            });


            var criteria = {
                siteId: payloadData.siteId
            }
            Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                if(err){
                    // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                    //console.log("Coming from Error User verification email");
                    fileReadStream.on('end', function (res) {
                      var email_data = { // set email variables for user
                            to: Configs.CONSTS.DEVELOPER_EMAIL,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: 'Register User - Error sending Email (No Data Found)',
                            html: "An error occurred while registering the user with the following details: <br> <b> Name : "  + payloadData.firstName + " " + payloadData.lastName + "<br> <b>Email : </b>" + payloadData.email + "<br> <br> <strong>Internal DB error occured while Searching for theme details for the following agent: " + " " + payloadData.siteId + "<br><br> Thanks <br>"
                        };

                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Error Sending email because of internal db error."
                            })
                        });
                    })
                }else if(result.length > 0){
                  fileReadStream.on('end', function (res) {
                      var path = result[0].siteUrl + '/#/email/verification/' + payloadData.email + '/' + verificationToken;
                      // //console.log("result[0].logoUrl",result[0].logoUrl);

                      var imagePath = 'http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=' + result[0].logoUrl
                      var sendStr = emailTemplate.replace('{{path}}', path).replace('{{siteName}}',result[0].siteName).replace('{{imagePath}}', imagePath).replace('{{signature}}', result[0].signature).replace('{{fb_link}}', result[0].facebookpageUrl).replace('{{site_link}}', result[0].siteUrl);

                      var email_data = {
                          to: payloadData.email,
                          from: result[0].fromName + '<' + result[0].fromEmail + '>',
                          subject: 'Welcome - ' + result[0].siteName,
                          html: sendStr
                      };

                      Utils.universalfunctions.send_email(email_data, (err, res)=> {
                          if (err){
                            //console.log("error")  
                            return cb(err)};
                          return cb(null, {
                              "statusCode": 200,
                              "status": "success",
                              "message": "Verification link sent to your email."
                          })
                      });
                  })
                }else{
                  //console.log("Coming from else loop of user verification");
                  // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl;
                  fileReadStream.on('end', function (res) {

                      var email_data = { // set email variables for user
                          to: Configs.CONSTS.DEVELOPER_EMAIL,
                          from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                          subject: 'Register User - Error sending Email (No Data Found)',
                          html: "An error occurred while registering the user with the following details: <br> <b> Name : " +  payloadData.firstName + " " + payloadData.lastName + "<br> <b>Email : </b>" + payloadData.email + "<br> <br> <strong>No data was found in the Website for the Agent with Id : " + " " + payloadData.siteId + "<br><br> Thanks <br>"
                      };
                      Utils.universalfunctions.send_email(email_data, (err, res)=> {
                          if (err)return cb(err);
                          return cb(null, {
                              "statusCode": 200,
                              "status": "success",
                              "message": "Error Sending Link. Admin will contact you soon."
                          })
                      });
                  })
                }
            });
            // Email From DB functionality implemented ends here
        }],
        AssignLeadToUserAutomatically: ['createUser','getUserDataofRegisterUser', (r5, cb)=> {
            Service.UserService.assignBuyerLead(payloadData, ( err, leadDetails )=> {
                  if (err) return cb(err);
                  return cb();
            })
        }],
      }, (err, result)=> {
        if (err) return CallbackRoute(err);
        return CallbackRoute(null, {

            message : "Registered Successfully",
            accessToken: returnedData.accessToken,
            userDetails: Utils.universalfunctions.deleteUnnecessaryUserData(returnedData)
        });
    });
}

var login = function (payloadData, userData, CallbackRoute) {
    var returnedData, token, verificationToken, registerSocialId, IsFirstLogin = true;
    var RunQuery = "Insert";
    var countOfVisitingWebsite=1;
    async.auto({
        verifyEmailAddress: [(cb)=> {
            if (!Utils.universalfunctions.verifyEmailFormat(payloadData.email)) return cb(Responses.INVALID_EMAIL);
            return cb();
        }],
        getUserData: ['verifyEmailAddress', (r1, cb)=> { ////console.log("getUserData init", RunQuery)
            var conditionArray = [];
            var conditionArrayNew = {};
            var Criteria ={email: payloadData.email,siteId:payloadData.siteId};
            ////console.log("Criteria", Criteria);
            Service.UserService.getUser(Criteria, {}, {}, (err, data)=> { ////console.log("getUserData",err, data)
                if (err) return cb(err);
                if (data.length==0) return cb(Responses.USER_NOT_FOUND);
                if(data[0].isSuspended) return cb(Responses.YOUR_ACCOUNT_IS_BLOCK);
                if(data[0].isPasswordExpired === true){

                    token = jwt.sign({
                        id: data[0]._id,
                        email: data[0].email,
                        isEmailVerified : data[0].isEmailVerified
                    }, Configs.CONSTS.jwtkey, {algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '50 days'});
                    //console.log("token", token);

                    var value = {
                        "message" : "Your Password Expired ! Please change password to continue.",
                        "result" : {
                            "isPasswordExpired" : data[0].isPasswordExpired,
                            "email"   : data[0].email,
                            "siteId" : data[0].siteId,
                            "accessToken":token
                        },
                        "statusCode" : 200
                    }
                    return cb(value);
                }
                if(data[0].isEmailVerified==false) return cb(Responses.EMAIL_NOT_VERIFIED);

                //
                // if(data[0].isEmailVerified === false){
                //     var value = {
                //         "message" : "Please verfiy email first.",
                //         "result" : "",
                //         "statusCode" : 400
                //     }
                //     return cb(value);
                // }

                returnedData = data[0];
                var password = Utils.universalfunctions.encryptpassword(payloadData.password);
                if (password != returnedData.password) return cb(Responses.INVALID_EMAIL_PASSWORD);
                if(returnedData.countOfVisitingWebsite){
                    countOfVisitingWebsite = returnedData.countOfVisitingWebsite + 1
                }
                return cb();
            });
        }],
        setAccesToken: ['getUserData', (r3, cb)=> {
            //console.log("setAccesToken init")
            var setCriteria = {_id: returnedData._id};
            token = jwt.sign({
                id: returnedData._id,
                email: returnedData.email,
                isEmailVerified : returnedData.isEmailVerified
            }, Configs.CONSTS.jwtkey, {algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '50 days'});
            //console.log("token", token);
            var deviceDetail = {
                device_type: payloadData.device_type,
                device_token: payloadData.device_token,
            }
            var setQuery = {
                updatedAt: new Date(),
                IsFirstLogin: false,
                accessToken: token,
                deviceDetail: deviceDetail,
                lastVisitedDate:new Date().toISOString(),
                countOfVisitingWebsite:countOfVisitingWebsite
            };
            Service.UserService.updateUser(setCriteria, setQuery, {new: true}, (err, data)=> { ////console.log("err, data",err, data);
                if (err) return cb(err)
                returnedData = data;
                returnedData.IsFirstLogin = IsFirstLogin
                return cb(null, data);
            });
        }],
    }, (err, result)=> {
        if (err) return CallbackRoute(err);


        return CallbackRoute(null, {
            accessToken: returnedData.accessToken,
            userDetails: Utils.universalfunctions.deleteUnnecessaryUserData(returnedData)
        });
    });
}

var saveListing = function (payloadData, UserData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var isSaved=false;
    var markfavoriteId;
    var IsSavedlisting=true;
    async.auto({
        checkListingIsValidOrNot: [(cb)=> {//console.log("checkListingIsValidOrNot==init");
            var criteria = {
                _id:payloadData.PropertyId,
            };
            var options = {lean: true};
            Service.REST_PROPERY_RD_1_Service.getData(criteria, {}, options,function (err, result) {
                if (err) return cb(err);
                if(result.length==0) return cb(responses.INVALID_POST_ID);
                return cb();
            });
        }],
        checkListingSaveORNot:[(cb)=> { ////console.log("checkListingSaveORNot==init");
            var criteria = {
                PropertyId:payloadData.PropertyId,
                user:UserData._id
            }; ////console.log("dataToSave",dataToSave,Service);
            var options = {lean: true};
            Service.MY_LISTING_SERVICE.getData(criteria,{},options,function (err, result) { ////console.log("checkListingSaveORNot==result",result);
                if (err) return cb(err);
                if(result.length>0){
                    isSaved=true;
                    markfavoriteId = result[0]._id
                    IsSavedlisting = result[0].IsSavedlisting
                    if(IsSavedlisting==true){
                        IsSavedlisting=false
                    }else{
                        IsSavedlisting=true;
                    }
                }
                return cb();
            });
        }],
        saveListingInDB: ['checkListingSaveORNot','checkListingIsValidOrNot',(ag1,cb)=> { ////console.log("saveListingInDB==init");
            if(isSaved==false){
                var dataToSave = {
                    PropertyId:payloadData.PropertyId,
                    user:UserData._id
                }; ////console.log("dataToSave",dataToSave,Service);
                Service.MY_LISTING_SERVICE.InsertData(dataToSave,function (err, result) {
                    if (err) return cb(err);
                    markfavoriteId= result._id
                    return cb();
                });
            }else{
                return cb();
            }
        }],
        updateInDB: ['checkListingSaveORNot','checkListingIsValidOrNot',(ag1,cb)=> { //console.log("saveListingInDB==init",isSaved);
            if(isSaved==true){
                var dataToSet = {
                    PropertyId:payloadData.PropertyId,
                    user:UserData._id,
                    //IsFavorited:payloadData.IsFavorited
                    IsSavedlisting:IsSavedlisting,
                    updatedAt:new Date().toISOString()
                };
                var criteria= {
                    _id:Mongoose.Types.ObjectId(markfavoriteId),
                     user:Mongoose.Types.ObjectId(UserData._id),
                     PropertyId:Mongoose.Types.ObjectId(payloadData.PropertyId),
                };
                var options= {
                    new:true
                }
                Service.MY_LISTING_SERVICE.updateData(criteria, dataToSet, options,function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            }else{
                return cb();
            }
        }],
        updateUserData: ['saveListingInDB',(ag1,cb)=> { ////console.log("saveListingInDB==init");
            if(isSaved==false){
                 var criteria={
                 _id:UserData._id
                };
                var options={
                    lean:true
                };
                var dataToSet = {
                    $addToSet: {
                        //LookedPropertiesId:Mongoose.Types.ObjectI(PropertyId)
                        markfavoriteId:Mongoose.Types.ObjectId(markfavoriteId)
                    }
                }
                Service.UserService.updateUser(criteria,dataToSet,options,function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });

            }else{
               return cb();
            }
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute(null,{
            IsSavedlisting:IsSavedlisting,
        });
    });
};

var getsavedListing = function (payloadData,UserData,callbackRoute) {
    //console.log("getAllAreaList===init");
    //console.log(UserData._id)
        var criteria =   {
            user:UserData._id,
            IsSavedlisting : true
        };
        var totalRecord=0;
        var projection =  {__v:0,isDeleted:0}
        var finalData=[],finalData_new =[]
     async.auto({
        CountSavedListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {lean:true};
            var projection= {};
            Service.MY_LISTING_SERVICE.getData(criteria, {PropertyId:1,_id:0}, options,(err,data)=> {
                if (err)  return cb(err);
                totalRecord = data.length;
                data.forEach(function(u) { finalData.push(u.PropertyId) })
                //finalData.push(data[0].PropertyId)
                return cb();
            });
        }],

     },function(err,result){ //console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord:totalRecord,
            finalData:finalData,
        });
     })
}


var getsaveListing = function (payloadData,UserData,callbackRoute) {
    //console.log("getAllAreaList===init");
        var criteria =   {
             user:UserData._id,
             IsSavedlisting : true
        };
        var totalRecord=0;
        var projection =  {__v:0,isDeleted:0}
        var finalData=[],finalData_new =[]
     async.auto({
        getListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {
                skip:payloadData.skip,
                limit:payloadData.limit,
                lean:true,
                sort: {
                    createdAt:-1
                }
            }; //
            var projection= {};
            var populateModel = [
                {
                    path: "PropertyId",
                    match: {},
                    select: 'l_listingid l_displayid l_askingprice l_area l_addressnumber l_addressstreet l_address l_city l_state',
                    model: 'retspropertyrd_1',
                    options: {lean: true}
                }
            ];
            DBCommonFunction.getDataPopulateOneLevel(Models.MY_LISTING,criteria,projection,options,populateModel,(err,data)=> {
                if (err)  return cb(err);
                finalData = data
                return cb();
           });
        }],
        addAddressKey:['getListing',(ag1,cb)=>{
           finalData.forEach(function(element) {
               var tempData = element; //return cb(element);
               //console.log(tempData)
               if(element.PropertyId !== null){
                  if(element.PropertyId.l_addressnumber.length>0){
                    var newAddress =element.PropertyId.l_addressnumber+'-'+element.PropertyId.l_addressstreet+'-'+element.PropertyId.l_city+'-'+element.PropertyId.l_state;
                  }else{
                      var newAddress =element.PropertyId.l_addressstreet+'-'+element.PropertyId.l_city+'-'+element.PropertyId.l_state;
                  }
                }else{
                  return cb();
                }
               newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress," ","-");
               tempData.newAddress = newAddress.toLowerCase();
               finalData_new.push(tempData);
               //return cb(element);
           });
           return cb();
        }],
        CountSavedListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {lean:true};
            var projection= {};
            Service.MY_LISTING_SERVICE.getData(criteria, {__v:0,isDeleted:0}, options,(err,data)=> {
                if (err)  return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],

     },function(err,result){ //console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord:totalRecord,
            finalData:finalData_new,
        });
     })
}


var deleteListing = function (payloadData,UserData,callbackRoute) {
    //console.log("getAllAreaList===init");
     async.auto({
        getListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {};
            var dataToRemove = {_id:payloadData.saveListingId ,user:UserData._id}
           Service.MY_LISTING_SERVICE.delteRecord(dataToRemove,options,(err,data)=> {
                if (err)  return cb(err);
                finalData = data
                return cb();
           });
        }],

     },function(err,result){ //console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute();
     })
}

var ChangedPassword = function (payloadData, UserData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var token;
    async.auto({
        CheckOldPassword: [(cb)=> {//Check Old Password
            if (UserData.password != Utils.universalfunctions.encryptpassword(payloadData.oldPassword)) return cb(Responses.INCORRECT_OLD_PASS)
            if (UserData.password == Utils.universalfunctions.encryptpassword(payloadData.newPassword)) return cb(Responses.SAME_PASSWORD)
            return cb();
        }],
        UpdatePassword: ['CheckOldPassword', (r1, cb)=> {
            var criteria = {_id: UserData._id};
            var setQuery = {
                password: Utils.universalfunctions.encryptpassword(payloadData.newPassword)
            };
            var options = {lean: true};
            Service.UserService.updateUser(criteria, setQuery, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var forgotPassword = function (params, callback) { //console.log("Email is not registered with us.");
    var name;
    var token;
    var details = {};
    var criteria = {email: params.email}
    async.series([
        function (cb) {
            if (!Utils.universalfunctions.verifyEmailFormat(params.email)) return cb(Responses.INVALID_EMAIL);
            return cb();
        },
        function (cb) { //getUser
            Service.UserService.getUser(criteria, {email:1,siteId:1}, {lean:true}, function (err, res) {
                if (err) return cb(err);
                if (res.length == 0)return cb(Responses.EMAIL_ID_NOT_EXISTS);
                //if (res[0].linkedinId || res[0].facebookId || res[0].socialMode) return cb(Responses.YOU_ARE_REGISTERED_USING_SOCIAL_MEDIA)
                // //console.log(res);
                return cb();
            })
        },
        function (cb) { //forgotPasswordToken generate
            token = jwt.sign({
                    email: params.email
                },
                Configs.CONSTS.jwtkey, {algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '24h'}
            );
            var objToUpdate = {
                forgetpasswordVerifyToken: token
            };
            Service.UserService.updateUser(criteria, objToUpdate, {new: true}, function (err, res) {
                if (err) return cb(err);
                if (res == null) return cb(err ? Responses.systemError : Responses.EMAIL_ID_NOT_EXISTS);
                name = res.name;
                details = res;
                return cb();
            })
        },
        function (cb) {
            // //console.log("++++++++++++++++++++++++In Forget Password Module++++++++++++++++++++++++++");
            // //console.log(details.siteId);
            var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
            var fileReadStream = fs.createReadStream(templatepath + 'reset_password.html');
            var emailTemplate = '';
            fileReadStream.on('data', function (buffer) {
                emailTemplate += buffer.toString();
            });
            var criteria = {
                siteId : details.siteId
            }
            Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                if(err){
                  //console.log("Forget Password from DB error loop");
                  fileReadStream.on('end', function (res) {

                      var email_data = { // set email variables for user
                          to: Configs.CONSTS.DEVELOPER_EMAIL,
                          from: 'Southsurrey App<' + Configs.CONSTS.noReplyEmail + '>',
                          subject: 'DB error in reset PassWord Request',
                          html: "Hello,<br> A user with the following details  <br> <b>Email :</b>" + params.email +" <Br> <b> Name :</b> " + name +"<br> requested a reset password request but because of Internal DB error while getting theme settings, we were unable to send the email.<br> Thanks"
                      };

                      Utils.universalfunctions.send_email(email_data, function (err, res) {
                          if (err)return cb(Responses.systemError);
                          return cb();
                      });
                  })
                }else if(result.length > 0){
                  var imagePath = 'http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=' + result[0].logoUrl
                  var passwordUrl = result[0].siteUrl + "/#/password/reset/"+token;
                  fileReadStream.on('end', function (res) {
                      var sendStr = emailTemplate.replace('{{name}}', details.firstName).replace('{{siteName}}',result[0].siteName).replace('{{imagePath}}', imagePath).replace('{{passwordUrl}}', passwordUrl).replace('{{signature}}', result[0].signature).replace('{{fb_link}}', result[0].facebookpageUrl).replace('{{site_link}}', result[0].siteUrl);

                      var email_data = { // set email variables for user
                          to: params.email,
                          from: result[0].fromName + '<' + result[0].fromEmail + '>',
                          subject: 'Reset password request - ' + result[0].siteName,
                          html: sendStr
                      };

                      Utils.universalfunctions.send_email(email_data, function (err, res) {
                          if (err)return cb(Responses.systemError);
                          return cb();
                      });
                  });
                }else{
                  //console.log("Forget password from else loop");
                  var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                  fileReadStream.on('end', function (res) {
                      var email_data = { // set email variables for user
                        to: Configs.CONSTS.DEVELOPER_EMAIL,
                        from: 'Southsurrey App<' + Configs.CONSTS.noReplyEmail + '>',
                        subject: 'No Data Found Warning in reset PassWord Request',
                        html: "Hello,<br> A user with the following details  <br> <b>Email :</b>" + params.email +" <Br> <b> Name :</b> " + name +"<br> requested a reset password request but because of <b><i>No Data found</i></b> warning while getting theme settings, we were unable to send the email.<br> Thanks"
                      };

                      Utils.universalfunctions.send_email(email_data, function (err, res) {
                          if (err)return cb(Responses.systemError);
                          return cb();
                      });
                  })
                }
              });
        }
    ], function (err, result) {
        if (err) return callback(err);
        var value = {
          "statusCode": 200,
          "message": "Forgot password link sent to your email",
          "result": ""
        }
        return callback(value)
    });
}

var resetForgotPassword = function (params, callback) { //console.log("resetForgotPassword===init");
    var passwordhash;
    var confirm_passwordhash;
    async.series([
            function (cb) {
                Utils.universalfunctions.check_resetpassword_token_exist(params.forgotPasswordToken, function (err, res) {  ////console.log("xxx",err, res)
                    if (err) return cb(err);
                    if(res.length==0) return cb(Responses.FORGOT_PASSWORD_TOKEN_EXPIRED)
                    return cb();
                })
            },
            function (cb) { //console.log("init===2");
                passwordhash = Utils.universalfunctions.encryptpassword(params.password); //hashing password
                //confirm_passwordhash = Utils.universalfunctions.encryptpassword(params.confirm_password); //hashing password
                jwt.verify(params.forgotPasswordToken, Configs.CONSTS.jwtkey, function (err, decode) { // checking token expiry
                    if(err){
                        cb(Responses.FORGOT_PASSWORD_TOKEN_EXPIRED)
                    }else{
                        cb();
                    }
                });
            },
            function (cb) { //console.log("init===3");
                var criteria = {
                    forgetpasswordVerifyToken: params.forgotPasswordToken
                };
                var objToUpdate = {
                    $unset: {forgetpasswordVerifyToken: 1},
                    password: passwordhash
                };
                Service.UserService.updateUser(criteria, objToUpdate, {new:true}, function (err, res) {
                    ////console.log("err, res", criteria, err, res);
                    if (err) return cb(err);
                    if (res == null) return cb(Utils.responses.tokenNotExist);
                    return cb()
                })
            }
        ], function (err, result) {
            if (err) return  callback(err)
            return callback()
        })
}


var saveSchedule = function (payloadData, UserData, callbackRoute) {
    //console.log("payloadData.formType",payloadData.formType);
    var userId =null,ContactId=null,contactDetailId;
    var siteId =payloadData.siteId;
    var userType;
    async.auto({
        savingSchedule:['AddingDetailsToDb',function(r0,cb){

            var  objToUpdate = payloadData;
            objToUpdate.userId = returnedData._id
              if(payloadData.formType){
                  objToUpdate.formType = payloadData.formType
              };
              //console.log("objToUpdate===",objToUpdate);
              Service.Schedule.InsertData(objToUpdate,(err, result)=> {
                  //console.log("ERRRRRRRR",err);
                  if (err) return cb(err);
                  ContactId= result._id;
                  //console.log("result,result,result,result,result,result",result)
                  return cb()
              })

        }],
        sendEmailToUSer:['savingSchedule',function (r1,cb) {
                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'contactUs.html');

                var emailTemplate = '';


                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                // var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                var criteria = {
                    siteId : siteId
                }
                Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                  if(err){
                    fileReadStream.on('end', function (res) {
                        var signature = " "
                        // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                        //console.log("Email is sent from the err loop of save schedule.",err);
                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{signature}}', signature);

                        var email_data = { // set email variables for user
                            to: payloadData.agentEmail,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: 'Southsurrey Query Reported Successfully',
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }else if(result.length > 0){
                    //console.log("Email sent property from save schedule API");
                    var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                    fileReadStream.on('end', function (res) {
                      var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{signature}}', result[0].signature);

                        var email_data = { // set email variables for user
                            to: payloadData.agentEmail,
                            from:  result[0].fromName + '<' + result[0].fromEmail + '>',
                            subject: 'Southsurrey Query Reported Successfully',
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err) return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }else {
                    //console.log("Email sent from else loop in save schedule API");
                    // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                    fileReadStream.on('end', function (res) {
                        var signature = " ";
                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{signature}}', signature);

                        var email_data = { // set email variables for user
                            to: payloadData.agentEmail,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: 'Southsurrey Query Reported Successfully',
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }
                });

        }]
      },function(err,result){
          if (err){
              //console.log(err);
              return callbackRoute(err)
          }
          return callbackRoute(null, result)
      })
  }


var contactUs = function (payloadData, UserData, callbackRoute) {
    //console.log("payloadData.formType",payloadData.formType);
    //console.log(payloadData);
    //console.log(UserData);
    var allData;
    var userId =null,ContactId=null,contactDetailId;
    var siteId =payloadData.siteId;
    var userType;
    var assignedTo;
    async.auto({
        checklistingId:[function(cb){
            if(payloadData.PropertyId){
                var options= {
                    lean:true
                };
                var criteria= {
                   _id:payloadData.PropertyId
                };
                var projection ={
                    _id:1,
                    listingid:1
                }
               Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options,(err,data)=> {
                    if (err)  return cb(err);
                    finalData = data[0]
                    return cb();
               });
            }else{
                 return cb();
            }
        }],
        getUserId:[function(cb){
            var criteria = {
                email:payloadData.email
            }
            var projection= {
                _id:1,
                email:1,
            }
            var options= {
                lean:true
            }
            Service.UserService.getUser(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    userId=result[0]._id;
                }
                return cb(null,{userId:userId,payloadData:payloadData})
            })
        }],
        InsertUser:['getUserId',function(ag1,cb){ //console.log("userId",userId);
            if(userId==null){
                var dataToSet = {
                   email:payloadData.email,
                   firstName:payloadData.firstName,
                   lastName:payloadData.lastName,
                   userType:USER_TYPE.BUYER,
                   siteId : payloadData.siteId
                }
                Service.UserService.createUser(dataToSet, (err, data)=> { //console.log("===InsertUser===", err)
                        if (err)  return cb(err);
                        userId = data._id;
                        return cb();
                });
            }else{
               return cb();
           }
        }],
        getContactId:['getUserId',function(ag1,cb){
            var criteria = {
                email:payloadData.email
            }
            var projection= {
                _id:1,
                siteId : 1

            }
            var options= {
                lean:true
            }
            Service.ContactFormService.getData(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    ContactId=result[0]._id;
                    if(result[0].siteId){
                        siteId= result[0].siteId;
                    }
                }
                return cb(null,{ContactId:ContactId,userId:userId,payloadData:payloadData})
            })
        }],
        saveDataInDB:['checklistingId','getUserId','getContactId','InsertUser',function(r1,cb){
            if(ContactId!=null){
                return cb();
            }else{
                objToUpdate = payloadData;
                if(userId!=null){
                   objToUpdate.userId = userId
                }
                if(payloadData.formType){
                    objToUpdate.formType = payloadData.formType
                };
                objToUpdate.siteId = payloadData.siteId;
                //console.log("objToUpdate===",objToUpdate);
                Service.ContactFormService.InsertData(objToUpdate,(err, result)=> {
                    if (err){
                          //console.log(err);
                          return cb(err);
                    }
                    //console.log("Result",result);
                    allData = result;
                    ContactId= result._id;
                    return cb()
                })
            }
        }],
        saveMessageData:['saveDataInDB',function(r1,cb){ //console.log("siteId",siteId)
               objToUpdate = payloadData;
                if(userId!=null){
                   objToUpdate.userId = userId
                }
                objToUpdate.ContactId= ContactId
                if(payloadData.PropertyId){
                  objToUpdate.formType=CONTACT_FORM_TYPE.LEAD
                }
                if(siteId!=null){
                  objToUpdate.siteId=siteId
                }
                Service.ContactForm_Detail_Service.InsertData( objToUpdate,(err, result)=> { ////console.log("err====",err)
               objToUpdate = payloadData;
                    if (err) return cb(err);
                    // //console.log("Result",result);
                    // allData = result;
                    contactDetailId= result._id;
                    return cb()
                })

        }],
        addToSetContactDetail:['saveMessageData',function(r1,cb){
            var criteria={
              _id:ContactId,
              formType : { $ne : "homeworth"}
            };
            var options={
                lean:true,
                new:true
            };
            if(userId!=null){
                var dataToSet = {
                    userType:"Member",
                    userId:userId,
                    $addToSet: {
                        contactDetailId:contactDetailId
                    }
                }
            }else{
                var dataToSet = {
                    userType:"Non-Member",
                    $addToSet: {
                        contactDetailId:contactDetailId
                    }
                }
            }

            if(payloadData.phoneNumber){
                dataToSet.phoneNumber = payloadData.phoneNumber
            }
            if(payloadData.message){
                dataToSet.message = payloadData.message
            }
            if(payloadData.firstName){
                dataToSet.firstName = payloadData.firstName
            }
            if(payloadData.lastName){
                dataToSet.lastName = payloadData.lastName
            }
            Service.ContactFormService.updateData(criteria,dataToSet,options,function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }],
        sendEmailToUSer:['saveMessageData',function (r1,cb) {
                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'contactUs.html');

                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                var criteria = {
                    siteId: siteId
                }
                Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                  if(err){
                    fileReadStream.on('end', function (res) {
                        var signature = "";
                        // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{SIGNATURE}}', " ");

                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: 'Contact Form: SouthSurrey.ca',
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusleadDetailsCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }else if(result.length > 0){
                    var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                    fileReadStream.on('end', function (res) {
                        var sendStr = emailTemplate.replace('{{name}}', payloadData.firstName).replace('{{imagePath}}', imagePath).replace('{{imagePath}}', imagePath).replace('{{SIGNATURE}}', result[0].signature)

                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from:  result[0].fromName + '<' + result[0].fromEmail + '>',
                            subject: 'Contact Form : '+ result[0].siteName,
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }else{
                    fileReadStream.on('end', function (res) {
                        var signature = "Regards <br> Team Southsurrey";
                        // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{SIGNATURE}}', " ");

                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: 'Contact Form: SouthSurrey.ca',
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }
                });

        }],
        AssignLeadToUserAutomatically: ['saveDataInDB', (r5, cb)=> {
            Service.ContactFormService.assignContactsLead(payloadData, ( err, leadDetails )=> {
                  if (err) return cb(err);
                  assignedTo = leadDetails.assignedTo
                  return cb();
            })
        }],
        sendEmailToAdmin:['saveMessageData','AssignLeadToUserAutomatically',function (r1,cb) {
                var criteria = {
                    _id : assignedTo
                }
                var projection= {
                    _id:1,
                    email:1,
                    firstName:1
                }
                var options= {
                    lean:true
                }
                Service.UserService.getUser(criteria, projection, options,(err, outp)=> {
                    if (err){
                        return cb(err);
                    }else if(outp.length>0){
                      var sendTo = outp[0].email;
                      var agentName = outp[0].firstName;
                      //console.log("SENT TO THE FOLLOWING AGENT",sendTo);
                      var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                      var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                      var fileReadStream = fs.createReadStream(templatepath + 'contactUs_admin.html');

                      var emailTemplate = '';
                      fileReadStream.on('data', function (buffer) {
                          emailTemplate += buffer.toString();
                      });

                      var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');

                      var criteria = {
                          siteId: siteId
                      }
                      Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                          if(err){
                            fileReadStream.on('end', function (res) {
                                var signature = "Regards <br> Team Southsurrey";
                                // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                                var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A Southsurrey user "+firstName+" with email "+payloadData.email+" has reported the following issue/query</p><p>"+payloadData.message+" </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'> Please contact him as soon as possible . </p>";
                                var subject = 'Contact Form';
                                if(payloadData.PropertyId){
                                   var Message = "<p>A Southsurrey user "+firstName+" with email "+payloadData.email+" has generated the lead.</p><p>"+payloadData.message+" </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'> Please contact him as soon as possible . </p>";
                                   var subject = 'new lead';
                                }
                                var sendStr = emailTemplate.replace('{{name}}', agentName).replace('{{message}}', Message).replace('{{signature}}', signature);
                                var email_data = {
                                    to:sendTo,// payloadData.email,
                                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                    subject: subject,
                                    html: sendStr
                                };
                                Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                    if (err)return cb(err);
                                    return cb(null, {
                                        "statusCode": 200,
                                        "status": "success",
                                        "message": "Reported successfully."
                                    })
                                });
                            })
                          }else if(result.length > 0){
                            var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                            fileReadStream.on('end', function (res) {
                                var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A Southsurrey user "+firstName+" with email "+payloadData.email+" has reported the following issue/query</p><p>"+payloadData.message+" </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'> Please contact him as soon as possible . </p>";
                                var subject = 'Contact Form :' + result[0].siteName;

                                if(payloadData.PropertyId){
                                   var Message = "<p>A Southsurrey user "+firstName+" with email "+payloadData.email+" has generated the lead.</p><p>"+payloadData.message+" </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'> Please contact him as soon as possible . </p>";
                                   var subject = 'new lead';
                                }
                                var sendStr = emailTemplate.replace('{{name}}', agentName).replace('{{imagePath}}', imagePath).replace('{{message}}', Message).replace('{{signature}}',result[0].signature);
                                var email_data = {
                                    to:sendTo,// payloadData.email,
                                    from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                    subject: subject,
                                    html: sendStr
                                };
                                Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                    if (err)return cb(err);
                                    return cb(null, {
                                        "statusCode": 200,
                                        "status": "success",
                                        "message": "Reported successfully."
                                    })
                                });
                            })
                          }else{
                            fileReadStream.on('end', function (res) {
                                var signature = "Regards <br> Team Southsurrey";
                                // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                                var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A Southsurrey user "+firstName+" with email "+payloadData.email+" has reported the following issue/query</p><p>"+payloadData.message+" </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'> Please contact him as soon as possible . </p>";
                                var subject = 'Contact Form ';
                                if(payloadData.PropertyId){
                                   var Message = "<p>A Southsurrey user: <b>"+firstName+" with email "+payloadData.email+" has generated the lead.</p><p>"+payloadData.message+" </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'> Please contact him as soon as possible . </p>";
                                   var subject = 'new lead';
                                }
                                var sendStr = emailTemplate.replace('{{name}}', agentName).replace('{{message}}', Message).replace('{{signature}}', signature);
                                var email_data = {
                                    to:sendTo,// payloadData.email,
                                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                                    subject: subject,
                                    html: sendStr
                                };
                                Utils.universalfunctions.send_email(email_data, (err, res)=> {
                                    if (err)return cb(err);
                                    return cb(null, {
                                        "statusCode": 200,
                                        "status": "success",
                                        "message": "Reported successfully."
                                    })
                                });
                            })
                          }
                      });
                    }else{
                      return cb();
                    }
                })
        }]
    },function(err,result){
        if (err) return callbackRoute(err)
        return callbackRoute(null, result)
    })
}


var verifyForgotPasswordToken = function (params, callback) {
    async.series([
            function (cb) {
                Models.users.findOne({$and: [{forgetpasswordVerifyToken: params.forgotPasswordToken}, {email: params.email}]}, function (err, res) {
                    if (err || res == null)
                        cb(err ? Responses.systemError : Responses.tokenNotExist);
                    else
                        cb()
                })
            },
            function (cb) {
                jwt.verify(params.forgotPasswordToken, Configs.CONSTS.jwtkey, function (err, decode) { // checking token expiry
                    if (err)
                        cb(Responses.forgotPasswordLinkExpired);
                    else
                        cb(null, null);
                });
            }
        ],
        function (err, result) {
            if (err)
                callback(err)
            else
                callback(null, result)

        })
}


var Logout = function (payloadData, UserData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var token;
    var criteria = {_id: UserData._id};
    var setQuery = {
        $unset: {
            accessToken: 1,
            deviceDetail: 1
        }

    };
    Service.UserService.updateUser(criteria, setQuery, {}, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var resentEmailVerificationLink = function (params, callback) {
  // //console.log("kjdxa");
    var verificationToken,UserData={};
    var details = {};
    async.series([
        function (cb) {
            if (!Utils.universalfunctions.verifyEmailFormat(params.email)) return cb(Responses.INVALID_EMAIL);
            return cb();
        },
        function (cb) {
            // //console.log("reaching here 1");
            Models.users.find({email: params.email}, {}, {}, function (err, res) {
                if (err) return cb(err)
                if(res.length == 0) return cb(Responses.EMAIL_ID_NOT_EXISTS);
                UserData = res[0]
                if (UserData.isEmailVerified) return cb(Responses.ACCOUNT_ALREADY_VERIFY);
                return cb()
            })
        },
        function (cb) {//generating and updating email token in db
            // //console.log("Reaching here");
            verificationToken = jwt.sign({ //generating email verification token
                    email: params.email
                },
                Configs.CONSTS.jwtkey, { algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '24h' } //setting expiry of 3 days
            );
            var criteria = {
                email: params.email
            };
            var setData = {
                emailVerificationToken: verificationToken
            };
            Service.UserService.updateUser(criteria, setData, {}, (err, data)=> {
                if (err) return cb(err)
                details = data;
                return cb();
            });
        },
        function (cb) { // send verification email to user

            var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
            var fileReadStream = fs.createReadStream(templatepath + 'welcomeUser.html');
            var emailTemplate = '';
            fileReadStream.on('data', function (buffer) {
                emailTemplate += buffer.toString();
            });
            var path = Configs.CONSTS.accountconfirmationUrl +'/'+ verificationToken + '/' + params.email;
            // var path = 'http://127.0.0.1:8000/emailTemplates/confirmAccount.html?emailConfirmToken=' + verificationToken + '&email=' + params.email;
            var criteria = {
                siteId: details.siteId
            }
            //console.log("+++++++++++++++++++++++++++++++++++++++++++");
            //console.log(criteria);
            //console.log("++++++++++++++++++++++++++++++++++++++++++++");
            Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                if(err){
                  fileReadStream.on('end', function (res) {
                      var signature = "Regards <br> Team Southsurrey";
                      // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                      var sendStr = emailTemplate.replace('{{path}}', path).replace('{{signature}}', signature);

                      var email_data = { // set email variables for user
                          to: params.email,
                          from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                          subject: 'Welcome - Southsurrey',
                          html: sendStr
                      };

                      Utils.universalfunctions.send_email(email_data, function (err, res) {
                          if (err) {
                              cb(err);
                          } else {
                              cb({
                                  "statusCode": 200,
                                  "status": "success",
                                  "message": "Verification link sent to your email."
                              })
                          }
                      });
                  })
                }else if( result.length > 0 ){
                  fileReadStream.on('end', function (res) {
                    var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                    var sendStr = emailTemplate.replace('{{path}}', path).replace('{{signature}}', result[0].signature);;

                      var email_data = { // set email variables for user
                          to: params.email,
                          from: result[0].fromName + '<' + result[0].fromEmail + '>',
                          subject: 'Welcome - Southsurrey',
                          html: sendStr
                      };

                      Utils.universalfunctions.send_email(email_data, function (err, res) {
                          if (err) {
                              cb(err);
                          } else {
                              cb({
                                  "statusCode": 200,
                                  "status": "success",
                                  "message": "Verification link sent to your email."
                              })
                          }
                      });
                  })
                }else{
                  var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                  fileReadStream.on('end', function (res) {
                    var signature = "Regards <br> Team Southsurrey";
                    var sendStr = emailTemplate.replace('{{path}}', path).replace('{{signature}}', signature);

                      var email_data = { // set email variables for user
                          to: params.email,
                          from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                          subject: 'Welcome- Southsurrey',
                          html: sendStr
                      };

                      Utils.universalfunctions.send_email(email_data, function (err, res) {
                          if (err) {
                              cb(err);
                          } else {
                              cb({
                                  "statusCode": 200,
                                  "status": "success",
                                  "message": "Verification link sent to your email."
                              })
                          }
                      });
                  })
                }
            });
        }
    ], function (err, result) {
        if (err) return callback(err)
        return callback(null, result)
    })
}

var verifyEmailToken = function (params, callback) {
    var userData={};
    async.auto({
        getUserData:[function(cb){
            var projection = {projection:1,emailVerificationToken:1,isEmailVerified:1}
            var criteria = {
                    email: params.email,
            };//criteria, projection, options, callback
            Service.UserService.getUser(criteria,projection,{lean:true},function (err, res) { //console.log("sadsad",res);
                if (err) return cb(err);
                if (res.length==0) return cb(Responses.tokenNotExist);
                userData = res[0];
                return cb();
            })
        }],
        checkEmailToken:['getUserData',function(r1,cb){ //console.log("userData.isEmailVerified",userData.isEmailVerified);
             if(userData.isEmailVerified){
                    return cb(Responses.ACCOUNT_ALREADY_VERIFY)
             }else if(userData.emailVerificationToken!=params.emailVerificationToken){
                return cb(Responses.TOKEN_NOT_EXISTS_AND_EMAIL_IS_NOT_VERIFY);
             }else{
                 return cb();
             }
        }],
        updatedEmailVerify:['checkEmailToken',function(r1,cb){ // //console.log("updatedEmailVerify======init====");
            var dataToSet = {$unset: {
                        emailVerificationToken: 1
                    },
                    verifiedAt : new Date,
                    isEmailVerified: true,
                }
            var criteria = {
                    email: params.email,
                };
              Service.UserService.updateUser(criteria,dataToSet, {new: true}, function (err, res) {
                    if (err) return cb(err);
                    if (res == null) return cb(Responses.tokenNotExist);
                    return cb(null, {
                            "statusCode": 200,
                            "status": "success",
                            "message": "Email verified successfully."
                        });
                })
        }],


    },function (err, result) { ////console.log("finallycallBack======init====");
            if (err) return callback(err)
            return callback(null,result.updatedEmailVerify)
        })

}
var getAllUsers = function (params, callback) {
    Models.users.find({}, {}, {}, function (err, res) {
        if (err)
            callback(Responses.systemError)
        else
            callback(null, {
                "statusCode": 200,
                "status": "success",
                "message": "Data fetch successfully.",
                "result": res
            })
    })
}


var Logout = function (payloadData, UserData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var token;
    var criteria = {_id: UserData._id};
    var setQuery = {
        $unset: {
            accessToken: 1,
            "deviceDetail.device_token":1,
            "deviceDetail.device_type":1,
        }

    };
    Service.UserService.updateUser(criteria, setQuery, {}, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};



var testPushNotifications = function (payloadData, callback) {
    var Data = {
        message: payloadData.message,
        jobid: payloadData.message,
        device_token: payloadData.device_token,
        server_key: payloadData.server_key

    }
    Utils.universalfunctions.testsendNotification(Data, function (err, result) {
        if (err) {
            callback(err)
        }
        else
            callback(null, result)
    })


}



var getPostDetail = function (payloadData,callbackRoute) {
    var totalRecord=0;
    var finalData={};
    var criteria= {postAutoIncrement:payloadData.postAutoIncrement};
    var projection={};
    var populateModel = [
        {
            path: "userId",
            match: {},
            select: 'lastName firstName first last email',
            model: 'user',
            options: {lean: true}
        },
        {
            path: "category",
            match: {},
            select: 'category',
            model: 'category',
            options: {lean: true}
        }
    ];
    // var populateModel2 = [
    //
    // ];
    async.auto({
        getData:[(cb)=>{
            var options= {
                skip:payloadData.skip,
                limit:payloadData.limit,
                lean:true,
                sort:{
                    postAutoIncrement:-1
                }
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.POST, criteria, projection, options,populateModel,(err,data)=> { ////console.log("err",err);
            //Service.PostService.getData(criteria, projection, options,(err,data)=> {
                if (err)  return cb(err);
                if(data.length>0) {
                     finalData = data[0];
                     if(finalData.userId){
                        if(finalData.userId.firstName){
                            finalData.authorName= finalData.userId.firstName
                        }
                        if(finalData.userId._id){
                            finalData.authorId= finalData.userId._id
                        }
                        if(finalData.userId.lastName){
                            finalData.authorName= finalData.authorName+' '+finalData.userId.lastName
                        }

                     }else{
                        finalData.authorName="N/A";
                     }
                    if(finalData.propertyImages.length>0){
                        finalData.isImage =true
                    }else{
                         finalData.isImage =false
                    }
                };
                return cb();
           });
        }],

    }, (err,result)=> { ////console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            postDetail: finalData
        });
    })
}


var saveSearch = function (payloadData, UserData, callbackRoute) { ////console.log("sadasdas",payloadData);
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var isSaved=false;
    async.auto({
        saveListingInDB: [(cb)=> { //console.log("saveListingInDB==init");
            var dataToSave = payloadData; ////console.log("dataToSave",Service.SEARCH_DATA_SERVICE.InsertData);
             if(payloadData.userId){
                dataToSave.user = payloadData.userId;
             }else{
                dataToSave.user = UserData._id;
             }
            //console.log(dataToSave.user,"dataToSave.user")
            Service.SEARCH_DATA_SERVICE.InsertData(dataToSave,function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};




var updateSaveSearch = function (payloadData, UserData, callbackRoute) { ////console.log("sadasdas",payloadData);
    // //console.log("PAYLOAD DATA",payloadData);
    // //console.log("USER DATA ",UserData);
    async.auto({
            updateData: [(cb)=> { ////console.log("saveListingInDB==init");
            ////console.log("dataToSave",Service.SEARCH_DATA_SERVICE.InsertData);
            var criteria={
              user:UserData._id,
              _id : payloadData.id
            };
           

            Service.SEARCH_DATA_SERVICE.updateData(criteria,payloadData,{new:true},function (err, result) {
                if (err) return cb(err);
                var value = {
                  "statusCode" : "200",
                  "message" : "Updated Successfully",
                  "data" : result
                }
                return cb(value);
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


var getSearchData = function (payloadData,UserData,callbackRoute) {  //console.log("getAllAreaList===init");
        var finalData={};
        if(payloadData.id){
            var criteria =   {
                user:payloadData.id
           };
        }else{
            var criteria =   {
                user:UserData._id
           };
        }
        var totalRecord=0;
        var details = [];
        var projection =  { __v:0,isDeleted:0 }
     async.auto({
        getListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {
                skip:payloadData.skip,
                limit:payloadData.limit,
               // lean:true,
                //sort: { createdAt:-1 },
            };
            var projection= {};
            var populateModel = [
                {
                    path: "PropertyId",
                    match: {},
                    select: 'l_listingid l_askingprice l_area l_addressnumber l_address',
                    model: 'retspropertyrd_1',
                    options: {lean: true,
                        //sort: { createdAt:-1 }
                    }
                }
            ];
            Service.SEARCH_DATA_SERVICE.getData(criteria,projection,options,(err,data)=> {
                //console.log('weweewewewewewweweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeewweweweweweewewweewewewew')
                //console.log(data)
                //console.log('weweewewewewewweweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeewweweweweweewewweewewewew')
                if (err)  return cb(err);
                 async.each(data, (item, cab) => {
                   var query = {};
                    //console.log("_________________________________________________________________________");
                      // //console.log(item.propertyType);
                      //Property Type
                      if(item.propertyType){
                        query.lm_char1_36 = item.propertyType
                      }
                      //Area
                      if(item.area){
                          if(item.area.length > 0){
                              query.l_area = { $in: item.area }
                          }
                      }
                      //Mls Number
                      if(item.listingid){
                          query.l_displayid = item.listingid
                      }
                      //Price
                      if(item.maxAskingprice){
                          query.l_askingprice = {$gte: item.minAskingprice || 0,$lte:item.maxAskingprice}
                      }
                      if( item.minAskingprice && item.maxAskingprice){
                          query.l_askingprice = {$gte: item.minAskingprice,$lte:item.maxAskingprice}
                      }
                      if( item.minAskingprice && !item.maxAskingprice){
                          query.l_askingprice = {$gte: item.minAskingprice}
                      }
                      //Bed Rooms
                      if(item.maxbedRoom){
                          query.lm_int1_4 = { $gte: item.minbedRoom || 0,$lte:item.maxbedRoom }
                      }
                      if( item.minbedRoom &&  item.maxbedRoom ) {
                          query.lm_int1_4 = { $gte: item.minbedRoom,$lte:item.maxbedRoom }
                      }
                      if( item.minbedRoom && !item.maxbedRoom){
                          query.lm_int1_4 = { $gte: item.minbedRoom }
                      }

                      //Bath Rooms
                      if(item.maxbathRoom){
                          query.lm_int1_19 = { $gte: item.minbathRoom || 0,$lte:item.maxbathRoom }
                      }
                      if( item.minbathRoom &&  item.maxbathRoom ) {
                          query.lm_int1_19 = { $gte: item.minbathRoom,$lte:item.maxbathRoom }
                      }
                      if( item.minbathRoom && !item.maxbathRoom){
                          query.lm_int1_19 = { $gte: item.minbathRoom }
                      }

                      //Floor SPace
                      if(item.maxFloorSpace){
                          query.lm_dec_7 = { $gte: item.minFloorSpace || 0,$lte:item.maxFloorSpace }
                      }
                      if( item.minFloorSpace &&  item.maxFloorSpace ) {
                          query.lm_dec_7 = { $gte: item.minFloorSpace,$lte:item.maxFloorSpace }
                      }
                      if( item.minFloorSpace && !item.maxFloorSpace){
                          query.lm_dec_7 = { $gte: item.minFloorSpace }
                      }

                      //Lot Size

                      if(item.max_lot){
                          query.lm_dec_11 = {$gte: item.min_lot || 0,$lte:item.max_lot}
                      }
                      if(item.min_lot && item.max_lot){
                          query.lm_dec_11 = {$gte: item.min_lot,$lte:item.max_lot}
                      }
                      if(item.min_lot && !item.max_lot){
                          query.lm_dec_11 = {$gte: item.min_lot}
                      }
                      // //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                      // //console.log(query);


                      // //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                      // if( minAskingprice)
                      t_name.count(query, function(err,count){ ////console.log("criteria_err",err);
                          if(err) {
                              if(err.name=="CastError") return callback(responses.INVALID_POST_ID);
                              cab(err);
                          }else{
                              var value = {
                                 "_id" : item._id,
                                 "searchTitle" : item.searchTitle,
                                 "propertyType" : item.propertyType,
                                 "minAskingprice" : item.minAskingprice,
                                 "maxAskingprice" : item.maxAskingprice,
                                 "minbedRoom" : item.minbedRoom,
                                 "maxbedRoom" : item.maxbedRoom,
                                 "minbathRoom" : item.minbathRoom,
                                 "maxbathRoom" : item.maxbathRoom,
                                 "typeOfDwelling" : item.typeOfDwelling,
                                 "min_lot" : item.min_lot,
                                 "max_lot" : item.max_lot,
                                 "maxFloorSpace" : item.maxFloorSpace,
                                 "minFloorSpace" : item.minFloorSpace,
                                 "listingid"    : item.listingid,
                                 "user" : item.user,
                                 "updatedAt" : item.updatedAt,
                                 "createdAt" : item.createdAt,
                                 "area" : item.area,
                                 "count" : count
                              }
                              ////console.log(value);
                              details.push(value)
                              cab();

                              //console.log("detailsssssssssssss",details);
                              // //console.log(details);
                               // return cb(details);
                              // return callback(null,result);
                          }
                      });
                    //console.log("_________________________________________________________________________");

                 },function(err){
                         ////console.log("Hello");
                     if(err){
                       //console.log(err);
                       //console.log("Error grabbing data");
                     } else {
                       cb();
                       ////console.log(" DETAILS HERE ",details);
                       ////console.log("Finished processing all data");
                     }
                 });
                // finalData = data
                // cb();
           });
        }],
        CountSavedListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {lean:true};
            var projection= {};
            // userModel.count({name: 'anand'}, function(err, c) {
            //      //console.log('Count is ' + c);
            // });
            Service.SEARCH_DATA_SERVICE.getData(criteria, { __v:0,isDeleted:0}, options,(err,data)=> {
                if (err)  return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],

     },function(err,result){ //console.log("last function");
     //var details1 = arraySort(details,'createdAt');
         ////console.log(details1);
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord:totalRecord,
            finalData:details,
        });
     })
}

var deletSearchData = function (payloadData,UserData,callbackRoute) {  //console.log("getAllAreaList===init");
     async.auto({
        getListing:[function(cb){
            var options= {};
            var dataToRemove = {_id:payloadData.searchId}
           Service.SEARCH_DATA_SERVICE.delteRecord(dataToRemove,options,(err,data)=> {
                if (err)  return cb(err);
                finalData = data
                return cb();
           });
        }],

     },function(err,result){ //console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute();
     })
}


var updateProfile = function (payloadData, UserData, callbackRoute) { //console.log("sadasdas",payloadData);
    //console.log("+++++++++++++++++++++++++++++++++++++++++++++");
    //console.log(payloadData);
    //console.log("+++++++++++++++++++++++++++++++++++++++++++++");
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var isSaved=false;
    async.auto({
        CheckOldPassword: [(cb)=> {//Check Old Password
            //console.log(payloadData)
            if(payloadData.password && payloadData.password != "" && payloadData.oldPassword && payloadData.oldPassword != "" ){
                //console.log('hieeeeeeeeee')
                //console.log(UserData)
            if (UserData.password != Utils.universalfunctions.encryptpassword(payloadData.oldPassword)) return cb(Responses.INCORRECT_OLD_PASS)
            if (UserData.password == Utils.universalfunctions.encryptpassword(payloadData.password)) return cb(Responses.SAME_PASSWORD)
            return cb();
            }

            else{
                return cb();
            }
        }],
        updateData: ['CheckOldPassword', (r1, cb)=> { //console.log("saveListingInDB==init");
            var dataToSet = payloadData; ////console.log("dataToSave",Service.SEARCH_DATA_SERVICE.InsertData);
            var criteria={
              _id:UserData._id
            };
            //console.log(criteria);
            var options={
                lean:true
            };
                if (payloadData.password) {
                    var password = Utils.universalfunctions.encryptpassword(payloadData.password);  //UniversalFunctions.CryptData(res + res1);
                    dataToSet.password = password;
                }
                // if (payloadData.facebookId) {
                //     dataToSet.facebookId = facebookId;
                // }
                // if (payloadData.linkedinId) {
                //     dataToSet.linkedinId = linkedinId;
                // }
                // if (payloadData.twitterId) {
                //     dataToSet.twitterId = twitterId;
                // }
                if (payloadData.fullName) {
                  var name = payloadData.fullName ;
                  //console.log(name);
                  var firstName = name.split(' ').slice(0, -1).join(' ');
                  //console.log(firstName);
                  var lastName = name.split(' ').slice(-1).join(' ');
                  //console.log(lastName);
                  dataToSet.first = firstName;
                  dataToSet.firstName = firstName;
                  dataToSet.last = lastName;
                  dataToSet.lastName = lastName;
                }
                // if (payloadData.lastName) {
                //     dataToSet.last = payloadData.lastName;
                // }
                if (payloadData.profile_pic) {
                    dataToSet.profile_pic = payloadData.profile_pic;
                }
                if (payloadData.biography) {
                    dataToSet.biography = payloadData.biography;
                }
                if (payloadData.phone) {
                    dataToSet.phone = payloadData.phone;
                }
                if (payloadData.phoneNumber) {
                    dataToSet.phoneNumber = payloadData.phoneNumber;
                }

                // //console.log("________________");
                // //console.log(dataToSet);
            Service.UserService.updateUser(criteria,dataToSet,options,function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var savePropertiesLooked = function (payloadData, UserData, callbackRoute) { //console.log("sadasdas",payloadData);
    var PropertyId;
    async.auto({
        getPropertyId:[(cb)=>{
            var criteria= {
                l_displayid:payloadData.mls
            }
            var projection={
                _id:1,
                l_listingid:1,
                l_displayid:1
            }
            var options= {
                lean:true
            };
           Service.REST_PROPERY_RD_1_Service.getData(criteria,projection, options,(err,data)=> {
                if (err)  return cb(err);
                //if(data.length)
                PropertyId = data[0]._id
                return cb(null,{criteria:criteria,data:data});
           });
        }],
        updateData: ['getPropertyId',(ag1,cb)=> { ////console.log("saveListingInDB==init");
            ////console.log("dataToSave",Service.SEARCH_DATA_SERVICE.InsertData);
            var criteria={
              _id:UserData._id
            };
            var options={
                lean:true
            };
            var dataToSet = {
                $addToSet: {
                    LookedPropertiesId:PropertyId
                }
            }
            Service.UserService.updateUser(criteria,dataToSet,options,function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getAllpost = function (payloadData,callbackRoute) { //console.log("here=====",payloadData);
    var totalRecord=0;
    var finalData=[];
    var finalData_new=[];
    var postCriteria= {
         status    : "Publish",
         isDeleted : false,
    };
    var agentAndAdminId =[Mongoose.Types.ObjectId(payloadData.siteId)]
    var projection={};
    async.auto({
        getAdminId:[(cb)=>{
            var criteria ={
              userType : USER_TYPE.ADMIN
            }
            var projection1 ={
                _id:1,email:1
            }

            Service.UserService.getUser(criteria, projection1, {},(err,data)=> {
                ////console.log(data)
                if (err)  return cb(err);
                data.forEach(function(element) {
                   agentAndAdminId.push(Mongoose.Types.ObjectId(element._id));
                });
                postCriteria.siteId = {
                    $in:agentAndAdminId
                }
                return cb(null,{postCriteria:postCriteria,agentAndAdminId:agentAndAdminId});
            });

        }],
        getData:['getAdminId',(ag1,cb)=>{
            var options= {
                skip:payloadData.skip,
                limit:payloadData.limit,
                lean:true,
                sort:{
                    publishedAt:-1
                }
            };
            Service.PostService.getData(postCriteria, projection, options,(err,data)=> {
                if (err)  return cb(err);
                if(data.length > 0){
                  finalData = data
                  return cb();
                }else{
                    var value = {
                      statusCode: 200,
                      status: "No Data Found",
                      data: []
                    }
                    return cb(value);
                }

            });
        }],
        getCommentsCount:['getData',(ag1,Outercb)=>{
          if(finalData.length>0){
            var i=0;
          async.eachSeries(finalData, function(element, InnerCb){
              var tempData =  element;
              var postId  = tempData.postAutoIncrement;
              var criteria = {
                 postId :  postId,
                 isVisible : true
                }
              /*  get count of comments based on Post Id */

              Service.PostService.getCommentsCount(criteria,function (err, count) {
                  if (err) return cb(err);
                  var countS = count;
                  element['commentsCount']= countS;
                  InnerCb();
              });
              //return InnerCb();
          },function(err)
           {
              if(err) return Outercb(err);
              return Outercb();
          })
        }
        }],
        getSubstring:['getCommentsCount',(ag2,Outercb)=>{
            if(finalData.length>0){
                async.eachSeries(finalData, function(element, InnerCb){
                    var tempData =  element;
                    var str_n = tempData.textData;
                    var postId  = tempData.postAutoIncrement;
                    if(tempData.propertyImages){
                        if(tempData.propertyImages.length>0){
                            tempData.isImage=true
                        }else{
                            tempData.isImage=false
                        }
                    }else{
                        tempData.isImage=false
                    }
                    /*if(tempData.textData.length>0){
                       tempData.textData =str_n.substring(1, 300);
                   }*/
                   tempData.commentsCount =  element.commentsCount;
                    finalData_new.push(tempData);
                     return InnerCb();
                },function(err)
                 {
                    if(err) return Outercb(err);
                    return Outercb();
                })
                /*finalData.forEach(function(element) {
                    var tempData =  element;
                    var str_n = tempData.textData;
                    if(tempData.propertyImages){
                        if(tempData.propertyImages.length>0){
                            tempData.isImage=true
                        }else{
                            tempData.isImage=false
                        }
                    }else{
                        tempData.isImage=false
                    }
                    tempData.textData =str_n.substring(1, 150);
                    finalData_new.push(tempData);
                })*/
                //return cb();
            }else{
               return Outercb();
            }
        }],
        coutTotalRecord:['getAdminId',(ag3,cb)=>{
            var options= {
                lean:true
            };
           Service.PostService.getData(postCriteria,projection,options,(err,data)=> {
                if (err)  return cb(err);
                totalRecord = data.length;
                return cb();
           });
        }],
    }, (err,result)=> { ////console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            postListing: finalData_new
        });
    })
}

var markfavoriteListing = function (payloadData, UserData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var isSaved=false;
    var markfavoriteId;
    var IsFavorited=true;
    async.auto({
        checkListingIsValidOrNot: [(cb)=> { //console.log("checkListingIsValidOrNot==init");
            var criteria = {
                _id:payloadData.PropertyId,
            };
            var options = {lean: true};
            Service.REST_PROPERY_RD_1_Service.getData(criteria, {}, options,function (err, result) {
                if (err) return cb(err);
                if(result.length==0) return cb(Responses.INVALID_PROPERTY_ID);
                return cb();
            });
        }],
        checkListingSaveORNot:[(cb)=> { ////console.log("checkListingSaveORNot==init");
            var criteria = {
                PropertyId:payloadData.PropertyId,
                user:UserData._id
            }; ////console.log("dataToSave",dataToSave,Service);
            var options = {lean: true};
            Service.MARK_FAVORITE_SERVICE.getData(criteria,{},options,function (err, result) { ////console.log("checkListingSaveORNot==result",result);
                if (err) return cb(err);
                if(result.length>0){
                    isSaved=true;
                    markfavoriteId = result[0]._id
                    IsFavorited = result[0].IsFavorited
                    if(IsFavorited==true){
                        IsFavorited=false
                    }else{
                        IsFavorited=true;
                    }
                }
                return cb();
            });
        }],
        saveListingInDB: ['checkListingSaveORNot','checkListingIsValidOrNot',(ag1,cb)=> { //console.log("saveListingInDB==init",isSaved);
            if(isSaved==false){
                var dataToSave = {
                    PropertyId:payloadData.PropertyId,
                    user:UserData._id
                }; ////console.log("dataToSave",dataToSave,Service);
                Service.MARK_FAVORITE_SERVICE.InsertData(dataToSave,function (err, result) {
                    if (err) return cb(err);
                    markfavoriteId= result._id
                    return cb();
                });
            }else{
                return cb();
            }
        }],
        updateInDB: ['checkListingSaveORNot','checkListingIsValidOrNot',(ag1,cb)=> { //console.log("saveListingInDB==init",isSaved);
            if(isSaved==true){
                var dataToSet = {
                    PropertyId:payloadData.PropertyId,
                    user:UserData._id,
                    //IsFavorited:payloadData.IsFavorited
                    IsFavorited:IsFavorited,
                    updatedAt:new Date().toISOString()
                };
                var criteria= {
                    _id:Mongoose.Types.ObjectId(markfavoriteId),
                     user:Mongoose.Types.ObjectId(UserData._id),
                     PropertyId:Mongoose.Types.ObjectId(payloadData.PropertyId),
                };
                var options= {
                    new:true
                }
                Service.MARK_FAVORITE_SERVICE.delteRecord(criteria, options,function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });
            }else{
                return cb();
            }
        }],
        updateUserData: ['saveListingInDB',(ag1,cb)=> { ////console.log("saveListingInDB==init");
            if(isSaved==false){
                 var criteria={
                 _id:UserData._id
                };
                var options={
                    lean:true
                };
                var dataToSet = {
                    $addToSet: {
                        //LookedPropertiesId:Mongoose.Types.ObjectI(PropertyId)
                        markfavoriteId:Mongoose.Types.ObjectId(markfavoriteId)
                    }
                }
                Service.UserService.updateUser(criteria,dataToSet,options,function (err, result) {
                    if (err) return cb(err);
                    return cb();
                });

            }else{
               return cb();
            }
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute(null,{
            IsFavorited:IsFavorited,
        });
    });
};

var landingPageApi = function (payloadData, UserData, callbackRoute) {

    async.auto({

        /*sendEmailToUSer:['saveDataInDB',function (r1,cb) {
                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'contactUs.html');

                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                fileReadStream.on('end', function (res) {
                    var sendStr = emailTemplate.replace('{{name}}', firstName)

                    var email_data = { // set email variables for user
                        to: payloadData.email,
                        from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                        subject: 'Southsurrey Query Reported Successfully',
                        html: sendStr
                    };
                    Utils.universalfunctions.send_email(email_data, (err, res)=> {
                        if (err)return cb(err);
                        return cb(null, {
                            "statusCode": 200,
                            "status": "success",
                            "message": "Reported successfully."
                        })
                    });
                })
        }],*/
        sendEmailToAdmin:[function (cb) {
                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.name);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'landingPage.html');

                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                // var imagePath = Path.join(__dirname, '../Assets/emailTemplates/img/logo.png');
                fileReadStream.on('end', function (res) {
                     var signature = "Regards <br> Team Southsurrey";
                     firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
                     var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
                     Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
                     Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
                     Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p><p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Brokerage : "+payloadData.brokerage+"</p>";
                     Message  = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Years In Business : "+payloadData.yearsInBusiness+"</p><p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Property listing : "+payloadData.Propertylisting+"</p>"
                     var subject = 'Southsurrey: New Lead';

                    var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
                    var email_data = {
                        to: 'derek@derekthornton.com',//Configs.CONSTS.ADMIN_EMIAL,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
                        from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                        subject: subject,
                        html : sendStr,
                        cc   :'ankur@matrixmarketers.com',
                        replyTo:payloadData.email
                    };
                    Utils.universalfunctions.send_email(email_data, (err, res)=> {
                        if (err)return cb(err);
                        return cb(null, {
                            "statusCode": 200,
                            "status": "success",
                            "message": "Reported successfully."
                        })
                    });
                })
        }]
    },function(err,result){
        if (err) return callbackRoute(err)
        return callbackRoute(null, result)
    })
}

var propertyValuation = function (payloadData, UserData, callbackRoute) {
    var IsFavorited=true;
    var sumofAskingprice=0
    var countTotalRecord=0;
    var avgAskingprice=0;
    var pricePerSqft= 0;
    var FinalpricePerSqft= 0;
    var userId=null;
    var ContactId=null;
    var agentId=null;
    var city_new = Utils.universalfunctions.capitalizeFirstLetter(payloadData.city)
    if(payloadData.addressLine1){
        payloadData.address = payloadData.addressLine1
    }
    async.auto({
        getSumOfAskingPrice: [(cb)=> { ////console.log("propertyValuation==init");
            var match = {
                $match: {
                    "l_city":{ $in:[city_new,payloadData.city] },
                    //"lm_char10_11":{ $in:["House/Single Family","Townhouse"] },
                    "lm_char10_11":{ $in:[payloadData.propertyType] },
                }
            }
            var groupBy= {
                $group:{
                  _id: "",
                  totalAmount: { $sum: "$l_pricepersqft" }, //l_askingprice
                  count: { $sum: 1 }
                }
            }
            DBCommonFunction.aggregate(Models.REST_PROPERY_RD_1,[match,groupBy],(err,data)=>{
                //Service.REST_PROPERY_RD_1_Service.getData(criteria, {}, options,function (err, result) {
                if (err) return cb(err);
                if(data.length>0){
                    sumofAskingprice = data[0].totalAmount
                    countTotalRecord = data[0].count
                    avgAskingprice   = sumofAskingprice/countTotalRecord
                    avgAskingprice   = avgAskingprice.toFixed(4);
                    avgAskingprice   = parseFloat(avgAskingprice);
                    pricePerSqft     = sumofAskingprice/avgAskingprice;
                    pricePerSqft     = parseFloat(pricePerSqft.toFixed(4))
                    FinalpricePerSqft = parseFloat((pricePerSqft*payloadData.propertySize).toFixed(4))
                }
                return cb(null,{
                    sumofAskingprice:sumofAskingprice,
                    countTotalRecord:countTotalRecord,
                    avgAskingprice:avgAskingprice,
                    pricePerSqft:pricePerSqft,

                });
            });
        }], //check User Exists Or Not
        getUserId:[function(cb){
            var criteria = {
                email:payloadData.email
            }
            var projection= {
                _id:1,
                email:1,
            }
            var options= {
                lean:true
            }
            Service.UserService.getUser(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    userId=result[0]._id;
                }
                return cb(null,{userId:userId,payloadData:payloadData})
            })
        }],
        getContactId:[function(cb){
            var criteria = {
                email:payloadData.email
            }
            var projection= {
                _id:1,
                agentId:1,

            }
            var options= {
                lean:true
            }
            Service.ContactFormService.getData(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    ContactId=result[0]._id;
                    if(result[0].agentId){
                        agentId= result[0].agentId;
                    }
                }
                return cb(null,{ContactId:ContactId,userId:userId,payloadData:payloadData})
            })
        }],
        InsertUser:['getUserId',function(ag1,cb){ //console.log("userId",userId);
            if(userId==null){
                var dataToSet = {
                   email:payloadData.email,
                   firstName:payloadData.firstName,
                   lastName:payloadData.lastName,
                   userType:USER_TYPE.BUYER,
                   //siteId:payloadData.agentId
                }
                if(payloadData.siteId){
                     dataToSet.siteId= payloadData.siteId
                }
                Service.UserService.createUser(dataToSet, (err, data)=> { ////console.log("===InsertUser===", err)
                        if (err)  return cb(err);
                        userId = data._id;
                        return cb();
                });
            }else{
               return cb();
           }
        }],
        saveDataInDB:['getUserId','getContactId','InsertUser',function(r1,cb){
            if(ContactId!=null){
                return cb();
            }else{
                objToUpdate = payloadData;
                if(userId!=null){
                   objToUpdate.userId = userId
                }
                if(payloadData.PropertyId){
                  objToUpdate.formType=CONTACT_FORM_TYPE.LEAD
                }
                objToUpdate.formType=CONTACT_FORM_TYPE.PROPERTY_VALUATION
                if(payloadData.address){
                    objToUpdate.addressLine1= payloadData.address
                    delete objToUpdate.address
                };
                if(payloadData.agentId){
                     objToUpdate.agentId= payloadData.agentId
                }
                Service.ContactFormService.InsertData( objToUpdate,(err, result)=> {
                    if (err) return cb(err);
                    ContactId= result._id;
                    return cb()
                })
            }
        }],

    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute(null,{
            sumofAskingprice:sumofAskingprice,
            countTotalRecord:countTotalRecord,
            avgAskingprice:avgAskingprice,
            pricePerSqft:pricePerSqft,
            FinalpricePerSqft:FinalpricePerSqft,
        });
    });
};
var savePolygon = function (payload,UserData,callback) {
    async.auto({
        saveLocation:[(cb)=>{
            var criteria = {
                _id:UserData._id,
            }
            var dataToSet =  {
                    location: {
                        type: "Polygon",
                        coordinates: [payload.coordinates]
                    }
            }
            Service.UserService.updateUser(criteria, dataToSet, {lean:true},(err, data)=> { ////console.log("===errerrerr===", err)
                if (err)  return cb(err);
                return cb();
            });
        }]
    },(err,result)=>{
        if(err) return callback(err);
        return callback()
    })
}

var socialLogin = function (payloadData, userData, CallbackRoute) {
    var returnedData, token, verificationToken, registerSocialId, IsFirstLogin = true;
    var RunQueryInsert = false;
    var countOfVisitingWebsite=1;
    async.auto({
        getUserData: [(cb)=> { ////console.log("getUserData init", RunQuery)
            var conditionArray = [];
            if(payloadData.email){
                conditionArray.push({email: payloadData.email})
            }
            if(payloadData.facebookId){
                conditionArray.push({facebookId: payloadData.facebookId})
            }
            if(payloadData.googleId){
                conditionArray.push({googleId: payloadData.googleId})
            }
            var Criteria ={
                $or:conditionArray
            };
            Service.UserService.getUser(Criteria, {}, {}, (err, data)=> { ////console.log("getUserData",err, data)
                if (err) return cb(err);
                if (data.length==0) {
                   RunQueryInsert=true;

                }else{
                    returnedData = data[0];
                    if(returnedData.countOfVisitingWebsite){
                        countOfVisitingWebsite= returnedData.countOfVisitingWebsite
                    }
                }
                return cb();
            });
        }],
        createUser:['getUserData', (ag1,cb)=>{
            if(RunQueryInsert){
                var dataSet = payloadData;
                dataSet.userType =USER_TYPE.BUYER
                Service.UserService.createUser(dataSet,(err, data)=> {
                    if(err) return cb(err)
                    returnedData = data;
                    return cb()
                })
            }else{
              return cb()
            }
        }],
        setAccesToken: ['getUserData','createUser', (ag2, cb)=> { ////console.log("setAccesToken init")
            var setCriteria = {_id: returnedData._id};
            token = jwt.sign({
                id: returnedData._id,
                //email: returnedData.email
            }, Configs.CONSTS.jwtkey, {algorithm: Configs.CONSTS.jwtAlgo, expiresIn: '50 days'});
            //console.log("token", token);

            var setQuery = {
                updatedAt: new Date(),
                IsFirstLogin: false,
                accessToken: token,
                lastVisitedDate:new Date().toISOString(),
                countOfVisitingWebsite:countOfVisitingWebsite
            };
            if(payloadData.facebookId){
                setQuery.facebookId = payloadData.facebookId
            }
            Service.UserService.updateUser(setCriteria, setQuery, {new: true}, (err, data)=> { ////console.log("err, data",err, data);
                if (err) return cb(err)
                returnedData = data;
                returnedData.IsFirstLogin = IsFirstLogin
                return cb(null, data);
            });
        }],
    }, (err, result)=> {
        if (err) return CallbackRoute(err);
        return CallbackRoute(null, {
            accessToken: returnedData.accessToken,
            userDetails: Utils.universalfunctions.deleteUnnecessaryUserData(returnedData)
        });
    });
}

var getFavouriteProperties = function (payloadData,UserData,callbackRoute) {  //console.log("getFavouriteProperties===init",payloadData);
if(payloadData.id){
    var criteria =   {
        user:payloadData.id,
        IsFavorited:true
   };
}else{
    var criteria =   {
        user:UserData._id,
        IsFavorited:true
   };
}
        
        var totalRecord=0;
        var projection =  { __v:0,isDeleted:0 }
        var finalData=[],finalData_new =[]
     async.auto({
        getListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {
                skip:payloadData.skip,
                limit:payloadData.limit,
                lean:true,
                sort: {
                    _id:-1
                }
            }; //
            var projection= {__v:0};
            var populateModel = [
                {
                    path: "PropertyId",
                    match: {},
                    // select: 'l_listingid l_displayid l_askingprice l_area l_addressnumber l_addressstreet l_address l_city l_state',
                    model: 'retspropertyrd_1',
                    options: {lean: true}
                }
            ];
            DBCommonFunction.getDataPopulateOneLevel(Models.MARK_FAVORITE,criteria,projection,options,populateModel,(err,data)=> {
                if (err)  return cb(err);
                finalData = data
                return cb();
           });
        }],
        addAddressKey:['getListing',(ag1,cb)=>{
           finalData.forEach(function(element) {
               var tempData = element; //return cb(element);
               if(element.PropertyId!=null){
                    if(element.PropertyId.l_addressnumber.length>0){
                        var newAddress =element.PropertyId.l_addressnumber+'-'+element.PropertyId.l_addressstreet+'-'+element.PropertyId.l_city+'-'+element.PropertyId.l_state;
                    }else{
                        var newAddress =element.PropertyId.l_addressstreet+'-'+element.PropertyId.l_city+'-'+element.PropertyId.l_state;
                    }
                }else{
                   var newAddress ='';
                }
               newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress," ","-");
               tempData.newAddress = newAddress.toLowerCase();
               finalData_new.push(tempData);
               //return cb(element);
           });
           return cb();
        }],
        CountSavedListing:[function(cb){ //console.log("getDistinctArea===init");
            var options= {lean:true};
            var projection= {};
            Service.MARK_FAVORITE_SERVICE.getData(criteria, {__v:0,isDeleted:0}, options,(err,data)=> {
                if (err)  return cb(err);
                totalRecord = data.length;
                return cb();
            });
        }],

     },function(err,result){ //console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord:totalRecord,
            finalData:finalData_new,
        });
     })
}

var getPageData = function (payloadData,callbackRoute) {
    var totalRecord=0;
    var finalData={};
    var val1 = parseInt(payloadData.pageAutoIncrement);
    var criteria= {};

    if(!val1){
      criteria.slug = payloadData.pageAutoIncrement
    }else{
      criteria.PageAutoIncrement = payloadData.pageAutoIncrement
    }
    //console.log(criteria);

    var projection={};
    var populateModel = [
        {
            path: "userId",
            match: {},
            select: 'lastName firstName first last email',
            model: 'user',
            options: {lean: true}
        }
    ];
    async.auto({
        getData:[(cb)=>{
            var options= {
                lean:true,
            };
            DBCommonFunction.getDataPopulateOneLevel(Models.PageDetail_MODEL, criteria, projection, options,populateModel,(err,data)=> { ////console.log("err",err,"data",data);
            //Service.PostService.getData(criteria, projection, options,(err,data)=> {
                if (err){
                  //console.log(err);
                  return cb(err);
                }
                if(data.length>0) {
                     finalData = data[0];
                        var landingPageFormData = [];
                        finalData.landingPageForm.forEach(function(item) { //console.log("item.isenable",item.isenable);
                            if(item.isenable==true){
                            landingPageFormData.push(item);
                            }
                        })
                        finalData.landingPageForm= landingPageFormData
                     if(finalData.userId){
                        if(finalData.userId.firstName){
                            finalData.authorName= finalData.userId.firstName
                        }
                        if(finalData.userId._id){
                            finalData.authorId= finalData.userId._id
                        }
                        if(finalData.userId.lastName){
                            finalData.authorName= finalData.authorName+' '+finalData.userId.lastName
                        }

                     }else{
                        finalData.authorName="N/A";
                     }
                    /*if(finalData.propertyImages.length>0){
                        finalData.isImage =true
                    }else{
                         finalData.isImage =false
                    }*/
                };
                return cb();
           });
        }],


    }, (err,result)=> { ////console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            totalRecord: totalRecord,
            postDetail: finalData
        });
    })
}


//Landing Page from API new functionality implemented here
var landingPageFormApi = function (payloadData, UserData, callbackRoute) {
    //console.log("LandPage from API reaching Here");
    if(payloadData.phonenumber){
        payloadData.phoneNumber = payloadData.phonenumber
    }
    var ContactId =null,siteId=payloadData.siteId;
    var userId =null
    var funnelId =null
    var pageDetails = {};
    var assignedTo;
    var agentEmail;
    async.auto({
        getFunnelId:[function(cb){
            // //console.log("LandPage from API reaching Here ::: Get funnel ID");
            var criteria = {
                _id:payloadData.landingPageId
            }
            // var projection= { funnelId:1 }
            var options= {
                lean:true
            }
            Service.PageDetailService.getPageDetails(criteria, {}, options,(err, result)=> {
                if (err) return cb(err);
                //console.log("Result",result);
                if(result){
                    funnelId=result.funnelId;
                    pageDetails = result;
                }
                return cb();
            })
        }],
        getContactId:[function(cb){
          // //console.log("LandPage from API reaching Here ::: Get Contact ID");

            var criteria = {
                email:payloadData.email,
                siteId : payloadData.siteId
            }
            var projection= {
                _id:1,
                siteId:1,
                agentId: 1
            }
            var options= {
                lean:true
            }
            Service.ContactFormService.getData(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    ContactId=result[0]._id;
                    if(result[0].siteId){
                        siteId= result[0].siteId;
                    }
                }
                return cb();
            })
        }],
        getUserId:[function(cb){
          // //console.log("LandPage from API reaching Here ::: Get User ID");

            var criteria = {
                email:payloadData.email,
                siteId : payloadData.siteId
            }
            var projection= {
                _id:1,
                email:1,
            }
            var options= {
                lean:true
            }
            Service.UserService.getUser(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    userId=result[0]._id;
                }
                return cb();
            })
        }],
        getUserId:[function(cb){
          // //console.log("LandPage from API reaching Here ::: Get User ID");

            var criteria = {
                email:payloadData.email,
                siteId : payloadData.siteId
            }
            var projection= {
                _id:1,
                email:1,
            }
            var options= {
                lean:true
            }
            Service.UserService.getUser(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    userId=result[0]._id;
                }
                return cb();
            })
        }],
        AssignLeadToUserAutomatically: [ 'getFunnelId',function(ag11,cb){

            Service.ContactFormService.assignLandingPageLead(pageDetails, ( err, assignedToAgent )=> {
                  if (err) return cb(err);
                  if(assignedToAgent == 0){
                      //console.log("No agent selected To assign lead");
                      return cb();
                  }else{
                    assignedTo = assignedToAgent;
                    return cb();
                  }

            })

        }],
        saveDataInDB:['getContactId','getFunnelId','getUserId','AssignLeadToUserAutomatically','sendEmailToAdmin',function(r1,cb){ //console.log("ContactId=====saveDataInDB===",ContactId);
          // //console.log("LandPage from API reaching Here :::Save Data in Database");
            if(ContactId != null){
                //console.log("ContactId=====if",ContactId);
                var criteria = {
                    _id:ContactId
                }
                var data = {
                  name: payloadData.name,
                  email: payloadData.email,
                  phonenumber: payloadData.phoneNumber,
                  address: payloadData.address,
                  message: payloadData.message,
                  landingPageId: payloadData.landingPageId,
                  type : payloadData.type
                }

                var dataToSet ={
                    $push : { landingPageDetails : data},
                    funnelId : funnelId
                }

                if(userId != null){
                      dataToSet.userId = userId;
                      dataToSet.userType = "Member"
                }
                Service.ContactFormService.updateData(criteria, dataToSet, {new:true}, (err, data)=> {
                    if (err)  return cb(err);
                    // //console.log("DATATTATATATATATAT",data);
                    return cb();
                });
                // return cb();
            }else{
                var objToUpdate = payloadData;
                if(userId != null){
                      objToUpdate.userId = userId;
                      objToUpdate.userType = "Member"
                }
                if(payloadData.PropertyId){
                  objToUpdate.formType=CONTACT_FORM_TYPE.LEAD
                }else{
                    objToUpdate.formType= payloadData.type
                }

                if(payloadData.name){
                  objToUpdate.firstName=payloadData.name
                }

                objToUpdate.assignedTo = assignedTo;

                if(funnelId!=null){
                  objToUpdate.funnelId=funnelId
                }
                objToUpdate.siteId = payloadData.siteId
                objToUpdate.isMovedToCMS =true
                // //console.log("objToUpdate===",objToUpdate,"payloadData===", payloadData);
                Service.ContactFormService.InsertData(objToUpdate,(err, result)=> {
                    if (err) return cb(err);
                    ContactId= result._id;
                    // //console.log("RESYLYKKJBHFD",result);
                    var val = {
                      statusCode: 200,
                      status: "Values added successfully",
                      data: result
                    }
                    return cb(val);
                })
            }
        }],
        saveMessageData:['saveDataInDB',function(r1,cb){ //console.log("siteId",siteId)
        //console.log("LandPage from API reaching Here ::: Save Message Data");

               objToUpdate = payloadData;
                if(userId!=null){
                   objToUpdate.userId = userId
                }
                objToUpdate.ContactId= ContactId
                if(payloadData.PropertyId){
                  objToUpdate.formType=CONTACT_FORM_TYPE.LEAD
                }
                if(siteId!=null){
                  objToUpdate.siteId=siteId
                }
                Service.ContactForm_Detail_Service.InsertData( objToUpdate,(err, result)=> {
                    if (err) return cb(err);
                    contactDetailId= result._id;
                    return cb()
                })

        }],
        // addToSetContactDetail:['saveMessageData',function(r1,cb){
        //   //console.log("LandPage from API reaching Here ::: Add to set contact details");
        //
        //     var criteria={
        //       _id:ContactId
        //     };
        //     var options={
        //         lean:true,
        //         new:true
        //     };
        //     if(userId!=null){
        //         var dataToSet = {
        //             userType:"Member",
        //             userId:userId,
        //             $addToSet: {
        //                 contactDetailId:contactDetailId
        //             }
        //         }
        //     }else{
        //         var dataToSet = {
        //             userType:"Non-Member",
        //             $addToSet: {
        //                 contactDetailId:contactDetailId
        //             }
        //         }
        //     }
        //     Service.ContactFormService.updateData(criteria,dataToSet,options,function (err, result) {
        //         if (err) return cb(err);
        //         return cb();
        //     });
        // }],
        getUserEmail:['AssignLeadToUserAutomatically',function(ad1,cb){
          //console.log("LandPage from API reaching Here ::: Get User ID");

            var criteria = {
                _id : assignedTo
            }
            var projection= {
                _id:1,
                email:1,
            }
            var options= {
                lean:true
            }
            Service.UserService.getUser(criteria, projection, options,(err, result)=> {
                if (err) return cb(err);
                if(result.length>0){
                    agentEmail=result[0].email;
                }
                return cb();
            })
        }],
        sendEmailToAdmin:['getUserEmail',function (agg1,cb) {
                //console.log("LandPage from API reaching Here ::: Send Email to ADMIN");
                //console.log("Agent Email",agentEmail);
                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.name);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'landingPage.html');

                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                var imagePath = Path.join(__dirname, '../Assets/emailTemplates/img/logo.png');
                var criteria = {
                      siteId :siteId
                  }

                Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                  if(err){
                    fileReadStream.on('end', function (res) {
                        // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                         var signature = "Regards <br> Team Southsurrey";
                         firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
                         var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p>";
                         var subject = 'Southsurrey: New Lead';

                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
                        var email_data = {
                            to: agentEmail,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html : sendStr,
                            //cc   :'ankur@matrixmarketers.com',
                            replyTo:payloadData.email
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }else if(result.length > 0){
                    fileReadStream.on('end', function (res) {
                         var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                         firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
                         var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p>";
                         var subject = 'Southsurrey: New Lead';

                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', Message).replace('{{signature}}', result[0].signature);
                        var email_data = {
                            to: agentEmail,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
                            from: result[0].fromName + '<' + result[0].fromEmail + '>',
                            subject: subject,
                            html : sendStr,
                            //cc   :'ankur@matrixmarketers.com',
                            replyTo:payloadData.email
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }else{

                    fileReadStream.on('end', function (res) {
                         var signature = "Regards <br>";
                         firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
                         var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
                         Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p>";
                         var subject = 'Southsurrey: New Lead';

                        var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
                        var email_data = {
                            to: agentEmail,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html : sendStr,
                            //cc   :'ankur@matrixmarketers.com',
                            replyTo:payloadData.email
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb(null, {
                                "statusCode": 200,
                                "status": "success",
                                "message": "Reported successfully."
                            })
                        });
                    })
                  }
              });

        }]
    },function(err,result){
        if (err) return callbackRoute(err)
        return callbackRoute(null, result)
    })
}
// var landingPageFormApi = function (payloadData, UserData, callbackRoute) {
//     //console.log("LandPage from API reaching Here");
//     if(payloadData.phonenumber){
//         payloadData.phoneNumber = payloadData.phonenumber
//     }
//     var ContactId =null,siteId=payloadData.siteId;
//     var userId =null
//     var funnelId =null
//     async.auto({
//         getFunnelId:[function(cb){
//             //console.log("LandPage from API reaching Here ::: Get funnel ID");
//             var criteria = {
//                 _id:payloadData.landingPageId
//             }
//             var projection= {funnelId:1}
//             var options= {
//                 lean:true
//             }
//             Service.PageDetailService.getData(criteria, projection, options,(err, result)=> {
//                 if (err) return cb(err);
//                 if(result.length>0){
//                     funnelId=result[0].funnelId;
//                 }
//                 return cb(null,{funnelId:funnelId,userId:userId,payloadData:payloadData})
//             })
//         }],
        // getUserId:[function(cb){
        //   //console.log("LandPage from API reaching Here ::: Get User ID");
        //
        //     var criteria = {
        //         email:payloadData.email
        //     }
        //     var projection= {
        //         _id:1,
        //         email:1,
        //     }
        //     var options= {
        //         lean:true
        //     }
        //     Service.UserService.getUser(criteria, projection, options,(err, result)=> {
        //         if (err) return cb(err);
        //         if(result.length>0){
        //             userId=result[0]._id;
        //         }
        //         return cb(null,{userId:userId,payloadData:payloadData})
        //     })
        // }],
//         InsertUser:['getUserId',function(ag1,cb){ //console.log("userId",userId);
//         //console.log("LandPage from API reaching Here ::: Insert User");
//
//             if(userId==null){
//                 var dataToSet = {
//                    email:payloadData.email,
//                    firstName:payloadData.name,
//                    //lastName:payloadData.lastName,
//                    userType:USER_TYPE.BUYER,
//                    siteId:payloadData.siteId
//                 };
//                 //console.log("siteId",siteId,dataToSet);
//                 Service.UserService.createUser(dataToSet, (err, data)=> {
//                         // //console.log("===InsertUser===", err)
//                         if (err)  return cb(err);
//                         userId = data._id;
//                         return cb();
//                 });
//             }else{
//                return cb();
//            }
//         }],
//         getContactId:[function(cb){
//           //console.log("LandPage from API reaching Here ::: Get Contact ID");
//
//             var criteria = {
//                 email:payloadData.email
//             }
//             var projection= {
//                 _id:1,
//                 siteId:1,
//                 agentId: 1
//
//             }
//             var options= {
//                 lean:true
//             }
//             Service.ContactFormService.getData(criteria, projection, options,(err, result)=> {
//                 if (err) return cb(err);
//                 if(result.length>0){
//                     ContactId=result[0]._id;
//                     if(result[0].siteId){
//                         siteId= result[0].siteId;
//                     }
//                 }
//                 return cb(null,{ContactId:ContactId,userId:userId,payloadData:payloadData})
//             })
//         }],
//         saveDataInDB:['getContactId','InsertUser','getFunnelId',function(r1,cb){ //console.log("ContactId=====saveDataInDB===",ContactId);
//
//           //console.log("LandPage from API reaching Here :::Save Data in Database");
//             if(ContactId!=null){ //console.log("ContactId=====if",ContactId);
//                 return cb();
//             }else{ //console.log("ContactId=====else",ContactId);
//                 objToUpdate = payloadData;
//                 if(userId!=null){
//                    objToUpdate.userId = userId
//                 }
//                 if(payloadData.PropertyId){
//                   objToUpdate.formType=CONTACT_FORM_TYPE.LEAD
//                 }
//                 if(payloadData.name){
//                   objToUpdate.firstName=payloadData.name
//                 }
//                 if(funnelId!=null){
//                   objToUpdate.funnelId=funnelId
//                 }
//                 objToUpdate.siteId = payloadData.siteId
//                 objToUpdate.isMovedToCMS =true
//                 //console.log("objToUpdate===",objToUpdate,"payloadData===", payloadData);
//                 Service.ContactFormService.InsertData(objToUpdate,(err, result)=> {
//                     if (err) return cb(err);
//                     ContactId= result._id;
//                     return cb()
//                 })
//             }
//         }],
//         saveMessageData:['saveDataInDB',function(r1,cb){ //console.log("siteId",siteId)
//         //console.log("LandPage from API reaching Here ::: Save Message Data");
//
//                objToUpdate = payloadData;
//                 if(userId!=null){
//                    objToUpdate.userId = userId
//                 }
//                 objToUpdate.ContactId= ContactId
//                 if(payloadData.PropertyId){
//                   objToUpdate.formType=CONTACT_FORM_TYPE.LEAD
//                 }
//                 if(siteId!=null){
//                   objToUpdate.siteId=siteId
//                 }
//                 Service.ContactForm_Detail_Service.InsertData( objToUpdate,(err, result)=> {
//                     if (err) return cb(err);
//                     contactDetailId= result._id;
//                     return cb()
//                 })
//
//         }],
//         addToSetContactDetail:['saveMessageData',function(r1,cb){
//           //console.log("LandPage from API reaching Here ::: Add to set contact details");
//
//             var criteria={
//               _id:ContactId
//             };
//             var options={
//                 lean:true,
//                 new:true
//             };
//             if(userId!=null){
//                 var dataToSet = {
//                     userType:"Member",
//                     userId:userId,
//                     $addToSet: {
//                         contactDetailId:contactDetailId
//                     }
//                 }
//             }else{
//                 var dataToSet = {
//                     userType:"Non-Member",
//                     $addToSet: {
//                         contactDetailId:contactDetailId
//                     }
//                 }
//             }
//             Service.ContactFormService.updateData(criteria,dataToSet,options,function (err, result) {
//                 if (err) return cb(err);
//                 return cb();
//             });
//         }],
//         // sendEmailToUSer:['saveDataInDB',function (r1,cb) {
//         //         var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
//         //         var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
//         //         var fileReadStream = fs.createReadStream(templatepath + 'contactUs.html');
//         //
//         //         var emailTemplate = '';
//         //         fileReadStream.on('data', function (buffer) {
//         //             emailTemplate += buffer.toString();
//         //         });
//         //
//         //         var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
//         //         fileReadStream.on('end', function (res) {
//         //             var sendStr = emailTemplate.replace('{{name}}', firstName)
//         //
//         //             var email_data = { // set email variables for user
//         //                 to: payloadData.email,
//         //                 from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
//         //                 subject: 'Southsurrey Query Reported Successfully',
//         //                 html: sendStr
//         //             };
//         //             Utils.universalfunctions.send_email(email_data, (err, res)=> {
//         //                 if (err)return cb(err);
//         //                 return cb(null, {
//         //                     "statusCode": 200,
//         //                     "status": "success",
//         //                     "message": "Reported successfully."
//         //                 })
//         //             });
//         //         })
//         // }],
//
//         sendEmailToAdmin:[function (cb) {
//                 //console.log("LandPage from API reaching Here ::: Send Email to ADMIN");
//
//                 var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.name);
//                 var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
//                 var fileReadStream = fs.createReadStream(templatepath + 'landingPage.html');
//
//                 var emailTemplate = '';
//                 fileReadStream.on('data', function (buffer) {
//                     emailTemplate += buffer.toString();
//                 });
//
//                 var imagePath = Path.join(__dirname, '../Assets/emailTemplates/img/logo.png');
//                 var criteria = {
//                       siteId :siteId
//                   }
//
//                 Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
//                   if(err){
//                     fileReadStream.on('end', function (res) {
//                         // var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
//                          var signature = "Regards <br> Team Southsurrey";
//                          firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
//                          var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p>";
//                          var subject = 'Southsurrey: New Lead';
//
//                         var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
//                         var email_data = {
//                             to: Configs.CONSTS.ADMIN_EMIAL,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
//                             from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
//                             subject: subject,
//                             html : sendStr,
//                             //cc   :'ankur@matrixmarketers.com',
//                             replyTo:payloadData.email
//                         };
//                         Utils.universalfunctions.send_email(email_data, (err, res)=> {
//                             if (err)return cb(err);
//                             return cb(null, {
//                                 "statusCode": 200,
//                                 "status": "success",
//                                 "message": "Reported successfully."
//                             })
//                         });
//                     })
//                   }else if(result.length > 0){
//                     fileReadStream.on('end', function (res) {
//                          var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
//                          firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
//                          var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p>";
//                          var subject = 'Southsurrey: New Lead';
//
//                         var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', Message).replace('{{signature}}', result[0].signature);
//                         var email_data = {
//                             to: Configs.CONSTS.ADMIN_EMIAL,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
//                             from: result[0].fromName + '<' + result[0].fromEmail + '>',
//                             subject: subject,
//                             html : sendStr,
//                             //cc   :'ankur@matrixmarketers.com',
//                             replyTo:payloadData.email
//                         };
//                         Utils.universalfunctions.send_email(email_data, (err, res)=> {
//                             if (err)return cb(err);
//                             return cb(null, {
//                                 "statusCode": 200,
//                                 "status": "success",
//                                 "message": "Reported successfully."
//                             })
//                         });
//                     })
//                   }else{
//
//                     fileReadStream.on('end', function (res) {
//                          var signature = "Regards <br> Team Southsurrey";
//                          firstName =Utils.universalfunctions.capitalizeFirstLetter1(firstName);
//                          var Message = "<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>You have a new lead from Southsurrey.</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Name : "+firstName+"</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Email : "+payloadData.email+"</p>";
//                          Message = Message+"<p style='padding:0 40px 0 40px; font-size:14px;margin:5px 0px;'>Phone Number : "+payloadData.phoneNumber+"</p>";
//                          var subject = 'Southsurrey: New Lead';
//
//                         var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
//                         var email_data = {
//                             to: Configs.CONSTS.ADMIN_EMIAL,//'ankur@matrixmarketers.com',//  'derek@derekthornton.com',
//                             from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
//                             subject: subject,
//                             html : sendStr,
//                             //cc   :'ankur@matrixmarketers.com',
//                             replyTo:payloadData.email
//                         };
//                         Utils.universalfunctions.send_email(email_data, (err, res)=> {
//                             if (err)return cb(err);
//                             return cb(null, {
//                                 "statusCode": 200,
//                                 "status": "success",
//                                 "message": "Reported successfully."
//                             })
//                         });
//                     })
//                   }
//               });
//
//         }]
//     },function(err,result){
//         if (err) return callbackRoute(err)
//         return callbackRoute(null, result)
//     })
// }


var scheduleShowing = function (payloadData, callbackRoute) {
  var returnedData;
  var isnew = true;
  async.auto({
          AddingDetailsToDb:[function(cb){
              //console.log("Reaching Here");
              var  objToUpdate = {
                  firstName : payloadData.firstName,
                  lastName : payloadData.lastName,
                  phoneNumber : payloadData.phoneNumber,
                  email : payloadData.email,
                  siteId : payloadData.siteId,
                  userType : payloadData.userType,
                  first : payloadData.firstName,
                  last :  payloadData.lastName,
                  phone : payloadData.phoneNumber
              }
              var criteria_New = {
                  email : payloadData.email
              }
              Service.UserService.checkEmail(criteria_New,(errN,dbData)=>{
                if(errN){
                    return cb(err);
                }else if(dbData){
                    returnedData = dbData;
                    isnew = false;
                    return cb();
                }else{

                  Service.UserService.createUser(objToUpdate, (err, data)=> { ////console.log("===errerrerr===", err)
                      if (err)  return cb(err);
                      //console.log("Retured DATATATATATA",returnedData);
                      returnedData = data;
                      return cb();
                  });
                }
              })


          }],
          CreatingPasswordToken:['AddingDetailsToDb',function(r11,cb){
            //console.log(isnew);
            if(isnew == true){
              var criteria = {
                                email: payloadData.email
                            }
                  token = jwt.sign({
                      email: payloadData.email
                  },
                  Configs.CONSTS.jwtkey, { algorithm: Configs.CONSTS.jwtAlgo }
              );
              var objToUpdate = {
                  createPasswordToken: token
              };
              Service.UserService.updateUser(criteria, objToUpdate, { new: true }, function (err, res) {
                  if (err) return cb(err);
                  if (res == null) return cb(err ? Responses.systemError : Responses.EMAIL_ID_NOT_EXISTS);
                  // name = res.name;
                  // details = res;
                  var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                  var fileReadStream = fs.createReadStream(templatepath + 'createPassword.html');
                  var emailTemplate = '';
                  fileReadStream.on('data', function (buffer) {
                      emailTemplate += buffer.toString();
                  });
                  // var path = 'http://127.0.0.1:8002/emailTemplates/resetPassword.html?passwordResetToken=' + token + '&email=' + params.email;
                  var path = Configs.CONSTS.createPasswordUrl + '/' + token;
                  var criteria = {
                      siteId : payloadData.siteId
                  }
                  Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                      if(err){
                        //console.log("Forget Password from DB error loop");
                        fileReadStream.on('end', function (res) {
                            // var signature = "Regards <br> Team Southsurrey";
                            var sendStr = emailTemplate.replace('{{path}}', path).replace('{{signature}}', " ");;

                            var email_data = { // set email variables for user
                                to: payloadData.email,
                                from: 'Southsurrey App<' + Configs.CONSTS.noReplyEmail + '>',
                                subject: 'Reset password request- Southsurrey App',
                                html: sendStr
                            };
                            Utils.universalfunctions.send_email(email_data, function (err, res) {
                                if (err)return cb(Responses.systemError);
                                return cb();
                            });
                        })
                      }else if(result.length > 0){
                        fileReadStream.on('end', function (res) {
                            var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                            var sendStr = emailTemplate.replace('{{path}}', path).replace('{{imagePath}}', imagePath).replace('{{signature}}', result[0].signature);

                            var email_data = { // set email variables for user
                                to: payloadData.email,
                                from: result[0].fromName + '<' + result[0].fromEmail + '>',
                                subject: 'Reset password request- Southsurrey App',
                                html: sendStr
                            };

                            Utils.universalfunctions.send_email(email_data, function (err, res) {
                                if (err)return cb(Responses.systemError);
                                return cb();
                            });
                        });
                      }else{
                        //console.log("Forget password from else loop");
                        fileReadStream.on('end', function (res) {
                            // var signature = "Regards <br> Team Southsurrey"
                            var sendStr = emailTemplate.replace('{{path}}', path).replace('{{signature}}'," ");

                            var email_data = { // set email variables for user
                                to: payloadData.email,
                                from: 'Southsurrey App<' + Configs.CONSTS.noReplyEmail + '>',
                                subject: 'Create password request- Southsurrey App',
                                html: sendStr
                            };

                            Utils.universalfunctions.send_email(email_data, function (err, res) {
                                if (err)return cb(Responses.systemError);
                                return cb();
                            });
                        })
                      }
                    });
                  // return cb();
              })
            }else{
                return cb();
            }
          }],
          savingSchedule:['AddingDetailsToDb',function(r0,cb){
            
                var query = {
                   "userId":returnedData._id,
                    "PropertyId": payloadData.PropertyId,
                }
                Shedule.find(query, function(err, user) {
                    if (err) {
                        return cb(Responses.systemError);
                    } else if (user.length>=1) {
                        return cb(Responses.alreadyExist);
                    } else {
                        var objToSave = payloadData;
                        objToSave.userId = returnedData._id
                        Service.Schedule.InsertData(objToSave,(err, result)=> {
                            if (err) return cb(err);
                            ContactId= result._id;
                            //console.log("result",result);
                            return cb()
                        })
                    }
                });
          }],
          sendEmail: ['savingSchedule',function (r1,cb){
            var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
            var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
            var fileReadStream = fs.createReadStream(templatepath + 'contactUs_admin.html');

            var emailTemplate = '';
            fileReadStream.on('data', function (buffer) {
                emailTemplate += buffer.toString();
            });

            var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');


            var criteria = {
                siteId : payloadData.siteId
            }

          Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
            if(err){
              fileReadStream.on('end', function (res) {
                  var signature = "Regards <br> Team Southsurrey"
                  var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A customer, "+firstName+" with email "+payloadData.email+" booked a schedule showing at : </p><p>DATE : "+payloadData.date+" <br> TIME : "+payloadData.time+" for property : "+payloadData.propertyName+"<br>Please book an appointment. </p>";
                  var subject = 'Schedule Showing';
                  var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
                  var email_data = {
                      to:payloadData.adminEmail,// payloadData.email,
                      from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                      subject: subject,
                      html: sendStr
                  };
                  Utils.universalfunctions.send_email(email_data, (err, res)=> {
                      if (err)return cb(err);
                      return cb();
                  });
              })
            }else if(result.length > 0){
              fileReadStream.on('end', function (res) {
                  var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                  var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A customer, "+firstName+" with email "+payloadData.email+" booked a schedule showing at : </p><p>DATE : "+payloadData.date+" <br> TIME : "+payloadData.time+" for property : "+payloadData.propertyName+"<br>Please book an appointment. </p>";
                  var subject = 'Schedule Showing';
                  var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', Message).replace('{{signature}}', result[0].signature);
                  var email_data = {
                      to:payloadData.adminEmail,// payloadData.email,
                      from: result[0].fromName + '<' + result[0].fromEmail + '>',
                      subject: subject,
                      html: sendStr
                  };
                  Utils.universalfunctions.send_email(email_data, (err, res)=> {
                      if (err)return cb(err);
                      return cb();
                  });
              })
            }else{
              fileReadStream.on('end', function (res) {
                  var signature = "Regards <br> Team Southsurrey";
                  var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A customer, "+firstName+" with email "+payloadData.email+" booked a schedule showing at : </p><p>DATE : "+payloadData.date+" <br> TIME : "+payloadData.time+" for property : "+payloadData.propertyName+"<br>Please book an appointment. </p>";
                  var subject = 'Schedule Showing';
                  var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
                  var email_data = {
                      to:payloadData.adminEmail,// payloadData.email,
                      from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                      subject: subject,
                      html: sendStr
                  };
                  Utils.universalfunctions.send_email(email_data, (err, res)=> {
                      if (err)return cb(err);
                      return cb();
                  });
              })
            }
          });

        }],sendEmailToUSer:['sendEmail',function (r1,cb) {

                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'showing_request_received.html');

                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');


                var criteria = {
                    siteId : payloadData.siteId
                }
//console.log('criteriaaaaaaaaaaaaaaaaaaaaaaaaaa'.criteria)
                Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                  if(err){
                    fileReadStream.on('end', function (res) {

                          var signature = "Regards <br> Team Southsurrey"
                        //   var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'  >Hello user <br> Your schedule showing is booked for property: "+payloadData.propertyName+" with "+payloadData.adminEmail+" on <br> DATE : "+payloadData.date+"<br>Time : "+payloadData.time+"<br> Thank you ";

                        var Message = payloadData.propertyName
                          var subject = 'Schedule showing Booked';
                          var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature).replace('{{site_link}}', result[0].siteUrl);
                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb();
                        });
                    })
                  }else if(result.length > 0){
                      fileReadStream.on('end', function (res) {
                            var imagePath = 'http://api.citruscow.com/v1/user/accessUserImagesOnServer?fileName=' + result[0].logoUrl
                            // var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'  >Hello "+firstName+" <br> Your schedule showing is booked for property: "+payloadData.propertyName+" with "+payloadData.adminEmail+" on <br> DATE : "+payloadData.date+"<br>Time : "+payloadData.time+"<br> Thank you ";
                            var Message = payloadData.propertyName
                            var subject = 'Schedule showing Booked';
                            var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{imagePath}}', imagePath).replace('{{signature}}', result[0].signature).replace('{{site_link}}', result[0].siteUrl).replace('{{siteName}}',result[0].siteName);
                          var email_data = { // set email variables for user
                              to: payloadData.email,
                              from: result[0].fromName + '<' + result[0].fromEmail + '>',
                              subject: subject,
                              html: sendStr
                          };
                          Utils.universalfunctions.send_email(email_data, (err, res)=> {
                              if (err)return cb(err);
                              return cb();
                          });
                      })
                  }else{
                    fileReadStream.on('end', function (res) {
                      // var signature = "Regards <br> Team Southsurrey";

                        //   var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'  >Hello user <br> Your schedule showing is booked for property: "+payloadData.propertyName+" with "+payloadData.adminEmail+" on <br> DATE : "+payloadData.date+"<br>Time : "+payloadData.time+"<br> Thank you ";
                        var Message = payloadData.propertyName
                          var subject = 'Schedule showing Booked';
                          var signature = "Regards" + "<br>" + "Team Southsurrey"
                          var sendStr = emailTemplate.replace('{{message}}', Message).replace('{{signature}}', signature);
                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            return cb();
                        });
                    })
                  }
                });

        }]
    }, (err, result)=> {
      if (err) return callbackRoute(err);
      return callbackRoute(null, {
          "statusCode": 200,
          "status": "success",
          "message": "Schedule showing booked successfully."
      })
  });
};




var contactUsForm = function (payloadData, callbackRoute) {
  async.auto({

      sendEmail: [(cb)=> {
          var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
          var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
          var fileReadStream = fs.createReadStream(templatepath + 'contactUs_admin.html');

          var emailTemplate = '';
          fileReadStream.on('data', function (buffer) {
              emailTemplate += buffer.toString();
          });

          var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');

          var criteria = {
              siteId : payloadData.siteId
          }

          Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
            if(err){
              fileReadStream.on('end', function (res) {
                var signature = "Regards <br> Team Southsurrey";

                  var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A customer, "+firstName+" with email "+payloadData.email+" has left a message : </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>"+payloadData.message+" </p><p> Please contact him as soon as possible . </p>";
                  var subject = 'Contact Agent';
                  var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature).replace('{{siteName}}',result[0].siteName);
                  var email_data = {
                      to:payloadData.adminEmail,// payloadData.email,
                      from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                      subject: subject,
                      html: sendStr
                  };
                  Utils.universalfunctions.send_email(email_data, (err, res)=> {
                      if (err)return cb(err);
                      Service.ContactFormService.InsertData(payloadData,function (err, result) {
                        //console.log('after errir  ', err);
                          if (err) return cb(err);
                          //return cb();
                          cb();
                      });
                  });
              })
            }else if(result.length > 0){
              fileReadStream.on('end', function (res) {
                  var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                  var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A customer, "+firstName+" with email "+payloadData.email+" has left a message : </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>"+payloadData.message+" </p><p> Please contact him as soon as possible . </p>";
                  var subject = 'Contact Agent';
                  var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{imagePath}}', imagePath).replace('{{message}}', Message).replace('{{signature}}', result[0].signature);
                  var email_data = {
                      to:payloadData.adminEmail,// payloadData.email,
                      from:  result[0].fromName +'<' + result[0].fromEmail + '>',
                      subject: subject,
                      html: sendStr
                  };
                  Utils.universalfunctions.send_email(email_data, (err, res)=> {
                      if (err)return cb(err);
                      Service.ContactFormService.InsertData(payloadData,function (err, result) {
                        //console.log('after errir  ', err);
                          if (err) return cb(err);
                          //return cb();
                          cb();
                      });
                  });
              })
            }else{
              fileReadStream.on('end', function (res) {
                  var signature = "Regards <br> Team Southsurrey";
                  var Message = "<p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>A customer, "+firstName+" with email "+payloadData.email+" has left a message : </p><p class='padd_lftc' style='color:#232323; font-size: 14px; padding: 0 40px 0 40px;'>"+payloadData.message+" </p><p> Please contact him as soon as possible . </p>";
                  var subject = 'Contact Agent';
                  var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{message}}', Message).replace('{{signature}}', signature);
                  var email_data = {
                      to:payloadData.adminEmail,// payloadData.email,
                      from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                      subject: subject,
                      html: sendStr
                  };
                  Utils.universalfunctions.send_email(email_data, (err, res)=> {
                      if (err)return cb(err);
                      Service.ContactFormService.InsertData(payloadData,function (err, result) {
                        //console.log('after errir  ', err);
                          if (err) return cb(err);
                          //return cb();
                          cb();
                      });
                  });
              })
            }
          });

        }],sendEmailToUSer:['sendEmail',function (r1,cb) {

                var firstName= Utils.universalfunctions.capitalizeFirstLetter(payloadData.firstName);
                var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                var fileReadStream = fs.createReadStream(templatepath + 'user_template.html');

                var emailTemplate = '';
                fileReadStream.on('data', function (buffer) {
                    emailTemplate += buffer.toString();
                });

                var imagePath = Path.join(__dirname, '../emailTemplates/img/logo.png');
                var criteria = {
                    siteId : payloadData.siteId
                }

                Service.ThemeSetting_SERVICE.getData(criteria,{},{},function (err, result) {
                  if(err){
                    fileReadStream.on('end', function (res) {
                          var signature = "Regards <br> Team Southsurrey";
                          var Message = "An Agent with email "+payloadData.adminEmail+" Will Contact you soon.";
                          var subject = 'Contact Agent';
                          var sendStr = emailTemplate.replace('{{message}}', Message).replace('{{signature}}', signature);
                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            cb();
                        });
                    })
                  }else if(result.length > 0){
                    fileReadStream.on('end', function (res) {
                          var imagePath = 'http://api.uat.djt.ca/Assets/' + result[0].logoUrl
                          var Message = "An Agent with email "+payloadData.adminEmail+" Will Contact you soon.";
                          var subject = 'Contact Agent';
                          var sendStr = emailTemplate.replace('{{message}}', Message).replace('{{imagePath}}', imagePath).replace('{{signature}}',result[0].signature);
                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            cb();
                        });
                    })
                  }else{
                    fileReadStream.on('end', function (res) {
                      var signature = "Regards <br> Team Southsurrey";

                          var Message = "An Agent with email "+payloadData.adminEmail+" Will Contact you soon.";
                          var subject = 'Contact Agent';
                          var sendStr = emailTemplate.replace('{{message}}', Message).replace('{{signature}}', signature);
                        var email_data = { // set email variables for user
                            to: payloadData.email,
                            from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                            subject: subject,
                            html: sendStr
                        };
                        Utils.universalfunctions.send_email(email_data, (err, res)=> {
                            if (err)return cb(err);
                            cb();
                        });
                    })
                  }
                });

        }]
    }, (err, result)=> {
      if (err) return callbackRoute(err);
      return callbackRoute(null, {
          "statusCode": 200,
          "status": "success",
          "message": "Reported successfully."
      })
  });
};


var ChangeExpirePassword = function (payloadData, callbackRoute) {
    var tokenToSend = null;
    var responseToSend = {};
    var tokenData = null;
    var userDBData;
    var token;
    var UserData = [];

    async.auto({
        CheckOldPassword: [(cb)=> {//Check Old Password
          var criteria = {
              email : payloadData.email
          }
          Service.UserService.getUser(criteria, {}, {}, (err, data)=> {
            if(err){
                return cb(err);
            }else if(data.length > 0){
              //console.log(data);
              UserData = data;
              if (data[0].password != Utils.universalfunctions.encryptpassword(payloadData.oldPassword)) return cb(Responses.INCORRECT_OLD_PASS)
              if (data[0].password == Utils.universalfunctions.encryptpassword(payloadData.newPassword)) return cb(Responses.SAME_PASSWORD)
              return cb();
            }else{
                    return cb("user not found. Please try again later");
            }


          }) ////console.log("getUserData",err, data)

        }],
        UpdatePassword: ['CheckOldPassword', (r1, cb)=> {
            var criteria = {_id: UserData[0]._id};
            var setQuery = {
                password: Utils.universalfunctions.encryptpassword(payloadData.newPassword),
                passwordLastUpdated : Date.now(),
                isPasswordExpired : false
            };
            var options = {lean: true};
            Service.UserService.updateUser(criteria, setQuery, options, function (err, result) {
                if (err) return cb(err);
                return cb();
            });
        }]
    }, (err, result)=> {
        if(err) return callbackRoute(err);
        var value = {
          "statusCode": 200,
          "status": "success",
          "message": "Password Changed successfully.Please Login!"
        }
        return callbackRoute(value);
    });
};

//Get All schedules for a certail API
var getSchedules = function (payUserData,UserData, callbackRoute) { ////console.log("sadasdas",payloadData);
    //console.log(UserData);
    async.auto({
        getAgentSchedules: [(cb)=> { //console.log("GettingAgentSchedulesInDB==init");
        if(payUserData.id){
            var criteria = {
                agentId : UserData._id, 
                userId :  payUserData.id
            }
        }
        else{
            var criteria = {
                agentId : UserData._id
            }
        }
          //console.log('**************************************8',criteria);
            Service.Schedule.getAllData(criteria,(err, result)=> {
                if (err) return cb(err);
                // ContactId= result._id;
                // //console.log("result,result,result,result,result,result",result);
                var value = {
                  "statusCode": 200,
                  "status": "success",
                  "message": result
                }
                return cb(value)
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        var details1 = arraySort(result,'createdAt',{reverse: true});
        var value = {
          "statusCode": 200,
          "status": "success",
          "message": details1
        }
        // return cb(value)
        return callbackRoute(value);
    });
};

// var buyerGetSchedules = function (payUserData,UserData, callbackRoute) { ////console.log("sadasdas",payloadData);
//     //console.log(UserData);
//     async.auto({
//         getAgentSchedules: [(cb)=> { //console.log("GettingAgentSchedulesInDB==init");
//         var criteria = {
//             agentId : UserData._id, 
//             userId :  payUserData.id
//         }
//           //console.log('**************************************8',criteria);
//             Service.Schedule.getAllData(criteria,(err, result)=> {
//                 if (err) return cb(err);
//                 // ContactId= result._id;
//                 // //console.log("result,result,result,result,result,result",result);
//                 var value = {
//                   "statusCode": 200,
//                   "status": "success",
//                   "message": result
//                 }
//                 return cb(value)
//             });
//         }]
//     }, (err, result)=> {
//         if (err) return callbackRoute(err);
//         var details1 = arraySort(result,'createdAt',{reverse: true});
//         var value = {
//           "statusCode": 200,
//           "status": "success",
//           "message": details1
//         }
//         // return cb(value)
//         return callbackRoute(value);
//     });
// };


//Get A SIngle Schedule
var getSchedule = function (payUserData,UserData, callbackRoute) { ////console.log("sadasdas",payloadData);
    //console.log(UserData);
    async.auto({
        getAgentSchedule: [(cb)=> { //console.log("GettingAgentScheduleFromDB==init");
        var criteria = {
            agentId : UserData._id,
            _id : payUserData.id
        }
          //console.log(criteria);
            Service.Schedule.getSingleData(criteria,(err, result)=> {
                if (err) return cb(err);
                // ContactId= result._id;
                // //console.log("result,result,result,result,result,result",result);
                var value = {
                  "statusCode": 200,
                  "status": "success",
                  "message": result
                }
                return cb(value);
            });
        }]
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        var value = {
          "statusCode": 200,
          "status": "success",
          "message": result
        }
        // return cb(value)
        return callbackRoute(value);
    });
};


//Testing automatic lead Assignment
var testLeads = function (payloadData, callbackRoute) {
  async.auto({
          savingSchedule:[function(cb){
              var objToSave = payloadData;
              objToSave.userType = "Buyer";
              // objToSave.assignedTo = "5ac324135aec95761a215985"
              Service.UserService.createUser(objToSave, (err, data)=> {
                    if (err) return cb(err);
                    //console.log("result,result,result,result,result,result",data);
                    return cb()
              })

          }],assignBuyerLead: ['savingSchedule',function (r1,cb){
            Service.UserService.assignBuyerLead(payloadData, (err, leadDetails)=> {
                  if (err) return cb(err);
                  // ContactId= result._id;
                  // //console.log("result,result,result,result,result,result",leadDetails);
                  return cb(leadDetails);
            })
        }]
    }, (err, result)=> {
      if (err) return callbackRoute(err);
      return callbackRoute(null, {
          "statusCode": 200,
          "status": "success",
          "message": result
      })
  });
};


var createPassword = function (payloadData , callback) { //console.log("resetForgotPassword===init");
//console.log(payloadData)
    var passwordhash;
    var confirm_passwordhash;
    async.waterfall([
            function (cb) { //console.log("init===2");
                passwordhash = Utils.universalfunctions.encryptpassword(payloadData.password); //hashing password
                //confirm_passwordhash = Utils.universalfunctions.encryptpassword(params.confirm_password); //hashing password
                jwt.verify(payloadData.createPasswordToken, Configs.CONSTS.jwtkey, function (err, decode) { // checking token expiry
                    if (err) {
                        
                        cb(Responses.FORGOT_PASSWORD_TOKEN_EXPIRED)
                    } else {
                        cb(null,decode);
                    }
                });
            },
            function (decode,cb) { //console.log("init===3");
            //console.log('decode')
            //console.log(decode)
                var criteria = {
                    _id : decode.id
                };
                var objToUpdate = {
                    password : passwordhash,
                    isEmailVerified : true,
                    isPasswordExpired : false,
                    createPasswordToken : " "
                };
                Service.UserService.updateUser(criteria, objToUpdate, {new:true}, function (err, res) {
                    //console.log('errrrrooorrrrrr',err)
                    if (err) return cb(err);
                    if (res == null) return cb(Utils.responses.tokenNotExist);
                    return cb()
                })
            }
        ], function (err, result) {
            if (err) return  callback(err)
            return callback()
        })
}

// Delete Favourite Listings API
var deleteFavouriteListings = function (payloadData, UserData, callbackRoute) {
    async.auto({
        updateFunnelData: [(cb)=> {
            var criteria= {
                user:UserData._id,
                _id : payloadData.favId
            }
            Service.deleteBuyerServices.deleteFavourites(criteria,(err,data)=> {
                if(err){
                  var value = {
                        statusCode: 500,
                        status: "Error",
                        message: 'Internal DB error. Please try again later'
                  }
                  //console.log("+++++++++++++++++++++deleteFavouritesListing:::AdminController++++++++++++++++++++++++++");
                  //console.log("DB Err::::::::::");
                  //console.log(err);
                  //console.log("+++++++++++++++++++++deleteFavouritesListing:::AdminController++++++++++++++++++++++++++");
                  return cb(value);
                }else if(data){
                    var value = {
                          statusCode: 200,
                          status: "Success",
                          message: 'Favourite Property deleted successfully'
                    }
                    return cb(value);
                }else{
                  var value = {
                      statusCode: 200,
                      status: "Success",
                      message: 'No Favourites Found'
                  }
                  return cb(value);
                }
            });

        }],
    }, (err, result)=> {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

// Get User API
var getUser = function (payloadData,UserData,callbackRoute) {  ////console.log("getFavouriteProperties===init",payloadData);
      //console.log("In Get User API");
      //console.log("UserData",UserData);
      // return
     async.auto({
       getUserDataofRegisterUser: [(cb)=> {
              return cb();
       }],

     },function(err,result){ //console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            userDetails: Utils.universalfunctions.deleteUnnecessaryUserData(UserData)
        });
     })
}
module.exports = {
    registerUser                : registerUser,
    login                       : login,
    Logout                      : Logout,
    ChangedPassword             : ChangedPassword,
    forgotPassword              : forgotPassword,
    resetForgotPassword         : resetForgotPassword,
    verifyForgotPasswordToken   : verifyForgotPasswordToken,
    resentEmailVerificationLink : resentEmailVerificationLink,
    verifyEmailToken            : verifyEmailToken,
    getAllUsers                 : getAllUsers,
    contactUs                   : contactUs,
    testPushNotifications       : testPushNotifications,
    getPostDetail               : getPostDetail,
    saveListing                 : saveListing,
    getsaveListing              : getsaveListing,
    deleteListing               : deleteListing,
    saveSearch                  : saveSearch,
    getSearchData               : getSearchData,
    deletSearchData             : deletSearchData,
    updateProfile               : updateProfile,
    savePropertiesLooked        : savePropertiesLooked,
    getAllpost                  : getAllpost,
    markfavoriteListing         : markfavoriteListing,
    landingPageApi              : landingPageApi,
    propertyValuation           : propertyValuation,
    savePolygon                 : savePolygon,
    socialLogin                 : socialLogin,
    getFavouriteProperties      : getFavouriteProperties,
    getPageData                 : getPageData,
    landingPageFormApi          : landingPageFormApi,
    saveSchedule                :  saveSchedule,
    contactUsForm               : contactUsForm,
    scheduleShowing             : scheduleShowing,
    ChangeExpirePassword        : ChangeExpirePassword,
    getSchedules                : getSchedules,
   // buyerGetSchedules           : buyerGetSchedules,
    getSchedule                 : getSchedule,
    updateSaveSearch            : updateSaveSearch,
    testLeads                   : testLeads,
    createPassword              : createPassword,
    deleteFavouriteListings     : deleteFavouriteListings,
    getUser                     : getUser,
    getsavedListing             :getsavedListing
 }
