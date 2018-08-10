// app.js

// Links
// https://www.npmjs.com/package/node-mysql-importer
// https://medium.com/codebuddies/getting-to-know-asynchronous-javascript-callbacks-promises-and-async-await-17e0673281ee
//

// Libraries
var importer = require('node-mysql-importer')

importer.config({
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'fdhjhpcdkjhyfjdfdj3d52'
})

importer.importSQL('sql/create.sql').then( () => {
    console.log('Database materialized.')
})
.catch( err => {
    console.log(`error: ${err}`)
})
