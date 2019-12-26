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
const CATEGORY_OF_LEAD = APP_CONSTANTS.CATEGORY_OF_LEAD;

var ContactDetailSchema = new Schema({
	userId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	siteId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	assignedTo :  {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	ContactId: {type: Schema.ObjectId, ref: 'ContactForm',index:true,sparse: true},
    message: {type: String,},
    ipAddress: {type: String,},
    createdAt: {type: Date, default: new Date()},
    PropertyId: {type: Schema.ObjectId, ref: 'retspropertyrd_1'},
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
    category: {type: String,enum: [
        CATEGORY_OF_LEAD.HOT,
        CATEGORY_OF_LEAD.COLD,
        CATEGORY_OF_LEAD.QUALIFIED,
        CATEGORY_OF_LEAD.NURTURED,
        ],
        default:CATEGORY_OF_LEAD.COLD
    },
})

var ContactDetail = Mongoose.model('ContactDetail', ContactDetailSchema);
module.exports = ContactDetail;
