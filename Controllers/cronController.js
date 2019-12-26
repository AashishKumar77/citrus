/*--------------------------------------------
 * Include internal modules.
 ---------------------------------------------*/

const Models = require('../Models');
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
const CLOUDCMA_API_KEY = APP_CONSTANTS.CLOUDCMA_API_KEY;
const DBCommonFunction = Utils.DBCommonFunction;
const RetsPropertyRD_1_Controller = require("./retsPropertyRD_1_Controller");
/*--------------------------------------------
 * Include external modules.
 ---------------------------------------------*/
const async = require('async');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs');
const _ = require('underscore');
const moment = require('moment');
const Mongoose = require('mongoose');
var mongoose = require('mongoose');
var Path = require('path');
var nodeRestClient = require('node-rest-client').Client;
nodeRestClient = new nodeRestClient();
const downloadFile = require('download-file');
const extractFile = require('extract-zip');
var rimraf_deleteFolder = require('rimraf');
var eb = require('easybars');
var uniqid  = require('uniqid');
var RA_2_getData = "http://rets.citruscow.com/get_data/RD_1/";
var getData_link = "http://rets.citruscow.com/get_data/";
// var getData_link = "http://rets.citruscow.com/update_data/RA_2";
var getClassAndCount = "http://rets.citruscow.com/get_count";
var nodemailer = require('nodemailer');

var request = require('request');
////console.log("CLOUDCMA_API__KEY",CLOUDCMA_API_KEY);
var RD_1_Properties = function(payload, callbackRoute) {
//   var transporter = nodemailer.createTransport({
//     service: 'smtp',
//     auth: {
//            user: 'Matrix Marketers',
//            pass: 'BHryGX5ONH57s88brqzj7w'
//        }
//    });
//    const mailOptions = {
//     user: '',
//     from: 'testing.matrixmarketers@gmail.com', // sender address
//     to: 'savita@matrixmarketers.com', // list of receivers
//     subject: 'Cron started', // Subject line
//     html: '<p>Cron started</p>'// plain text body
//   };

//   transporter.sendMail(mailOptions, function (err, info) {
//     if(err)
//       console.log(err)
//     else
//       console.log(info);
//  });
console.log('corn started')
  var isExist = false;
  var lastId;
  var propertyArray = [ 'RD_1', 'RA_2', 'MF_3', 'LD_4'];
  //var propertyArray = [ 'MF_3'];
  // var propertyArray = ['RA_2'];

  async.each(propertyArray,function(item1, cb){
      // //console.log("WORKING FOR THE following details",item1);
      var url = "http://rets.citruscow.com/latest_data/"+item1;
      //var url = "http://rets.citruscow.com/get_data/MF_3/100/0"
      //console.log("The URL is",url);
      request.get(url, (error, response, body) => { //starting request
      // console.log("Body",body);
      // return false
        if(error) {
          
          }else{
            var profile = JSON.parse(body);
            // fs.writeFileSync("")
            var arr = {};
            arr = profile.data;
            // //console.log(arr);
            // //console.log("Profulee ::::::::",arr);
            async.each(arr,function(item, cb){ //Async function starts here
                // //console.log("Item Details",item);
                async.auto({
                  checkPropertyExistORNot:[(cb)=>{
                      var criteria= {
                          l_listingid:item.l_listingid
                      };
                      isExist = false;
                      // //console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
                      // //console.log("Criteria for DB search = ",criteria);
                      // //console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");

                      var projection={l_listingid:1};
                      var options= {lean:true};
                      //return cb(criteria)
                     Service.REST_PROPERY_RD_1_Service.getData_test(criteria,projection,(err,data)=> { ////console.log("===erredatarrerr===",err,data)
                          if (err)  return cb(err);
                          if(data.length>0){
                             // //console.log(data[0].l_listingid);
                             //  //console.log("Is Exist Is true in this CASE",criteria,data[0].l_listingid);
                              isExist=true;
                              return cb(null,{criteria:criteria,data:data});
                              // lastId = data[0]._id;
                              // propertyAutoIncrement = data[0].propertyAutoIncrement
                          }else{
                              isExist=false;
                             return cb(null,{criteria:criteria,data:data});
                          }

                          //return cb(item);
                     });
                  }],
                  insertIntoDb:['checkPropertyExistORNot',(r1,cb)=>{
                      if(isExist==false){
                          //console.log("New Property Added",item.l_listingid);
                         item.isDeleted = false;
                         item.l_listingdate_unix = moment(moment(item.l_listingdate).format('YYYY-MM-DD')).unix();
                         var longitude = parseFloat(item.longitude);
                         var latitude = parseFloat(item.lat);
                         // //console.log(item.l_listingid);
                         // //console.log("LONGITUDE :::::::",longitude);
                         // //console.log("LATITUDEV ::::::::::::",latitude);
                         if(item.longitude === NaN){
                             longitude = 0.0
                         }
                         if(item.lat === NaN){
                             latitude = 0.0
                         }
                         item.location = {
                                            "coordinates" : [longitude ,latitude],
                                            "type" : "Point"
                                          }
                         Service.REST_PROPERY_RD_1_Service.InsertData(item,(err, data)=> { ////console.log("===erredatarrerr===", data)
                             if (err)  return cb(err);
                             lastId = data._id;
                             console.log("Data Added");
                             return cb();
                         });
                      }else{
                          return cb();
                      }
                  }],
                  update:['checkPropertyExistORNot',(r1,cb)=>{ ////console.log("===update==init===");
                      if(isExist==true){ ////console.log("===update==init=data==",lastId,propertyAutoIncrement);
                         // var criteria = {
                         //   _id:mongoose.Types.ObjectId(lastId)
                         //  }
                         //console.log("Property Updated",item.l_listingid);
                         var criteria = {
                              l_listingid:item.l_listingid
                         }
                          // //console.log(item.l_listingid);
                          var longitude = parseFloat(item.longitude);
                          var latitude = parseFloat(item.lat);
                          // //console.log("LONGITUDE :::::::",longitude);
                          // //console.log("LATITUDEV ::::::::::::",latitude);
                          if(item.longitude === NaN){
                              longitude = 0.0
                          }
                          if(item.lat === NaN){
                              latitude = 0.0
                          }
                          item.location = { "coordinates" : [ longitude ,latitude],
                                               "type" : "Point"
                                           }
                         var dataToSet = {allData:item};
                         //console.log('item Changes',item)
                         //lm_char1_36
                          // var dataToSet = Object.assign(defalutObject, item); //lm_char1_36

                          item.l_listingdate_unix = moment(moment(item.l_listingdate).format('YYYY-MM-DD')).unix();
                          item.updatedAt =  new Date().toISOString();
                         // dataToSet.location = location;
                         item.isDeleted = false;
                         Service.REST_PROPERY_RD_1_Service.updateData(criteria,item,{new:true},(err, data)=> { ////console.log("===eruuuurerrerr===", data)
                             if (err)  return cb(err);
                             // //console.log("Data Updated");
                             return cb();
                         });
                      }else{
                          return cb();
                      }
                  }],
                }, function(err, result) {
                  if (err)
                    return cb(err);
                  return cb(); //null,result.createPagination
                })

            }, function(err){
                if(err){
                  //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                  //console.log("In RD_1 Properties Async.each ::::::::::::::ERROR");
                  //console.log(err);
                  //console.log("In RD_1 Properties Async.each ::::::::::::::ERROR");
                  //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                }else{
                  //JUst Testing
                  var url1 = "http://rets.citruscow.com/master_listing_data/"+item1;
                  // //console.log("URL 111 : ",url1);
                  request.get(url1, (error2, response, body2) => {
                      if(error2){
                          // //console.log("ERROR 2",error2);
                      }else{
                        var profile = JSON.parse(body2);
                        var arr2 = {};
                        arr2 = profile.data;
                        var deleteCriteria;
                        var del = true;
                        // //console.log("Reaching",item1);
                        if(item1 === 'RD_1'){
                          // //console.log();
                          deleteCriteria = {
                              l_listingid : { $nin : arr2 },
                              lm_char1_36 : "Residential Detached"
                          }
                        }else if(item1 === 'RA_2'){
                          deleteCriteria = {
                              l_listingid : { $nin : arr2 },
                              lm_char1_36 : "Residential Attached"
                          }
                        }else if(item1 === 'MF_3'){
                          deleteCriteria = {
                              l_listingid : { $nin : arr2 },
                              lm_char1_36 : "Multifamily"
                          }
                        }else if(item1 === 'LD_4'){
                          deleteCriteria = {
                              l_listingid : { $nin : arr2 },
                              lm_char1_36 : "Land Only"
                          }
                        }else{
                            del = false;
                        }

                        // //console.log("CRITERIA FOR DELETIONS ::::",deleteCriteria);
                        if(del === true){
                          Service.REST_PROPERY_RD_1_Service.deleteOutdatedProperties(deleteCriteria,(err, data)=> { ////console.log("===eruuuurerrerr===", data)
                              if (err)  return cb(err);
                              // //console.log(data);
                              // //console.log("Data Deleted");
                          });
                        }else{
                          return callbackRoute();
                        }
                    }
                  });
                }
            });//Async function ends here
          }
      }); //CLosing Request
  },function(err){
      if(err){
          // //console.log("Something went wrong while importing data");
      }else{

      //   var transporter = nodemailer.createTransport({
      //     service: 'smtp',
      //     auth: {
      //            user: 'Matrix Marketers',
      //            pass: 'BHryGX5ONH57s88brqzj7w'
      //        }
      //    });
      //    const mailOptions = {
      //     user: '',
      //     from: 'testing.matrixmarketers@gmail.com', // sender address
      //     to: 'savita@matrixmarketers.com', // list of receivers
      //     subject: 'Cron ended', // Subject line
      //     html: '<p>Cron ended</p>'// plain text body
      //   };
      
      //   transporter.sendMail(mailOptions, function (err, info) {
      //     if(err)
      //       console.log(err)
      //     else
      //       console.log(info);
      //  });


          console.log("Data for all Property Classes Imported Successfully");
      }
  });
};

