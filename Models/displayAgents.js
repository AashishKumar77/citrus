const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var displayAgentsSchema = new Schema({
    siteId: {type: Schema.ObjectId, ref: 'user',index:true,sparse: true},
    agentsOrder : [{type: Schema.ObjectId, ref: 'user',index:true,sparse: true}]
},
{
   timestamps: true
});

var displayAgents = Mongoose.model('displayAgents', displayAgentsSchema);
module.exports = displayAgents;
