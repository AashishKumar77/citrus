
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

var usefulLinksSchema = new Schema({
    linksAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
    siteId  : { type: Schema.Types.ObjectId, ref: 'users',required: true },
    createdBy :   {type: Schema.ObjectId, ref: 'users'},
    text     :  {type: String },
    url      : {type: String},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},
    globalView: {type: Boolean, default: true},
    type     :  {type: String },
})

usefulLinksSchema.plugin(mongooseSequence, { inc_field: 'linksAutoIncrement' });

var usefulLinks = Mongoose.model('usefulLinks', usefulLinksSchema);
module.exports = usefulLinks;
