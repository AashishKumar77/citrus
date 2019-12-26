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
const CATEGORY_OF_LEAD = APP_CONSTANTS.CATEGORY_OF_LEAD; ////console.log("CATEGORY_OF_LEADxx",CATEGORY_OF_LEAD);

var CrmUserPropertySchema = new Schema({
    crmUserId: {type: Schema.ObjectId, ref: 'cmsuserdata'},
    PropertyId: {type: Schema.ObjectId, ref: 'retspropertyrd_1'},
    ContactId: {type: Schema.ObjectId, ref: 'ContactForm'},
    funnelId: {type: Schema.ObjectId, ref: 'ContactForm'},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date},
    category: {type: String,enum: [
        CATEGORY_OF_LEAD.HOT,
        CATEGORY_OF_LEAD.COLD,
        ],
        default:CATEGORY_OF_LEAD.COLD
    },
})


var CrmUserProperty = Mongoose.model('crmuserproperty', CrmUserPropertySchema);
module.exports = CrmUserProperty;
