const mongoose = require('mongoose')
const config = require('../config/database')

// doc: http://mongoosejs.com/docs/connections.html
const options = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 20,
  useNewUrlParser: true,
}

mongoose.Promise = global.Promise // ES6 promises

mongoose.connect(config.DATABASE, options).then(
  () => console.log('database connection READY'),
  err => {
    console.error(`database connection error: ${err.message}`)
    process.exit(1)
  }
)

module.exports = mongoose