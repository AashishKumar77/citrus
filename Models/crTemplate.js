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

var crTemplateSchema = new Schema({
	crTemplateAutoIncrement: { type: Number,unique: true,index:true,sparse:true },
	title: { type: String },
	type: { type: String },
  sendField : { type: String },
	rating : [{ type: String }],
  subject : { type : String },
  content : { type :  String },
  siteId : { type : String },
  isActive : { type : Boolean , default : true }
},{
    timestamps :  true
});

crTemplateSchema.plugin(mongooseSequence, { inc_field: 'crTemplateAutoIncrement' });
var crTemplate = Mongoose.model('crTemplate', crTemplateSchema);
module.exports = crTemplate;
