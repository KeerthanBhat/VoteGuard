'use strict';

const voter_model_path = require('../models/voters');
const voters = voter_model_path.voter;
const area_model_path = require('../models/areas');
const areas = area_model_path.areas;
const candidate_model_path = require('../models/candidates');
const candidates = candidate_model_path.candidate;

const uuid4 = require('uuid/v4');
const async = require('async');

const comFun = require('../common_functions');

module.exports.temp = function (req, res, next) {


    let password = comFun.getSHA256("qwerty");
    let area = [
        {areaId: "",
        state: "Karnataka",
        district: "Bangalore South",
        name: "Bommanahalli"},

        {areaId: "",
        state: "Karnataka",
        district: "Bangalore South",
        name: "Jayanagar"},

        {areaId: "",
        state: "Karnataka",
        district: "Bangalore South",
        name: "BTM Layout"}
        ];

    let candi1 = [
        {candidateId: "",
        name: "K. S. Hegde",
        area: ""},

        {candidateId: "",
        name: "T. R. Shamanna",
        area: ""},

        {candidateId: "",
        name: "V. S. Krishna Iyer ",
        area: ""},

        {candidateId: "",
        name: "R. Gundu Rao ",
        area: ""}
    ];
    let candi2 = [
        {candidateId: "",
            name: "K. V. Gowda ",
            area: ""},

        {candidateId: "",
            name: "Ananth Kumar ",
            area: ""},

        {candidateId: "",
            name: "Tejasvi Surya ",
            area: ""},

        {candidateId: "",
            name: "D. P. Sharma ",
            area: ""}
    ];
    let candi3 = [
        {candidateId: "",
            name: "B. K. Hariprasad ",
            area: ""},

        {candidateId: "",
            name: "B. T. Parthasarathy ",
            area: ""},

        {candidateId: "",
            name: "D. Arumugam ",
            area: ""},

        {candidateId: "",
            name: "Jayanthi",
            area: ""}
    ];


    let vote1 = [
        {voterId: "",
            password: password,
            name: "Aadarsh G",
            area: "",
            areaName: "Bommanahalli"},

        {voterId: "",
            password: password,
            name: "Aadesh Gowda",
            area: "",
            areaName: "Bommanahalli"},

        {voterId: "",
            password: password,
            name: "Aahvanath",
            area: "",
            areaName: "Bommanahalli"}
    ];

    let vote2 = [
        {voterId: "",
        password: password,
        name: "Prafula Nair",
        area: "",
        areaName: "Jayanagar"}];

    let vote3 = [{voterId: "",
        password: password,
        name: "Aadhira Singh",
        area: "",
        areaName: "BTM Layout"},

        {voterId: "",
            password: password,
            name: "Aadit",
            area: "",
            areaName: "BTM Layout"}
        ];


    for (let i = 0; i < 3; i++){
        let uid = uuid4();
        uid = uid.replace(/-/g, "");

        area[i].areaId = uid;
    }

    for (let i = 0; i < candi1.length; i++){
        candi1[i].area = area[0].areaId;
    }

    for (let i = 0; i < candi2.length; i++){
        candi2[i].area = area[1].areaId;
    }

    for (let i = 0; i < candi3.length; i++){
        candi3[i].area = area[2].areaId;
    }

    for (let i = 0; i < vote1.length; i++){
        vote1[i].area = area[0].areaId;
    }

    for (let i = 0; i < vote2.length; i++){
        vote2[i].area = area[1].areaId;
    }

    for (let i = 0; i < vote3.length; i++){
        vote3[i].area = area[2].areaId;
    }


    async.parallel({

        F1: function (cb) {
            async.forEachOf(area, function (val, index, calbk) {

                let post = new areas(val);
                post.save(function (err, docs) {
                    if(err){
                        calbk(err);
                    } else {
                        calbk(null);
                    }

                })

            }, function (err) {
                if(err){
                    cb(err);
                } else {
                    cb(null);
                }
            })
        },
        F2: function (cb) {

            async.parallel({

                fn1: function (calbk) {
                    async.forEachOf(candi1, function (val, index, calbk) {

                        let uid = uuid4();
                        uid = uid.replace(/-/g, "");

                        val.candidateId = uid;

                        let post = new candidates(val);
                        post.save(function (err, docs) {
                            if(err){
                                calbk(err);
                            } else {
                                calbk(null);
                            }

                        })

                    }, function (err) {
                        if(err){
                            calbk(err);
                        } else {
                            calbk(null);
                        }
                    })
                },
                fn2: function (calbk) {
                    async.forEachOf(candi2, function (val, index, calbk) {

                        let uid = uuid4();
                        uid = uid.replace(/-/g, "");

                        val.candidateId = uid;

                        let post = new candidates(val);
                        post.save(function (err, docs) {
                            if(err){
                                calbk(err);
                            } else {
                                calbk(null);
                            }

                        })

                    }, function (err) {
                        if(err){
                            calbk(err);
                        } else {
                            calbk(null);
                        }
                    })
                },
                fn3: function (calbk) {
                    async.forEachOf(candi3, function (val, index, calbk) {

                        let uid = uuid4();
                        uid = uid.replace(/-/g, "");

                        val.candidateId = uid;

                        let post = new candidates(val);
                        post.save(function (err, docs) {
                            if(err){
                                calbk(err);
                            } else {
                                calbk(null);
                            }

                        })

                    }, function (err) {
                        if(err){
                            calbk(err);
                        } else {
                            calbk(null);
                        }
                    })
                }

            }, function (err) {
                if(err){
                    cb(err);
                } else {
                    cb(null);
                }
            })

        },
        F3: function (cb) {

            async.parallel({

                fn1: function (calbk) {
                    async.forEachOf(vote1, function (val, index, calbk) {

                        let uid = uuid4();
                        uid = uid.replace(/-/g, "");

                        val.voterId = uid;

                        let post = new voters(val);
                        post.save(function (err, docs) {
                            if(err){
                                calbk(err);
                            } else {
                                calbk(null);
                            }

                        })

                    }, function (err) {
                        if(err){
                            calbk(err);
                        } else {
                            calbk(null);
                        }
                    })
                },
                fn2: function (calbk) {
                    async.forEachOf(vote2, function (val, index, calbk) {

                        let uid = uuid4();
                        uid = uid.replace(/-/g, "");

                        val.voterId = uid;

                        let post = new voters(val);
                        post.save(function (err, docs) {
                            if(err){
                                calbk(err);
                            } else {
                                calbk(null);
                            }

                        })

                    }, function (err) {
                        if(err){
                            calbk(err);
                        } else {
                            calbk(null);
                        }
                    })
                },
                fn3: function (calbk) {
                    async.forEachOf(vote3, function (val, index, calbk) {

                        let uid = uuid4();
                        uid = uid.replace(/-/g, "");

                        val.voterId = uid;

                        let post = new voters(val);
                        post.save(function (err, docs) {
                            if(err){
                                calbk(err);
                            } else {
                                calbk(null);
                            }

                        })

                    }, function (err) {
                        if(err){
                            calbk(err);
                        } else {
                            calbk(null);
                        }
                    })
                }

            }, function (err) {
                if(err){
                    cb(err);
                } else {
                    cb(null);
                }
            })

        }

    }, function (err) {
        if(err){
            console.log("Error!");
            res.json({success: 0});
            return next;
        } else {
            console.log("Success!");
            res.json({success: 1});
            return next;
        }
    })

};
