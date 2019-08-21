'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let candi_schema = new Schema({
    candidateId: {type: String, unique: true},
    name: {type: String},
    area: {type: String}
});

module.exports.candidate = mongoose.model('candiModel', candi_schema, 'candidates');
