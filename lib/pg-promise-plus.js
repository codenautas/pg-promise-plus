"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var pgPromisePlus = {};

var pglib = require('pg');
var Promises = require('promise-plus');

pgPromisePlus.Motor = function PgMotor(){};
pgPromisePlus.Motor.motorName = 'PgPromisePlus';
pgPromisePlus.Motor.defaultPort = 5432;

pgPromisePlus.Motor.connect = function connect(connectParameters){
    return Promises.make(function(resolve, reject){
        pglib.connect(connectParameters,function(err, client, done){
            if(err){
                reject(err);
            }else{
                resolve({client:client, done:done});
            }
        });
    });
}

pgPromisePlus.Motor.done = function connect(internal){
    return Promises.start(function(){
        return internal.done();
    });
}

pgPromisePlus.Motor.prepare = function prepare(internal, sqlSentence){
    return Promises.resolve({
        client:internal.client,
        done:internal.done,
        sql:sqlSentence
    });
}

pgPromisePlus.Motor.query = function prepare(internal, data){
    return Promises.resolve({
        client:internal.client,
        done:internal.done,
        sql:internal.sql,
        data:data
    });
}

pgPromisePlus.Motor.fetchAll = function fetchAll(internal){
    return Promises.make(function(resolve, reject){
        internal.client.query(internal.sql, internal.data,function(err, result){
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

pgPromisePlus.Motor.fetchRowByRow = function fetchAll(internal, functions){
    var client = internal.client.query(internal.sql, internal.data);
    client.on('row', functions.onRow);
    client.on('end', functions.onEnd);
    client.on('error', functions.onError);
}

pgPromisePlus.Motor.placeHolder = function placeHolder(n){
    return '$'+(Number(n));
}

module.exports = pgPromisePlus;