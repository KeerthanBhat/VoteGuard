'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let voter_schema = new Schema({
    voterId: {type: String, unique: true},
    password: {type: String},
    name: {type: String},
    area: {type: String},
    areaName: {type: String},
    status: {type: Number, default: 0},//1 if he has already voted
    cast: {type: String}
});

module.exports.voter = mongoose.model('voterLoginModel', voter_schema, 'voters');
