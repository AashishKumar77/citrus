/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 27 April, 2017
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const SUBSCRIPTION_PLAN_TYPE = APP_CONSTANTS.SUBSCRIPTION_PLAN_TYPE;




var SubscriptionPlanSchema = new Schema({
	SubscriptionIdAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    planName:{type: String,required: true},
    planAmount:{ type: Number,required: true},
    interval: {
    	type: String,
    	enum: [
	        SUBSCRIPTION_PLAN_TYPE.DAY,
	        SUBSCRIPTION_PLAN_TYPE.WEEK,
	        SUBSCRIPTION_PLAN_TYPE.MONTH,
	        SUBSCRIPTION_PLAN_TYPE.YEAR,
        ],
        default: SUBSCRIPTION_PLAN_TYPE.MONTH,
    },
    numberOfMonths:{ type: Number,required: true},
    stripePlanId:{type: String,},
    isDeleted: {type: Boolean, default: false},
})

SubscriptionPlanSchema.plugin(mongooseSequence, { inc_field: 'SubscriptionIdAutoIncrement' });
var subscriptionplan = Mongoose.model('subscriptionplan', SubscriptionPlanSchema);
module.exports = subscriptionplan;
