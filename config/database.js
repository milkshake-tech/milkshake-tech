require('dotenv').config()

module.exports = {
  db: {
    production: process.env.MONGODB_URI,
    development: process.env.MONGODB_DEV_URI,
    test: process.env.MONGODB_TEST_URI
  }
}
