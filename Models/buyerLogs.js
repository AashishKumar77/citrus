const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var buyerSchema = new Schema({
    buyerLogId: { type: Number,unique: true,index:true,sparse:true },
    siteId  : { type: Schema.Types.ObjectId, ref: 'users' },
    createdBy :   { type: Schema.ObjectId, ref: 'users' },
    leadId : { type: Schema.Types.ObjectId, ref: 'users' },
    contactDate : { type :  Date },
    contactMethod : { type :  String },
    logs : { type :  String }
})

buyerSchema.plugin(mongooseSequence, { inc_field: 'buyerLogId' });

var buyerLogs = Mongoose.model('buyerLogs', buyerSchema);
module.exports = buyerLogs;
