
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var termsSchema = new Schema({
    siteId: { type: Schema.Types.ObjectId, ref: 'users',required: true },
    terms : { type : String }
})

// featuredPropertyAlgorithmSchema.plugin(mongooseSequence, { inc_field: 'featuredPropertyAutoIncrement' });

var terms = Mongoose.model('terms', termsSchema);
module.exports = terms;