var PropertyClass = function(payload, callbackRoute) {

  var apiData=[],PaginationDataArray=[];
  async.auto({
    hitExternalAPI: [
      function(cb) {
        nodeRestClient.get(getClassAndCount, function(data, response) {
          //console.log("hitExternalAPI===c",data);

            apiData =  [];
            if(data.RD_1){
            	apiData.push({className:'RD_1',totalRecords:data.RD_1,createdAt:new Date().toISOString()})
            }
            if(data.RA_2){
            	apiData.push({className:'RA_2',totalRecords:data.RA_2,createdAt:new Date().toISOString()})
            }
            if(data.MF_3){
            	apiData.push({className:'MF_3',totalRecords:data.MF_3,createdAt:new Date().toISOString()})
            }
            if(data.LD_4){
            	apiData.push({className:'LD_4',totalRecords:data.LD_4,createdAt:new Date().toISOString()})
            }

            //console.log('dfdsfsdfsd ',apiData);
            return cb();
        })
      }
    ],
    InsertIntoDB: [
      'hitExternalAPI',
      function(ag1, Outercb) {
        async.eachSeries(apiData, function(item, InnerCb) {
          var criteria = {
            className: item.className
          }
          var isExists = false;
          async.auto({
            checkClassExistsOrNot: [
              function(cb) {
                Service.PROPERTY_CLASS_SERVICE.getData(criteria, {}, {
                  lean: true
                }, function(err, result) {
                  if (err)
                    return cb(err);
                  if (result.length > 0) {
                    isExists = true
                  }
                  return cb();
                });
              }
            ],
            InsertData: [
              'checkClassExistsOrNot',
              function(ag2, cb) {
                if (isExists == false) {
                  Service.PROPERTY_CLASS_SERVICE.InsertData(item, function(err, result) {
                    if (err)
                      return cb(err);
                    return cb();
                  });
                } else {
                  return cb();
                }
              }
            ],
            updateDta: [
              'checkClassExistsOrNot',
              function(ag3, cb) {
                if (isExists) {
                  item.updatedAt = new Date().toISOString();
                  delete item.createdAt;
                  Service.PROPERTY_CLASS_SERVICE.updateData(criteria, item, {
                    new: true
                  }, function(err, result) { ////console.log("hitExternalAPI==item",item);
                    if (err)
                      return cb(err);
                    return cb();
                  });
                } else {
                  return cb();
                }
              }
            ]
          }, function(err, result) {
            if (err)
              return InnerCb(err);
            return InnerCb();
          })
        }, function(err, res) {
          if (err)
            return Outercb(err);
          return Outercb();
        })
      }
    ],
    createPagination: [
      'hitExternalAPI',
      function(ag4, cb) {
        createPaginationArray(apiData, function(err, result) {
          if (err)
            return cb(err);
          PaginationDataArray = result;
          return cb(null, {
            PaginationDataArray: PaginationDataArray,
            apiData: apiData
          });
        })
      }
    ],
    clearMainCollection: [
      'hitExternalAPI',
      'createPagination',
      'InsertIntoDB',
      function(ag4, cb) {
        Service.MAIN_PROPERTY_SERVICE.deleteAllRecord({}, {}, (err, data) => {
          if (err)
            return cb(err);
          return cb();
        });
      }
    ],
    getPropertyDataAndInsert: [
      'clearMainCollection',
      function(ag4, cb) {
        InsertAndUpdateData(PaginationDataArray, function(err, result) {
          if (err)
            return cb(err);
          return cb();
        })
      }
    ]

  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute(); //null,result.createPagination
  })
};

var createPaginationArray = function(Data, callback) {
  var limit = 100;
  var PaginationArray = [];

  async.eachSeries(Data, function(item, InnerCb) {
    var tempData = item;
    var numperOfPages = 1;
    var apiDataArray = []
    numperOfPages = Math.ceil(tempData.totalRecords / limit);
    tempData.totalPages = numperOfPages;
    tempData.limit = limit;
    for (i = 0; i < numperOfPages; i++) {
      apiDataArray.push({
        limit: limit,
        skip: i * limit
      })
    }
    tempData.apiDataArray = apiDataArray;
    PaginationArray.push(tempData)
    return InnerCb();
  }, function(err, result) {
    if (err)
      return callback(err);
    return callback(null, PaginationArray);
  })
}

