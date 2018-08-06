// app.js

// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=1
// https://itmdapps.milwaukee.gov/MPDCallData/index.jsp?district=All
// https://www.npmjs.com/package/table-scraper

// Libraries
var scraper = require('table-scraper')

// Vars

scraper
  .get('https://itmdapps.milwaukee.gov/MPDCallData/')
  .then(function(tableData) {
    console.log(tableData)
  })
