// app.js

// Links
// https://www.npmjs.com/package/node-mysql-importer
// https://medium.com/codebuddies/getting-to-know-asynchronous-javascript-callbacks-promises-and-async-await-17e0673281ee
//

// Libraries
// var importer = require('node-mysql-importer')
var importer = require('./util/sqlimport.js')
var config = require('dotenv').config({path: './database.config'}); // For config

sqlimporter.config({
    'host': process.env.DATABASE_HOST,
    'user': process.env.DATABASE_USER,
    'password': process.env.DATABASE_PASSWORD
})
sqlimporter.importSQL('sql/create.sql').then( () => {
    console.log('initDB() materialized.')
})
.catch( err => {
    console.log(`error: ${err}`)
})
