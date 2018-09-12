require('dotenv').config()

const database = process.env.DATABASE || null

if (database === null) {
  console.error('No database connection string provided in environment file')
  process.exit(1)
}

module.exports = {
  DATABASE: database,
}