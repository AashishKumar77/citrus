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
const DBCommonFunction = Utils.DBCommonFunction;
const paymentController = require("./paymentController");
const noOfeatured = APP_CONSTANTS.noOfeatured
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

var defalutObject = {
    "l_idxinclude": "",
    "lv_vow_address": "",
    "lv_vow_include": "",
    "lo3_webpage": "",
    "lo3_phonenumber1": "",
    "lo3_organizationname": "",
    "lo3_shortname": "",
    "lo2_webpage": "",
    "lo2_phonenumber1": "",
    "lo2_organizationname": "",
    "lo2_shortname": "",
    "lo1_webpage": "",
    "lo1_phonenumber1": "",
    "lo1_organizationname": "",
    "lo1_shortname": "",
    "la3_char100_1": "",
    "la3_webpage": "",
    "la3_email": "",
    "la3_phonenumber1": "",
    "la3_loginname": "",
    "la2_char100_1": "",
    "la2_webpage": "",
    "la2_email": "",
    "la2_phonenumber1": "",
    "la2_loginname": "",
    "la1_char100_1": "",
    "la1_webpage": "",
    "la1_email": "",
    "la1_phonenumber1": "",
    "la1_loginname": "",
    "lr_remarks33": "",
    "lr_remarks22": "",
    "lfd_directionalexpfaces_59": "",
    "lfd_bylawrestrictions_58": "",
    "lfd_maintfeeincludes_57": "",
    "lfd_amenities_56": "",
    "lfd_featuresincluded_55": "",
    "lfd_floorfinish_50": "",
    "lfd_fireplacefueledby_49": "",
    "lfd_fuelheating_48": "",
    "lfd_outdoorarea_47": "",
    "lfd_siteinfluences_46": "",
    "lfd_parkingaccess_45": "",
    "lfd_parking_44": "",
    "lfd_roof_43": "",
    "lfd_exteriorfinish_42": "",
    "lfd_construction_41": "",
    "lfd_directionalexprearyard_40": "",
    "lfd_watersupply_39": "",
    "lfd_servicesconnected_38": "",
    "lfd_basementarea_37": "",
    "lfd_suite_36": "",
    "lfd_renovations_35": "",
    "lfd_styleofhome_32": "",
    "vt_vtoururl": "",
    "lm_dec_22": "",
    "lm_dec_16": "",
    "lm_dec_14": "",
    "lm_dec_13": "",
    "lm_dec_12": "",
    "lm_dec_11": "",
    "lm_char100_3": "",
    "lm_char100_1": "",
    "lm_char30_28": "",
    "lm_char30_5": "",
    "lm_char30_4": "",
    "lm_char30_3": "",
    "lm_char30_2": "",
    "lm_char10_70": "",
    "lm_char10_69": "",
    "lm_char10_68": "",
    "lm_char10_67": "",
    "lm_char10_66": "",
    "lm_char10_65": "",
    "lm_char10_64": "",
    "lm_char10_63": "",
    "lm_char10_62": "",
    "lm_char10_61": "",
    "lm_char10_60": "",
    "lm_char10_59": "",
    "lm_char10_58": "",
    "lm_char10_57": "",
    "lm_char10_56": "",
    "lm_char10_55": "",
    "lm_char10_54": "",
    "lm_char10_53": "",
    "lm_char10_52": "",
    "lm_char10_51": "",
    "lm_char10_50": "",
    "lm_char10_49": "",
    "lm_char10_48": "",
    "lm_char10_47": "",
    "lm_char10_46": "",
    "lm_char10_45": "",
    "lm_char10_44": "",
    "lm_char10_43": "",
    "lm_char10_42": "",
    "lm_char10_41": "",
    "lm_char10_40": "",
    "lm_char10_39": "",
    "lm_char10_38": "",
    "lm_char10_37": "",
    "lm_char10_36": "",
    "lm_char10_35": "",
    "lm_char10_34": "",
    "lm_char10_33": "",
    "lm_char10_32": "",
    "lm_char10_31": "",
    "lm_char5_60": "",
    "lm_char5_59": "",
    "lm_char5_58": "",
    "lm_char5_57": "",
    "lm_char5_56": "",
    "lm_char5_55": "",
    "lm_char5_54": "",
    "lm_char5_53": "",
    "lm_char5_52": "",
    "lm_char5_51": "",
    "lm_char5_50": "",
    "lm_char5_49": "",
    "lm_char5_48": "",
    "lm_char5_47": "",
    "lm_char5_46": "",
    "lm_char5_45": "",
    "lm_char5_44": "",
    "lm_char5_43": "",
    "lm_char5_42": "",
    "lm_char5_41": "",
    "lm_char5_40": "",
    "lm_char5_39": "",
    "lm_char5_38": "",
    "lm_char5_37": "",
    "lm_char5_36": "",
    "lm_char5_35": "",
    "lm_char5_34": "",
    "lm_char5_33": "",
    "lm_char5_32": "",
    "lm_char5_31": "",
    "lm_char5_30": "",
    "lm_char5_29": "",
    "lm_char5_28": "",
    "lm_char5_27": "",
    "lm_char5_26": "",
    "lm_char5_25": "",
    "lm_char5_24": "",
    "lm_char5_23": "",
    "lm_char5_22": "",
    "lm_char5_21": "",
    "lm_char5_20": "",
    "lm_char5_19": "",
    "lm_char5_18": "",
    "lm_char5_17": "",
    "lm_char5_16": "",
    "lm_char5_15": "",
    "lm_char5_14": "",
    "lm_char5_13": "",
    "lm_char5_12": "",
    "lm_char5_11": "",
    "lm_char5_10": "",
    "lm_char5_9": "",
    "lm_char5_8": "",
    "lm_char5_7": "",
    "lm_char5_6": "",
    "lm_char5_5": "",
    "lm_char5_4": "",
    "lm_char5_3": "",
    "lm_char1_36": "",
    "lm_dec_9": "",
    "lm_dec_8": "",
    "lm_dec_7": "",
    "lm_dec_6": "",
    "lm_dec_5": "",
    "lm_dec_4": "",
    "lm_dec_3": "",
    "lm_dec_2": "",
    "lm_dec_1": "",
    "lm_int4_2": "",
    "lm_int4_1": "",
    "lm_int2_8": "",
    "lm_int2_7": "",
    "lm_int2_6": "",
    "lm_int2_5": "",
    "lm_int2_4": "",
    "lm_int2_3": "",
    "lm_int2_2": "",
    "lm_int1_20": "",
    "lm_int1_19": "",
    "lm_int1_18": "",
    "lm_int1_17": "",
    "lm_int1_16": "",
    "lm_int1_15": "",
    "lm_int1_14": "",
    "lm_int1_13": "",
    "lm_int1_12": "",
    "lm_int1_11": "",
    "lm_int1_10": "",
    "lm_int1_9": "",
    "lm_int1_8": "",
    "lm_int1_7": "",
    "lm_int1_6": "",
    "lm_int1_5": "",
    "lm_int1_4": "",
    "lm_int1_3": "",
    "lm_int1_2": "",
    "lm_int1_1": "",
    "lm_char50_5": "",
    "lm_char25_30": "",
    "lm_char25_27": "",
    "lm_char25_23": "",
    "lm_char25_22": "",
    "lm_char25_21": "",
    "lm_char25_20": "",
    "lm_char25_19": "",
    "lm_char25_18": "",
    "lm_char25_17": "",
    "lm_char25_16": "",
    "lm_char25_15": "",
    "lm_char25_14": "",
    "lm_char25_13": "",
    "lm_char25_12": "",
    "lm_char25_11": "",
    "lm_char25_10": "",
    "lm_char25_9": "",
    "lm_char25_8": "",
    "lm_char25_7": "",
    "lm_char25_6": "",
    "lm_char25_5": "",
    "lm_char25_4": "",
    "lm_char10_30": "",
    "lm_char10_29": "",
    "lm_char10_28": "",
    "lm_char10_27": "",
    "lm_char10_26": "",
    "lm_char10_25": "",
    "lm_char10_24": "",
    "lm_char10_23": "",
    "lm_char10_22": "",
    "lm_char10_21": "",
    "lm_char10_19": "",
    "lm_char10_18": "",
    "lm_char10_17": "",
    "lm_char10_16": "",
    "lm_char10_13": "",
    "lm_char10_12": "",
    "lm_char10_11": "",
    "lm_char10_6": "",
    "lm_char10_5": "",
    "lm_char10_3": "",
    "lm_char1_16": "",
    "lm_char1_15": "",
    "lm_char1_14": "",
    "lm_char1_13": "",
    "lm_char1_10": "",
    "lm_char1_9": "",
    "lm_char1_8": "",
    "lm_char1_7": "",
    "lm_char1_6": "",
    "lm_char1_5": "",
    "lm_char1_4": "",
    "lm_char1_3": "",
    "lm_char1_2": "",
    "lm_char1_1": "",
    "l_pricepersqft": "",
    "l_status": "",
    "l_address": "",
    "l_streetdesignationid": "",
    "l_addressunit": "",
    "l_addressnumberlow": "",
    "l_displayid": "",
    "l_last_photo_updt": "", //"2015-07-02 10:52:00",
    "l_picturecount": "",
    "l_updatedate": "", //"2017-04-25 23:50:00",
    "l_remarks": "",
    "l_listingdate": "", //"2013-04-25",
    "l_listagent3": "",
    "l_listoffice2": "",
    "l_listagent2": "",
    "l_listoffice1": "",
    "l_listagent1": "",
    "l_zip": "",
    "l_state": "",
    "l_city": "",
    "l_addressstreet": "",
    "l_addressdirection": "",
    "l_addressnumber": "", //"8288",
    "l_askingprice": "",
    "l_area": "",
    "l_listingid": "",

};