var InsertAndUpdateData = function(Data, mainCallback) {
  async.eachSeries(Data, function(item, OuterCb) {
    var className = item.className
    async.eachSeries(item.apiDataArray, function(Inneritem, InnerCb) {
      ////console.log("xxx",getData_link+className+"/"+Inneritem.limit+"/"+Inneritem.skip);
      nodeRestClient.get(getData_link + className + "/" + Inneritem.limit + "/" + Inneritem.skip, function(data, response) { ////console.log("data",data)
        RetsPropertyRD_1_Controller.InsertPropertyRD_1_Data(data.data, (err, result) => {
          if (err)
            return InnerCb(err);
          return InnerCb(null, {data: data.data})
        })
      }) //return InnerCb(Inneritem);
    }, function(err, result) {
      if (err)
        return OuterCb(err);
      return OuterCb();
    });
  }, function(err, result) {
    if (err)
      return mainCallback(err);
    return mainCallback();
  })
}

var restPropertyRD_1 = function(payload, callback) {
  var limit = 10;
  var templimit = 24000;
  var skip = 7000
  var totalRecord = 0;
  var apiDataArray = [],
    numperOfPages = 1
  nodeRestClient.get(RA_2_getData + templimit + "/" + skip, function(data, response) { ////console.log("xxxdata",data)
    totalRecord = data.total_records
    if (totalRecord <= limit) {
      apiDataArray.push({limit: 10, skip: 0})
    } else {
      numperOfPages = Math.ceil(totalRecord / limit);
      for (i = 0; i < numperOfPages; i++) {
        apiDataArray.push({
          limit: limit,
          skip: i * limit
        })
      }
    }/*return callback(null, {
           	   data:totalRecord,
           	   numperOfPages:numperOfPages,
           	   apiDataArray:apiDataArray
		 	   //data:JSON.parse(data.data),
		    })*/
    ////console.log("apiDataArray",apiDataArray);
    async.eachSeries(apiDataArray, function(item, InnerCb) { ////console.log("xxxx",RA_2_getData+templimit+"/"+skip);
      //console.log("item", item, RA_2_getData + item.limit + item.skip);
      var dd = {
        item: item,
        cv: RA_2_getData + item.limit + "/" + item.skip
      }
      //return InnerCb(dd);
      nodeRestClient.get(RA_2_getData + item.limit + "/" + item.skip, function(data, response) { ////console.log("data",data)
        RetsPropertyRD_1_Controller.InsertPropertyRD_1_Data(data.data, (err, result) => {
          if (err)
            return InnerCb(err);
          return InnerCb(null, {
            data: data.data,
            //data:JSON.parse(data.data),
          })
        })
        //return InnerCb(data.data);
      }) //return InnerCb();
    }, function(err, res) {
      if (err)
        return callback(err);
      return callback();
    })
  });
}

