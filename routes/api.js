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

router.post('/:resource', (req, res, next) => {
	const resource = req.params.resource
	const params = req.body
	const controller = controllers[resource]

	if (controller === null){
		return res.json({ confirmation: 'Fail', message: 'Invalid Resource' })
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
			const SparkPost = require('sparkpost')

			const sparky = new SparkPost(process.env.SPARKPOST_API_KEY)
			let message = "<p>"+inquiryPkg.message + ".</p><p>This came from " + inquiryPkg.name + ", " + inquiryPkg.email+'</p>'
			sparky.transmissions.send({
				content: {
					from: 'katrina@milkshake.tech',
					subject: 'Milkshake Inquiry',
					html: message
				},
				recipients: [
					{
						address: { email: 'brian@milkshake.tech' }
					}
				]
			})
			.then(data => {
				res.redirect('/')
			})
			.catch(err => {
				console.log('ERR: '+JSON.stringify(err))
				return res.json({ confirmation: "Fail", message: err })
			})
		}
	])
})

module.exports = router
