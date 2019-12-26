/*-----------------------------------------------------------------------
 * @ file        : users.js
 * @ description : This file defines the CMS user meta schema for mongodb.
 * @ author      :Anurag Gupta
 * @ date        : 08 February, 2017
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

var CrmUserDataSchema = new Schema({
	autoIncrement: { type: Number,unique: true,index:true,sparse:true},
	firstName: {type: String, "createdCollectionAutomatically" : false,},
    lastName: {type: String, "createdCollectionAutomatically" : false,},
    email: {type: String, trim: true, index: true,sparse: true},
    //PropertyId: {type: Schema.ObjectId, ref: 'retspropertyrd_1'},
    //ContactId: {type: Schema.ObjectId, ref: 'ContactForm'},
    PropertyId: {type: Array},
    ContactId: {type: Array},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date},

    spouselastName: {type: String, },
    spouselastName: {type: String, },

    recordofContact: {type: String, },
    sourceofContact: {type: String, },

    typeofResidence: {type: String},
    dob: {type: String, },
    Wedding_Anniversary: {type: String},
    rating: {type: String},
    family:[
        {
            firstName: {type: String },
            lastName: {type: String },
            age: {type: Number },
						gender : { type : String },
						dob : { type : Date },
						relation: { type: String }
        }
    ],
		pets:[{
					id : { type: Number },
					pet : { type: String }
		}],
		status : { type : String }

},{
		timestamps : true
})

CrmUserDataSchema.plugin(mongooseSequence, { inc_field: 'autoIncrement' });
var CrmUserData = Mongoose.model('crmuserdata', CrmUserDataSchema);
module.exports = CrmUserData;
