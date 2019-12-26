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

var PageDetailSchema = new Schema({
    userId: {type: Schema.ObjectId, ref: 'users'},
    funnelId: {type: Schema.ObjectId, ref: 'funnel'},
    PageAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    title : {type: String, "createdCollectionAutomatically" : false,},
    slug: {type: String, "createdCollectionAutomatically" : false,},
    templateName: {type: String},
    textData: {type: String, trim: true},
    isDeleted: {type: Boolean, default: false},
    status: { type: String,enum: [
        POST_STATUS.PUBLISH,
        POST_STATUS.DRAFT,
        ], default:POST_STATUS.DRAFT
    },
    createdAt: {type: Date, default: new Date()},
    publishedAt: {type: Date},
    updatedAt: {type: Date, default: new Date()},
    isdefaultNavigation: {type: Boolean, default: false},
    isLandingPage: {type: Boolean, default: false},
    globalView: {type: Boolean, default: false},
    pageAgents : [{ type: Schema.ObjectId, ref: 'user'}],
    landingPageForm:[
        {
            fieldName: {type: String, },
            fieldType: {type: String, },
            fieldRequired: {type: Boolean},
            isenable: {type: Boolean},
        }
    ],
    type : { type: String }
},{
    timestamps : true
})

PageDetailSchema.plugin(mongooseSequence, { inc_field: 'PageAutoIncrement' });
PageDetailSchema.index({ title: "text" }, { default_language: "none" });
PageDetailSchema.index({ slug: "text" }, { default_language: "none" });
PageDetailSchema.index({ slug: "text" }, { default_language: "none" });
var Pagedetail = Mongoose.model('Pagedetail', PageDetailSchema);
module.exports = Pagedetail;
