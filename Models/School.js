/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the user schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 27 February, 2017
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

var SchoolSchema = new Schema({
    schoolAutoIncrement: {  type: Number,unique: true,index:true,sparse:true  },
    schoolTitle : { type: String,index:true,sparse:true  },
    schoolType : {  type: String  },
    location: {
        type: { type: String, enum: "Polygon", default: "Polygon"},
        coordinates:  {type:Array}
    },
    location2: {
        'type': { type: String, enum: "Polygon", default: "Polygon" },//LineString //Polygon
        coordinates: [{ type:Array }]
    },
    displayInNavigation : { type : Boolean , default : false },
    weblink : { type: String },
    no_of_parking_spaces : { type: String },
    status : { type: String },
    operating_hours : { type: String },
    sq_footage : { type: String },
    facility_type : { type: String },
    address : { type: String },
    description : { type: String }
},{
    timestamps : true
})
SchoolSchema.plugin(mongooseSequence, { inc_field: 'schoolAutoIncrement' });
// SchoolSchema.index( { location : "2dsphere" });
// SchoolSchema.index( { location2 : "2dsphere" });
//SchoolSchema.index({ title: "text" }, { default_language: "none" });
var school = Mongoose.model('school', SchoolSchema);
module.exports = school;
