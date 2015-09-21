"use strict";

var Promises = require('promise-plus');

var tester=require('sql-promise-tester');

var defaultConnOpts={
    motor:'test',
    user:'test_user',
    password:'test_pass',
    database:'test_db',
    host:'localhost',
    port:5432
}

var MotorPg = require('../lib/pg-promise-plus.js').Motor;

var conn;

console.log('aca');

function prepareSchema(){
    var pg = require('pg-promise-strict'); // provisorio hasta que tenga más funcionalidad
    return Promises.start().then(function(){
        return pg.connect(defaultConnOpts);
    }).then(function(obteinedConn){
        conn = obteinedConn;
        return conn.query("DROP SCHEMA IF EXISTS test_sql_promise CASCADE;").execute();
    }).then(function(){
        return conn.query("CREATE SCHEMA test_sql_promise;").execute();
    }).then(function(){
        return conn.query("ALTER USER test_user SET search_path = test_sql_promise;").execute();
    }).catch(function(err){
        console.log("can't create schema");
        throw err;
    }).then(function(){
        return null; // ok, no error
    }).catch(function(err){
        console.log('ERROR', err);
        console.log('STACK', err.stack);
        return err;
    });
}

tester(MotorPg, {
    connOpts:defaultConnOpts,
    prepare:prepareSchema
});
