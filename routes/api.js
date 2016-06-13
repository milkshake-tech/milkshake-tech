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