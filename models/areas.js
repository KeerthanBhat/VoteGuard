'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let area_schema = new Schema({
    areaId: {type: String, unique: true},
    state: {type: String},
    district: {type: String},
    name: {type: String},
    candidates: {type: [String], default: undefined}
});

module.exports.areas = mongoose.model('areaModel', area_schema, 'areas');
