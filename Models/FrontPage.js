const env = require('../env');
const Mongoose = require('mongoose');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const Schema = Mongoose.Schema;

var FrontPageSchema = new Schema({
	pageTitle: {type: String, },
	siteId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
	routerLink: {type: String, },
	pageId: {type: Schema.ObjectId, ref: 'pagedetail',},
	createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date},
    isdefaultNavigation: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
});

var frontPage = Mongoose.model('frontPage', FrontPageSchema);
module.exports = frontPage;
