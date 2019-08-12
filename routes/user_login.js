'use strict';

module.exports.loginFunc = function (req, res, next) {
    res.json({success: 1, message: "Yeah!!"});
    return next();
};
