const database = require('../config/database')
const mongoose = require('mongoose')
process.env.NODE_ENV = 'test'

beforeEach((done) => {
  function clearDB(){
    for(var i in mongoose.connection.collections){
      mongoose.connection.collections[i].remove(function() {})
    }
    return done()
  }

  if(mongoose.connection.readyState === 0){
    mongoose.connect(database.db.test, (err) => {
      if(err){
        throw err
      }
      return clearDB()
    })
  } else {
    return clearDB()
  }
})

afterEach((done) => {
  mongoose.disconnect()
  return done()
})
