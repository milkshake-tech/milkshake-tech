var express = require('express');
var router = express.Router();
var inquiryController = require('../controllers/InquiryController');
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
				confirmation: 'fail',
				message: err
			})
			return
		}

		res.json({
			confirmation: 'success',
			results: results
		})
		return
	})
 
})

router.post('/:resource', function(req, res, next){
	var resource = req.params.resource
	var controller = controllers[resource]

	if (resource == 'inquiry'){ //submit inquiry

		var params = req.body
		var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

		var replyMsg = params['message'] + ". This came from " + params['name'] + ", " + params["email"] + ", for " + params["service"]

		sendgrid.send({
			to: 'karodriguez8@gmail.com',
			from: 'karodriguez8@gmail.com', 
			subject: 'You got an Inquiry!',
			text: replyMsg
		}, function(err){

		})

	}

	if (controller == null){
		res.json({
			confirmation: 'Fail',
			message: 'Invalid Resource'
		})
		return
	}

	controller.post(req.body, function(err, result){
		if (err){
			res.json({
				confirmation: 'Fail',
				message: err.message
			})
			return
		}

		res.json({
			confirmation: 'Success',
			result: result
		})
		return
	})	
		
})

module.exports = router