var InsertPropertyRD_1_Data = function (Data, CallbackRoute) {
    console.log("====InsertPropertyRD_1_Data==init===");
    var returnedData = {}
    async.auto({
        InsertData: [(OuterCb) => {
            async.eachSeries(Data, function (item, InnerCb) {
                //console.log("item",item.l_listingdate,new Date(item.l_listingdate)); //2017-11-30
                var lastId, isExist = false, propertyAutoIncrement;

                if (item.longitude && item.lat) {
                    var location = {
                        type: "Point",
                        coordinates: [item.longitude, item.lat]
                    }
                } else {
                    var location = {
                        type: "Point",
                        coordinates: [0, 0]
                    }
                }
                async.auto({
                    checkPropertyExistORNot: [(cb) => {
                        var criteria = {
                            l_listingid: item.l_listingid
                        };
                        var projection = { l_listingid: 1, propertyAutoIncrement: 1 };
                        var options = { lean: true };
                        //return cb(criteria)
                        Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => { //console.log("===erredatarrerr===",err,data)
                            if (err) return cb(err);
                            if (data.length > 0) {
                                isExist = true;
                                lastId = data[0]._id;
                                propertyAutoIncrement = data[0].propertyAutoIncrement
                            }
                            return cb(null, { criteria: criteria, data: data });
                            //return cb(item);
                        });
                    }],
                    insertIntoDb: ['checkPropertyExistORNot', (r1, cb) => {
                        if (isExist == false) {
                            var saveData = Object.assign(defalutObject, item);
                            saveData.l_listingdate_unix = moment(moment(item.l_listingdate).format('YYYY-MM-DD')).unix();
                            saveData.location = location;
                            saveData.isDeleted = false;
                            Service.REST_PROPERY_RD_1_Service.InsertData(saveData, (err, data) => { //console.log("===erredatarrerr===", data)
                                if (err) return cb(err);
                                //lastId = data._id;
                                return cb();
                            });
                        } else {
                            return cb();
                        }
                    }],
                    update: ['insertIntoDb', (r1, cb) => {
                        console.log("===update==init===");
                        if (isExist == true) { //console.log("===update==init=data==",lastId,propertyAutoIncrement);
                            var criteria = {
                                _id: mongoose.Types.ObjectId(lastId)
                            }
                            var dataToSet = { allData: item }; //lm_char1_36
                            var dataToSet = Object.assign(defalutObject, item); //lm_char1_36
                            if (item.lm_char1_36 == "Land Only") { //console.log("itemland==",item.lm_char1_36,item.lm_int1_4);
                                dataToSet.lm_int1_4 = 0;
                                dataToSet.lm_int1_19 = 0;
                            }
                            dataToSet.l_listingdate_unix = moment(moment(item.l_listingdate).format('YYYY-MM-DD')).unix();
                            dataToSet.updatedAt = new Date().toISOString();
                            dataToSet.location = location;
                            dataToSet.isDeleted = false;
                            Service.REST_PROPERY_RD_1_Service.updateData(criteria, dataToSet, { new: true }, (err, data) => { //console.log("===eruuuurerrerr===", data)
                                if (err) return cb(err);
                                return cb(null, { id: lastId, dta: data, propertyAutoIncrement: propertyAutoIncrement });
                            });
                        } else {
                            return cb();
                        }
                    }],
                    unsetPropertyImages: ['insertIntoDb', (r1, cb) => {
                        if (isExist == true && item.image_path.length > 0) {
                            var criteria = {
                                _id: mongoose.Types.ObjectId(lastId)
                            }
                            var dataToSet = {
                                $unset: { propertyImages: 1 }
                            };
                            Service.REST_PROPERY_RD_1_Service.updateData(criteria, dataToSet, {}, (err, data) => { //console.log("===eruuuurerrerr===", data)
                                if (err) return cb(err);
                                return cb(null, { id: lastId, dta: data });
                            });
                        } else {
                            return cb();
                        }
                    }],
                    setPropertyImages: ['insertIntoDb', (r1, cb) => {
                        var criteria = {
                            _id: mongoose.Types.ObjectId(lastId)
                        }
                        console.log("+++++++++++++++++++++++++++++++++++++++++++");
                        console.log("item.image_path", item.image_path);
                        console.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
                        var dataToSet = {
                            $addToSet: { propertyImages: { $each: item.image_path } }
                        };
                        Service.REST_PROPERY_RD_1_Service.updateData(criteria, dataToSet, {}, (err, data) => { //console.log("===eruuuurerrerr===", data)
                            if (err) return cb(err);
                            return cb(null, { id: lastId, dta: data });
                        });

                    }],
                    InsertIntoMainCollection: ['insertIntoDb', (r1, cb) => {
                        var dataToInsert = {
                            l_displayid: item.l_displayid
                        }
                        Service.MAIN_PROPERTY_SERVICE.InsertData(dataToInsert, (err, data) => { //console.log("===eruuuurerrerr===", data)
                            if (err) return cb(err);
                            return cb(null, { data: data });
                        });
                    }]
                }, function (err, restult) {
                    if (err) return InnerCb(err);
                    return InnerCb();
                });
            }, function (err, res) {
                if (err) return OuterCb(err);
                return OuterCb();
            });
        }],
    }, (err, result) => {
        if (err) return CallbackRoute(err);
        return CallbackRoute();
    });
}


var getNumberOfPropertiesInEachType = function (payloadData, callbackRoute) {
    async.auto({
        getPropertiesCount: [(cb) => {
            Service.REST_PROPERY_RD_1_Service.getPropertiesCount(function (err, propertiesCount) {
                console.log('after here ', propertiesCount);
                if (err) return cb(err);
                planData = propertiesCount;
                return cb();
            })
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute(null, planData)
    })
}

//Get Count of dwelling
var getNumberOfDwellings = function (payloadData, callbackRoute) {
    async.auto({
        getPropertiesCount: [(cb) => {
            Service.REST_PROPERY_RD_1_Service.getDwellingCount(function (err, propertiesCount) {
                console.log('after here ', propertiesCount);
                if (err) return cb(err);
                planData = propertiesCount;
                return cb();
            })
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute(null, planData)
    })
}

var getCountOfParams = function (payloadData, callbackRoute) {
    console.log("REACHING HET");
    async.auto({
        getPropertiesCount: [(cb) => {
            Service.REST_PROPERY_RD_1_Service.getCountOnTwoParams(function (err, value) {
                console.log('after here ', value);
                if (err) return cb(err);
                planData = value;
                return cb();
            })
        }]
    }, function (err, result) {
        if (err) return callbackRoute(err)
        return callbackRoute(null, planData)
    })
}

var getAllResidentialProperty = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [], finalData_new = [], recentProperties = [], FavoritedListingArray = [], SavedListingArray = [];
    var criteria = {};
    var userId;
    var schoolData;
    var tempLocation = {};
    var projection = {
        //lm_char5_19:1
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1,
        lm_char10_12: 1,
        lm_char1_36: 1,
        lm_dec_16: 1,
        lm_int2_3: 1,
        lm_int4_2: 1,
        l_remarks: 1,
        lr_remarks22: 1,
        l_pricepersqft: 1,
        lr_remarks22: 1,
        location: 1,
        propertyImages: 1,
        lo1_organizationname: 1,
        l_askingprice: 1,
        l_city: 1, l_state: 1, l_zip: 1,
        l_addressnumber: 1,
        l_addressstreet: 1,
        l_addressunit: 1,
        l_streetdesignationid: 1,
        l_displayid: 1,
        lm_dec_7: 1,
        lo1_organizationname: 1,
        lm_char10_11: 1,
        isDeleted: 1,
        l_streetdesignationid: 1,
        l_addressunit: 1,
        images_count: 1,
        l_idxinclude: 1,
        l_updatedate: 1
    }
    if (payloadData.propertyType == 'Apartment/Condo') {
        criteria.lm_char10_11 = payloadData.propertyType
    }
    else if (payloadData.propertyType == 'Townhouse') {
        criteria.lm_char10_11 = payloadData.propertyType
    }
    else if (payloadData.propertyType == 'Apartment/Townhouse') {
        criteria.lm_char10_11 = ['Apartment/Condo', 'Townhouse']
    }
    else if (payloadData.propertyType) {
        criteria.lm_char1_36 = payloadData.propertyType
    }

    if (payloadData.typeOfDwelling) {
        criteria.lm_char10_11 = payloadData.typeOfDwelling
    }

    if (payloadData.listingid) {
        criteria.l_displayid = payloadData.listingid
    }

    /*if(payloadData.listingid){
        criteria.l_listingid = payloadData.listingid
    }*/

    if (payloadData.area) {
        var area_array = payloadData.area.split(',');
        if (area_array.length > 0) {
            criteria.l_area = { $in: area_array }
        }

    }

    if (payloadData.minbathRoom && payloadData.maxbathRoom) {
        var lm_int1_19 = {
            $gte: payloadData.minbathRoom,
            $lte: payloadData.maxbathRoom
        }
        criteria.lm_int1_19 = lm_int1_19;
    } else {
        if (payloadData.minbathRoom) {
            var lm_int1_19 = {
                $gte: payloadData.minbathRoom,
            }
            criteria.lm_int1_19 = lm_int1_19;
        }
        if (payloadData.maxbathRoom) {
            var lm_int1_19 = {
                $lte: payloadData.maxbathRoom
            }
            criteria.lm_int1_19 = lm_int1_19;
        }
    }

    if (payloadData.minbedRoom && payloadData.maxbedRoom) {
        var lm_int1_4 = {
            $gte: payloadData.minbedRoom,
            $lte: payloadData.maxbedRoom
        }
        criteria.lm_int1_4 = lm_int1_4;
    } else {
        if (payloadData.minbedRoom) {
            var lm_int1_4 = {
                $gte: payloadData.minbedRoom,
            }
            criteria.lm_int1_4 = lm_int1_4;
        }
        if (payloadData.maxbedRoom) {
            var lm_int1_4 = {
                $lte: payloadData.maxbedRoom
            }
            criteria.lm_int1_4 = lm_int1_4;
        }
    }

    if (payloadData.minAskingprice && payloadData.maxAskingprice) {
        var price = {
            $gte: payloadData.minAskingprice,
            $lte: payloadData.maxAskingprice
        }
        criteria.l_askingprice = price;
    } else {
        if (payloadData.minAskingprice) {
            var price = {
                $gte: payloadData.minAskingprice,
            }
            criteria.l_askingprice = price;
        }
        if (payloadData.maxAskingprice) {
            var price = {
                $lte: payloadData.maxAskingprice
            }
            criteria.l_askingprice = price;
        }
    };
    if (payloadData.min_lot && payloadData.max_lot) {
        var lm_dec_11 = {
            $gte: payloadData.min_lot,
            $lte: payloadData.max_lot
        }
        criteria.lm_dec_11 = lm_dec_11;
    } else {
        if (payloadData.min_lot) {
            var lm_dec_11 = {
                $gte: payloadData.min_lot,
            }
            criteria.lm_dec_11 = lm_dec_11;
        }
        if (payloadData.max_lot) {
            var lm_dec_11 = {
                $lte: payloadData.max_lot
            }
            criteria.lm_dec_11 = lm_dec_11;
        }
    }
    if (payloadData.minFloorSpace && payloadData.maxFloorSpace) {
        var lm_dec_7 = {
            $gte: payloadData.minFloorSpace,
            $lte: payloadData.maxFloorSpace
        }
        criteria.lm_dec_7 = lm_dec_7;
    } else {
        if (payloadData.minFloorSpace) {
            var lm_dec_7 = {
                $gte: payloadData.minFloorSpace,
            }
            criteria.lm_dec_7 = lm_dec_7;
        }
        if (payloadData.maxFloorSpace) {
            var lm_dec_7 = {
                $lte: payloadData.maxFloorSpace
            }
            criteria.lm_dec_7 = lm_dec_7;
        }
    }

    //console.log("===criteria===",criteria,payloadData.minAskingprice)

    async.auto({
        getSchoolData: [(cb) => {
            if (payloadData.schoolId) {
                var criteriaSchool = {
                    _id: payloadData.schoolId
                }
                Service.SCHOOL_SERVICE.getData(criteriaSchool, { location: 1 }, { lean: true }, (err, data) => {
                    if (err) return cb(err);
                    if (data.length > 0) {
                        schoolData = data[0];
                        // console.log("lll",tempLocation)
                        if (schoolData.location && schoolData.location.coordinates.length > 0) { //console.log("lll==if",tempLocation)
                            var coordinate_db = schoolData.location.coordinates[0];
                            tempLocation = {
                                //"location.coordinates":{
                                $geoWithin: {
                                    $polygon: coordinate_db
                                }
                                //}
                            }; //console.log("lll",tempLocation)
                            criteria['location.coordinates'] = tempLocation
                        } else {
                            //console.log("lll==else",tempLocation)
                        }
                    }
                    return cb(null, {
                        //length:schoolData.location.coordinates.length,
                        //tempLocation:tempLocation,
                        criteria: criteria,
                        schoolData: schoolData
                    });
                })
            } else {
                return cb();
            }
        }],
        getData: ['getSchoolData', (ag1, cb) => {

            var options = {
                skip: payloadData.skip,
                limit: payloadData.limit,
                lean: true
            };

            if (payloadData.searchValue != "" && payloadData.searchValue != undefined && payloadData.searchValue != null) {
                criteria = {
                    $or: [
                        { l_displayid: payloadData.searchValue },
                        { l_city: { $regex: payloadData.searchValue, $options: "$i" } }
                    ]
                };
            }

            if (payloadData.sortBy == 'Price') {
                if (payloadData.sortOrder) {
                    options.sort = {
                        l_askingprice: payloadData.sortOrder
                    }
                } else {
                    options.sort = {
                        l_askingprice: -1
                    }
                }

            }
            if (payloadData.sortBy == 'Date') {
                if (payloadData.sortOrder) {
                    options.sort = {
                        l_listingdate: payloadData.sortOrder
                    }
                } else {
                    options.sort = {
                        l_listingdate: -1
                    }
                }
            }
            if (payloadData.sortBy == 'Square_Footage') {
                if (payloadData.sortOrder) {
                    options.sort = {
                        lm_dec_13: payloadData.sortOrder
                    }
                } else {
                    options.sort = {
                        lm_dec_13: -1
                    }
                }
            }

            // console.log('After this here',criteria);

            if (payloadData.token) {
                jwt.verify(payloadData.token, Configs.CONSTS.jwtkey, function (err, decoded) {

                    if (!decoded) {
                        criteria.l_idxinclude = "Yes";
                    }

                    Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                        if (err) return cb(err);
                        finalData = data
                        return cb(null, { len: data.length, criteria: criteria, data: data });
                    });

                });
            } else {
                criteria.l_idxinclude = "Yes";
                Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                    if (err) return cb(err);
                    finalData = data
                    return cb(null, { len: data.length, criteria: criteria, data: data });
                });
            }

            /*  Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {  //console.log("data",err,data);
                 if (err) return cb(err);
                 finalData = data
                 return cb(null, { len: data.length, criteria: criteria, data: data });
             }); */
        }],
        getUserDataToken: [(cb) => {
            if (payloadData.accessToken) {
                jwt.verify(payloadData.accessToken, Configs.CONSTS.jwtkey, function (err, decoded) {
                    //if (err) return cb(messages.TOKEN_EXIRED);
                    userId = decoded.id; console.log("userId====xxx", userId);
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        getFavoritedListing: ['getUserDataToken', (ag1, cb) => {
            if (payloadData.accessToken) {
                var criteria = {
                    user: userId,
                    IsFavorited: true
                };
                var options = {}
                var projection = { PropertyId: 1 }
                Service.MARK_FAVORITE_SERVICE.getData(criteria, projection, options, function (err, result) {
                    if (err) return cb(err);
                    result.forEach(function (element) {
                        //if(element.IsFavorited==true){
                        FavoritedListingArray.push(element.PropertyId.toString())
                        //}
                    })

                    return cb(null, FavoritedListingArray);
                });
                //return cb();
            } else {
                return cb();
            }
        }],
        getSavedListing: ['getUserDataToken', (ag1, cb) => {
            if (payloadData.accessToken) {
                var criteria = {
                    user: userId,
                    IsSavedlisting: true
                };
                var options = {}
                var projection = { PropertyId: 1 }
                Service.MY_LISTING_SERVICE.getData(criteria, projection, options, function (err, result) {
                    if (err) return cb(err);
                    result.forEach(function (element) {
                        //if(element.IsFavorited==true){
                        SavedListingArray.push(element.PropertyId.toString())
                        //}
                    })

                    return cb(null, SavedListingArray);
                });
                //return cb();
            } else {
                return cb();
            }
        }],
        addAddressKey: ['getData', 'getFavoritedListing', 'getSavedListing', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                if (element.l_addressnumber.length > 0) {
                    var l_streetdesignationid = element.l_streetdesignationid ? element.l_streetdesignationid + '-' : '';
                    var l_addressunit = element.l_addressunit ? element.l_addressunit + '-' : '';
                    var newAddress = l_addressunit + element.l_addressnumber + '-' + element.l_addressstreet + '-' + l_streetdesignationid + element.l_city + '-' + element.l_state;
                } else {
                    var l_streetdesignationid = element.l_streetdesignationid ? element.l_streetdesignationid + '-' : '';
                    var l_addressunit = element.l_addressunit ? element.l_addressunit + '-' : '';
                    var newAddress = l_addressunit + element.l_addressstreet + '-' + l_streetdesignationid + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();

                if (SavedListingArray.indexOf(tempData._id.toString()) > -1) {
                    tempData.IsSavedlisting = true;
                } else {
                    tempData.IsSavedlisting = false;
                }
                //console.log("xx==",FavoritedListingArray,FavoritedListingArray.indexOf("5a4b68e8a08a5a4847bced0f")>-1,tempData._id);
                if (FavoritedListingArray.indexOf(tempData._id.toString()) > -1) {
                    tempData.IsFavorited = true;
                } else {
                    tempData.IsFavorited = false;
                }
                finalData_new.push(tempData);
            });
            return cb();
        }],
        coutTotalRecord: ['getSchoolData', (ag1, cb) => {
            var options = {
                lean: true
            };

            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = (data.length > 100) ? 100 : data.length;
                return cb();
            });
        }],
    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err){
            console.log('errrrr',err)
            return callbackRoute(err);
        } 
        if (result){
            console.log('result',result)
                return callbackRoute(null, {
                    totalRecord: totalRecord,
                    FavoritedListingArray: FavoritedListingArray,
                    count: finalData.length,
                    recentProperties: recentProperties,
                    propertyListing: finalData,
                    retsUpdatedDate: finalData.length > 0?finalData.sort(function (a, b) {
                        var keyA = new Date(a.l_updatedate),
                            keyB = new Date(b.l_updatedate);
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    })[0].l_updatedate:undefined
                });
        }
        
    })
}

