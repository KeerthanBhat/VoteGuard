'use strict';

const express = require('express');
const app = express();


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

const port = 8080;

let listener = app.listen(port, function(){
    // console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
