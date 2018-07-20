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

router.delstar = function(req, res) {
  var query = req.query;
  var name = query.name;
  var callback = query.callback;
  result = dataCenter.moveFavoriteToViewed(name);
  // res.send(`${callback}("Hello ${req.query.name}")`);
  var resData = {"result":result, "name":name}
  resData = JSON.stringify(resData);
  res.send(`${callback}(${resData})`);
}


module.exports = router;