var PropertyDetails = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData;
    var criteria = {
        l_listingid: payloadData.mls
    };
    var projection = {
        getRecentProperty: [(cb) => {
            var options = {
                lean: true
            };
            var criteria = {
                createdAt: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) }
            }
            Service.REST_PROPERY_RD_1_Service.getRecentProperties(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                return cb(data);
            });
        }],
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1,
        propertyImages: 1,
        lm_char10_12: 1,
        lm_char1_36: 1,
        lm_dec_16: 1,
        lm_int2_3: 1,
        lm_int4_2: 1,
        l_remarks: 1,
        lr_remarks22: 1,
        l_pricepersqft: 1,
        lr_remarks22: 1,
        l_displayid: 1,
        lm_dec_7: 1,
        lo1_organizationname: 1,
        lfd_featuresincluded_55: 1,
        lfd_featuresincluded_85: 1,
        lfd_featuresincluded_24: 1,
        isDeleted: 1,

        //lm_char5_19:1

    };
    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data[0]
                return cb();
            });
        }],
        setDataFormat: ['getData', (ag1, cb) => {
            if (finalData.lm_char1_36 == "Residential Attached") {
                if (finalData.lfd_featuresincluded_55) {
                    console.log("==if==");
                    var dd = finalData.lfd_featuresincluded_55;
                    var features_Included = dd.split(",");
                } else {
                    console.log("==else==");
                    var features_Included = [];
                }
            } else if (finalData.lm_char1_36 == "Multifamily") {
                if (finalData.lfd_featuresincluded_85) {
                    var dd = finalData.lfd_featuresincluded_85;
                    var features_Included = dd.split(",");
                } else {
                    var features_Included = [];
                }
            } else if (finalData.lm_char1_36 == "Residential Detached") {
                if (finalData.lfd_featuresincluded_24) {
                    var dd = finalData.lfd_featuresincluded_24;
                    var features_Included = dd.split(",");
                } else {
                    var features_Included = [];
                }
            } else {
                var features_Included = [];
            }
            finalData.features_Included = features_Included
            return cb();
        }]

    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            propertyDetail: finalData
        });
    })
}
var PropertyDetailsusingMls = function (payloadData, callbackRoute) { //console.log("===PropertyDetailsusingMls==init=======")
    var totalRecord = 0;
    var finalData;
    var criteria = {

    };
    if (payloadData.PropertyId) {
        criteria._id = payloadData.PropertyId
    }

    if (payloadData.mls) {
        criteria.l_listingid = payloadData.mls
    }

    var projection = {
        "l_listingid": 1,
        "l_displayid": 1,   //mlsnumber
        "lm_char1_36": 1, //Prop Type
        "lm_int1_19": 1, //Total Baths
        "lm_int1_4": 1,//Total Bedrooms
        "l_area": 1,
        "l_askingprice": 1,//price
        "lm_dec_14": 1,//Lot Sz (Hectares)
        "lm_dec_13": 1,//Lot Sz (Sq.Mtrs.)
        "lm_dec_12": 1,//Lot Sz (Acres)
        "lm_dec_11": 1,//Lot Sz (Sq.Ft.)
        "lm_char10_22": { type: String, trim: true, index: true },//Dist to School/School Bus
        "lm_int1_8": 1,
        "lfd_featuresincluded_55": 1, //Features Included
        l_listingdate_unix: 1, // listing date in unix format
        "l_picturecount": 1,
        "l_updatedate": 1, //"2017-04-25 23:50:00",
        "l_listingdate": 1, //"2013-04-25",
        "lm_dec_16": 1, //Gross Taxes
        "lm_int2_3": 1,//age
        "lm_int4_2": 1, //  STRATA FEES
        "l_pricepersqft": 1, //pricepersqft
        "lr_remarks22": 1,  //short description
        "l_zip": 1,
        "l_state": 1,
        "l_city": 1,
        "lm_dec_7": 1, //SQFT
        "lo1_organizationname": 1,
        "lo2_organizationname": 1,
        "lm_int1_1": 1,  // No. Floor Levels
        "lm_char10_11": 1,  //Type of Dwelling
        "lm_char10_12": 1,// Title to Land
        "l_remarks": 1, //Legal Description
        "lfd_amenities_56": 1,
        "la2_email": 1,
        "l_listagent1": 1,
        "l_idxinclude": 1,
        "lv_vow_address": 1,
        "lv_vow_include": 1,
        "lo3_webpage": 1,
        "lo3_phonenumber1": 1,
        "lo3_organizationname": 1,
        "lo3_shortname": 1,
        "lo2_webpage": 1,
        "lo2_phonenumber1": 1,
        "lo2_shortname": 1,
        "lo1_webpage": 1,
        "lo1_phonenumber1": 1,
        "lo1_shortname": 1,
        "la3_char100_1": 1,
        "la3_webpage": 1,
        "la3_email": 1,
        "la3_phonenumber1": 1,
        "la3_loginname": 1,
        "la2_char100_1": 1,
        "la2_webpage": 1,
        "la2_phonenumber1": 1,
        "la2_loginname": 1,
        "la1_char100_1": 1,
        "la1_webpage": 1,
        "la1_email": 1,
        "la1_phonenumber1": 1,
        "la1_loginname": 1,
        "lr_remarks33": 1,
        "lfd_directionalexpfaces_59": 1,
        "lfd_bylawrestrictions_58": 1,
        "lfd_maintfeeincludes_57": 1,
        "lfd_floorfinish_50": 1,
        "lfd_fireplacefueledby_49": 1,
        "lfd_fuelheating_48": 1,
        "lfd_outdoorarea_47": 1,
        "lfd_siteinfluences_46": 1,
        "lfd_parkingaccess_45": 1,
        "lfd_parking_44": 1,
        "lfd_roof_43": 1,
        "lfd_exteriorfinish_42": 1,
        "lfd_construction_41": 1,
        "lfd_directionalexprearyard_40": 1,
        "lfd_watersupply_39": 1,
        "lfd_servicesconnected_38": 1,
        "lfd_basementarea_37": 1,
        "lfd_suite_36": 1,
        "LFD_Suite_5": 1,
        "LFD_MaintFeeIncludes_26": 1,
        "LFD_DirectionalExpFaces_28": 1,
        "LFD_DirectionalExpRearYard_9": 1,
        "LFD_ByLawRestrictions_27": 1,
        "lfd_renovations_35": 1,
        "lfd_styleofhome_32": 1,
        "vt_vtoururl": "",
        "lm_dec_22": 1,
        "lm_char100_3": 1, //"CITY & MOUNTAIN",
        "lm_char100_1": 1,
        "lm_char30_28": 1,
        "lm_char30_5": 1,
        "lm_char30_4": 1,
        "lm_char30_3": 1,
        "lm_char30_2": 1,
        "lm_char10_70": 1,
        "lm_char10_69": 1,
        "lm_char10_68": 1,
        "lm_char10_67": 1,
        "lm_char10_66": 1,
        "lm_char10_65": 1,
        "lm_char10_64": 1,
        "lm_char10_63": 1,
        "lm_char10_62": 1,
        "lm_char10_61": 1,
        "lm_char10_60": 1,
        "lm_char10_59": 1,
        "lm_char10_58": 1,
        "lm_char10_57": 1,
        "lm_char10_56": 1,
        "lm_char10_55": 1,
        "lm_char10_54": 1,
        "lm_char10_53": 1,
        "lm_char10_52": 1,
        "lm_char10_51": 1,
        "lm_char10_50": 1,
        "lm_char10_49": 1,
        "lm_char10_48": 1,
        "lm_char10_47": 1,
        "lm_char10_46": 1,
        "lm_char10_45": 1,
        "lm_char10_44": 1,
        "lm_char10_43": 1,
        "lm_char10_42": 1,
        "lm_char10_41": 1,
        "lm_char10_40": 1,
        "lm_char10_39": 1,
        "lm_char10_38": 1,
        "lm_char10_37": 1,
        "lm_char10_36": 1,
        "lm_char10_35": 1,
        "lm_char10_34": 1,
        "lm_char10_33": 1,
        "lm_char10_32": 1,
        "lm_char10_31": 1,
        "lm_char5_60": 1,
        "lm_char5_59": 1,
        "lm_char5_58": 1,
        "lm_char5_57": 1,
        "lm_char5_56": 1,
        "lm_char5_55": 1,
        "lm_char5_54": 1,
        "lm_char5_53": 1,
        "lm_char5_52": 1,
        "lm_char5_51": 1,
        "lm_char5_50": 1,
        "lm_char5_49": 1,
        "lm_char5_48": 1,
        "lm_char5_47": 1,
        "lm_char5_46": 1,
        "lm_char5_45": 1,
        "lm_char5_44": 1,
        "lm_char5_43": 1,
        "lm_char5_42": 1,
        "lm_char5_41": 1,
        "lm_char5_40": 1,
        "lm_char5_39": 1,
        "lm_char5_38": 1,
        "lm_char5_37": 1,
        "lm_char5_36": 1,
        "lm_char5_35": 1,
        "lm_char5_34": 1,
        "lm_char5_33": 1,
        "lm_char5_32": 1,
        "lm_char5_31": 1,
        "lm_char5_30": 1,
        "lm_char5_29": 1,
        "lm_char5_28": 1,
        "lm_char5_27": 1,
        "lm_char5_26": 1,
        "lm_char5_25": 1,
        "lm_char5_24": 1,
        "lm_char5_23": 1,
        "lm_char5_22": 1,
        "lm_char5_21": 1,
        "lm_char5_20": 1,
        "lm_char5_19": 1,
        "lm_char5_18": 1,
        "lm_char5_17": 1,
        "lm_char5_16": 1,
        "lm_char5_15": 1,
        "lm_char5_14": 1,
        "lm_char5_13": 1,
        "lm_char5_12": 1,
        "lm_char5_11": 1,
        "lm_char5_10": 1,
        "lm_char5_9": 1,
        "lm_char5_8": 1,
        "lm_char5_7": 1,
        "lm_char5_6": 1,
        "lm_char5_5": 1,
        "lm_char5_4": 1,
        "lm_char5_3": 1,
        "lm_dec_9": 1,
        "lm_dec_8": 1,
        "lm_dec_6": 1,
        "lm_dec_5": 1,
        "lm_dec_4": 1,
        "lm_dec_3": 1,
        "lm_dec_2": 1,
        "lm_dec_1": 1,
        "lm_int4_1": 1,
        "lm_int2_8": 1,
        "lm_int2_7": 1,
        "lm_int2_6": 1,
        "lm_int2_5": 1,
        "lm_int2_4": 1,
        "lm_int2_2": 1,
        "lm_int1_20": 1,
        "lm_int1_18": 1,
        "lm_int1_17": 1,
        "lm_int1_16": 1,
        "lm_int1_15": 1,
        "lm_int1_14": 1,
        "lm_int1_13": 1,
        "lm_int1_12": 1,
        "lm_int1_11": 1,
        "lm_int1_10": 1,
        "lm_int1_9": 1,
        "lm_int1_7": 1,
        "lm_int1_6": 1,
        "lm_int1_5": 1,
        "lm_int1_3": 1,
        "lm_int1_2": 1,
        "lm_int1_1": 1,
        "lm_char50_5": 1,
        "lm_char25_30": 1,
        "lm_char25_27": 1,
        "lm_char25_23": 1,
        "lm_char25_22": 1,
        "lm_char25_21": 1,
        "lm_char25_20": 1,
        "lm_char25_19": 1,
        "lm_char25_18": 1,
        "lm_char25_17": 1,
        "lm_char25_16": 1,
        "lm_char25_15": 1,
        "lm_char25_14": 1,
        "lm_char25_13": 1,
        "lm_char25_12": 1,
        "lm_char25_11": 1,
        "lm_char25_10": 1,
        "lm_char25_9": 1,
        "lm_char25_8": 1,
        "lm_char25_7": 1,
        "lm_char25_6": 1,
        "lm_char25_5": 1,
        "lm_char25_4": 1,
        "lm_char10_30": 1,
        "lm_char10_29": 1,
        "lm_char10_28": 1,
        "lm_char10_27": 1,
        "lm_char10_26": 1,
        "lm_char10_25": 1,
        "lm_char10_24": 1,
        "lm_char10_23": 1,
        "lm_char10_21": 1,
        "lm_char10_19": 1,
        "lm_char10_18": 1,
        "lm_char10_17": 1,
        "lm_char10_16": 1,
        "lm_char10_13": 1,
        "lm_char10_6": 1,
        "lm_char10_5": 1,
        "lm_char10_3": 1,
        "lm_char1_16": 1,
        "lm_char1_15": 1,
        "lm_char1_14": 1,
        "lm_char1_13": 1,
        "lm_char1_10": 1,
        "lm_char1_9": 1,
        "lm_char1_8": 1,
        "lm_char1_7": 1,
        "lm_char1_6": 1,
        "lm_char1_5": 1,
        "lm_char1_4": 1,
        "lm_char1_3": 1,
        "lm_char1_2": 1,
        "lm_char1_1": 1,
        "l_status": 1,
        "l_address": 1,
        "l_streetdesignationid": 1,
        "l_addressunit": 1,
        "l_addressnumberlow": 1,
        "l_last_photo_updt": 1, //"2015-07-02 10:52:00",
        "l_listagent3": 1,
        "l_listoffice2": 1,
        "l_listagent2": 1,
        "l_listoffice1": 1,
        "l_addressstreet": 1,
        "l_addressdirection": 1,
        "l_addressnumber": 1 //"8288",
    };
    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, options, (err, data) => {
                if (err) return cb(err);
                finalData = data[0]
                if (finalData.l_addressnumber.length > 0) {
                    var newAddress = finalData.l_addressnumber + '-' + finalData.l_addressstreet + '-' + finalData.l_city + '-' + finalData.l_state;
                } else {
                    var newAddress = finalData.l_addressstreet + '-' + finalData.l_city + '-' + finalData.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                finalData.newAddress = newAddress.toLowerCase();
                return cb();
            });
        }],
        setDataFormat: ['getData', (ag1, cb) => {
            if (finalData.lm_char1_36 == "Residential Attached") {
                if (finalData.lfd_featuresincluded_55) {
                    console.log("==if==");
                    var dd = finalData.lfd_featuresincluded_55;
                    var features_Included = dd.split(",");
                } else {
                    console.log("==else==");
                    var features_Included = [];
                }
            } else if (finalData.lm_char1_36 == "Multifamily") {
                if (finalData.lfd_featuresincluded_85) {
                    var dd = finalData.lfd_featuresincluded_85;
                    var features_Included = dd.split(",");
                } else {
                    var features_Included = [];
                }
            } else if (finalData.lm_char1_36 == "Residential Detached") {
                if (finalData.lfd_featuresincluded_24) {
                    var dd = finalData.lfd_featuresincluded_24;
                    var features_Included = dd.split(",");
                } else {
                    var features_Included = [];
                }
            } else {
                var features_Included = [];
            }
            if (finalData.lm_char10_22) {
                finalData.schoolDistance = finalData.lm_char10_22
            } else {
                finalData.schoolDistance = "N/A"
            }
            finalData.features_Included = features_Included
            return cb();
        }]

    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            propertyDetail: finalData
        });
    })
}

