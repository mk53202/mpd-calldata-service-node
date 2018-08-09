// app.js

// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=1
// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=All
// https://www.npmjs.com/package/table-scraper
// https://github.com/mysqljs/mysql
// https://www.npmjs.com/package/tasktimer

// Libraries
var scraper = require('table-scraper')
var mysql = require('mysql2')
var TaskTimer = require('tasktimer')

// Vars
var timer = new TaskTimer(60000)

scrapeIt() // Run initial time outside of timer

// Add task(s) based on tick intervals.
timer.addTask({
    name: 'job1',       // unique name of the task
    tickInterval: 5,    // run every 5 ticks (5 x interval = 5000 ms)
    totalRuns: 0,      // run 5 times only. (set to 0 for unlimited times)
    callback: function (task) {
      scrapeIt()
      // console.log(task.name + ' task has run ' + task.currentRuns + ' times.')
      // if( task.currentRuns >= task.totalRuns ) {
      //   timer.stop()
      // }
    }
})

timer.start()

function scrapeIt() {
  scraper
    .get('https://itmdapps.milwaukee.gov/MPDCallData/')
    .then(function(tableData) {
      parseCallTable( tableData )
    })
    .catch(function (err) {
      console.log("Got error with scraper request:\n" + err)
    })
}

function parseCallTable( tableData ) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'fdhjhpcdkjhyfjdfdj3d52',
    database : "mpd-calldata"
  })

  tableData[0].forEach(function(mpdcall) { // Using [0] since it's the first and only table
    var callnumber = mpdcall['Call Number']
    var timestamp = mpdcall['Date/Time']
    var location = mpdcall.Location
    var district = mpdcall['Police District']
    var calltype = mpdcall['Nature of Call']
    var status = mpdcall.Status

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
