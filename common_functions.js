'use strict';

const crypto = require('crypto');
const moment = require('moment');

let self = module.exports = {

    showData: function(collection, query, query1, sortQuery, skip, limit, callback) {

        collection.find(query,query1, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        })
            .sort(sortQuery)
            .limit(limit)
            .skip(skip);
    },


    Mob12: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === 'string') {
            if(v.length === 12) {
                return true;// HERE I WANT ONLY MY VALUES TO BE 91+mobilenumber
            } else {
                return false;
            }
        }
        return false;
    },
    NotNullUndef: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }

        return true;
    },
    objectNotNullUndef: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }

        else if(type === 'object') {
            return true;
        }
        return false;
    },
    objectNotEmpty: function (v) {
        if(self.objectNotNullUndef(v)) {
            if(Object.keys(v).length > 0) {
                return true;
            }
        }
        return false;
    },
    StrVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === 'string') {
            if(v.length < 1) {
                return false;
            } else {
                return true; // HERE I WANT ONLY MY VALUES TO BE NOT EMPTY STRING
            }
        }
        return false;
    },
    StrMobVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === 'string') {
            if(v.length === 10) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },

    strEmpVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === 'string') {
            return true;
        }
        return false;
    },
    arrEmptVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(v instanceof Array) {
            return true;
        }
        return false;
    },
    ArrVal: function (v) {
        if(self.arrEmptVal(v)) {
            if(v.length < 1) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    },

    numVal: function (v) {
        let type = typeof v;
        if(type === 'undefined') {
            return false;
        }
        if(v === null) {
            return false;
        }
        if(v === undefined) {
            return false;
        }
        if(type === /*'number'*/ 'string' || type === 'number') {
            /*<REM> added -? for number starting with minus*/
            let onlydigits = /^-?\d+$/.test(v);
            if(onlydigits) {
                return true;
            }
        }
        return false;
    },
    gethmacsha256: function(input_string, key) {
        let algorithm = 'sha256';   //consider using sha256
        let hash, hmac;

        // Method 1 - Writing to a stream
        hmac = crypto.createHmac(algorithm, key);
        hmac.write(input_string); // write in to the stream
        hmac.end();       // can't read from the stream until you call end()
        hash = hmac.read().toString('hex');    // read out hmac digest
        //console.log("hash: ", hash);
        return hash;
    },
    getSHA256: function(input_string){
        let hash = crypto.createHash('sha256').update(input_string).digest('base64');

        return hash;
    },
    getCurrTime: function(){
        return moment().utcOffset(330).format("YYYY-MM-DDTHH:mm:ss.SSS");
    }
};