var getAlllocation = function (payloadData, callbackRoute) { //console.log("===PropertyDetailsusingMls==init=======")
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = {};
    var projection = {
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1,
        la1_loginname: 1,
        lm_char10_12: 1,
        lm_char1_36: 1,
        lm_dec_16: 1,
        lm_int2_3: 1,
        lm_int4_2: 1,
        l_remarks: 1,
        lr_remarks22: 1,
        l_pricepersqft: 1,
        lr_remarks22: 1,
        location: 1,
        propertyImages: 1,
        lo1_organizationname: 1,
        l_askingprice: 1,
        l_city: 1, l_state: 1, l_zip: 1,
        l_addressstreet: 1,
        l_addressnumber: 1,
        l_addressunit: 1,
        l_streetdesignationid: 1,
        lm_dec_7: 1,
        l_displayid: 1,
        isDeleted: 1,
        images_count: 1
    };

    if (payloadData.propertyType) {
        criteria.lm_char1_36 = payloadData.propertyType
    }

    if (payloadData.typeOfDwelling) {
        criteria.lm_char10_11 = payloadData.typeOfDwelling
    }

    if (payloadData.listingid) {
        criteria.l_displayid = payloadData.listingid
    }

    /*if(payloadData.listingid){
        criteria.l_listingid = payloadData.listingid
    }*/

    if (payloadData.area) {
        criteria.l_area = payloadData.area
    }

    if (payloadData.minbathRoom && payloadData.maxbathRoom) {
        var lm_int1_19 = {
            $gte: payloadData.minbathRoom,
            $lte: payloadData.maxbathRoom
        }
        criteria.lm_int1_19 = lm_int1_19;
    } else {
        if (payloadData.minbathRoom) {
            var lm_int1_19 = {
                $gte: payloadData.minbathRoom,
            }
            criteria.lm_int1_19 = lm_int1_19;
        }
        if (payloadData.maxbathRoom) {
            var lm_int1_19 = {
                $lte: payloadData.maxbathRoom
            }
            criteria.lm_int1_19 = lm_int1_19;
        }
    }

    if (payloadData.minbedRoom && payloadData.maxbedRoom) {
        var lm_int1_4 = {
            $gte: payloadData.minbedRoom,
            $lte: payloadData.maxbedRoom
        }
        criteria.lm_int1_4 = lm_int1_4;
    } else {
        if (payloadData.minbedRoom) {
            var lm_int1_4 = {
                $gte: payloadData.minbedRoom,
            }
            criteria.lm_int1_4 = lm_int1_4;
        }
        if (payloadData.maxbedRoom) {
            var lm_int1_4 = {
                $lte: payloadData.maxbedRoom
            }
            criteria.lm_int1_4 = lm_int1_4;
        }
    }

    if (payloadData.minAskingprice && payloadData.maxAskingprice) {
        var price = {
            $gte: payloadData.minAskingprice,
            $lte: payloadData.maxAskingprice
        }
        criteria.l_askingprice = price;
    } else {
        if (payloadData.minAskingprice) {
            var price = {
                $gte: payloadData.minAskingprice,
            }
            criteria.l_askingprice = price;
        }
        if (payloadData.maxAskingprice) {
            var price = {
                $lte: payloadData.maxAskingprice
            }
            criteria.l_askingprice = price;
        }
    };
    if (payloadData.min_lot && payloadData.max_lot) {
        var lm_dec_11 = {
            $gte: payloadData.min_lot,
            $lte: payloadData.max_lot
        }
        criteria.lm_dec_11 = lm_dec_11;
    } else {
        if (payloadData.min_lot) {
            var lm_dec_11 = {
                $gte: payloadData.min_lot,
            }
            criteria.lm_dec_11 = lm_dec_11;
        }
        if (payloadData.max_lot) {
            var lm_dec_11 = {
                $lte: payloadData.max_lot
            }
            criteria.lm_dec_11 = lm_dec_11;
        }
    }
    if (payloadData.minFloorSpace && payloadData.maxFloorSpace) {
        var lm_dec_7 = {
            $gte: payloadData.minFloorSpace,
            $lte: payloadData.maxFloorSpace
        }
        criteria.lm_dec_7 = lm_dec_7;
    } else {
        if (payloadData.minFloorSpace) {
            var lm_dec_7 = {
                $gte: payloadData.minFloorSpace,
            }
            criteria.lm_dec_7 = lm_dec_7;
        }
        if (payloadData.maxFloorSpace) {
            var lm_dec_7 = {
                $lte: payloadData.max_lot
            }
            criteria.lm_dec_7 = lm_dec_7;
        }
    }


    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true,
                skip: payloadData.skip,
                limit: payloadData.limit,
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        setData: ['getData', (r1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();
                var lat = tempData.location.coordinates[1] //latlong
                var Lng = tempData.location.coordinates[0] //latlong
                var latlong = [lat, Lng];
                tempData.latlong = latlong;
                if (lat != 0 && Lng != 0) {
                    finalData_new.push(tempData);
                }
                delete tempData.location;
            });
            return cb();
        }]

    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            countData: finalData.length,
            locations: finalData_new
        });
    })
}

