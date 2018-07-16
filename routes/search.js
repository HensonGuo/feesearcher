var express = require('express');
var router = express.Router();
var dataCenter = require('./../public/javascripts/data_center')
var constants = require("./../public/javascripts/constants");

/* GET users listing. */
router.search = function(req, res) {
  	var starName = req.body.value;
  	info = dataCenter.find(starName)
  	if (info){
  		src = info["src"]
  		if (src == constants.SrcConst.Favorites){
  			res.render('follows', { title: "feesearcher", 
  				serveradress:constants.serveradress, star:info['data']});
  		}
  		else if (src == constants.SrcConst.Tbds){
  			res.send('在待察');
  		}
  		else if (src == constants.SrcConst.Vieweds){
  			res.send('已观察过')
  		}
  		else if (src == constants.SrcConst.Ignores){
  			res.send('已忽略')
  		}
  		else if (src == constants.SrcConst.Results) {
  			res.send('在搜索结果里，待处理')
  		}
  		else{
  			res.send('not exist');
  		}
  	}
  	else{
  		res.send('not exist');
  	}
};

module.exports = router;