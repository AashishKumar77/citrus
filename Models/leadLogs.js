
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var logSchema = new Schema({
    leadLogId: { type: Number,unique: true,index:true,sparse:true },
    siteId  : { type: Schema.Types.ObjectId, ref: 'users' },
    createdBy :   { type: Schema.ObjectId, ref: 'users' },
    leadId : { type: Schema.Types.ObjectId, ref: 'users' },
    contactDate : { type :  Date },
    contactMethod : { type :  String },
    leadEmail : { type : String },
    message : { type :  String }
})

logSchema.plugin(mongooseSequence, { inc_field: 'leadLogId' });

var logs = Mongoose.model('logs', logSchema);
module.exports = logs;