var featuredProperties = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var projection = {
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_char1_36: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1, propertyImages: 1,
        isFeatured: 1,
        l_addressnumber: 1,
        l_addressstreet: 1,
        l_addressunit: 1,
        l_address: 1,
        l_streetdesignationid: 1,
        l_city: 1,
        l_state: 1,
        l_displayid: 1,
        lo1_organizationname: 1,
        lm_dec_7: 1,
        isDeleted: 1,
        images_count: 1
        //lm_char5_19:1

    };
    var criteria = {
        //isFeatured : true
    }



    var finalData = [], finalData_new = [];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: 0,
                limit: 3,
                sort: { l_listingdate: -1 },
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                finalData = data
                return cb();
            });
        }],
        addAddressKey: ['getData', (ag1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();
                finalData_new.push(tempData);
            });
            return cb();
        }],
    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            count: finalData_new.length,
            totalRecord: finalData_new.length,
            propertyListing: finalData_new
        });
    })
}
var getRelatedProperties = function (payloadData, callbackRoute) {
    var totalRecord = 0;
    var finalData = [];
    var projection = {
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_char1_36: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1, propertyImages: 1,
        isFeatured: 1,
        l_addressnumber: 1,
        l_addressstreet: 1,
        l_addressunit: 1,
        l_address: 1,
        l_streetdesignationid: 1,
        l_city: 1,
        lm_dec_22: 1,
        l_state: 1,
        l_displayid: 1,
        lo1_organizationname: 1,
        lm_dec_7: 1,
        isDeleted: 1,
        location: 1,
        l_remarks: 1,
        lr_remarks22: 1,
        lr_remarks33: 1,
        images_count: 1
        //lm_char5_19:1

    };

    // console.log(projection);
    console.log(typeof payloadData.minPrice)
    console.log(typeof payloadData.maxPrice)
    console.log(typeof payloadData.minSqft)
    console.log(typeof payloadData.maxSqft)

    var criteria = {
        _id: { $ne: payloadData._id },
        l_area: payloadData.area,    // same area strn
        lm_int1_4: payloadData.bedRoom, //same bed nmbr
        lm_int1_19: payloadData.bathRoom, // same bath room   nmbr
        lm_dec_7: {
            $gte: payloadData.minSqft.toString(),
            $lte: payloadData.maxSqft.toString()
        },//footage around 20 %  string  +/-
        l_askingprice: { $gte: payloadData.minPrice, $lte: payloadData.maxPrice }, //  10 % +/-  nmbr
        images_count : {$gt : 0}
    }


    //criteria["propertyImages.0"] = { $exists: true };
    var finalData = [], finalData_new = [];
    async.auto({
        getData: [(cb) => {
            var options = {
                skip: 0,
                limit: 6,
                sort: { createdAt: -1 },
                lean: true
            };

            console.log("criteria:", criteria);
            Service.REST_PROPERY_RD_1_Service.getRelatedProperties(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    finalData = data
                    return cb();
                } else {
                    var criteria = {
                        _id: { $ne: payloadData._id },
                        lm_int1_4: payloadData.bedRoom, //same bed nmbr
                        lm_int1_19: payloadData.bathRoom, // same bath room   nmbr
                        images_count : {$gt : 0}
                    }
                    //criteria["propertyImages.0"] = { $exists: true };
                    console.log("ELSE criteria:", criteria);
                    Service.REST_PROPERY_RD_1_Service.getRelatedProperties(criteria, projection, options, (err, data) => {
                        if (err) {
                            return cb(err);
                        }
                        // if(data.l_addressnumber.length>0){
                        //      console.log("REACHING HERE");
                        //      console.log("address",data);
                        //      address= data.l_addressnumber+'-'+data.l_addressstreet+'-'+data.l_city+'-'+data.l_state;
                        //      newAddress = Utils.universalfunctions.replaceCharacterInString(address," ","-");
                        //      data.newADDRESS = newAddress.toLowerCase();
                        //      console.log("DATA.newADDRESS : ",data.newADDRESS);
                        //      finalData = data
                        //      return cb();
                        //  }else{
                        //    finalData = data
                        //    return cb();
                        //  }
                        finalData = data
                        return cb();
                    })
                }
            });
        }]
    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            count: finalData.length,
            totalRecord: finalData.length,
            propertyListing: finalData
        });
    })
}

var homePageSilderData = function (payloadData, callbackRoute) { //noOfeatured
  
    var projection = {
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1, propertyImages: 1,
        isFeatured: 1,
        lm_char1_36: 1,
        lm_char10_12: 1,
        l_addressunit: 1,
        l_streetdesignationid: 1,
        l_addressnumber: 1,
        l_addressstreet: 1,
        l_city: 1,
        l_state: 1,
        l_displayid: 1,
        lm_dec_7: 1,
        lo1_organizationname: 1,
        isDeleted: 1,
        images_count: 1
        //lr_remarks22:1
        //lm_char5_19:1

    };
    var countofFeatured = 0;
    var finalData = [], featuredProperty = [], recentProperty = [], featuredPropertyId = [];
    var featuredPropertySizeZeroId = [], recentPropertySizeZeroId = [];
    var getRecentProperty = true;
    var RecentPropertylimit = 0;
    
    async.auto({
        getfeaturedSizeZeroImges: [function (cb) {
            var criteria = {
                isFeatured: true,
                propertyImages: { $size: 0 }

            }
            var options = {
                skip: 0,
                limit: noOfeatured,
                lean: true
            };
            
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                
                data.forEach(function (element) {
                    featuredPropertySizeZeroId.push(mongoose.Types.ObjectId(element._id));
                    //featuredPropertyId.push(element._id)
                });
                return cb();
            });
        }],
        getfeatured: ['getfeaturedSizeZeroImges', function (r1, cb) {
            var criteria = {
                isFeatured: true,
                _id: { $nin: featuredPropertySizeZeroId },
                propertyImages: { $exists: true }
                //propertyImages: { $size: {$gte:1} }
            }
            var options = {
                skip: 0,
                limit: noOfeatured,
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                featuredProperty = data;
                countofFeatured = featuredProperty.length
                return cb();
            });
        }],
        getIdOfFeatured: ['getfeatured', function (r1, cb) {
            featuredProperty.forEach(function (element) {
                featuredPropertyId.push(mongoose.Types.ObjectId(element._id));
                //featuredPropertyId.push(element._id)
            });
            return cb(null, featuredPropertyId);
        }],
        checkFeatured: ['getfeatured', function (r2, cb) {
            if (countofFeatured < noOfeatured) {
                RecentPropertylimit = noOfeatured - countofFeatured
            }
            return cb(null, RecentPropertylimit);
        }],
        getRecentSizeZeroImges: ['checkFeatured', function (r3, cb) {
            if (RecentPropertylimit > 0) {
                var tempId = _.union(featuredPropertyId, featuredPropertySizeZeroId);
                var criteria = {
                    propertyImages: { $size: 0 },
                    _id: {
                        $nin: tempId
                    },
                }
                var options = {
                    skip: 0,
                    limit: noOfeatured,
                    sort: { l_listingdate_unix: -1 },
                    lean: true
                };
                Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                    if (err) return cb(err);
                    data.forEach(function (element) {
                        recentPropertySizeZeroId.push(mongoose.Types.ObjectId(element._id));
                        //featuredPropertyId.push(element._id)
                    });
                    return cb(null, recentPropertySizeZeroId);
                });
            } else {
                return cb();
            }

        }],
        getRecentPropertyd: ['getRecentSizeZeroImges', 'getIdOfFeatured', function (r3, cb) {
            if (RecentPropertylimit > 0) {
                var tempId = _.union(featuredPropertyId, featuredPropertySizeZeroId, recentPropertySizeZeroId);
                var criteria = {
                    _id: {
                        $nin: tempId
                    },
                    propertyImages: { $exists: true }
                    //propertyImages: {$size: {$gte:1} }
                }
                var options = {
                    skip: 0,
                    limit: noOfeatured,
                    sort: { l_listingdate_unix: -1 },
                    lean: true
                };
                Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                    if (err) return cb(err);
                    recentProperty = data
                    return cb();
                });
            } else {
                return cb();
            }

        }],
        mergeArray: ['getRecentPropertyd', 'getfeatured', function (r4, cb) {
            var finalData1 = Utils.universalfunctions.jsonParseStringify(_.union(recentProperty, featuredProperty));
            finalData1.forEach(function (element) {
                var temp = element;
                //return cb(element);
                if ((element.propertyImages) && (element.propertyImages.length > 0)) {
                    temp.propertyImage = element.propertyImages[0];
                } else {
                    console.log("element==else", element._id);
                }
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                temp.newAddress = newAddress.toLowerCase();
                finalData.push(temp);
            });
            return cb();
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            //totalRecord: totalRecord,
            finalData: finalData,
            //propertyListing: featuredProperty,
            //recentProperty:recentProperty,
        });
    })
}

