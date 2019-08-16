'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let trans_schema = new Schema({
    uid: {type: String, unique: true},
    shopName: {type: String},
    imgUrl: {type: String}
});

module.exports.test = mongoose.model('testing', trans_schema, 'test');
