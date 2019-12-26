const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var categorySchema = new Schema({
    category: {type: String},
    description : {type: String},
    siteId : {type: Schema.ObjectId, ref: 'users'},
    createdAt: {type: Date, default: new Date()},
    isDeleted: {type: Boolean, default: false}
});

// categorySchema.plugin(mongooseSequence, { inc_field: 'commentId' });

var category = Mongoose.model('category', categorySchema);
module.exports = category;
