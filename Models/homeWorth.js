const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var homeWorthSchema = new Schema({
    siteId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
    funnelId: { type: Schema.ObjectId, ref: 'funnel' },
    homeWorthAgents : [{ type: Schema.ObjectId, ref: 'user'}],
    lot_size:{type: String}
});

// categorySchema.plugin(mongooseSequence, { inc_field: 'commentId' });

var category = Mongoose.model('homeWorth', homeWorthSchema);
module.exports = category;
