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
const POST_STATUS = APP_CONSTANTS.POST_STATUS;
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;

var PostSchema = new Schema({
    siteId: {type: Schema.ObjectId, ref: 'users'},
    createdBy :   {type: Schema.ObjectId, ref: 'users'},
    postAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    title : {type: String, "createdCollectionAutomatically" : false,},
    slug: {type: String, "createdCollectionAutomatically" : false,},
    textData: {type: String, trim: true},
    isFeatured: {type: Boolean, default: false},
    propertyImages:{type:Array},
    isDeleted: {type: Boolean, default: false},
    //isImageExists: {type: Boolean, default: false},
    status: {type: String,enum: [
        POST_STATUS.PUBLISH,
        POST_STATUS.DRAFT,
        ],default:POST_STATUS.DRAFT
    },
    createdAt: {type: Date, default: new Date()},
    publishedAt: {type: Date},
    updatedAt: {type: Date, default: new Date()},
    category : [{type: Schema.ObjectId, ref: 'category'}],
    globalView: {type: Boolean, default: false},
    tags:[
        {
            display:{type:String},
            value:{type:String}
        }
    ]
})

PostSchema.plugin(mongooseSequence, { inc_field: 'postAutoIncrement' });
PostSchema.index({ title: "text" }, { default_language: "none" });
PostSchema.index({ slug: "text" }, { default_language: "none" });
//PostSchema.index({ textData: "text" }, { default_language: "none" });
//PostSchema.index({ slug: "text" }, { default_language: "none" });
var post = Mongoose.model('post', PostSchema);
module.exports = post;

function getTimeStamp() {
    return parseInt(Date.now() / 1000)
}
