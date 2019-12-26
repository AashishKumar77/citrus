

/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 13 February, 2018
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;



var MarkFavoriteSchema = new Schema({
	favoriteListingAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	PropertyId: { type: Schema.Types.ObjectId, ref: 'retspropertyrd_1' },
	isDeleted: {type: Boolean, default: false},
	IsFavorited: {type: Boolean, default: true},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date},

});

MarkFavoriteSchema.plugin(mongooseSequence, { inc_field: 'favoriteListingAutoIncrement' });
var MarkFavorite = Mongoose.model('markfavorite', MarkFavoriteSchema);
module.exports = MarkFavorite;
