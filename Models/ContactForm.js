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
    firstName: {type: String, "createdCollectionAutomatically" : false,},
    lastName: {type: String, "createdCollectionAutomatically" : false,},
    email: {type: String, trim: true, index: true,sparse: true},
    sellerEmail: {type: String, trim: true, index: true,sparse: true},
    ContactFormAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    phone: {type: Number},
    phoneNumber: { type: String },
    name : {type: String},
    bedrooms : {type: String},
    bathrooms : {type: String},
    squareFeet : {type: String},
    sellingIn : {type: String},
    //message: {type: String, "createdCollectionAutomatically" : false,},
    message: {type: String},
    emailSendDate: {type: Date, default: new Date()},
    // createdAt: {type: Date, default: new Date()},
    isRead: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    PropertyId: {type: Schema.ObjectId, ref: 'retspropertyrd_1'},
    movedToCmsDate: {type: Date},
    isMovedToCMS:{type: Boolean, default: false,index: true},
    formType: {
        type: String,
        enum: [
          CONTACT_FORM_TYPE.LEAD,
          CONTACT_FORM_TYPE.CONTACT_FORM,
          CONTACT_FORM_TYPE.PROPERTY_VALUATION,
          CONTACT_FORM_TYPE.REQUESTCALLBACK,
          CONTACT_FORM_TYPE.PROPERTY_DETAIL,
          CONTACT_FORM_TYPE.CONTACT_AGENT,
          CONTACT_FORM_TYPE.HOMEWORTH,
          CONTACT_FORM_TYPE.LANDINGPAGEB,
          CONTACT_FORM_TYPE.LANDINGPAGES
        ],
        default:CONTACT_FORM_TYPE.CONTACT_FORM
    },
    userType: {
        type: String,
        enum: [
          "Member",
          "Non-Member",
          "Buyer",
          "Seller"
        ],
    },
    spousefirstName: {type: String, },
    spouselastName: {type: String, },
    typeofResidence: {type: String},
    dob: {type: Date },
    moving_day: {type: Date },
    city: {type: String, },
    state: {type: String, },
    zip: {type: String, },
    address: {type: String, },
    Wedding_Anniversary: {type: Date},
    rating: {type: String},
    assignedFunnel:[
      {
          funnelId:{ type:Schema.ObjectId,ref: 'funnel'},
          name: {type: String },
          isEnable:{type:Boolean}
      }
  ],
    family:[
        {
          firstName: {type: String },
          lastName: {type: String },
          age: {type: Number },
          gender : { type : String },
          dob : { type : Date },
          relation: { type: String },
          pet: { type: String }
        }
    ],
    pets:[{
          id : { type: Number },
          pet : { type: String }
    }],
    recordofContact: { type: String },
    sourceofContact: { type: String },
    funnelId: { type: String },
    contactDetailId:{type:Array},
    addressLine1: {type: String},
    addressLine2: {type: String},
    city: {type: String},
    State: {type: String},
    Zip: {type: String},
    type:{type: String},
    isListed: {type: Boolean,default : false},
    assignedTo : { type: Schema.ObjectId, ref: 'user',index:true,sparse: true  },
    siteId : { type: Schema.ObjectId, ref: 'user',index:true,sparse: true  },
    isCMASent  : { type: Boolean , default : false },
    unsubscribe : { type : Boolean, default : false },
    dealStatus : { type : String , enum: ["Pending","Closed"],default : "Pending"},
    status : { type : String },
    landingPageDetails : [{
      name: { type : String },
      email: { type : String },
      phonenumber: { type : String },
      address: { type : String },
      message: { type : String },
      landingPageId: { type: Schema.ObjectId, ref: 'Pagedetail',index:true,sparse: true },
      type : { type : String }
    }],
    landingPageId : { type: Schema.ObjectId, ref: 'Pagedetail',index:true,sparse: true },
    greetingCards :{type:Array},
    newsletter :{type:Array},
    isFunnelEnable:{type:Boolean},
},
{
   timestamps: true
});

ContactFormSchema.plugin(mongooseSequence, { inc_field: 'ContactFormAutoIncrement' });
ContactFormSchema.index({ firstName: "text" }, { default_language: "none" });
ContactFormSchema.index({ lastName: "text" }, { default_language: "none" });
var ContactForm = Mongoose.model('ContactForm', ContactFormSchema);
module.exports = ContactForm;
//============u are in contact foem modelchnages

function getTimeStamp() {
    return parseInt(Date.now() / 1000)
}
