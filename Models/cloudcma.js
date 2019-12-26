const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var cloudcmaSchema = new Schema({
    id : { type :  Number },
    user_id : { type : Number },
    firstName:  { type :  String },
    lastName : { type : String},
    phoneNumber : { type : String },
    email_to:  { type :  String } ,
    pdf_url : { type : String },
    status : { type : String },
    body : { type : String },
    address : { type :  String },
    createdAt : { type : Date , default : Date.now() },
    updatedAt : { type : Date },
    siteId : { type: Schema.ObjectId, ref: 'user' },
    isEmailSent : { type : Boolean, default : false },
    funneltemplateId : { type: Schema.ObjectId, ref: 'funnelTemplate'},
    funnelId : {type: Schema.ObjectId, ref: 'users'}
})


var cloudcma = Mongoose.model('cloudcma', cloudcmaSchema);
module.exports = cloudcma;
