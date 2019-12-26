const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var aboutUsSchema = new Schema({
    pageId: { type: Number,unique: true,index:true,sparse:true},
    content: {type: String},
    siteId : {type: Schema.ObjectId, ref: 'users'},
    createdAt: {type: Date, default: new Date()},
    url : {type: String}
})

aboutUsSchema.plugin(mongooseSequence, { inc_field: 'pageId' });

var aboutUs = Mongoose.model('aboutUs', aboutUsSchema);
module.exports = aboutUs;
