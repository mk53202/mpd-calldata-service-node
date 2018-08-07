// app.js

// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=1
// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=All
// https://www.npmjs.com/package/table-scraper
// https://github.com/mysqljs/mysql

// Libraries
var scraper = require('table-scraper')
var mysql = require('mysql')

// Vars
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'secret'
});

scraper
  .get('https://itmdapps.milwaukee.gov/MPDCallData/')
  .then(function(tableData) {
    console.log(tableData)
  })

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
