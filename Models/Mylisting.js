

/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 03 January, 2018
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;



var myListingSchema = new Schema({
	myListingAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	PropertyId: { type: Schema.Types.ObjectId, ref: 'REST_PROPERY_RD_1' },
	isDeleted: {type: Boolean, default: false},
    createdAt: {type: Date, default: new Date()},
	updatedAt: {type: Date, default: new Date()},   
	IsSavedlisting: {type: Boolean, default: true}, 
    
});

myListingSchema.plugin(mongooseSequence, { inc_field: 'myListingAutoIncrement' });
var myListing = Mongoose.model('myListing', myListingSchema);
module.exports = myListing;


