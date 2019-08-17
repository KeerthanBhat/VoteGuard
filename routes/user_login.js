'use strict';

const model = require('../models/test');
const test = model.test;

const uuid4 = require('uuid/v4');

module.exports.loginFunc = function (req, res, next) {

    /*
    * to send on success:
    *
    * token
    * voterId
    * name
    * area
    * candidates
    *
    * fail:
    *
    * wrong pass: -1
    * not registered: -2
    * */

    console.log("Inside login func");
    res.json({success: 1, message: "Yeah!!", token: "123", voterId: "12345", name: "akshay", area: "1234", candidates: ["c1",'c2']});
    return next();
    /*
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

     */


};
