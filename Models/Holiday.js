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

var HolidaySchema = new Schema({
	holidayAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
	agentId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	title: {type: String, },
	holidayDate: {type: Date},
	createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date},
});

HolidaySchema.plugin(mongooseSequence, { inc_field: 'holidayAutoIncrement' });
var holiday = Mongoose.model('holiday', HolidaySchema);
module.exports = holiday;
