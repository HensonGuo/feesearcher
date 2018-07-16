var express = require('express');
var router = express.Router();
var ejs = require('ejs')
var dataCenter = require('./../public/javascripts/data_center')
var constants = require("./../public/javascripts/constants");

router.get('/:name', function(req, res, next) {
	var starName = req.params.name;
  	starInfo = dataCenter.getFavoriteStar(starName)
  	res.render('follows', { title: "feesearcher", serveradress:constants.serveradress, star:starInfo});
});

router.get('/:tag/:minorid', function(req, res, next) {
	var tag = req.params.tag;
	var minorid = req.params.minorid;

	var favorites = dataCenter.getFavoritesByTagAndMinor(tag, minorid);
  	ejs.renderFile('./views/index.html', 
  		{ title: 'feesearcher', serveradress:constants.serveradress , content:favorites}, function(err, data){
		  	if (err){
		  		res.end(err.toString());
		  		console.log(err);
		  	}
		  	else{
		  		res.end(data);
		  	}
		}
	);
});

module.exports = router;