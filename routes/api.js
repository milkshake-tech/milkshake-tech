const express = require('express')
const router = express.Router()
const async = require('async')
const inquiryController = require('../controllers/InquiryController')
const controllers = {
	inquiry: inquiryController
}

router.get('/:resource', (req, res) => {
  const resource = req.params.resource
  const controller = controllers[resource]
	if (controller === null){
  	return res.json({ confirmation: 'fail', message: 'Invalid Resource' })
	}

	controller.get(req.query, false, (err, results) => {
		if (err){
			return res.json({ confirmation: 'Fail', message: err })
		}

		return res.json({ confirmation: 'Success', results: results })
	})
})

router.post('/:resource', (req, res) => {
	const resource = req.params.resource
	const params = req.body
	const controller = controllers[resource]

	if (controller === null){
		res.json({ confirmation: 'Fail', message: 'Invalid Resource' })
		return
	}

	async.waterfall([
		function(done){
			controller.post(req.body, (err, response) => {
				if(err){
					return res.json({ confirmation: 'Fail', message: err })
				}

				let inquiryPkg = {
					message: response.message,
					email: response.email,
					name: response.name
				}
				done(err, inquiryPkg)
			})
		},
		function(inquiryPkg, done){
			let helper = require('sendgrid').mail;
			let fromEmail = new helper.Email('katrina@milkshake.tech')
			let toEmail = new helper.Email('katrina@milkshake.tech')
			let subject = 'Milkshake | New Inquiry'
			let content = new helper.Content('text/plain', 'New message from '+inquiryPkg.name+", "+inquiryPkg.email+'. Message: '+inquiryPkg.message)
			let mail = new helper.Mail(fromEmail, subject, toEmail, content)

			let sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
			let request = sg.emptyRequest({
			  method: 'POST',
			  path: '/v3/mail/send',
			  body: mail.toJSON()
			})

			sg.API(request, function (err, response) {
			  if (err) {
					res.redirect('/#contact')
					return
			  }
				res.redirect('/#contact-thankyou')
				return
			})
		}
	])
})

module.exports = router
