const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const env = require('../env');
const mongooseSequence  = require('mongoose-sequence');
const Configs = require('../Configs');
const APP_CONSTANTS = Configs.CONSTS;

// var city = new Schema({
//     city : { type: String},
//     province : {type : String}
// })

var citySchema = new Schema({
    location :{type: Array }
})

// aboutUsSchema.plugin(mongooseSequence, { inc_field: 'pageId' });

var city = Mongoose.model('city', citySchema);
module.exports = city;
