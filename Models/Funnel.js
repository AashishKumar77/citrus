/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the CMS user meta schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 09 February, 2017
 -----------------------------------------------------------------------*/

const env = require('../env');
const Mongoose = require('mongoose');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const Schema = Mongoose.Schema;

var FunnelSchema = new Schema({
	funnelAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
	siteId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true, required: true},
	createdBy :   {type: Schema.ObjectId, ref: 'users'},
	title: {type: String, },
	noOfDays: {type: Number},
	unsubscribe : { type : Boolean , default : false },
	unsubscribeText : { type : String },
	emailTemplateHtml: {type: String, },
	createdAt: {type: Date, default: new Date()},
	updatedAt: {type: Date},
	funnelType: {type: String},
	isDeleted: {type: Boolean, default: false},
	unsubscribedUsers : [{type: Schema.ObjectId, ref: 'user'}],
	globalView : {type: Boolean, default: false}
});

FunnelSchema.plugin(mongooseSequence, { inc_field: 'funnelAutoIncrement' });
var Funnel = Mongoose.model('funnel', FunnelSchema);
module.exports = Funnel;
