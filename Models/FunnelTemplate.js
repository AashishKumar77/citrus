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

var FunnelTemplateSchema = new Schema({
	funnelTemplateAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
	funnelId: { type: Schema.ObjectId, ref: 'users' },
	title: { type: String, },
	subject: { type: String, },
	emailTimeInterval: { type: Number},
	emailTemplateHtml: { type: String, },
	status:{ type: String},
	emailType:{ type: String},
	sendCmaAutomatically: { type: Boolean, default: false},
	noOfDays: { type: Number },
	createdAt: { type: Date, default: new Date()},
  updatedAt: { type: Date},
  isDeleted: { type: Boolean, default: false},

});

FunnelTemplateSchema.plugin(mongooseSequence, { inc_field: 'funnelTemplateAutoIncrement' });
var FunnelTemplate = Mongoose.model('funnelTemplate', FunnelTemplateSchema);
module.exports = FunnelTemplate;
