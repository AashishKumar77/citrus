/*-----------------------------------------------------------------------
 * @ file        : proeprtyDeals.js
 * @ description : This file defines the deals cracked on specific properties
 * @ author      :Rajat SHarma
 * @ date        : 26 March, 2019
 -----------------------------------------------------------------------*/

const env = require('../env');
const Mongoose = require('mongoose');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const Schema = Mongoose.Schema;

var propertyDealsSchema = new Schema({
	propertyDealsAutoIncrement: { type: Number,unique: true,index:true,sparse:true },
	leadId : { type: Schema.ObjectId, ref: 'ContactForm' },
	propertyId : { type: Schema.ObjectId, ref: 'retsPropertyRd_1' },
  status : { type: String },
	mlsNumber : { type: String ,default :""},
	acceptance_date : { type: String },
	subject_removal_date : { type: String },
	completion_date : { type: String },
	possession_date : { type: String },
	includeInFunnel : { type : Boolean , default : true },
	isStillOwnIt:{type:Boolean},
  siteId : { type : String }
},{
    timestamps :  true
});

propertyDealsSchema.plugin(mongooseSequence, { inc_field: 'propertyDealsAutoIncrement' });
var propertyDeals = Mongoose.model('propertyDeals', propertyDealsSchema);
module.exports = propertyDeals;
