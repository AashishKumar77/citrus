const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const SUBSCRIPTION_PLAN_TYPE = APP_CONSTANTS.SUBSCRIPTION_PLAN_TYPE;

var paymentDetailSchema = new Schema({
    paymentIdAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    userId: {type: Schema.ObjectId, ref: 'user',},
    transactionId: {type: String,index:true,unique: true,},
    status:{type: Boolean, default: false},
    transactionDetail:{type: String},
    planId: {type: Schema.ObjectId, ref: 'paymentdetails',},
    createdAt: {type: Date, default: new Date()},
    modified_at: {type: Date},
})
paymentDetailSchema.plugin(mongooseSequence, { inc_field: 'paymentIdAutoIncrement' });
var paymentdetails = Mongoose.model('paymentdetails', paymentDetailSchema);
module.exports = paymentdetails;
