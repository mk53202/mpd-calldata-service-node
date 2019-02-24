// app.js

// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=1
// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=All
// https://www.npmjs.com/package/table-scraper
// https://github.com/mysqljs/mysql
// https://www.npmjs.com/package/execsql #maybe some day?
// https://www.npmjs.com/package/tasktimer
// https://stackoverflow.com/questions/9472167/what-is-the-best-way-to-delete-old-rows-from-mysql-on-a-rolling-basis

// Libraries
var scraper = require('table-scraper')
var mysql = require('mysql2')
var TaskTimer = require('tasktimer')
var sqlimporter = require('./util/sqlimport.js')
const request = require('request-promise')
var config = require('dotenv').config({path: './database.config'}); // For config

// Vars
var timer = new TaskTimer(60000)

var urlMFD = 'https://itmdapps.milwaukee.gov/MilRest/mfd/calls'
var urlMPD = 'https://itmdapps.milwaukee.gov/MPDCallData/'

initDB()

timer.addTask({
    name: 'job1',       // unique name of the task
    tickInterval: 5,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 0,      // run 5 times only. (set to 0 for unlimited times)
    callback: function (task) {
      getMPD(urlMPD, function(mpd_results) {
          parseMPD(mpd_results)
      })
    }
})

timer.addTask({
    name: 'job2',       // unique name of the task
    tickInterval: 2,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 0,      // run 5 times only. (set to 0 for unlimited times)
    callback: function (task) {
      getMFD(urlMFD, function(mfd_results) {
          parseMFD(mfd_results)
      })
    }
})

timer.start()

// getMPD(urlMPD, function(mpd_results) {
//     parseMPD(mpd_results)
// })


function initDB() {
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
}

function getMFD( my_url, callback ) {
  var request_options = {
    method: 'GET',
    uri: my_url,
    json: true,
    headers: {
      'Cache-Control': 'no-cache'
    } // headers
  } // request_options
  request( request_options )
    .then(function (response) {  // Request was successful
      var json_result = response
      callback( json_result )
    })
    .catch(function (err) {
      console.log( err ) // Something bad happened, handle the error
    })
}

function getMPD(my_url, callback) {
  scraper
    .get(my_url)
    .then(function(response) {
      // var json_result = response
      callback( response )
    })
    .catch(function (err) {
      console.log("Got error with scraper request:\n" + err)
    })
}

function parseMPD( tableData ) {
  var connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME
  })
  tableData[0].forEach(function(mpdcall) { // Using [0] since it's the first and only table, at least now. B-).
    var callnumber = mpdcall['Call Number']
    var timestamp = mpdcall['Date/Time']
    var location = mpdcall.Location
    var district = mpdcall['Police District']
    var calltype = mpdcall['Nature of Call']
    var status = mpdcall.Status

    var timestamp = Date.parse(timestamp); // Normalize timestamp to Unix epoch

    var sql_insert = `INSERT IGNORE INTO \`calls\` (\`callnumber\`, \`timestamp\`, \`location\`, \`district\`, \`calltype\`, \`status\`) VALUES (${callnumber}, '${timestamp}', '${location}', '${district}', '${calltype}', '${status}')`
    connection.execute(
      sql_insert,
      function(err, results, fields) {
        if (err) throw err;
      }
    )
  })
  connection.end()
}

function parseMFD( jsonData ) {
  var connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME
  })
  jsonData.forEach(function(mpdcall) { // Using [0] since it's the first and only table
    var callnumber = mpdcall['cfs']
    var timestamp = mpdcall['callDate']
    var location = mpdcall['address']
    var district = mpdcall['city']
    var calltype = mpdcall['type']
    var status = mpdcall['disposition']

    var timestamp = Date.parse(timestamp); // Normalize timestamp to Unix epoch

    var sql_insert = `INSERT IGNORE INTO \`calls\` (\`callnumber\`, \`timestamp\`, \`location\`, \`district\`, \`calltype\`, \`status\`) VALUES (${callnumber}, '${timestamp}', '${location}', '10', '${calltype}', '${status}')`
    connection.execute(
      sql_insert,
      function(err, results, fields) {
        if (err) throw err;
      }
    )
  })
  connection.end()
}
