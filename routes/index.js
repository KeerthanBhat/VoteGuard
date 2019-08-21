'use strict';

let express = require('express');
let router = express.Router();

const sanitize = require('mongo-sanitize');

//This is how we specify routes
//user_login should be a JS file in the routes directory and loginFunc is the name of the function in the JS file
const login = require('./user_login');
router.post('/login', login.loginFunc);

const cast_vote = require('./caste_vote');
router.post('/cast_vote', cast_vote.casteVote);

const  temp = require('./temp');
router.post('/temp', temp.temp);

router.post('*', (req, res, next) => {
    let vers = req.headers['x-ver'];
    console.log("Unspecified Route Post Req For version: " + vers + " req.path: " + req.path);
});

module.exports = router;
