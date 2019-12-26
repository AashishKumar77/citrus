/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 27 January, 2018
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var PostCardLobSchema = new Schema({
   // userId: {type: Schema.ObjectId, ref: 'users'},
    ContactId: {type: Schema.ObjectId, ref: 'ContactForm',index:true,sparse: true},
    PostCardLob : {type: String},
    isDeleted: {type: Boolean, default: false},
},
{timestamps:true}
)
var PostCardLob = Mongoose.model('postcardlob', PostCardLobSchema);
module.exports = PostCardLob;