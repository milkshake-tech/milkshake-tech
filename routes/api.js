var express = require('express')
var router = express.Router()
var async = require('async')
var inquiryController = require('../controllers/InquiryController')
var controllers = {
	inquiry: inquiryController
}

router.get('/:resource', function(req, res, next) {
  var resource = req.params.resource
  var controller = controllers[resource]
	if (controller == null){
	 	res.json({
  			confirmation: 'fail',
  			message: 'Invalid Resource'
  		})

  		return
	}

	controller.get(req.query, false, function(err, results){
		if (err){
			res.json({
				confirmation: 'Fail',
				message: err
			})
			return
		}

		res.json({
			confirmation: 'Success',
			results: results
		})
		return
	})

})

router.post('/:resource', function(req, res, next){
	var resource = req.params.resource
	var params = req.body
	var controller = controllers[resource]

	if (controller === null){
		res.json({
			confirmation: 'Fail',
			message: 'Invalid Resource'
		})
		return
	}

	async.waterfall([
		function(done){
			controller.post(req.body, function(err, response){
				if(err){
					res.json({
						confirmation: 'Fail',
						message: err
					})
					return
				}

				var inquiryPkg = {
					message: response.message,
					email: response.email,
					name: response.name
				}
				done(err, inquiryPkg)
			})
		},
		function(inquiryPkg, done){
			var SparkPost = require('sparkpost')

			var sparky = new SparkPost(process.env.SPARKPOST_API_KEY)
			var message = "<p>"+inquiryPkg.message + ".</p><p>This came from " + inquiryPkg.name + ", " + inquiryPkg.email+'</p>'

			sparky.transmissions.send({
				content: {
					from: 'katrina@milkshake.tech',
					subject: 'Milkshake Inquiry!',
					html: message
				},
				recipients: [
					{
						address: {
							email: 'brian@milkshake.tech'
						}
					}
				]
			})
			.then(data => {
				res.redirect('/')
			})
			.catch(err => {
				res.json({
					confirmation: "Fail",
					message: err
				})
				return
			})
		}
	])
})

module.exports = router
