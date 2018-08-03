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

router.addStar = function(req, res){
  var query = req.query;
  var name = query.name;
  var callback = query.callback;
  result = dataCenter.addToFavorite(name)
  var resData = {"result":result, "name":name}
  resData = JSON.stringify(resData);
  res.send(`${callback}(${resData})`);
}

router.delArt = function(req, res){
  var query = req.query;
  var starname = query.starname;
  var artname = query.artname;
  var callback = query.callback;
  result = dataCenter.delArt(starname, artname)
  var resData = {"result":result, "starname":starname, "artname":artname}
  resData = JSON.stringify(resData);
  res.send(`${callback}(${resData})`);
}

router.addArt = function(req, res){
  var query = req.query;
  var starname = query.starname;
  var artname = query.artname;
  var artcover = query.artcover;
  var callback = query.callback;
  result = dataCenter.addArt(starname, artname, artcover)
  var resData = {"result":result, "starname":starname, "artname":artname, "artcover":artcover};
  resData = JSON.stringify(resData);
  res.send(`${callback}(${resData})`);
}

router.editStar = function(req, res){
  var query = req.query;
  var orgname = query.orgname;
  var starname = query.starname;
  var enname = query.enname;
  var birth = query.birth;
  var height = query.height;
  var measurements = query.measurements;
  var cupsize = query.cupsize;
  var tag = query.tag;
  console.info(tag)
  var minorid = query.minorid;
  var callback = query.callback;
  data = {name:starname, enname:enname, birth:birth, 
    height:height, measurements:measurements, cupsize:cupsize, tag:tag, minorid:minorid}
  result = dataCenter.editStar(orgname, data)
  var resData = {"result":result, "data":data};
  resData = JSON.stringify(resData);
  res.send(`${callback}(${resData})`);
}


module.exports = router;