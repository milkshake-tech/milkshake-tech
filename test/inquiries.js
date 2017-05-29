const utils = require('./utils')
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../app')
const Inquiry = require('../models/Inquiry')
chai.use(chaiHttp)

describe('Inquiry Controller', () => {
  it('should GET All inquiries on /api/inquiry', (done) => {
    Inquiry.create({
      name: 'Brian',
      email: 'brian@gmail.com',
      message: 'Is there anyone home?'
    })

    chai.request(server)
    .get('/api/inquiry')
    .end((err, res) => {
      res.should.have.status(200)
      res.should.be.json
      res.body.should.be.a('object')
      res.body.confirmation.should.equal('Success')
      res.body.should.have.property('results')
      res.body.results.length.should.equal(1)
      res.body.results[0].name.should.equal('Brian')
      res.body.results[0].email.should.equal('brian@gmail.com')
      res.body.results[0].message.should.equal('Is there anyone home?')
      res.body.results[0].should.include.keys(
        '_id', 'name', 'timestamp', 'service', 'message', 'phone', 'email'
      )
      done()
    })
  })

  //TODO: TEST SINGLE POST when Sparkpost config is fixed
  // 
  // it('should POST SINGLE inquiry on /api/inquiry', (done) => {
  //   let inquiry = {
  //     name: 'Michael Phelps',
  //     message: 'Hello, I need a website',
  //     email: 'phelps@gmail.com'
  //   }
  //
  //   chai.request(server)
  //   .post('/api/inquiry')
  //   .send(inquiry)
  //   .end((err, res)=>{
  //     console.log('ERR: '+JSON.stringify(err))
  //     console.log('RES: '+JSON.stringify(res))
  //     done()
  //   })
  // })
})
