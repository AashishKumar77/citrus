const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var faqSchema = new Schema({
    faqId: { type: Number,unique: true,index:true,sparse:true},
    question: {type: String},
    answer: {type: String},
    is_global: { type: Boolean, default: false},
    is_deleted: { type: Boolean, default: false},
    createdAt: { type: Date, default: new Date()},
    updatedAt: { type: Date},
    createdBy: {type: Schema.ObjectId, ref: 'users'},
    publishedAt: {type: Date},
    is_published: { type: Boolean, default: false},
    type:{type: String,enum: ['seller','buyer']
    }


})

faqSchema.plugin(mongooseSequence, { inc_field: 'faqId' });

var faq = Mongoose.model('faq', faqSchema);
module.exports = faq;