var homePagebottomData = function (payloadData, callbackRoute) { //noOfeatured
    var projection = {
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1, propertyImages: 1,
        isFeatured: 1,
        lm_char1_36: 1,
        lm_char10_12: 1,
        l_addressnumber: 1,
        l_addressunit: 1,
        l_streetdesignationid: 1,
        l_city: 1,
        l_state: 1,
        lr_remarks22: 1,
        lm_char5_19: 1,
        l_addressstreet: 1,
        l_displayid: 1,
        lm_dec_7: 1,
        location: 1,
        lo1_organizationname: 1,
        isDeleted: 1,

    };
    var countofFeatured = 0;
    var finalData = [], featuredProperty = [], recentProperty = [], featuredPropertyId = [];
    var featuredPropertySizeZeroId = [], recentPropertySizeZeroId = [];
    var getRecentProperty = true;
    var RecentPropertylimit = 0;
    async.auto({
        getfeaturedSizeZeroImges: [function (cb) {
            var criteria = {
                isFeatured: true,
                propertyImages: { $size: 0 }

            }
            var options = {
                skip: 0,
                limit: payloadData.limit,
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                data.forEach(function (element) {
                    featuredPropertySizeZeroId.push(mongoose.Types.ObjectId(element._id));
                    //featuredPropertyId.push(element._id)
                });
                return cb();
            });
        }],
        getfeatured: ['getfeaturedSizeZeroImges', function (r1, cb) {
            var criteria = {
                isFeatured: true,
                _id: { $nin: featuredPropertySizeZeroId },
                propertyImages: { $exists: true }
                //propertyImages: { $size: {$gte:1} }
            }
            var options = {
                skip: 0,
                limit: payloadData.limit,
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                featuredProperty = data;
                countofFeatured = featuredProperty.length
                return cb();
            });
        }],
        getIdOfFeatured: ['getfeatured', function (r1, cb) {
            featuredProperty.forEach(function (element) {
                featuredPropertyId.push(mongoose.Types.ObjectId(element._id));
                //featuredPropertyId.push(element._id)
            });
            return cb(null, featuredPropertyId);
        }],
        checkFeatured: ['getfeatured', function (r2, cb) {
            if (countofFeatured < noOfeatured) {
                RecentPropertylimit = noOfeatured - countofFeatured
            }
            return cb(null, RecentPropertylimit);
        }],
        getRecentSizeZeroImges: ['checkFeatured', function (r3, cb) {
            if (RecentPropertylimit > 0) {
                var tempId = _.union(featuredPropertyId, featuredPropertySizeZeroId);
                var criteria = {
                    propertyImages: { $size: 0 },
                    _id: {
                        $nin: tempId
                    },
                }
                var options = {
                    skip: 0,
                    limit: payloadData.limit,
                    sort: { l_listingdate_unix: -1 },
                    lean: true
                };
                Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                    if (err) return cb(err);
                    data.forEach(function (element) {
                        recentPropertySizeZeroId.push(mongoose.Types.ObjectId(element._id));
                        //featuredPropertyId.push(element._id)
                    });
                    return cb(null, recentPropertySizeZeroId);
                });
            } else {
                return cb();
            }

        }],
        getRecentPropertyd: ['getRecentSizeZeroImges', 'getIdOfFeatured', function (r3, cb) {
            if (RecentPropertylimit > 0) {
                var tempId = _.union(featuredPropertyId, featuredPropertySizeZeroId, recentPropertySizeZeroId);
                var criteria = {
                    _id: {
                        $nin: tempId
                    },
                    propertyImages: { $exists: true }
                    //propertyImages: {$size: {$gte:1} }
                }
                var options = {
                    skip: 0,
                    limit: payloadData.limit,
                    sort: { l_listingdate_unix: -1 },
                    lean: true
                };
                Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                    if (err) return cb(err);
                    recentProperty = data
                    return cb();
                });
            } else {
                return cb();
            }

        }],
        mergeArray: ['getRecentPropertyd', 'getfeatured', function (r4, cb) {
            var finalData1 = Utils.universalfunctions.jsonParseStringify(_.union(recentProperty, featuredProperty));
            finalData1.forEach(function (element) {
                var temp = element;
                //return cb(element);
                if ((element.propertyImages) && (element.propertyImages.length > 0)) {
                    temp.propertyImage = element.propertyImages[0];
                } else {
                    // console.log("element==else",element._id);
                }
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                temp.newAddress = newAddress.toLowerCase();
                finalData.push(temp);
            });
            return cb();
        }]

    }, function (err, result) {
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            //totalRecord: totalRecord,
            count: finalData.length,
            finalData: finalData,

        });
    })
}


var getAllAreaList = function (payloadData, callbackRoute) {
    console.log("getAllAreaList===init");
    var finalData = [];
    async.auto({

        getDistinctArea: [function (cb) {
            console.log("getDistinctArea===init");
            var match = {
                $match: {
                    "l_area": {
                        $nin: ["", " ", null]
                    }
                }
            };
            var groupBy = {
                $group: { _id: null, uniqueValues: { $addToSet: "$l_area" } }
            }; //'retspropertyrd_1'
            DBCommonFunction.aggregate(Models.REST_PROPERY_RD_1, [match, groupBy], (err, data) => {  //console.log("err,data",err,data);
                if (err) return cb(err);
                finalData = _.sortBy(data[0].uniqueValues); //_.sortBy(myArray, 'total');
                return cb();
            });
        }],
    }, function (err, result) {
        console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            finalData: finalData,
        });
    })
}

var getAllCityList = function (payloadData, callbackRoute) {
    console.log("getAllCityList===init");
    var finalData = [];
    async.auto({

        getDistinctCity: [function (cb) {
            console.log("getDistinctCity===init");
            var match = {
                $match: {
                    "l_city": {
                        $nin: ["", " ", null]
                    }
                }
            };
            var groupBy = {
                $group: { _id: null, uniqueValues: { $addToSet: "$l_city" } }
            }; //'retspropertyrd_1'
            DBCommonFunction.aggregate(Models.REST_PROPERY_RD_1, [match, groupBy], (err, data) => {  //console.log("err,data",err,data);
                if (err) return cb(err);
                finalData = _.sortBy(data[0].uniqueValues); //_.sortBy(myArray, 'total');
                return cb();
            });
        }],
    }, function (err, result) {
        console.log("last function");
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            finalData: finalData,
        });
    })
}

// var PropertyDetailsusingl_displayid =function (payloadData,callbackRoute) { //console.log("===PropertyDetailsusingMls==init=======")
//     var totalRecord=0;
//     var finalData={};
//     var criteria= {
//         l_displayid :payloadData.l_displayid
//     };
//     var userData={}
//
//     var projection={
//         l_listingid:1,
//         propertyAutoIncrement:1,
//         l_area:1,
//         lm_int1_19:1,
//         lm_int1_4:1,
//         l_askingprice:1,
//         lm_dec_11:1,
//         lo1_organizationname:1,
//         lo1_shortname:1,
//         la3_phonenumber1:1,
//         la1_loginname:1,
//         la1_loginname:1,
//
//         lm_char10_12:1,
//         lm_char1_36:1,
//         lm_dec_16:1,
//         lm_int2_3:1,
//         lm_int4_2:1,
//         l_remarks:1,
//         lr_remarks22:1,
//         l_pricepersqft:1,
//         lr_remarks22:1,
//         location:1,
//         propertyImages:1,
//         lo1_organizationname:1,
//         l_askingprice:1,
//         l_city:1,l_state:1,l_zip:1,
//         l_addressstreet:1,
//         l_addressnumber:1,
//         lm_dec_7:1,
//         l_displayid:1,
//         l_displayid:1,
//         lm_char10_22:1,
//         lm_char1_36:1,
//         lfd_featuresincluded_24:1,
//         lfd_featuresincluded_55:1,
//         lfd_featuresincluded_85:1,
//         lfd_amenities_56:1,
//         lo1_organizationname:1,
//         lo1_organizationname:1,
//         isDeleted:1,
//                //lm_char5_19:1
//
//     };
//     async.auto({
//         getData:[(cb)=>{
//             var options= {
//                 lean:true
//             };
//            Service.REST_PROPERY_RD_1_Service.getData(criteria,projection, options,(err,data)=> {
//                 if (err)  return cb(err);
//                 if(data.length>0){
//                     finalData = data[0]
//                 }
//                 return cb();
//            });
//         }],
//         getTokenData:[(cb)=>{
//             if(payloadData.accessToken){
//                 jwt.verify(payloadData.accessToken, Configs.CONSTS.jwtkey, function (err, decoded) {
//                     if (err) return cb(); //"messages.TOKEN_EXIRED"
//                     userData = decoded;//console.log("asdsa====userData",userData);
//                     return cb();
//                 });
//             }else{
//                 return cb();
//             }
//         }],
//         checkFeatureOrNot:['getTokenData','getData',(ag1,cb)=>{
//             if(payloadData.accessToken && userData.id){ //getData
//                 var criteria = {
//                     user:userData.id,
//                     PropertyId:finalData._id,
//                     IsFavorited:true
//                 }
//                 var projection_1= {};
//
//                 Service.MARK_FAVORITE_SERVICE.getData(criteria, projection, {},(err,data)=> {
//                     if(err) return cb(err)
//                     if(data.length>0){
//                         finalData.IsFavorited =true
//                     }else{
//                        finalData.IsFavorited =false
//                     }
//                    return cb(null,{criteria:criteria,data:data,userData:userData});
//                 })
//             }else{
//                 //finalData.IsFavorited =false
//                 return cb();
//             }
//         }],
//         setDataFormat:['checkFeatureOrNot',(ag2,cb)=>{
//             if(finalData.lfd_amenities_56 && finalData.lfd_amenities_56.length>0){
//                 /*if(finalData.lfd_amenities_56.length>0){
//
//                 }*/
//                 finalData.amenities = finalData.lfd_amenities_56.split(",");
//             }else{
//                 finalData.amenities = []
//             }
//             if(finalData.lm_char1_36=="Residential Attached"){
//                 if(finalData.lfd_featuresincluded_55){ //console.log("==if==");
//                     var dd = finalData.lfd_featuresincluded_55;
//                     var features_Included =dd.split(",");
//                 }else{ //console.log("==else==");
//                     var features_Included =[];
//                 }
//             }else if(finalData.lm_char1_36=="Multifamily"){
//                 if(finalData.lfd_featuresincluded_85){
//                     var dd = finalData.lfd_featuresincluded_85;
//                     var features_Included =dd.split(",");
//                 }else{
//                     var features_Included =[];
//                 }
//             }else if(finalData.lm_char1_36=="Residential Detached"){
//                 if(finalData.lfd_featuresincluded_24){
//                     var dd = finalData.lfd_featuresincluded_24;
//                     var features_Included =dd.split(",");
//                 }else{
//                     var features_Included =[];
//                 }
//             }else{
//                 var features_Included =[];
//             }
//             if(finalData.lm_char10_22){
//                 finalData.schoolDistance =finalData.lm_char10_22
//             }else{
//                 finalData.schoolDistance ="N/A"
//             }
//             finalData.features_Included = features_Included
//             return cb();
//         }]
//
//     }, (err,result)=> { //console.log("===erredatarrerr===",err,result)
//         if (err) return callbackRoute(err);
//         return callbackRoute(null, {
//            propertyDetail: finalData
//         });
//     })
// }

