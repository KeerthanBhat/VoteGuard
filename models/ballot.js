'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ballot_schema = new Schema({
    voterId: {type: String, unique: true},
    cast: {type: String}
});

module.exports.ballot = mongoose.model('ballotModel', ballot_schema, 'ballot');
