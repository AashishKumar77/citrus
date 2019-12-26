/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 18 December, 2017
 -----------------------------------------------------------------------*/

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const USER_TYPE = APP_CONSTANTS.USER_TYPE;
const SOCIAL_MODE = APP_CONSTANTS.SOCIAL_MODE;


var UserSchema = new Schema({
    siteId : {type: Schema.ObjectId, ref: 'user',},
    assignedTo : {type: Schema.ObjectId, ref: 'user'},
    user : { type: Schema.Types.ObjectId, ref: 'Person' },
    first : {
        type: String, 
        "createdCollectionAutomatically" : false,
        trim: true
    },
    last : {type: String, "createdCollectionAutomatically" : false,trim: true},
    firstName: {type: String, trim: true },
    lastName: {type: String, trim: true},
    userAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    phone: {type: String, trim: true},
    status: {type: String, enum: [
                                    "Cold",
                                    "Hot",
                                    "Contacted",
                                    "No Contact",
                                    "Failed Information"
    ]},
    phoneNumber: {type: String, trim: true},
    password: {type: String, trim: true},
    email: {type: String, trim: true},
    emailVerificationToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    phoneVerificationToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    isPhoneVerified: {type: Boolean, default: false},
    isEmailVerified: {type: Boolean, default: false},
    forgetpasswordVerifyToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    isSuspended: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    isConfirmed: {type: Boolean, default: false},
    isPasswordExpired : { type : Boolean , default: false },
    created_at: {type: Number, default: getTimeStamp},
    modified_at: {type: Number},
    facebookId: {type: String},
    linkedinId: {type: String},
    twitterId: {type: String},
    socket_id: {type: String},
    userType: { type: String,
        // enum: [
        // USER_TYPE.ADMIN,USER_TYPE.AGENT,
        // USER_TYPE.BUYER,
        // USER_TYPE.SELLER,
        // USER_TYPE.BUILDER,
        // USER_TYPE.SITE_AGENT,
        // USER_TYPE.SUPER_ADMIN
        // ],
    },
    clientType: { type: String,enum: [
       "Buyer",
       "Buyer/Seller",
       "Seller",
       "Builder",
       "Invester"
        ],
    },
    lastVisitedDate:{type: Date},
    countOfVisitingWebsite:{type: Number, default:0},
    countOfPropertiesLooked:{type: Number, default:0},
    LookedPropertiesId:{type:Array},
    socialMode: {type: String,enum: [SOCIAL_MODE.FACEBOOK,SOCIAL_MODE.LINKEDIN]},
    about_yourself: {type: String},
    profile_pic: {type: String},
    markfavoriteId:{type:Array},
    workingTime:{
      startHour: {type: Number},
      startMinute: {type: Number},
      endHour: {type: Number},
      endMinute: {type: Number},
    },
    location: {
        'type': {type: String, enum: "Polygon", default: "Polygon"},//LineString //Polygon
        coordinates: {type:Array}
    },
      startHour: {type: String},
      startMinute: {type: String},
      endHour: {type: String},
      endMinute: {type: String},
      fromEmail: {type: String},
      fromName: {type: String},
    deletedDefaultNavigation:{type:Array},
    customer_id: {type: String},
    agentSince:{type: String},
    propertiesRented:{type: String},
    lastSoldProperty:{type: String},
    averagePrice:{type: Number},
    propertiesSold:{type: String},
    website:{type: String},
    biography:{type: String},
    verifiedAt : {type: Date},
    passwordLastUpdated : { type : Date },
    realtorcontactbox : { type: String },
    realtoragentid : { type: String  },
    cloudcmaapi : {type: String } ,
    rotateInFeaturedListing : {type: Boolean,default : false } ,
    rotateInContactBox : {type: Boolean,default : false } ,
    receiveContactFormSubmissions : {type: Boolean,default : false } ,
    receiveShowingRequests : {type: Boolean,default : false } ,
    r_contactForm : {type: Boolean,default : false } ,
    r_showingRequests : {type: Boolean,default : false } ,
    r_building : {type: Boolean,default : false } ,
    r_settings : {type: Boolean,default : false } ,
    r_realtors :{type: Boolean,default : false } ,
    r_members : {type: Boolean, default : false } ,
    r_blog : {type: Boolean ,default : false} ,
    r_school : {type:Boolean , default : false} ,
    r_leads : {type:Boolean , default : false },
    s_facebook : { type: String  },
    s_twitter : { type :  String },
    s_linkedin : { type : String },
    s_google : { type : String },
    s_instagram : { type : String },
    signature : { type : String },
    rotate_sellers : { type : Boolean , default : true },
    rotate_buyers : { type : Boolean , default : true },
    createPasswordToken : { type: String },
    
    rotateInListingDetails : { type : Boolean , default : true },
    slug : { type : String, trim: true  },
    createdBy :   {type: Schema.ObjectId, ref: 'users'},
    buildPath : { type : String , default : null },
    baseUrl : { type : String, trim: true },
	facebookPixelId : { type : String },
    facebookAppId : { type : String },
    domain : { type : String },
    serviceusername : { type : String },
    servicepassword : { type : String },
    fromCrm: { type : Number, default:0},
    isMovedToCMS:{type: Boolean, default: false,index: true},
    propertiesId: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'ContactForm' }],
    // new feilds added
    source : { type : String },
    rating: {type: String},
    state: {type: String, },
    zip: {type: String, },
    typeofResidence: {type: String},
    address: {type: String, },
    dob: {type: Date },
    moving_day: {type: Date },
    Wedding_Anniversary: {type: Date},
    sourceofContact: { type: String },
    recordofContact: { type: String },
    contactPreference:{ type: String },
    mailingAddress:{ type: String },
    moving_date: {type: Date},
    funnelId: { type :String },
    assignedTo:{ type :String },
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
          pet : { type: String }
        }
    ],
    // pets:[{
    //       id : { type: Number },
    //       pet : { type: String }
    // }],
    dealStatus : { type : String , enum: ["Pending","Closed"],default : "Pending"},
    greetingCards :{type:Array},
    newsletter :{type:Array},
    automatic_meeting_request:{type:String},
    automatic_meeting_request_date:{type:Date},
    automatic_meeting_request_sent:{type:Number},
    isFunnelEnable:{type:Boolean},
    automatic_meeting_request_frequency:{type:Number},
    newsletter_frequency:{type:Number}
},
{
   timestamps: true
});

UserSchema.plugin(mongooseSequence, { inc_field: 'userAutoIncrement' });
UserSchema.index({ name: "text" }, { default_language: "none" });
UserSchema.index( { email: 1, siteId: 1},{unique: true,sparse: true} )
var user = Mongoose.model('user', UserSchema);
module.exports = user;

function getTimeStamp() {
    return parseInt(Date.now() / 1000)
}
