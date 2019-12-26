const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;


var setAreaSchema = new Schema({
    area: [{ type: String, default: "" }],
    // area: { type: String, default: "" },
    siteId: { type: String },
    createdAt: { type: Date, default: new Date() },
    modifiedOn: { type: Date, default: new Date() },
})

var setArea = Mongoose.model('setArea', setAreaSchema);
module.exports = setArea;
