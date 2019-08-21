'use strict';

const voter_model_path = require('../models/voters');
const voters = voter_model_path.voter;
const ballot_model_path = require('../models/ballot');
const ballot = ballot_model_path.ballot;

const comFun = require('../common_functions');
const sanitize = require('mongo-sanitize');
const async = require('async');

module.exports.casteVote = function (req, res, next) {

    console.log("Casting vote");
    let voterId = sanitize(req.body.voterId);
    let candidate = sanitize(req.body.candidate);

    if(comFun.StrVal(voterId) && comFun.StrVal(candidate)){

        //TODO call the block chain code to add the vote

       let cast = comFun.gethmacsha256(voterId, candidate);

        async.parallel({

            F1: function (callback) {
                voters.findOneAndUpdate({voterId: voterId}, {$set: {status: 1, cast: cast}}, function (err, docs) {
                    if(err){
                        console.log("Error updating the voter: ", err);
                        callback(err);
                    } else {
                        callback(null);
                    }
                })
            },

            F2: function (callback) {
                let saveObj = {voterId: voterId, cast: cast};

                let POST = new ballot(saveObj);
                POST.save(function (err, docs) {
                    if(err){
                        console.log("Error updating the ballot: ", err);
                        callback(err);
                    } else {
                        callback(null);
                    }

                })
            }

        }, function (err) {
            if(err){
                res.json({success: -1, message: "Error voting"});
                return next();
            } else {
                console.log("Successfully voted!");
                res.json({success: 1, message: "Success!", cast: cast});
                return next();
            }
        })

    } else {
        console.log("Insufficient data!");
        res.json({success: -10, message: "Insufficient data"});
        return next();
    }

};
