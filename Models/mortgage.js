const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var mortgageSchema = new Schema({
    type: { type: String},
    term: { type: Number },
    location : {  type: String },
    provider: { type: String },
    rate : { type: Number },
    siteId : {type: Schema.ObjectId, ref: 'users'},
    createdAt : { type: Date, default: new Date() }
})

// mortgageSchema.plugin(mongooseSequence, { inc_field: 'pageId' });
mortgageSchema.index({'$**': 'text'});
var mortgage = Mongoose.model('mortgage', mortgageSchema);
module.exports = mortgage;
