
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var featuredPropertyAlgorithmSchema = new Schema({
    featuredPropertyAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    siteId: { type: Schema.Types.ObjectId, ref: 'users',required: true },
    minbathRoom     :  {type: Number },
    maxbathRoom     :  {type: Number },
    minbedRoom      :  {type: Number },
    maxbedRoom      :  {type: Number },
    minAskingprice  :  {type: Number },
    maxAskingprice  :  {type: Number },
    area            :  [{type: String }] ,
    city            :  [{type: String }] ,
    boardUserName   :  { type : String },
    type   :  { type : String },
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},
    includeOwnListing:{type : Boolean , default : false},
    prioritizedListing : {type : Boolean , default : false}
})

featuredPropertyAlgorithmSchema.plugin(mongooseSequence, { inc_field: 'featuredPropertyAutoIncrement' });

var featuredPropertyAlgorithm = Mongoose.model('featuredPropertyAlgorithm', featuredPropertyAlgorithmSchema);
module.exports = featuredPropertyAlgorithm;