var PropertyDetailsusingl_displayid = function (payloadData, callbackRoute) {
    console.log("===PropertyDetailsusingMls==init=======")
    // console.log(payloadData);
    var totalRecord = 0;
    var finalData = {};
    var agentData = {};
    var criteria = {
        l_displayid: payloadData.l_displayid
    };
    var criteria_1 = {};
    var userData = {}

    if (payloadData.accessToken && payloadData.accessToken != "") {
        // console.log(' Access Token ****** ',payloadData.accessToken);
        jwt.verify(payloadData.accessToken, Configs.CONSTS.jwtkey, function (err, decoded) {        // console.log(decoded);
            console.log('Error here', err);
            if (!err) {
                var emailVerified = decoded.emailVerified;
                console.log('Email is verified', emailVerified);
                if (emailVerified == true) {
                    projection = {
                        l_listingid: 1,
                        propertyAutoIncrement: 1,
                        l_area: 1,
                        lm_int1_19: 1,
                        lm_int1_4: 1,
                        l_askingprice: 1,
                        lm_dec_11: 1,
                        lo1_organizationname: 1,
                        lo1_shortname: 1,
                        la3_phonenumber1: 1,
                        la1_loginname: 1,
                        la1_loginname: 1,
                        lm_char10_12: 1,
                        lm_char1_36: 1,
                        lm_dec_16: 1,
                        lm_int2_3: 1,
                        lm_int4_2: 1,
                        l_remarks: 1,
                        lr_remarks22: 1,
                        l_pricepersqft: 1,
                        lr_remarks22: 1,
                        location: 1,
                        propertyImages: 1,
                        lo1_organizationname: 1,
                        l_askingprice: 1,
                        l_city: 1, l_state: 1, l_zip: 1,
                        l_addressstreet: 1,
                        l_addressnumber: 1,
                        l_addressunit: 1,
                        l_streetdesignationid: 1,
                        lm_dec_7: 1,
                        lm_dec_22: 1,
                        l_displayid: 1,
                        l_displayid: 1,
                        lm_char10_22: 1,
                        lm_char1_36: 1,
                        lfd_featuresincluded_24: 1,
                        lfd_featuresincluded_55: 1,
                        lfd_featuresincluded_85: 1,
                        lfd_amenities_56: 1,
                        lo1_organizationname: 1,
                        lo1_organizationname: 1,
                        isDeleted: 1,
                        lm_char10_25: 1,
                        lm_char10_26: 1,
                        lm_char10_27: 1,
                        lm_char10_28: 1,
                        lm_char10_29: 1,
                        lm_char10_30: 1,
                        lm_char25_4: 1,
                        lm_char25_5: 1,
                        lm_char25_6: 1,
                        lm_char25_7: 1,
                        lm_char25_8: 1,
                        lm_char25_9: 1,
                        lm_char25_10: 1,
                        lm_char25_11: 1,
                        lm_char25_12: 1,
                        lm_char25_13: 1,
                        lm_char25_14: 1,
                        lm_char25_15: 1,
                        lm_char5_7: 1,
                        lm_char5_8: 1,
                        lm_char5_9: 1,
                        lm_char5_10: 1,
                        lm_char5_11: 1,
                        lm_char5_12: 1,
                        lm_char5_13: 1,
                        lm_char5_14: 1,
                        lm_char5_15: 1,
                        lm_char5_16: 1,
                        lm_char5_17: 1,
                        lm_char5_18: 1,
                        lm_char5_19: 1,
                        lm_char5_20: 1,
                        lm_char5_21: 1,
                        lm_char5_22: 1,
                        lm_char5_23: 1,
                        lm_char5_24: 1,
                        lm_char5_25: 1,
                        lm_char5_26: 1,
                        lm_char5_27: 1,
                        lm_char5_28: 1,
                        lm_char5_29: 1,
                        lm_char5_30: 1,
                        lm_char5_31: 1,
                        lm_char5_32: 1,
                        lm_char5_33: 1,
                        lm_char5_34: 1,
                        lm_char5_35: 1,
                        lm_char5_36: 1,
                        lm_char5_37: 1,
                        lm_char5_38: 1,
                        lm_char5_39: 1,
                        lm_char5_40: 1,
                        lm_char5_41: 1,
                        lm_char5_42: 1,
                        lm_char5_43: 1,
                        lm_char5_44: 1,
                        lm_char5_45: 1,
                        lm_char5_46: 1,
                        lm_char5_47: 1,
                        lm_char5_48: 1,
                        lm_char5_49: 1,
                        lm_char5_50: 1,
                        lm_char5_51: 1,
                        lm_char5_52: 1,
                        lm_char5_53: 1,
                        lm_char5_54: 1,
                        lm_char5_55: 1,
                        lm_char5_56: 1,
                        lm_char5_57: 1,
                        lm_char5_58: 1,
                        lm_char5_59: 1,
                        lm_char5_60: 1,
                        lm_char10_31: 1,
                        lm_char10_32: 1,
                        lm_char10_33: 1,
                        lm_char10_34: 1,
                        lm_char10_35: 1,
                        lm_char10_36: 1,
                        lm_char10_37: 1,
                        lm_char10_38: 1,
                        lm_char10_39: 1,
                        lm_char10_40: 1,
                        lm_char10_41: 1,
                        lm_char10_42: 1,
                        lm_char10_43: 1,
                        lm_char10_44: 1,
                        lm_char10_45: 1,
                        lm_char10_46: 1,
                        lm_char10_47: 1,
                        lm_char10_48: 1,
                        lm_char10_49: 1,
                        lm_char10_50: 1,
                        lm_char10_51: 1,
                        lm_char10_52: 1,
                        lm_char10_53: 1,
                        lm_char10_54: 1,
                        lm_char10_55: 1,
                        lm_char10_56: 1,
                        lm_char10_57: 1,
                        lm_char10_58: 1,
                        lm_char10_59: 1,
                        lm_char10_60: 1,
                        lm_char10_61: 1,
                        lm_char10_62: 1,
                        lm_char10_63: 1,
                        lm_char10_64: 1,
                        lm_char10_65: 1,
                        lm_char10_66: 1,
                        lm_char10_67: 1,
                        lm_char10_68: 1,
                        lm_char10_69: 1,
                        lm_char10_70: 1,
                        lm_char30_4: 1,
                        lm_char30_4: 1,
                        lm_char30_5: 1,
                        lfd_bylawrestrictions_27: 1,
                        lm_char1_15: 1,
                        lm_char50_5: 1,
                        lfd_directionalexprearyard_9: 1,
                        lfd_directionalexpfaces_28: 1,
                        lm_char1_16: 1,
                        lm_char1_13: 1,
                        lfd_maintfeeincludes_26: 1,
                        lm_char30_2: 1,
                        lm_char25_27: 1,
                        lm_char10_3: 1,
                        lm_int2_6: 1,
                        lm_int2_7: 1,
                        l_pricepersqft: 1,
                        lm_char30_3: 1,
                        lfd_suite_5: 1,
                        lm_int4_2: 1,
                        lm_int4_1: 1,
                        l_listagent1: 1,
                        l_listagent2: 1,
                        l_listagent3: 1
                    };
                } else {
                    var projection = {
                        l_listingid: 1,
                        propertyAutoIncrement: 1,
                        l_area: 1,
                        lm_int1_19: 1,
                        lm_int1_4: 1,
                        l_askingprice: 1,
                        lm_dec_11: 1,
                        lo1_organizationname: 1,
                        lo1_shortname: 1,
                        la3_phonenumber1: 1,
                        la1_loginname: 1,
                        la1_loginname: 1,
                        lm_dec_22: 1,
                        lm_char10_12: 1,
                        lm_char1_36: 1,
                        lm_dec_16: 1,
                        lm_int2_3: 1,
                        lm_int4_2: 1,
                        l_remarks: 1,
                        lr_remarks22: 1,
                        l_pricepersqft: 1,
                        lr_remarks22: 1,
                        location: 1,
                        propertyImages: 1,
                        lo1_organizationname: 1,
                        l_askingprice: 1,
                        l_city: 1, l_state: 1, l_zip: 1,
                        l_addressstreet: 1,
                        l_addressnumber: 1,
                        l_addressunit: 1,
                        l_streetdesignationid: 1,
                        lm_dec_7: 1,
                        l_displayid: 1,
                        l_displayid: 1,
                        lm_char10_22: 1,
                        lm_char1_36: 1,
                        lfd_featuresincluded_24: 1,
                        lfd_featuresincluded_55: 1,
                        lfd_featuresincluded_85: 1,
                        lfd_amenities_56: 1,
                        lo1_organizationname: 1,
                        lo1_organizationname: 1,
                        isDeleted: 1,
                        l_address: 1,
                        lm_char10_11: 1,
                        lm_int1_17: 1,
                        lm_int1_18: 1,
                        lm_int2_2: 1,
                        lm_char100_3: 1,
                        l_addressdirection: 1,
                        l_addressunit: 1,
                        l_streetdesignationid: 1,
                        lfd_amenities_25: 1,
                        lfd_siteinfluences_15: 1,
                        lr_remarks33: 1,
                        lm_char10_22: 1,
                        l_status: 1,
                        lfd_featuresincluded_24: 1,
                        lm_int1_2: 1,
                        lm_int2_5: 1,
                        lfd_styleofhome_1: 1,
                        lm_char10_5: 1,
                        l_listagent1: 1,
                        l_listagent2: 1,
                        l_listagent3: 1
                    };
                }
            }
        });
    }
    else {
        var projection = {
            images_count: 1,
            l_listingid: 1,
            propertyAutoIncrement: 1,
            l_area: 1,
            lm_int1_19: 1,
            lm_int1_4: 1,
            l_askingprice: 1,
            lm_dec_11: 1,
            lo1_organizationname: 1,
            lo1_shortname: 1,
            la3_phonenumber1: 1,
            la1_loginname: 1,
            la1_loginname: 1,
            lm_dec_22: 1,
            lm_char10_12: 1,
            lm_char1_36: 1,
            lm_dec_16: 1,
            lm_int2_3: 1,
            lm_int4_2: 1,
            l_remarks: 1,
            lr_remarks22: 1,
            l_pricepersqft: 1,
            lr_remarks22: 1,
            location: 1,
            propertyImages: 1,
            lo1_organizationname: 1,
            l_askingprice: 1,
            l_city: 1, l_state: 1, l_zip: 1,
            l_addressstreet: 1,
            l_addressnumber: 1,
            l_addressunit: 1,
            l_streetdesignationid: 1,
            lm_dec_7: 1,
            l_displayid: 1,
            l_displayid: 1,
            lm_char10_22: 1,
            lm_char1_36: 1,
            lfd_featuresincluded_24: 1,
            lfd_featuresincluded_55: 1,
            lfd_featuresincluded_85: 1,
            lfd_amenities_56: 1,
            lo1_organizationname: 1,
            lo1_organizationname: 1,
            isDeleted: 1,
            l_address: 1,
            lm_char10_11: 1,
            lm_int1_17: 1,
            lm_int1_18: 1,
            lm_int2_2: 1,
            lm_char100_3: 1,
            l_addressdirection: 1,
            l_addressunit: 1,
            l_streetdesignationid: 1,
            lfd_amenities_25: 1,
            lfd_siteinfluences_15: 1,
            lr_remarks33: 1,
            lm_char10_22: 1,
            l_status: 1,
            lfd_featuresincluded_24: 1,
            lm_int1_2: 1,
            lm_int2_5: 1,
            lfd_styleofhome_1: 1,
            lm_char10_5: 1,
            l_listagent1: 1,
            l_listagent2: 1,
            l_listagent3: 1
        };
    }

    async.auto({
        getData: [(cb) => {
            console.log("REACHING HERERERRRERER");
            var options = {
                lean: true
            };
            Service.REST_PROPERY_RD_1_Service.getData(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                if (data.length > 0) {
                    console.log('1')
                    console.log(data)
                    finalData = data[0]
                    var runCode = 0;


                    if (data[0].la1_loginname) {
                        console.log('2')
                        runCode = 1;
                        criteria_1 = {
                            realtoragentid: data[0].la1_loginname
                        }
                    } else {
                        console.log('3')
                        criteria_1 = {
                            _id: payloadData.realtoragentid
                        }
                        var projection = {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            userType: 1,
                            siteId: 1,
                            first: 1,
                            last: 1,
                            phone: 1,
                            profile_pic: 1,
                            slug: 1,
                            userAutoIncrement: 1
                        };

                        var options = {
                            lean: true,
                        };

                        Service.UserService.getUser(criteria_1, projection, { lean: true }, function (err, foundUser) {
                            if (err) return cb(err);
                            if (foundUser.length > 0) {
                                agentData = foundUser;
                                return cb();
                            } else {
                                return cb();
                                // console.log(' user found ',foundUser);
                            }

                        });
                    }

                    console.log("++++++++++++++++++++++++++++++++++++++++++Criteria 1", criteria_1);
                    if (runCode) {
                        var projection = {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            userType: 1,
                            siteId: 1,
                            first: 1,
                            last: 1,
                            phone: 1,
                            profile_pic: 1,
                            slug: 1,
                            userAutoIncrement: 1
                        };
                        Service.UserService.getUser(criteria_1, projection, { lean: true }, function (err, data) {
                            // console.log("data++++",getCriteria,data)
                            if (err) {
                                return cb({ errorMessage: 'DB Error: ' + err })
                            } else if (data.length > 0) {
                                console.log("I dont expect it to reach here");
                                agentData = data;
                                return cb();
                            } else {
                                console.log("I am expecting it to reach here");
                                criteria_1 = {
                                    _id: payloadData.rotateAgentId
                                }
                                var projection = {
                                    _id: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    email: 1,
                                    userType: 1,
                                    siteId: 1,
                                    first: 1,
                                    last: 1,
                                    phone: 1,
                                    profile_pic: 1,
                                    slug: 1,
                                    userAutoIncrement: 1
                                };
                                var options = {
                                    lean: true,
                                };
                                Service.UserService.getUser(criteria_1, projection, options, function (err, foundUser) {
                                    if (err) return cb(err);
                                    if (foundUser.length > 0) {
                                        console.log("HEWRE ALSO");
                                        agentData = foundUser;
                                        return cb();
                                    } else {
                                        return cb();
                                    }
                                });
                            }
                        });
                    }
                } else {
                    return cb()
                }

            });
        }],
        getTokenData: [(cb) => {
            if (payloadData.accessToken) {
                jwt.verify(payloadData.accessToken, Configs.CONSTS.jwtkey, function (err, decoded) {
                    if (err) return cb(); //"messages.TOKEN_EXIRED"
                    userData = decoded;//console.log("asdsa====userData",userData);
                    return cb();
                });
            } else {
                return cb();
            }
        }],
        checkFeatureOrNot: ['getTokenData', 'getData', (ag1, cb) => {
            if (payloadData.accessToken && userData.id) { //getData
                var criteria = {
                    user: userData.id,
                    PropertyId: finalData._id,
                    IsFavorited: true
                }
                var projection_1 = {};

                Service.MARK_FAVORITE_SERVICE.getData(criteria, projection, {}, (err, data) => {
                    if (err) return cb(err)
                    if (data.length > 0) {
                        finalData.IsFavorited = true
                    } else {
                        finalData.IsFavorited = false
                    }
                    return cb(null, { criteria: criteria, data: data, userData: userData });
                })
            } else {
                //finalData.IsFavorited =false
                return cb();
            }
        }],
        setDataFormat: ['checkFeatureOrNot', (ag2, cb) => {
            if (finalData.lfd_amenities_56 && finalData.lfd_amenities_56.length > 0) {
                /*if(finalData.lfd_amenities_56.length>0){

                }*/
                finalData.amenities = finalData.lfd_amenities_56.split(",");
            } else {
                finalData.amenities = []
            }
            if (finalData.lm_char1_36 == "Residential Attached") {
                if (finalData.lfd_featuresincluded_55) { //console.log("==if==");
                    var dd = finalData.lfd_featuresincluded_55;
                    var features_Included = dd.split(",");
                } else { //console.log("==else==");
                    var features_Included = [];
                }
            } else if (finalData.lm_char1_36 == "Multifamily") {
                if (finalData.lfd_featuresincluded_85) {
                    var dd = finalData.lfd_featuresincluded_85;
                    var features_Included = dd.split(",");
                } else {
                    var features_Included = [];
                }
            } else if (finalData.lm_char1_36 == "Residential Detached") {
                if (finalData.lfd_featuresincluded_24) {
                    var dd = finalData.lfd_featuresincluded_24;
                    var features_Included = dd.split(",");
                } else {
                    var features_Included = [];
                }
            } else {
                var features_Included = [];
            }
            if (finalData.lm_char10_22) {
                finalData.schoolDistance = finalData.lm_char10_22
            } else {
                finalData.schoolDistance = "N/A"
            }
            finalData.features_Included = features_Included
            return cb();
        }]

    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            propertyDetail: finalData,
            agentDetails: agentData
        });
    })
}

