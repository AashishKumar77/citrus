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
const POST_STATUS = APP_CONSTANTS.POST_STATUS;

var testimonialSchema = new Schema({
    postAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    name : {type: String, required:true},
    designation : {type: String, required:true},
    textData: {type: String, trim: true},
    isFeatured: {type: Boolean, default: false},
    postImage:{type:String},
    createdBy :   {type: Schema.ObjectId, ref: 'users'},
    siteId : {type: Schema.Types.ObjectId, ref: 'users'},
    isDeleted: {type: Boolean, default: false},
    status: {type: String,enum: [
        POST_STATUS.PUBLISH,
        POST_STATUS.DRAFT,
        ],default:POST_STATUS.DRAFT
    },
    createdAt: {type: Date, default: new Date()},
    publishedAt: {type: Date},
    updatedAt: {type: Date, default: new Date()},
    globalView: {type: Boolean, default: false}
})


var testimonial = Mongoose.model('testimonial', testimonialSchema);
module.exports = testimonial;
