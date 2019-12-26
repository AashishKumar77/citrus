/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 27 April, 2017
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const USER_TYPE = APP_CONSTANTS.USER_TYPE;
const CONTACT_FORM_TYPE = APP_CONSTANTS.CONTACT_FORM_TYPE;
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;



var ContactFormSchema = new Schema({
    userId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
    siteId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
    agentId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
    firstName: {type: String, "createdCollectionAutomatically" : false,},
    lastName: {type: String, "createdCollectionAutomatically" : false,},
    email: {type: String, trim: true, index: true,sparse: true},
    ContactFormAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    phone: {type: Number},
    phoneNumber: {type: String},
    message: {type: String},
    date: {type: String },
    time : [{type : String}],
    //message: [messageSchema],
    emailSendDate: {type: Date, default: new Date()},
    createdAt: {type: Date, default: new Date()},
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    PropertyId: {type: Schema.ObjectId, ref: 'retspropertyrd_1'},
    propertyName:{type: String},
    movedToCmsDate: {type: Date},
    isMovedToCMS:{type: Boolean, default: false,index: true},
    formType: {
        type: String,
        enum: [
          CONTACT_FORM_TYPE.LEAD,
          CONTACT_FORM_TYPE.CONTACT_FORM,
          CONTACT_FORM_TYPE.PROPERTY_VALUATION,
          CONTACT_FORM_TYPE.REQUESTCALLBACK,
          CONTACT_FORM_TYPE.PROPERTY_DETAIL
        ],
        default:CONTACT_FORM_TYPE.CONTACT_FORM
    },
    userType: {
        type: String,
        enum: [
          "Member",
          "Non-Member",
          "Buyer"
        ],
    },
    spousefirstName: {type: String, },
    spouselastName: {type: String, },
    typeofResidence: {type: String},
    dob: {type: String, },
    moving_day: {type: String, },
    city: {type: String, },
    state: {type: String, },
    zip: {type: String, },
    address: {type: String, },
    Wedding_Anniversary: {type: String},
    rating: {type: String},
    kids:[
        {
            name: {type: String, },
            age: {type: String, },
            gender: {type: String, },
        }
    ],
    recordofContact: {type: String, },
    sourceofContact: {type: String, },
    funnelId: {type: Schema.ObjectId, ref: 'ContactForm'},
    contactDetailId:{type:Array},
    addressLine1: {type: String},
    addressLine2: {type: String},
    city: { type: String },
    State: { type: String },
    Zip: { type: String },
    mlsNumber : { type :  String }
})

// ContactFormSchema.plugin(mongooseSequence, { inc_field: 'ContactFormAutoIncrement' });
ContactFormSchema.index({ firstName: "text" }, { default_language: "none" });
ContactFormSchema.index({ lastName: "text" }, { default_language: "none" });
var schedule = Mongoose.model('schedule', ContactFormSchema);
module.exports = schedule;

function getTimeStamp() {
    return parseInt(Date.now() / 1000)
}
