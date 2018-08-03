var express = require('express');
var router = express.Router();
var ejs = require('ejs')
var dataCenter = require('./../public/javascripts/data_center')
var constants = require("./../public/javascripts/constants");

router.test = function(req, res){
	res.render('test', {serveradress:constants.serveradress});
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var favorites = dataCenter.getFavoritesByTagAndMinor('*', '*');
  ejs.renderFile('./views/index.html', 
  	{ title: 'feesearcher', serveradress:constants.serveradress , content:favorites}, function(err, data){
  	if (err){
  		res.end(err.toString());
  		console.log(err);
  	}
  	else{
  		res.end(data);
  	}
  });
});

module.exports = router;