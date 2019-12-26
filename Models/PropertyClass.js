/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the property class and their total records schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 02 January, 2018
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var PropertClassSchema = new Schema({
    className: {type: String,trim: true, index: true, unique: true, sparse: true,required: true},
    totalRecords : {type: Number,required: true,index: true},
    completedAt: {type: Date},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},   
})

//PropertClassSchema.plugin(mongooseSequence, { inc_field: 'postAutoIncrement' });

var PropertClass = Mongoose.model('propertclass', PropertClassSchema);
module.exports = PropertClass;

