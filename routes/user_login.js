'use strict';

const voter_model_path = require('../models/voters');
const voter = voter_model_path.voter;
const candi_model_path = require('../models/candidates');
const candidates = candi_model_path.candidate;

const uuid4 = require('uuid/v4');
const sanitize = require('mongo-sanitize');
const comFun = require('../common_functions');

module.exports.loginFunc = function (req, res, next) {

    console.log("Inside login func");
    //REM: NOT To print the req body as it contains password
    let voterId = sanitize(req.body.voter_id);
    let pass = sanitize(req.body.password);

    if(comFun.NotNullUndef(voterId) && comFun.NotNullUndef(pass)){

        voter.findOne({voterId: voterId}, function (err, docs) {

            if(err){
                console.log("Error getting the voter: ", err);
                res.json({success: 0, message: "Error getting the voter"});
                return next();
            } else {
                if(comFun.objectNotEmpty(docs)){

                    if(docs.status === 1){

                        console.log("Already voted!");
                        res.json({success: -8, message: "Already voted", cast: docs.cast});
                        return next();

                    } else {
                        let hash = comFun.getSHA256(pass);
                        if(hash === docs.password){

                            candidates.find({area: docs.area}, function (err, data) {
                                if(err){
                                    console.log("Error getting the candidates: ", err);
                                    res.json({success: 0, message: "Error getting the candidates"});
                                    return next();
                                } else {
                                    if(comFun.objectNotEmpty(data)){

                                        let candi = [];
                                        for (let i = 0; i < data.length; i++){
                                            candi.push(data[i]);
                                        }

                                        let token = uuid4();
                                        token = token.replace(/-/g, "");

                                        console.log("Login successful!");
                                        res.json({success: 1, message: "Success!", token: token, name: docs.name, voterId: voterId, candidates: candi, area: docs.areaName});
                                        return next();

                                    } else {
                                        console.log("No candidates!");
                                        res.json({success: -5, message: "No candidates"});
                                        return next();
                                    }
                                }
                            });

                        } else {
                            console.log("Password incorrect");
                            res.json({success: -1, message: "Password incorrect"});
                            return next();
                        }
                    }

                } else {
                    console.log("Voter not registered");
                    res.json({success: -2, message: "Voter not registered"});
                    return next();
                }
            }

        });

    } else {
        console.log("Insufficient data");
        res.json({success: -10, message: "Insufficient data"});
        return next();
    }

};
