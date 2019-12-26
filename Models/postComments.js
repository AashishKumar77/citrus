const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var commentSchema = new Schema({
    postId: {type: String},
    commentId: { type: Number,unique: true,index:true,sparse:true},
    comment: {type: String},
    userId : {type: String},
    siteId : {type: Schema.ObjectId, ref: 'users'},
    isVisible: {type: Boolean, default: true},
    createdAt: {type: Date, default: new Date()}
});

commentSchema.plugin(mongooseSequence, { inc_field: 'commentId' });

var postComments = Mongoose.model('postComments', commentSchema);
module.exports = postComments;
