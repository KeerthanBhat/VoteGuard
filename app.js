'use strict';

const express = require('express');
const app = express();

//DotEnv
const result = require('dotenv').config({/*path: "../.env", *//*encoding: 'base64'*/});

if (result.error) {
    console.error("result.error: ", result.error);
}
//DotEnv

// Mongoose Connection
const mongoose = require('mongoose');
const config = require('./config/database');

const DB_URL = config.db.url;
// const DB_PASS = config.db.mongo_pass;
// const DB_USER = config.db.mongo_user;
// const DB_ADMINDB = config.db.mongo_admin_db;

mongoose.connection.on("connected", function(ref) {
//  throw new Exception("Error here ...");
    //console.log("Connected to " + " DB!");
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
    console.error('Failed to connect to DB ' + ' on startup ', err);
    if (err) {
        return err;
    }
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function(err) {
    console.error('Mongoose default connection to DB :' + ' disconnected');
    if (err) {
        return err;
    }
});

let gracefulExit = function() {
    mongoose.connection.close(function () {
        console.error('Mongoose default connection with DB :'  + ' is disconnected through app termination');
        process.exit(0);
    });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
// ??

exports.con_close = function () {
    console.error('Mongoose connection disconnected');
    mongoose.connection.close();
};

/*
let options = {
    user: DB_USER,
    pass: DB_PASS,
    auth: {
        authdb: DB_ADMINDB
    }
};
*/

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, function(err) {
    if (err) {
        console.error('error connection to mongo server! err: ', err);
    } else {
        console.log('Connected to DB!');
    }
});

mongoose.set('debug', true);

// Mongoose Connection

//Disable Default Headers
app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

//app.use(cookieParser()); // to parse Cookies sent from browser on every request.
const index=require("./routes/index");

app.use("/",index);

app.get('*', function(req, res) {
    console.log("Global req.path: " + req.path);
    res.sendFile(__dirname + '/public/views/index.html');
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    // <REMEMBER> HERE WE ARE NOT SENDING ERROR TO THE USER AS ENVIRONMENT IS PRODUCTION
    /*if (err instanceof multer.MulterError) {
        console.error("Multer Error Occured while uploading err: %j", err);
    } else {

    }*/
    console.error('Error handler err: %j', err);
    res.json({success : 0, message : "Error"});
    /*if(err instanceof IpDeniedError){
        console.log('Error handler IpDeniedError err.message: ', err.message);
        res.json({success : 0, message : "Sorry there is some error"});
        return next();
    }else{*/
    return next();
    /* InFuture We Will Show error according to return next(err) from the routing files and there we will not
    send anything in the response */
    /*res.json({success : 0, message : "Sorry there is some error"});
    return next();*/
    /*}*/
});
////</Error Handling>

const port = process.env.PORT || 4200;

let listener = app.listen(port, function(){
    // console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
