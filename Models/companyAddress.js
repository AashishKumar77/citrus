const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var companyAddressSchema = new Schema({
    companyName: { type: String },
    type: { type: String },
    phone: { type: String, trim: true },
    email: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    siteId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    updatedAt: { type: Date, default: new Date() },
})


var companyAddress = Mongoose.model('companyAddress', companyAddressSchema);
module.exports = companyAddress;
