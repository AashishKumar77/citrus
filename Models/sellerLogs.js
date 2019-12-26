const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var sellerSchema = new Schema({
    sellerLogId: { type: Number,unique: true,index:true,sparse:true },
    siteId  : { type: Schema.Types.ObjectId, ref: 'users' },
    createdBy :   { type: Schema.ObjectId, ref: 'users' },
    leadId : { type: Schema.Types.ObjectId, ref: 'users' },
    contactDate : { type :  Date },
    contactMethod : { type :  String },
    logs : { type :  String }
})

sellerSchema.plugin(mongooseSequence, { inc_field: 'sellerLogId' });

var sellerLogs = Mongoose.model('sellerLogs', sellerSchema);
module.exports = sellerLogs;
