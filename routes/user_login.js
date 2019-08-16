'use strict';

const model = require('../models/test');
const test = model.test;

const uuid4 = require('uuid/v4');

module.exports.loginFunc = function (req, res, next) {

    console.log("Inside login func");

    let uid = uuid4();
    uid = uid.replace(/-/g, "");
    let saveObj = {uid: uid, shopName: "testing", imgUrl: "yes!!"};

    let post = new test(saveObj);
    post.save(function (err, docs) {
        if(err){
            console.log("Error while saving data: ", err);
            res.json({success: -1, message: "Error"});
            return next();
        } else {
            console.log("Data saved!");
            res.json({success: 1, message: "Yeah!!"});
            return next();
        }
    })


};