var getAlllocationNorthAndSouthCoordinate = function (payloadData, callbackRoute) { //console.log("===PropertyDetailsusingMls==init=======")
    var totalRecord = 0;
    var finalData = [], finalData_new = [];
    var criteria = {
        $match: {

        }
    };
    var projection = {
        l_listingid: 1,
        propertyAutoIncrement: 1,
        l_area: 1,
        lm_int1_19: 1,
        lm_int1_4: 1,
        l_askingprice: 1,
        lm_dec_11: 1,
        lo1_organizationname: 1,
        lo1_shortname: 1,
        la3_phonenumber1: 1,
        la1_loginname: 1,
        la1_loginname: 1,

        lm_char10_12: 1,
        lm_char1_36: 1,
        lm_dec_16: 1,
        lm_int2_3: 1,
        lm_int4_2: 1,
        l_remarks: 1,
        lr_remarks22: 1,
        l_pricepersqft: 1,
        lr_remarks22: 1,
        location: 1,
        propertyImages: 1,
        lo1_organizationname: 1,
        l_askingprice: 1,
        l_city: 1, l_state: 1, l_zip: 1,
        l_addressstreet: 1,
        l_addressnumber: 1,
        l_addressunit: 1,
        l_streetdesignationid: 1,
        lm_dec_7: 1,
        l_displayid: 1,
    };
    if (payloadData.propertyType) {
        criteria.$match.lm_char1_36 = payloadData.propertyType
    }

    if (payloadData.typeOfDwelling) {
        criteria.$match.lm_char10_11 = payloadData.typeOfDwelling
    }

    if (payloadData.listingid) {
        criteria.$match.l_displayid = payloadData.listingid
    }

    /*if(payloadData.listingid){
        criteria.l_listingid = payloadData.listingid
    }*/

    if (payloadData.area) {
        criteria.$match.l_area = payloadData.area
    }

    if (payloadData.minbathRoom && payloadData.maxbathRoom) {
        var lm_int1_19 = {
            $gte: payloadData.minbathRoom,
            $lte: payloadData.maxbathRoom
        }
        criteria.$match.lm_int1_19 = lm_int1_19;
    } else {
        if (payloadData.minbathRoom) {
            var lm_int1_19 = {
                $gte: payloadData.minbathRoom,
            }
            criteria.$match.lm_int1_19 = lm_int1_19;
        }
        if (payloadData.maxbathRoom) {
            var lm_int1_19 = {
                $lte: payloadData.maxbathRoom
            }
            criteria.$match.lm_int1_19 = lm_int1_19;
        }
    }

    if (payloadData.minbedRoom && payloadData.maxbedRoom) {
        var lm_int1_4 = {
            $gte: payloadData.minbedRoom,
            $lte: payloadData.maxbedRoom
        }
        criteria.$match.lm_int1_4 = lm_int1_4;
    } else {
        if (payloadData.minbedRoom) {
            var lm_int1_4 = {
                $gte: payloadData.minbedRoom,
            }
            criteria.$match.lm_int1_4 = lm_int1_4;
        }
        if (payloadData.maxbedRoom) {
            var lm_int1_4 = {
                $lte: payloadData.maxbedRoom
            }
            criteria.$match.lm_int1_4 = lm_int1_4;
        }
    }

    if (payloadData.minAskingprice && payloadData.maxAskingprice) {
        var price = {
            $gte: payloadData.minAskingprice,
            $lte: payloadData.maxAskingprice
        }
        criteria.$match.l_askingprice = price;
    } else {
        if (payloadData.minAskingprice) {
            var price = {
                $gte: payloadData.minAskingprice,
            }
            criteria.$match.l_askingprice = price;
        }
        if (payloadData.maxAskingprice) {
            var price = {
                $lte: payloadData.maxAskingprice
            }
            criteria.$match.l_askingprice = price;
        }
    };
    if (payloadData.min_lot && payloadData.max_lot) {
        var lm_dec_11 = {
            $gte: payloadData.min_lot,
            $lte: payloadData.max_lot
        }
        criteria.$match.lm_dec_11 = lm_dec_11;
    } else {
        if (payloadData.min_lot) {
            var lm_dec_11 = {
                $gte: payloadData.min_lot,
            }
            criteria.$match.lm_dec_11 = lm_dec_11;
        }
        if (payloadData.max_lot) {
            var lm_dec_11 = {
                $lte: payloadData.max_lot
            }
            criteria.$match.lm_dec_11 = lm_dec_11;
        }
    }
    if (payloadData.minFloorSpace && payloadData.maxFloorSpace) {
        var lm_dec_7 = {
            $gte: payloadData.minFloorSpace,
            $lte: payloadData.maxFloorSpace
        }
        criteria.$match.lm_dec_7 = lm_dec_7;
    } else {
        if (payloadData.minFloorSpace) {
            var lm_dec_7 = {
                $gte: payloadData.minFloorSpace,
            }
            criteria.$match.lm_dec_7 = lm_dec_7;
        }
        if (payloadData.maxFloorSpace) {
            var lm_dec_7 = {
                $lte: payloadData.max_lot
            }
            criteria.$match.lm_dec_7 = lm_dec_7;
        }
    }
    var geoWithinLocation = {
        $geoWithin: {
            $box: [
                //[ 49.74400648683359, -121.11963272094727 ], [ 49.07566511479297, -124.47046279907227 ]
                //[ -121.11963272094727,49.74400648683359], [  -124.47046279907227,49.07566511479297 ]
                //[  -124.47046279907227,49.07566511479297 ],[ -121.11963272094727,49.74400648683359]
                payloadData.northEast, payloadData.southWest
            ]
        }
    }
    criteria.$match.location = geoWithinLocation
    var project_new = {
        $project: projection
    }
    var skip = { $skip: payloadData.skip, }
    var limit = { $limit: payloadData.limit, }
    async.auto({
        getData: [(cb) => {
            var options = {
                lean: true,
                skip: payloadData.skip,
                limit: payloadData.limit,
            };
            DBCommonFunction.aggregate(Models.REST_PROPERY_RD_1, [project_new, criteria, skip, limit], (err, data) => {
                //Service.REST_PROPERY_RD_1_Service.getData(criteria,projection, options,(err,data)=> {
                if (err) return cb(err);
                finalData = data
                return cb({ criteria: criteria, data: finalData });
            });
        }],
        setData: ['getData', (r1, cb) => {
            finalData.forEach(function (element) {
                var tempData = element;
                if (element.l_addressnumber.length > 0) {
                    var newAddress = element.l_addressnumber + '-' + element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                } else {
                    var newAddress = element.l_addressstreet + '-' + element.l_city + '-' + element.l_state;
                }
                newAddress = Utils.universalfunctions.replaceCharacterInString(newAddress, " ", "-");
                tempData.newAddress = newAddress.toLowerCase();
                var lat = tempData.location.coordinates[1] //latlong
                var Lng = tempData.location.coordinates[0] //latlong
                var latlong = [lat, Lng];
                tempData.latlong = latlong;
                if (lat != 0 && Lng != 0) {
                    finalData_new.push(tempData);
                }
                delete tempData.location;
            });
            return cb();
        }]

    }, (err, result) => { //console.log("===erredatarrerr===",err,result)
        if (err) return callbackRoute(err);
        return callbackRoute(null, {
            countData: finalData.length,
            locations: finalData_new
        });
    })
}



///GET RECENT PROPERTIES
var getRecentProperties = function (payloadData, callbackRoute) {
    //console.log(payloadData);
    async.auto({
        getRecentProperty: [(cb) => {
            var options = {
                lean: true
            };
            var criteria = {
                createdAt: { $gt: new Date(Date.now() - 48 * 60 * 60 * 1000) }
            }
            Service.REST_PROPERY_RD_1_Service.getRecentProperties(criteria, projection, options, (err, data) => {
                if (err) return cb(err);
                totalRecord = data.length;
                if (data.length > 0) {
                    return cb(data);
                } else {
                    var value = {
                        "statusCode": 200,
                        "message": "No recent value added",
                        data: "data not available"
                    }
                    return cb(value)
                }

            });
        }],
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};

var getFavourites = function (payloadData, callbackRoute) {
    console.log(payloadData);
    async.auto({
        getFavourites: [(cb) => {

            var criteria = {
                user: payloadData.userid
            };
            Service.MARK_FAVORITE_SERVICE.getFavs(criteria, function (err, result) {
                if (err) return cb(err);
                //totalRecord = data.length;
                if (result.length > 0) {
                    return cb(result);
                } else {
                    var value = {
                        "statusCode": 404,
                        "message": "No recent value added",
                        data: "data not available"
                    }
                    return cb(value)
                }
            });
        }],
    }, (err, result) => {
        if (err) return callbackRoute(err);
        return callbackRoute();
    });
};


module.exports = {
    InsertPropertyRD_1_Data: InsertPropertyRD_1_Data,
    getNumberOfPropertiesInEachType: getNumberOfPropertiesInEachType,
    getNumberOfDwellings: getNumberOfDwellings,
    getAllResidentialProperty: getAllResidentialProperty,
    PropertyDetails: PropertyDetails,
    featuredProperties: featuredProperties,
    homePageSilderData: homePageSilderData,
    homePagebottomData: homePagebottomData,
    getAllAreaList: getAllAreaList,
    getAllCityList: getAllCityList,
    PropertyDetailsusingMls: PropertyDetailsusingMls,
    getAlllocation: getAlllocation,
    PropertyDetailsusingl_displayid: PropertyDetailsusingl_displayid,
    getAlllocationNorthAndSouthCoordinate: getAlllocationNorthAndSouthCoordinate,
    getRelatedProperties: getRelatedProperties,
    getRecentProperties: getRecentProperties,
    getFavourites: getFavourites,
    getCountOfParams: getCountOfParams

}
