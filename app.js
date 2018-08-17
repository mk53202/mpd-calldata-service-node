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
var config = require('dotenv').config({path: './database.config'}); // For config

// Vars
var timer = new TaskTimer(60000)

initDB()

// Add task(s) based on tick intervals.
timer.addTask({
    name: 'job1',       // unique name of the task
    tickInterval: 5,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 0,      // run 5 times only. (set to 0 for unlimited times)
    callback: function (task) {
      scrapeIt('https://itmdapps.milwaukee.gov/MPDCallData/')
    }
})

// Add task(s) based on tick intervals.
timer.addTask({
    name: 'job2',       // unique name of the task
    tickInterval: 5,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 0,      // run 5 times only. (set to 0 for unlimited times)
    callback: function (task) {
      scrapeIt('https://itmdapps.milwaukee.gov/MFDCallData/index.jsp')
    }
})

timer.start()

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

function scrapeIt(url2scrape) {
  scraper
    .get(url2scrape)
    .then(function(tableData) {
      parseCallTable( tableData )
    })
    .catch(function (err) {
      console.log("Got error with scraper request:\n" + err)
    })
}

function parseCallTable( tableData ) {

  var connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME
  })

  tableData[0].forEach(function(mpdcall) { // Using [0] since it's the first and only table
    var callnumber = mpdcall['Call Number']
    var timestamp = mpdcall['Date/Time']
    var location = mpdcall.Location
    var district = mpdcall['Police District']
    var calltype = mpdcall['Nature of Call']
    var status = mpdcall.Status

    // Fix sql_insert to shorten inserts below
    var sql_insert = `INSERT IGNORE INTO \`calls\` (\`callnumber\`, \`timestamp\`, \`location\`, \`district\`, \`calltype\`, \`status\`) VALUES (${callnumber}, '${timestamp}', '${location}', ${district}, '${calltype}', '${status}')`
    connection.query(
      sql_insert,
      function(err, results, fields) {
      }
    )
    // console.log(sql_insert)
  })
  connection.end()
}