var sendEmailToUser = function(payload, callbackRoute) {
  var funnelIdArray = [],
    funneldataArray = [],
    userList = [];
  async.auto({
    getFunnel: [(cb) => {
        var criteria = {
          emailTemplateHtml: {
            $exists: true
          },
          noOfDays: {
            $exists: true
          }
        }
        var projection = {
          _id: 1,
          emailTemplateHtml: 1,
          noOfDays: 1
        }
        Service.FUNNEL_SERVICE.getData(criteria, projection, {}, (err, data) => {
          if (err)
            return cb(err);
          funneldataArray = data;
          data.forEach(function(element) {
            //funnelIdArray.push(element._id.toString())
            funnelIdArray.push(Mongoose.Types.ObjectId(element._id))
          })
          return cb();
        });
      }
    ],
    getUerList: [
      'getFunnel',
      (ag1, cb) => {
        var match = {
          $match: {
            "funnelId": {
              $in: funnelIdArray
            }
          }
        }
        var groupBy = {
          $group: {
            _id: "$funnelId",
            UserData: {
              $push: {
                email: "$email",
                firstName: "$firstName",
                lastName: "$lastName",
                emailSendDate: "$emailSendDate"
              }
            }
          }
        }
        DBCommonFunction.aggregate(Models.CONTACTFORM, [
          match, groupBy
        ], (err, data) => {
          if (err)
            return cb();
          userList = data;
          return cb(null, {
            match: match,
            userList: userList
          });
        })
      }
    ],
    sendEmail: [
      'getUerList',
      'getFunnel',
      (ag2, OuterCb) => {
        sendEmailToBuyerOrSeller(userList, funneldataArray, function(err, result) {
          if (err)
            return OuterCb(err);
          return OuterCb();
        })
      }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })
}

var sendEmailToUser_new = function(payload, callbackRoute) {
  var funnelIdArray = [],
    funneldataArray = [],
    userList = [];
  async.auto({
    getFunnel: [(cb) => {
        var criteria = {
          emailTemplateHtml: {
            $exists: true
          },
          noOfDays: {
            $exists: true
          }
        }
        var projection = {
          _id: 1,
          emailTemplateHtml: 1,
          noOfDays: 1
        }
        Service.FUNNEL_SERVICE.getData(criteria, projection, {}, (err, data) => {
          if (err)
            return cb(err);
          funneldataArray = data;
          return cb();
        });
      }
    ],
    getUerList: [
      'getFunnel',
      (ag1, OuterCb) => {
        async.eachSeries(funneldataArray, function(item, InnerCb) {
          // var currentDate    = moment().format('YYYY-MM-DD');
          var d = new Date();
          var time = d.getTime();
          var days = (item.noOfDays) * 86400000;
          var oldDate = (time - days);
          // d.setDate(d.getTime()-7);
          var newDate = new Date(oldDate);
          // var newDate     = moment(moment().add(-item.noOfDays, 'day')).format('YYYY-MM-DD');
          // newDate   = new Date(newDate);
          var match = {
            $match: {
              "funnelId": {
                $in: [Mongoose.Types.ObjectId(item._id)]
              },
              emailSendDate: {
                $lte: newDate
              }
            }
          }
          var groupBy = {
            $group: {
              _id: "$funnelId",
              UserData: {
                $push: {
                  email: "$email",
                  firstName: "$firstName",
                  lastName: "$lastName",
                  emailSendDate: "$emailSendDate",
                  agentId: "$agentId"
                }
              }
            }
          }; ////console.log("currentDate",currentDate,"newDate",newDate,item.noOfDays,new Date());
          DBCommonFunction.aggregate(Models.CONTACTFORM, [
            match, groupBy
          ], (err, data) => {
            if (err)
              return InnerCb(err);
            if (data.length > 0) {
              var dt = data[0];
              dt.noOfDays = item.noOfDays
              dt.emailTemplateHtml = item.emailTemplateHtml;
              userList.push(dt);
            }
            return InnerCb(null, {
              match: match,
              userList: userList
            });
          })
          //return InnerCb(item);
        }, function(err, restult) {
          if (err)
            return OuterCb(err);
          return OuterCb();
        })
      }
    ],
    sendEmail: [
      'getUerList',
      'getFunnel',
      (ag2, OuterCb) => { //return OuterCb(userList);
        sendEmailToBuyerOrSeller_new(userList, funneldataArray, function(err, result) {
          if (err)
            return OuterCb(err);
          return OuterCb();
        })
      }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })

}
var sendEmailToBuyerOrSeller_new = function(userList, funnelList, callbackRoute) {
  //console.log("sendEmailToBuyerOrSeller_new==init")
  async.auto({
    sendData: [(mainCb) => {
        //console.log("sendData==init")
        async.eachSeries(userList, function(itemFirst, OuterCb) {
          var tempData = itemFirst;
          var funnelId = tempData._id;
          var emailTemplateHtml = itemFirst.emailTemplateHtml;
          var noOfDays = itemFirst.noOfDays;
          var sendEmail = true;
          async.eachSeries(tempData.UserData, function(itemSecond, InnerCb) {
            async.auto({
              getAgentHolidays: [(cb) => {
                  //console.log("getAgentHoliday===init");
                  // var d = new Date();
                  // var time = d.getTime();
                  // var days = (item.noOfDays) * 86400000;
                  // var oldDate = (time - days);
                  //  d.setDate(d.getTime()-7);
                  // var newDate = new Date(oldDate);
                  var holidayDate = moment(moment(itemSecond.emailSendDate).add(noOfDays, 'day')).format('YYYY-MM-DD'); //DD MM YYYY
                  var startholidayDate = moment(moment(holidayDate).add(-1, 'day')).format('YYYY-MM-DD');
                  var endholidayDate = moment(moment(holidayDate).add(1, 'day')).format('YYYY-MM-DD');
                  startholidayDate = moment(startholidayDate).set({hour: 23, minute: 59, second: 59, millisecond: 0});

                  holidayDate = new Date(holidayDate);
                  startholidayDate = new Date(startholidayDate);
                  endholidayDate = new Date(endholidayDate);
                  var criteria = {
                    agentId: itemSecond.agentId,
                    holidayDate: {
                      $gte: startholidayDate,
                      $lt: endholidayDate
                    }
                  }
                  var options = {}
                  Service.Holiday_SERVICE.getData(criteria, {}, options, (err, data) => {
                    if (err)
                      return cb(err);

                    //finalData = data;
                    if (data.length > 0) {
                      sendEmail = false;
                    }
                    return cb(null, {
                      error: "xx",
                      noOfDays: noOfDays,
                      holidayDate: holidayDate,
                      startholidayDate: startholidayDate,
                      endholidayDate: endholidayDate,
                      itemSecond: itemSecond,
                      criteria: criteria,
                      data: data
                    });
                  });
                }
              ],
              sendEmailToUser: [
                'getAgentHolidays',
                (ag1, cb) => {
                  //console.log("sendEmailToUser===init==");
                  if (sendEmail == true) {
                    var emailTemplate = '';
                    var oldstring = "{{name}}";
                    var newstring = itemSecond.firstName;
                    if (itemSecond.lastName) {
                      newstring = newstring + " " + itemSecond.lastName
                    }
                    while (emailTemplateHtml.indexOf(oldstring) > -1) {
                      emailTemplateHtml = emailTemplateHtml.replace(oldstring, newstring);
                    }
                    var email_data = { // set email variables for user
                      to: itemSecond.email,
                      from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                      subject: 'testing',
                      html: emailTemplateHtml
                    };
                    Utils.universalfunctions.send_email(email_data, (err, res) => {
                      if (err)
                        return cb(err);
                      return cb()
                    });
                  } else {
                    return cb()
                  }
                }
              ],
              updateEmailSendDate: [
                'getAgentHolidays',
                (ag2, cb) => {
                  if (sendEmail == true) {
                    var criteria = {
                      email: itemSecond.email
                    }
                    var dataToSave = {
                      emailSendDate: new Date().toISOString()
                    };
                    Service.ContactFormService.updateData(criteria, dataToSave, {
                      new: true
                    }, function(err, result) {
                      if (err)
                        return cb(err);
                      return cb();
                    });
                  } else {
                    return cb();
                  }
                }
              ]
            }, function(err, restult) {
              if (err)
                return InnerCb(err);
              return InnerCb();
            })
          }, function(err, restult) {
            if (err)
              return OuterCb(err);
            return OuterCb();
          })
        }, function(err, restult) {
          if (err)
            return mainCb(err);
          return mainCb();
        })
      }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })
}

var sendEmailToBuyerOrSeller = function(userList, funnelList, callbackRoute) {
  async.auto({
    sendData: [(mainCb) => {
        async.eachSeries(userList, function(itemFirst, OuterCb) {
          var tempData = itemFirst;
          var funnelId = tempData._id;
          var emailTemplateHtml;
          var noOfDays;
          funnelList.forEach(function(element) { ////console.log("funnelId",funnelId.toString(),"element",element._id.toString());
            if (funnelId.toString() == element._id.toString()) {
              emailTemplateHtml = element.emailTemplateHtml;
              noOfDays = element.noOfDays;
            }
          })
          async.eachSeries(tempData.UserData, function(itemSecond, InnerCb) {
            if (itemSecond.emailSendDate) {
              var userDate = moment(itemSecond.emailSendDate).format('DD-MM-YYYY');
              var newDate = moment(moment(userDate).add(noOfDays, 'day')).format('DD-MM-YYYY'); //DD MM YYYY
            }
            ////console.log("userDate",userDate,'newDate',newDate,noOfDays)
            async.auto({
              sendEmailToUser: [(cb) => { ////console.log("itemSecond",itemSecond);
                  var emailTemplate = '';
                  var oldstring = "{{name}}";
                  var newstring = itemSecond.firstName;
                  if (itemSecond.lastName) {
                    newstring = newstring + " " + itemSecond.lastName
                  }
                  while (emailTemplateHtml.indexOf(oldstring) > -1) {
                    emailTemplateHtml = emailTemplateHtml.replace(oldstring, newstring);
                  }
                  var email_data = { // set email variables for user
                    to: itemSecond.email,
                    from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                    subject: 'testing',
                    html: emailTemplateHtml
                  };
                  /*Utils.universalfunctions.send_email(email_data, (err, res)=> {
								if (err)return cb(err);
								return cb()
							}); */
                  return cb()
                }
              ],
              updateEmailSendDate: [(cb) => {
                  var criteria = {
                    email: itemSecond.email
                  }
                  var dataToSave = {
                    emailSendDate: new Date().toISOString()
                  };
                  Service.ContactFormService.updateData(criteria, dataToSave, {
                    new: true
                  }, function(err, result) {
                    if (err)
                      return cb(err);
                    return cb();
                  });
                }
              ]
            }, function(err, restult) {
              if (err)
                return InnerCb(err);
              return InnerCb();
            })
          }, function(err, restult) {
            if (err)
              return OuterCb(err);
            return OuterCb();
          })
        }, function(err, restult) {
          if (err)
            return mainCb(err);
          return mainCb();
        })
      }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })
}

var sendEmailToAgent = function(payload, callbackRoute) {}
var Insertschool = function(filePath, callbackRoute) { ////console.log("filePath",filePath.features);
  var DataArray = [];
  var urlArray = [
    {
      url: "http://cosmos.surrey.ca/geo_ref/Images/OpenDataArchives/Elementary_School_Catchments_JSON.zip",
      filename: "elementary_school_catchments.json"
    }, {
      url: "http://cosmos.surrey.ca/geo_ref/Images/OpenDataArchives/Secondary_School_Catchments_JSON.zip",
      filename: "secondary_school_catchments.json"
    }
  ];
  var tempFolderArray = [];
  async.auto({
    createDirectoryAndInsertData: [(firstOuterCb) => {
        async.eachSeries(urlArray, function(OuterItem, InnerCb) {
          var folder_Name = Utils.universalfunctions.generateRandomString(10) + '_' + moment().valueOf();
          var dowloadFileName = folder_Name + '.zip';
          tempFolderArray.push(folder_Name);
          var json_File_name = OuterItem.filename
          async.auto({
            makeTempDirectory: [(cb) => {
                var folder_Name_f = Utils.universalfunctions.makeDirectory_customFolder(folder_Name);
                return cb();
              }
            ],
            downloadZipFile: [
              'makeTempDirectory',
              (ag1, cb) => {
                var url = OuterItem.url
                var directory = "./Assets/schoolZipDowloads/" + folder_Name + "/"
                var options = {
                  directory: directory, //"./Assets/schoolZipDowloads/",
                  filename: dowloadFileName //"test.zip"
                }
                downloadFile(url, options, function(err) {
                  if (err)
                    return cb(err)
                  return cb(); ////console.log("meow")
                })
              }
            ],
            extractFZipFile: [
              'downloadZipFile',
              (ag2, cb) => {
                //console.log("extractFZipFile===init")
                //var source = "./Assets/test.zip";
                var source = "./Assets/schoolZipDowloads/" + folder_Name + "/" + dowloadFileName;
                var dir = path.join(__dirname, '../Assets/schoolZipDowloads/' + folder_Name + '/');
                extractFile(source, {
                  dir: dir
                }, function(err) { ////console.log("extractFZipFile===err",err)
                  if (err)
                    return cb(err)
                  return cb(); ////console.log("meow")
                })
              }
            ],
            InsertData: [
              'extractFZipFile',
              (ag3, mainCb) => {
                //var file_path =  require('../Assets/schoolZipDowloads/'+folder_Name+'/elementary_school_catchments.json');
                var file_path = require('../Assets/schoolZipDowloads/' + folder_Name + '/' + json_File_name);
                if (file_path.features) {
                  //console.log("if");
                  DataArray = file_path.features;
                } //
                ////console.log("DataArray===",DataArray);
                async.eachSeries(DataArray, function(item, OuterCb) { ////console.log("item===",item);
                  var tempData = {
                    schoolTitle: item.properties.SCHOOL_NAME,
                    schoolType: item.properties.SCHOOL_CATCHMENT_TYPE_2,
                    location: item.geometry
                  }
                  async.auto({
                    createSchool: [(cb) => {
                        var dataToSave = tempData;
                        Service.SCHOOL_SERVICE.InsertData(dataToSave, function(err, result) { ////console.log("err, result",err, result);
                          if (err)
                            return cb(err);
                          return cb();
                        });
                      }
                    ]
                  }, function(err, result) {
                    if (err)
                      return OuterCb(err);
                    return OuterCb();
                  })
                }, function(err, res) {
                  if (err)
                    return mainCb(err);
                  return mainCb();
                })
              }
            ]
          }, function(err, result) {
            if (err)
              return InnerCb(err);
            return InnerCb();
          })
        }, function(err, res) {
          if (err)
            return firstOuterCb(err);
          return firstOuterCb();
        })
      }
    ],
    removeTempFolder: [
      'createDirectoryAndInsertData',
      (ag4, OuterCb) => { //tempFolderArray
        //rimraf_deleteFolder
        async.eachSeries(tempFolderArray, function(item, InnerCb) {
          //console.log('item', item);
          var remove_dir = path.join(__dirname, '../Assets/schoolZipDowloads/' + item);
          rimraf_deleteFolder(remove_dir, function() {
            //console.log('done');
          });
          return InnerCb();
        }, function(err, res) {
          if (err)
            return OuterCb(err);
          return OuterCb();
        })
      }
    ]
  }, function(err, res) {
    if (err)
      return callbackRoute(err);
    return callbackRoute();
  })
}

var cloudcmaAPI = function(payload, callbackRoute) {
  var apiUrl = 'http://cloudcma.com/cmas/widget';
  console.log("IN CMA ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("payload=======", payload);
  var args = {
    //data: {
    api_key: CLOUDCMA_API_KEY,
    name: payload.name,
    email_to: payload.email_to,
    address: payload.address
    //},
    //headers: { "Content-Type": "application/json" }
  }
  request.post(apiUrl, {
    form: args
  }, function(err, httpResponse, body) {
    // //console.log("err",err);
    //     //console.log("httpResponse",httpResponse);
    //     //console.log("body==========",body);
    if (err)
      return callbackRoute(err);

    if (body === "Could not find any comparable listings on the MLS around that subject property address.") {
      var deta = "false"
      return callbackRoute(null, deta, body);
    } else {
      //console.log(body);
      var deta = "true"
      return callbackRoute(null, deta, body);
    }

    // //console.log("HTTP RESPONSE",httpResponse);

  })
  // return callbackRoute();
}

var cloudcmaAPICallback = function(payload, callbackRoute) {

  var apiUrl = 'http://cloudcma.com/cmas/widget';
 console.log("IN cloud api  call back CMA ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  // //console.log("payload=======",payload);

  var args = {
    api_key: CLOUDCMA_API_KEY,
    name: payload.name,
    email_to: "chetan@devs.matrixmarketers.com",
    address: payload.address,
    callback_url: 'http://api.citruscow.com/v1/admin/cloudCmaCallback',
    job_id: payload.job_id
  }
  request.post(apiUrl, {
    form: args
  }, function(err, httpResponse, body) {
    if (err){
      return callbackRoute(err);
    }
    if (body === "Could not find any comparable listings on the MLS around that subject property address.") {
      console.log('we are in body')
      var deta = "false"
      return callbackRoute(null, deta, body, httpResponse);
    } else {
      // console.log('body',body);
      // console.log('deta',deta);
      // console.log('httpResponse',httpResponse);
      var deta = "true"
      return callbackRoute(null, deta, body, httpResponse);
    }

    // //console.log("HTTP RESPONSE",httpResponse);

  })
  // return callbackRoute();
}




var FunnelEmailAndCma = function(payload, callbackRoute) {
  console.log('we are in funnel and cma api')
  // console.log("1")
  var userList = [];
  var funnelDetails = [];
  var unsubUser = false;
  async.auto({
    getUserList: [(cb) => {
        var criteria = {
          // funnelId: {
          //   $exists: true
          // }
        }

        var pro = {
          email: 1,
          firstName: 1,
          lastName: 1,
          funnelId: 1,
          address: 1,
          siteId: 1,
          formType: 1,
					createdAt : 1,
          phoneNumber : 1,
          assignedFunnel:1,
          unsubscribedUsers : 1
        }

        Service.ContactFormService.getData(criteria, pro, {
          lean: true
        }, (err, data) => {
          if (err)
            return cb(err);
        // console.log("datatatatatatatatatat",data);
          userList = data
          return cb();
        });
      }
    ],
    getFunnelDetails: [ 'getUserList',(ag11,cb) => {
      // console.log("2")
      console.log("userList",userList);
      // if(userList.length > 0){
        var criteria = {
          _id : userList[0].assignedFunnel[0].funnelId
      }
      var projection = {
          _v : 0
      }
      var options = {
          lean : true
      }
      Service.FUNNEL_SERVICE.getData(criteria, projection, options,(err,funnel_D)=> {
          if (err)  return cb(err);
          funnelDetails = funnel_D;
          //console.log("All Funnel Details :::::::::",funnelDetails);
          return cb();
      });
      // }else{
      //   funnelDetails = []
      //   return cb();
      // }
      //     console.log("Funnel Id",userList[0].funnelId);
         
    }],
    checkFunnelTemplateExistsAndSendEmail: [
      'getUserList','getFunnelDetails',
      (ag1, OuterCb) => {
        //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("userLIST",userList);
        // console.log("3")

        async.eachSeries(userList, function(item, InnerCb) {
          // var funnel_unsubscribe_list = funnelDetails[0].unsubscribedUsers;
          // // //console.log("Type of Item : ", typeOf(item._id));
          // //console.log("funnel_unsubscribe_list",funnel_unsubscribe_list);
          // //console.log("Item._id ++++++++++++++++++++++++++++++++++++++++++//////////////",item._id);
          // //console.log("!(funnel_unsubscribe_list.includes(userList[0]._id))++++++++++",funnel_unsubscribe_list.includes(item._id));
          // //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
          // var val = item._id.toString();
          // if(!(funnel_unsubscribe_list.includes(val))){
              var itemData = item;
              var sendEmail = false;
              var funnelTemplateData = [];
              var emailSendDate = null;
              var userLastEmailsend = false;
              var funnelIdArray = []
              var cloudcmaSend = false;
              var cloudcmaCreate = false;
              var themeData = {}
              var base64Image;
              async.auto({
                checkUnsubscribeUser: [(cb) => {
                      // console.log(item,"pppppppppppppppppppppp");
                       if(item.assignedFunnel.length > 0){


                      var criteria = {
                            _id : item.assignedFunnel[0].funnelId,
                            unsubscribedUsers : { $in : [item._id] }
                      }
                      Service.FUNNEL_SERVICE.checkData(criteria,(err,unsubscribedUsersDetails)=> {
                          if (err)  return cb(err);
                          if(unsubscribedUsersDetails){
                              // console.log("Reaching Herr");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("unsubscribedUsersDetails",unsubscribedUsersDetails);
                              unsubUser = true;
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                          }
                          // console.log("4")
                          // funnelDetails = funnel_D;
                          // //console.log("All Funnel Details :::::::::",funnelDetails);
                          return cb();
                      });
                    }else{
                      var value = {
                        statusCode: 400,
                      message:"something went wrong"
                    }
                      return cb(value);
                    }
                }],
                getEmailDetailoflastSend: [(cb) => {
                  // console.log("5")
                    // //console.log(item.formType);
                    // var criteria = {};
                    // if(item.formType === "homeworth"){
                    // 	criteria = {
                    // 		funnelId: item.funnelId
                    // 	}
                    // }else{
                    var criteria = {
                      funnelId: item.assignedFunnel[0].funnelId,
                      userId: item._id
                    }

                    var opt = {
                      lean: true,
                      sort: {
                        emailSendDate: -1
                      }
                    }
                    console.log(criteria,"criteriaooooooooooooooooooooooooooooo")
                     
                    Service.EmailSendDetail_SERVICE.getData(criteria, {}, opt, (err, data) => {
                      // console.log("error",err)
                      // console.log("hieeee13",data)
                      if (err)
                        return cb(err);
                      if (data.length > 0) {
                        // console.log("hieeee12",data)
                        data.forEach(function(element) {
                          funnelIdArray.push(element.funneltemplateId)
                        });
                        userLastEmailsend = true;
                        emailSendDate = data[0].emailSendDate
                      }
                      return cb(null, {
                        criteria: criteria,
                        funnelIdArray: funnelIdArray,
                        data: data
                      });
                    });

                  }
                ],
                getfunnelTemplate: [
                  'getEmailDetailoflastSend',
                  (ag1, cb) => {
                    var criteria = {
                      funnelId: item.assignedFunnel[0].funnelId,
                      _id: {
                        $nin: funnelIdArray
                      }
                    }
                    //console.log("CRITERIAAAAAAAAAAAAAAAAAAAAA",criteria);
                    var opt = {
                      lean: true,
                      sort: {
                        emailTimeInterval: 1
                      }
                    }
                    Service.FUNNEL_TEMPLATE_SERVICE.getData(criteria, {}, {
                      lean: true
                    }, (err, data) => {
                      // console.log("7")
                      if (err)
                        return cb(err);

                      // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                      // console.log(data,"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                      // //console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
                      funnelTemplateData = data

                      if (data.length > 0) {
                        // console.log("hiee11")
                        // console.log(data)
                        sendEmail = true;
                      }
                      // //console.log("+++++++++");
                      // //console.log("Service.FUNNEL_TEMPLATE_SERVICE.getData :::::::::::::",sendEmail);
                      return cb();
                    });
                  }
                ],
                checkEmailSendOrNot: [
                  'getfunnelTemplate',
                  'getEmailDetailoflastSend',
                  (ag1, cb) => {
                    var emailTimeInterval = -1;
                    var diffTime = -1
                    // //console.log("funnelTemplateData[0].emailTimeInterval :::",funnelTemplateData[0].emailTimeInterval);
                    // //console.log("funnelTemplateData.length",funnelTemplateData.length);
                    if (funnelTemplateData.length > 0) {
                      // console.log("hieeee10");
                      
                      emailTimeInterval = funnelTemplateData[0].emailTimeInterval
                      console.log(emailTimeInterval)
                      // console.log(funnelTemplateData[0])
                    }
                    // console.log('emailSendDate',emailSendDate)
                    if(emailSendDate != null){
                      var currentDate = new Date().toString();
                     console.log("++++++++++================================================================");
                      currentDate = moment();
                      ////console.log("Current Date",currentDate);
                      var emailSendDateNew = moment(emailSendDate);
                      //diffTime = currentDate.diff(item.createdAt, 'minutes');
                      diffTime = currentDate.diff(emailSendDateNew, 'minutes');
                      // console.log("hieeee999999");
                      // console.log(diffTime)
                      // console.log(item.createdAt)
                      // console.log(currentDate)
                    }
                    // else{
                    //   var currentDate = new Date().toString();
                    //   // //console.log("++++++++++================================================================");
                    //   currentDate = moment();
                    //   ////console.log("Current Date",currentDate);
                    //   //var emailSendDateNew = moment(emailSendDate);
                    //   diffTime = currentDate.diff(item.createdAt, 'minutes');

                    //   console.log("hieeee9");
                    //   console.log(diffTime)
                    //   console.log(item.createdAt)
                    //   console.log(currentDate)
                    // }
                    //console.log("============================================================================");
                    //console.log("funnelTemplateData",funnelTemplateData);
                    //console.log("Email Send Date New : ",item.createdAt);
                    //console.log("diff time",diffTime);
                    //console.log("diffTime==========",diffTime,"emailTimeInterval====",emailTimeInterval);
                    //console.log("emailTimeInterval",emailTimeInterval,"diffTime",diffTime,"funnelTemplateData","userLastEmailsend",userLastEmailsend);
                    //console.log("============================================================================");
                  //  console.log("8")
                    if (userLastEmailsend == false) {
                    //  console.log("hiee6 userLastEmailsend")
                      if (diffTime <= -1) {
                        //  console.log("hiee7")
                        diffTime = 0;
                      }
                      if (emailTimeInterval <= -1) {
                      // console.log("hiee8")
                        diffTime = 0;
                      }
                    }

                    //console.log("emailTimeInterval::",emailTimeInterval,"diffTime::",diffTime);
                    // var diffTime = 6
                    console.log(diffTime,"diffTime")
                    console.log(emailTimeInterval,"   console.log(emailTimeInterval)")
                    //emailTimeInterval > 0 && diffTime > 0 && diffTime >= emailTimeInterval
                    if (emailTimeInterval >= 0 && diffTime >= 0) {
                       console.log('hieeee1')
                      if (funnelTemplateData[0].sendCmaAutomatically) {
                        // console.log('hieeee2')
                        cloudcmaSend = false;
                        sendEmail = false;
                        cloudcmaCreate = true;
                      } else if (funnelTemplateData[0].emailType === "CMA" && funnelTemplateData[0].sendCmaAutomatically === false) {
                        // console.log('hieeee3')
                        // console.log("Reaching here");
                        // console.log(2);
                        cloudcmaSend = false;
                        sendEmail = false;
                        cloudcmaCreate = true;
                      }else{
                        // console.log('hieeee4')
                        cloudcmaSend = false;
                        sendEmail = true;
                        cloudcmaCreate = false;
                      }
                    }else{
                        console.log('hieeee5')
                      // console.log(emailTimeInterval,diffTime)
                      sendEmail = false
                      cloudcmaSend = false;
                      cloudcmaCreate = false;
                    }

                    // //console.log("checkEmailSendOrNot::::::::::::::::::::::::::::::::",sendEmail);
                    //sendEmail =true;
                    //currentDate     = moment().format('MMMM Do YYYY, h:mm:ss a');;
                    //moment
                    return cb(null, {
                      sendEmail: sendEmail,
                      diffTime: diffTime,
                      currentDate: currentDate,
                      emailSendDate: emailSendDate,
                      funnelTemplateData: funnelTemplateData
                    });
                  }
                ],
                InsertLastemailSendDetail: [
                  'checkEmailSendOrNot',
                  (ag2, cb) => { ////console.log("item===InsertLast===init");
                    if ( (sendEmail && !unsubUser) || cloudcmaSend || cloudcmaCreate ) {
                          // console.log(funnelTemplateData[0],"funnelTemplateData[0]")
                        var dataToSave = {
                          userId: itemData._id,
                          funnelId: funnelTemplateData[0].funnelId,
                          funneltemplateId: funnelTemplateData[0]._id,
                          emailSendDate: new Date().toISOString()
                        }

                      // //console.log("InsertLastemailSendDetail::::::::::::::::::::::::::::::::",sendEmail);
                        Service.EmailSendDetail_SERVICE.InsertData(dataToSave, function(err, result) {
                          if (err)
                            return cb(err);
                          return cb();
                        });
                      } else {
                        // console.log("8")
                        return cb();
                      }
                    }
                ],
                sendEmailToUser: [
                  'checkEmailSendOrNot',
                  (ag1, cb) => {
                    // console.log("item===sendEmailToUser===init","sendEmail",sendEmail,"cloudcmaSend",cloudcmaSend);

                    var unsubscribe_val,unsubscribe_url;
                    if (sendEmail && !unsubUser){
                      // console.log(itemData);
                      var firstName = Utils.universalfunctions.capitalizeFirstLetter(itemData.firstName);
                      var emailTemplateHtml = funnelTemplateData[0].emailTemplateHtml;
                      //console.log("EMail Template HTML============",emailTemplateHtml);
                      var templatepath = Path.join(__dirname, '../Assets/emailTemplates/');
                      var fileReadStream = fs.createReadStream(templatepath + 'funnelTemplate.html');
                      var emailTemplate = '';
                      fileReadStream.on('data', function(buffer) {
                        emailTemplate += buffer.toString();
                      });
                      ////console.log("themeData",themeData);
                      // if()
                      if (themeData.logoUrl) {
                        //var imagePath = Path.join(__dirname, '../emailTemplates/'+themeData.logoUrl);
                        var imagePath = "http://api.uat.djt.ca/Assets/" + themeData.logoUrl;
                      } else {
                        var imagePath = "http://dev.citruscow.com/assets/email_Images/logo.png";
                      }

                      if(funnelDetails[0].unsubscribe === true){
                          unsubscribe_val = funnelDetails[0].unsubscribeText;
                          unsubscribe_url = 'http://southsurrey.ca/#/unsubscribe/'+ userList[0].email + '/' + userList[0]._id + '/' + userList[0].funnelId
                      }else{
                          unsubscribe_val = ''
                          unsubscribe_url = ''
                      }
                      // console.log("9")

                      var criteria = {
                        siteId: item.siteId
                      }
                      var newMessageToSend = emailTemplateHtml + '<a href="{{unsubscribeLink}}">{{unsubscribe}}</a>'
                      Service.ThemeSetting_SERVICE.getData(criteria, {}, {}, function(err, result) {
                        if (err) {
                          // console.log("Reaching Err");
                          fileReadStream.on('end', function(res) { //logopath
                            // var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{logopath}}', imagePath).replace('{{message}}', emailTemplateHtml)

                            var messageToSend = eb(newMessageToSend, { SIGNATURE: " ",FIRSTNAME :item.firstName,LASTNAME : item.lastName, EMAIL : item.email, PHONE : item.phoneNumber,unsubscribe : unsubscribe_val,unsubscribeLink : unsubscribe_url});
                            var subject = funnelTemplateData[0].subject;
                            var email_data = { // set email variables for user
                              to: itemData.email, // "anurag@devs.matrixmarketers.com",//
                              from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                              subject: subject,
                              // html: sendStr
                              html: messageToSend
                            };
                            // //console.log("Reaching here");
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                              if (err)
                                return cb(err);
                              return cb()
                            });
                          })
                        } else if (result.length > 0) {

                          // console.log("Reaching result");
                          fileReadStream.on('end', function(res) { //logopath
                            // var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{logopath}}', imagePath).replace('{{message}}', emailTemplateHtml)

                            var messageToSend = eb(newMessageToSend, { SIGNATURE: result[0].signature,FIRSTNAME :item.firstName,LASTNAME : item.lastName, EMAIL : item.email, PHONE : item.phoneNumber,unsubscribe : unsubscribe_val, unsubscribeLink: unsubscribe_url});
                            var subject = funnelTemplateData[0].subject;
                            var email_data = { // set email variables for user
                              to: itemData.email, // "anurag@devs.matrixmarketers.com",//
                              from: result[0].fromName + '<' + result[0].fromEmail + '>',
                              subject: subject,
                              html: messageToSend
                            };
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                              if (err)
                                return cb(err);
                              return cb()
                            });
                          })
                        }else{
                          // console.log("10")
                          // console.log("Reaching Details");
                          fileReadStream.on('end', function(res) { //logopath

                            var messageToSend = eb(newMessageToSend, { SIGNATURE: " ",FIRSTNAME :item.firstName,LASTNAME : item.lastName, EMAIL : item.email, PHONE : item.phoneNumber,unsubscribe : unsubscribe_val,unsubscribeLink : unsubscribe_url});

                            // var sendStr = emailTemplate.replace('{{name}}', firstName).replace('{{logopath}}', imagePath).replace('{{message}}', emailTemplateHtml)
                            var subject = funnelTemplateData[0].subject;
                            var email_data = { // set email variables for user
                              to: itemData.email, // "anurag@devs.matrixmarketers.com",//
                              from: 'Southsurrey <' + Configs.CONSTS.noReplyEmail + '>',
                              subject: subject,
                              html: messageToSend
                            };
                            // //console.log("Reaching here");
                            Utils.universalfunctions.send_email(email_data, (err, res) => {
                              if (err)
                                return cb(err);
                              return cb()
                            });
                          })
                        }
                      });
                    } else {
                      return cb()
                    }
                  }
                ],
                cloudcma: [
                  'checkEmailSendOrNot',
                  (ag1, cb) => {
                    // console.log("item===cloudcma===init","cloudcmaSend",cloudcmaSend,"sendEmail",sendEmail);
                    // //console.log(funnelTemplateData);
                    //console.log(item);
                    // cloudcmaSend = true;
                    if (cloudcmaSend) {
                      // console.log('we are in cloud cma send ')
                      
                      
                      ////console.log("if=====849");
                      if (item.address) {
                        // console.log('we are in item.address')
                         ////console.log("if=====850");
                        var userData = {
                          api_key: CLOUDCMA_API_KEY,
                          name: item.firstName,
                          email_to: item.email, //"anurag@devs.matrixmarketers.com",//
                          address: item.address
                        }
                        // //console.log("___________________________________________________________________________");
                        // //console.log("___________________________________________________________________________");
                        // //console.log("___________________________________________________________________________");
                        // //console.log("___________________________________________________________________________");
                        // //console.log("Reaching in CLOUD CMA WHERE EMAIL IS HANDLED BY CLOUDCCMA");
                        // //console.log("___________________________________________________________________________");
                        // //console.log("___________________________________________________________________________");
                        // //console.log("___________________________________________________________________________");
                        // //console.log("___________________________________________________________________________");

                        cloudcmaAPI(userData, function(err, result, body) {
// console.log('err',err);
// console.log('body',body);
// console.log('result',result)
                          if (err)
                            return cb(err);
                          return cb();
                        })
                      } else {
                        // console.log('we are in item.address else condition')
                        //console.log("else======cloudcma=====addressnotFound======861");
                        return cb();
                      }

                    } else if (cloudcmaCreate) {
                      // console.log('we are in cloud cma create ')
                      //  console.log("11")
                      // var val = item.firstName + "-";
                      // var jobId = uniqid(val);
                      var userData = {
                        api_key: CLOUDCMA_API_KEY,
                        name: item.firstName,
                        email_to: item.email,
                        address: item.address
                        // job_id: jobId
                      }
                      // //console.log("___________________________________________________________________________");
                      // //console.log("___________________________________________________________________________");
                      // //console.log("___________________________________________________________________________");
                      // //console.log("___________________________________________________________________________");
                      // //console.log("Reaching in CLOUD CMA WHERE EMAIL IS HANDLED BY US");
                      // //console.log("___________________________________________________________________________");
                      // //console.log("___________________________________________________________________________");
                      // //console.log("___________________________________________________________________________");
                      // //console.log("___________________________________________________________________________");
                      cloudcmaAPICallback(userData, function(err, result, body, httpResponse) {
                        if (err)
                          return cb(err);
                        if (httpResponse.statusCode == 200) {
                          console.log('Returned body ', body);
                          var zzz = JSON.parse(body);
                          var dataToSave = {
                            "id" :  zzz.cma.id,
                            "user_id" : zzz.cma.user_id,
                            "status": "Pending",
                            "address": zzz.cma.address,
                            "firstName": item.firstName,
                            "lastName": item.lastName,
                            "phoneNumber" : item.phoneNumber,
                            "email_to": item.email,
                            "siteId" : item.siteId,
                            "funnelId": funnelTemplateData[0].funnelId,
                            "funneltemplateId": funnelTemplateData[0]._id
                          }
                          Service.cloudcma.createCloudCMA(dataToSave, (err, updatedData) => {
                            if (err)
                              return cb(err);
                            console.log("CMA Details in Pending Mode");
                            return cb();
                          });

                        } else {
                          var dataToSave = {
                            "address": item.address,
                            "name": item.firstName,
                            "email_to": item.email,
                            "status": "Rejected",
                            "body": "body"
                          }
                          Service.cloudcma.createCloudCMA(dataToSave, (err, updatedData) => {
                            if (err)
                              return cb(err);
                            console.log("CMA Details Rejected Permanently");
                            return cb();
                          });
                          // return cb();
                        }
                      });

                    }else{
                      // console.log('12')
                      return cb();
                    }
                  }
                ]
              }, function(err, result) {
                if (err)
                  return InnerCb(err);
                  console.log(err)
                return InnerCb(err);
              })
          // } //If loop for unsubscribe checking


        }, function(err, result) {
          if (err)
            return OuterCb(err);
          return OuterCb(err);
        })
        }
    ]
  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute(err);
  })
}

//Funnel Send Email Ends here

var deleteProperty = function(payload, callbackRoute) {
  var allpropertyList = []
  async.auto({
    getAllProperty: [(cb) => {
        var criteria = {}
        var opt = {
          lean: true,
          propertyAutoIncrement: -1
        }
        var projection = {
          l_displayid: 1,
          _id: 1,
          propertyAutoIncrement: 1
        }
        Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, opt, (err, data) => {
          if (err)
            return cb(err);
          allpropertyList = data
          return cb();
        });
      }
    ],
    checkPropertyAndDelete: [
      'getAllProperty',
      (ag1, Outercb) => {
        async.eachSeries(allpropertyList, function(item, InnerCb) {
          var tempData = item;
          var isDeleted = true;
          async.auto({
            checkPropertyExists: [(cb) => {
                var criteria = {
                  l_displayid: item.l_displayid
                }
                Service.MAIN_PROPERTY_SERVICE.getData(criteria, {}, {}, (err, data) => {
                  if (err)
                    return cb(err);
                  if (data.length > 0) {
                    isDeleted = false;
                  }
                  return cb(null, {
                    item: item,
                    isDeleted: isDeleted
                  });
                });
              }
            ],
            updateProperty: [
              'checkPropertyExists',
              (ag2, cb) => {
                if (isDeleted == true) {
                  var dataToSet = {
                    isDeleted: isDeleted
                  }
                  var criteria = {
                    _id: Mongoose.Types.ObjectId(item._id)
                  }
                  Service.REST_PROPERY_RD_1_Service.updateData(criteria, dataToSet, {
                    new: true
                  }, (err, data) => { ////console.log("===eruuuurerrerr===", data)
                    if (err)
                      return cb(err);
                    return cb(null, {
                      item: item,
                      isDeleted: isDeleted
                    });
                  });
                } else {
                  return cb();
                }
              }
            ]
          }, function(err, restult) {
            if (err)
              return InnerCb(err);
            return InnerCb();
          })
        }, function(err, restult) {
          if (err)
            return Outercb(err);
          return Outercb();
        })
      }
    ]

  }, function(err, result) {
    if (err)
      return callbackRoute(err);
    return callbackRoute(null, {
      count: allpropertyList.length,
      //allpropertyList:allpropertyList
    });
  })
}



module.exports = {
			restPropertyRD_1      : restPropertyRD_1,
			PropertyClass         :  PropertyClass,
			sendEmailToUser       : sendEmailToUser,
			sendEmailToUser_new   : sendEmailToUser_new,
			Insertschool          : Insertschool,
			cloudcmaAPI           : cloudcmaAPI,
			FunnelEmailAndCma     : FunnelEmailAndCma,
			deleteProperty        : deleteProperty,
			cloudcmaAPICallback   : cloudcmaAPICallback,
      RD_1_Properties       : RD_1_Properties
}
