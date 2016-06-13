var Inquiry = require('../models/Inquiry')

module.exports = {

	get: function(params, isRaw, callback){
		Inquiry.find(params, function(err, inquiries){
			if(err){
				if (callback != null)
					callback(err, null)
				return
			}

			if (callback != null)
				callback(null, inquiries)
		})
	},

	post: function(params, callback){
		Inquiry.create(params, function(err, inquiry){
			if (err){
				if (callback != null)
					callback(err, null)
				return
			}

			if (callback != null)
				callback(null, inquiry)
		})
	}
}