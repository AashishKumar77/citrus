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
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;

var stripe = require("stripe")(APP_CONSTANTS.testSecretKey);
var stripeGenerateToken = require("stripe")('sk_test_AgZKfIho2sqgmftheseydYsA');
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

var CreateSubscriptionPlan = function(payloadData, callbackRoute){
    var planData;
    async.auto({
        CreateStripePlan:[(cb)=>{
            stripe.plans.create(payloadData, function(err, plan) {
               if(err) return cb(err);
               planData = plan;
               return cb();
            })
        }]

    },function(err,result){
        if(err) return callbackRoute(err)
        return callbackRoute(null,planData)
    })
}

var stripePlansRetrieve=function(payloadData, callbackRoute){ //console.log("payloadData==",payloadData.stripPlanId);
    var planData;
    async.auto({
        StripePlanRetrieve:[(cb)=>{
            stripe.plans.retrieve(payloadData.stripPlanId, function(err, plan) {
               if(err) return cb(err);
               planData = plan;
               return cb();
            })
        }]

    },function(err,result){
        if(err) return callbackRoute(err)
        return callbackRoute(null,planData)
    })
}

var createCustomer = function(params, callback){
    console.log("inside create customer", params)

    async.waterfall([
        function(cb) { // create stripe customer
            if (params.customer_id) { // customer id already exists
                cb({ statusCode: 103, status: "warning", message: "Customer id already exists" })
            } else {
                stripe.customers.create({
                    description: 'Customer for Southsurrey',
                    email: params.email,
                }, function(err, customer) {
                    if (err) {
                        //console.log("error while creating customer",err)
                        cb(err.raw)
                    } else {
                        //console.log("inside success when creating customer")
                        //console.log("customer=====",customer)
                        cb(null, customer)
                    }
                });
            }
        },
        /**/
    ], function(err, result) { //console.log("resultxxxxxx",result);
        if (err) {
            callback(err)
        } else {
            callback(null, result)
        }
    })
}

var createSource = function(params, callback) { console.log("params", params)
    stripe.customers.createSource(
        params.customer_id, { source: params.token },
        function(err, card) {
            if (err) { console.log("inside error when creating customer source")
                callback({ statusCode: err.raw.statusCode, type: err.raw.type, message: err.raw.message })
            } else { console.log("successfully source created")
                callback(null, {})
            }
        }
    );
}

var listCards = function(params, callback) {
    if(params.customer_id){
        stripe.customers.retrieve(params.customer_id, function(err, cards) {
            if (err) { console.log("erron in fetching cards==", {
                statusCode:err.raw.statusCode,
            })
                callback(err.raw)
            } else { //console.log("cards..xxxx..", cards)
                callback(null, cards)
            }
        })
    }else{
        return callback()
    }
}

var setDefaultCard = function(params, callback) {

    stripe.customers.update(
        params.userData.customer_id, { default_source: params.card_id },
        function(err, obj) {
            if (err) {
                console.log("error in updating card details")
                //console.log("errXXXX",err)
                callback({ statusCode: err.raw.statusCode, type: err.raw.type, message: err.raw.message })
            } else {
                console.log("response of updating card")
                console.log(obj)
                callback(null, obj)
            }

        }
    );

}
var createCharge =(Data, callback)=> { console.log("inside create charge", Data)
    async.auto({
        stripeCharge:[(cb)=> { //console.log("inside next callback", data)
            stripe.charges.create({
                amount: Data.amount,
                currency: Data.currency ,
                customer: Data.customer_id,
                //metadata: {},
                source: Data.source,
                description: "Charge for job on Southsurrey"
            },(err, charge)=> {
                if (err) { console.log("error while creating charges",err.raw)
                    if(err.raw) return cb({
                        type: err.raw.type,
                        message: err.raw.message,
                        statusCode: 400,
                    })
                    return cb(err)
                } else { console.log("success in charge create")
                    return cb(null,charge)
                }
            });
        }]
    },(err, result)=>{
        if (err) return callback(err)
        return callback(null, result.stripeCharge)
    });
}

var deleteCard = (Data, callback)=> {
    stripe.customers.deleteCard(
        Data.customer_id,//"cus_BDn9tyZ7JHhbMf", //customer_id
        Data.CardId,//"card_1ArLZHAUIb3ryDLmN5rWKLSr", //CardId
        function(err, confirmation) { //console.log("errr=====deleteCard",err);
            if (err) {
                if(err.raw) return callback({
                    type: err.raw.type,
                    message: err.raw.message,
                    statusCode: 400,
                });
                return callback(err)
            }
            return callback();
        }
    )

}
var subscriptionsCreate = function (Data, callback){ //console.log("Data==",Data);
        stripe.subscriptions.create({
            customer: Data.customer,
            billing:'send_invoice',
            days_until_due:2,
            items: [{
               //plan: "plan_Coh63sPXbPt1dG",
               plan: Data.stripePlanId,
            }]
        }, function(err, subscription) {
            if(err) { //console.log("err==",err);
                return callback(err)
            }
            return callback(null,subscription)
        });
}
var subscriptionsPlanDelete = function (Data, callback){ console.log("Data==",Data);
    stripe.plans.del(Data.stripePlan_Id,function(err, confirmation) {
        if(err){
            if(err.raw) return callback(Responses.NO_PLAN_EXISTS);
            return callback(err)
        }
        return callback()
    });
}

var generateCardToken= function(data,callback){

  console.log(' In create Card token here ',data);

    var cardData = {
        "number": data.cardNumber,        //'4000056655665556',
        "exp_month": data.cardExpMonth,  //12,
        "exp_year": data.cardExpYear,   //2019,
        "cvc": data.cardCvc            //'123'
    }; console.log("cardData===",cardData);
    var tokenId
    stripeGenerateToken.tokens.create({card: cardData},function(err,token) {
        if(err){ //console.log("=======generateCardToken======err==if===",err);
            return callback(err.raw);
        }else{
            tokenId = token.id; //console.log("=======generateCardToken======token==else===",tokenId);
            return callback(null,tokenId);
        }
    });
}

// for testing purpose only
var createCardToken= function(callbackRoute){
    var cardData = {
        "number": '4000056655665556',
        "exp_month": 12,
        "exp_year": 2019,
        "cvc": '123'
    }
    stripeGenerateToken.tokens.create({card: cardData
    //stripe.tokens.create({card: cardData

    },function(err, token) {
            console.log("token",err,token);
            return callbackRoute();

    });
}

/*
createCardToken((err)=>{
    console.log("err",err);
})*/
module.exports = {
    CreateSubscriptionPlan     :  CreateSubscriptionPlan,
    stripePlansRetrieve        :  stripePlansRetrieve,
    createCustomer             :  createCustomer,
    createSource               :  createSource,
    listCards                  :  listCards,
    setDefaultCard             :  setDefaultCard,
    createCharge               :  createCharge,
    deleteCard                 :  deleteCard,
    subscriptionsCreate        :  subscriptionsCreate,
    subscriptionsPlanDelete    :  subscriptionsPlanDelete,
    generateCardToken          :  generateCardToken
}
