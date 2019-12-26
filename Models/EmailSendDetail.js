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

var EmailSendDetailSchema = new Schema({
	userId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	funnelId: {type: Schema.ObjectId, ref: 'users'},
	funneltemplateId: {type: Schema.ObjectId, ref: 'users'},
	emailSendDate: {type: Date, default: new Date()},
	createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date},
});

//FunnelSchema.plugin(mongooseSequence, { inc_field: 'funnelAutoIncrement' });
var emailsenddetail = Mongoose.model('emailsenddetail', EmailSendDetailSchema);
module.exports = emailsenddetail;
