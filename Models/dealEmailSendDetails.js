const env = require('../env');
const Mongoose = require('mongoose');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const Schema = Mongoose.Schema;

var DealEmailSendDetailSchema = new Schema({
	leadId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	status: { type: String },
	dealtemplateId: {type: Schema.ObjectId, ref: 'dealTemplates'},
	emailSendDate: {type: Date, default: new Date()}
},{
    timestamps : true
});

//FunnelSchema.plugin(mongooseSequence, { inc_field: 'funnelAutoIncrement' });
var dealEmailSendDetails = Mongoose.model('dealEmailSendDetails', DealEmailSendDetailSchema);
module.exports = dealEmailSendDetails;
