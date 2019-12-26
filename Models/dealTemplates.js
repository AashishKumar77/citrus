
const env = require('../env');
const Mongoose = require('mongoose');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;
const Schema = Mongoose.Schema;

var dealTemplateSchema = new Schema({
	dealTemplateAutoIncrement: { type: Number,unique: true,index:true,sparse:true},
	siteId: { type: Schema.ObjectId, ref: 'users' },
	title: { type: String },
	subject: { type: String },
  status : { type : String },
	emailTimeInterval: { type: Number },
	emailToBeTriggeredForCompletion : { type : Number },
	daysOfCompletion : { type : Date },
	content: { type: String }
},{
    timestamps : true
});

dealTemplateSchema.plugin(mongooseSequence, { inc_field: 'dealTemplateAutoIncrement' });
var dealTemplate = Mongoose.model('dealTemplate', dealTemplateSchema);
module.exports = dealTemplate;
