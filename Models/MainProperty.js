/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 2 May, 2018
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var mainPropertySchema = new Schema({
   l_displayid : {type: String,trim: true, index: true,sparse:true},
   mainPropertyAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
   createdAt: {type: Date, default: new Date()},
})
mainPropertySchema.plugin(mongooseSequence, { inc_field: 'mainPropertyAutoIncrement' });
var mainproperty = Mongoose.model('mainproperty', mainPropertySchema);
module.exports = mainproperty;