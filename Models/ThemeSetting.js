/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 27 February, 2017
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var ThemeSettingSchema = new Schema({
    logoUrl: { type: String },
    siteId: { type: Schema.ObjectId, ref: 'user',index:true,sparse: true, required: true },
    ContactNumber: { type: String },
    facebookpageUrl : { type: String,index:true,sparse:true },
    twitterpageUrl : { type: String,index:true,sparse:true },
    passwordExpireDays : { type : Number },
    fromEmail : { type : String },
    fromName : { type : String },
    signature : { type : String },
    siteName : { type : String },
    copyrightYear : { type : String },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    siteUrl : { type : String }
})

var ThemeSetting = Mongoose.model('themesetting', ThemeSettingSchema);
module.exports = ThemeSetting;
