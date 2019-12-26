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

var searchDataSchema = new Schema({
    searchTitle: {type: String,trim: true, index: true,sparse: true,required: true},
    user: { type: Schema.Types.ObjectId, ref: 'user',required: true },
    listingid       : {type: Number },
    minbathRoom     :  {type: Number },
    maxbathRoom     :  {type: Number },
    minbedRoom      :  {type: Number },
    maxbedRoom      :  {type: Number },
    minAskingprice  :  {type: Number },
    maxAskingprice  :  {type: Number },
    typeOfDwelling:{type: String,trim: true},
    minFloorSpace  :  {type: Number },
    maxFloorSpace  :  {type: Number },
    min_lot        :  {type: Number },
    max_lot        :  {type: Number },

    area            :  [{ type: String }],

    propertyType    :  {type: String }
},
{ timestamps: true })

//PropertClassSchema.plugin(mongooseSequence, { inc_field: 'postAutoIncrement' });

var searchData = Mongoose.model('searchData', searchDataSchema);
module.exports = searchData;
