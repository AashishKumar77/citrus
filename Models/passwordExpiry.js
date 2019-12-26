const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var passwordExpirySchema = new Schema({
    siteId: { type: Schema.Types.ObjectId, ref: 'users',required: true },
    days : { type : Number }
})

// featuredPropertyAlgorithmSchema.plugin(mongooseSequence, { inc_field: 'featuredPropertyAutoIncrement' });

var passwordExpiry = Mongoose.model('passwordExpiry', passwordExpirySchema);
module.exports = passwordExpiry;
