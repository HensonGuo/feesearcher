var express = require('express');
var router = express.Router();
var ejs = require('ejs')
var dataCenter = require('./../public/javascripts/data_center')
var constants = require("./../public/javascripts/constants");

function isTag(param){
	if (param == "*")
		return true;
	for (var key in constants.Tag){
		if (constants.Tag[key] == param)
			return true;
	}
	return false;
}

function renderStarPage(starName, res)
{
  	starInfo = dataCenter.getFavoriteStar(starName)
  	if (starInfo)
  		res.render('follows', { title: "feesearcher", 
  			serveradress:constants.serveradress, 
  			filesvradress:constants.filesvradress,
  			star:starInfo});
  	else
  		res.redirect('/');
}

function renderTagMinorPage(tag, minorid, res)
{
	var favorites = dataCenter.getFavoritesByTagAndMinor(tag, minorid);
  	ejs.renderFile(
  		'./views/index.html', 
  		{ title: 'feesearcher', serveradress:constants.serveradress , content:favorites}, 
  		function(err, data){
		  	if (err){
		  		res.end(err.toString());
		  		console.log(err);
		  	}
		  	else{
		  		res.end(data);
		  	}
		}
	);
}

function renderVideoPlayerPage(playerName, videoName, res)
{
	var vpath = constants.filesvradress + '/video/' + playerName + '/' + videoName + '.mp4'
	ejs.renderFile('./video_player/player.html', 
		{ videopath: vpath, videoname:videoName, serveradress:constants.serveradress}, 
		function(err, data){
		if (err){
		  		res.end(err.toString());
		  		console.log(err);
		  	}
		  	else{
		  		res.end(data);
		  	}
	});
}


// router.get('/:name', function(req, res, next) {
// 	var starName = req.params.name;
//   	starInfo = dataCenter.getFavoriteStar(starName)
//   	res.render('follows', { title: "feesearcher", serveradress:constants.serveradress, star:starInfo});
// });

// router.get('/:tag/:minorid', function(req, res, next) {
// 	var tag = req.params.tag;
// 	var minorid = req.params.minorid;

// 	var favorites = dataCenter.getFavoritesByTagAndMinor(tag, minorid);
//   	ejs.renderFile('./views/index.html', 
//   		{ title: 'feesearcher', serveradress:constants.serveradress , content:favorites}, function(err, data){
// 		  	if (err){
// 		  		res.end(err.toString());
// 		  		console.log(err);
// 		  	}
// 		  	else{
// 		  		res.end(data);
// 		  	}
// 		}
// 	);
// });


router.handle = function(req, res)
{
	var path = decodeURI(req.path);
	var params = path.split('/')

	if (params[1] == ''){
		res.redirect('/');
	}
	else if (isTag(params[1]))
		if (params.length == 3)
			renderTagMinorPage(params[1], params[2], res);
		else
			res.redirect('/');
	else if (params[1] == 'playvideo')
		renderVideoPlayerPage(params[2], params[3], res)
	else
		renderStarPage(params[1], res)
}


module.exports = router;