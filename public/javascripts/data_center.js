var fs=require('fs');
var constants = require("./constants");
var utils = require('./utils')


var _favorites = {};
var _ignores = [];
var _tbds = [];
var _vieweds = [];
var _results = [];
var _config = {};
var _minorsmap = {};

function loadData()
{
	try{
		_favorites = JSON.parse(fs.readFileSync('./public/configs/favorite.json'));
		_ignores = JSON.parse(fs.readFileSync('./public/configs/ignore.json'));
		_tbds = JSON.parse(fs.readFileSync('./public/configs/tbd.json'));
		_vieweds = JSON.parse(fs.readFileSync('./public/configs/vieweds.json'));
		_results = JSON.parse(fs.readFileSync('./public/configs/result.json'));
		_config = JSON.parse(fs.readFileSync('./public/configs/_config.json'));

		getMinors().forEach(function(minor, index, minors){
			_minorsmap[minor.minorid] = minor;
		});
	}
	catch(err)
	{
		console.error(err)
	}
};

function sortByMinorid(star1, star2){
	return star1.minorid - star2.minorid
};

function getTags()
{
    return _config.tags
};

function getMinors()
{
    return _config.minors
};


function addToFavorite(name){
	if (utils.isInMap(_favorites, name))
		return false;
	if (utils.IsInArray(_tbds, name))
		return false;
	if (utils.IsInArray(_ignores, name))
		return false;
	if (utils.IsInArray(_vieweds, name))
		return false;
	_favorites[name] = {"name":name}
	fs.writeFileSync('./public/configs/favorite.json', JSON.stringify(_favorites))
	return true;
}

function getFavoriteStar(starName){
	if (starName in _favorites)
		return _favorites[starName]
	return null
};

function getFavorites(){
	return _favorites;
};

function getFavoritesByTagAndMinor(tag, minorid)
{
	var filtereds = [];
	var tags = [constants.Tag.Big, constants.Tag.Mid, constants.Tag.Small]
	var validTag = tags.indexOf(tag) != -1;
	var validMinorid = minorid.toString() in _minorsmap;

	for(var starName in _favorites){
		star = _favorites[starName]
		if (validTag)
		{
			hasTag = star.tags?star.tags.indexOf(tag) != -1:false;
			if (hasTag)
			{
				if (validMinorid)
				{
					if (star.minorid == minorid)
					{
						filtereds.push(star);
					}
				}
				else
				{
					if (minorid == '-')
					{
						if (!star.minorid)
						{
							filtereds.push(star);
						}
					}
					else
					{
						filtereds.push(star);
					}
				}
			}
		}
		else
		{
			if (validMinorid)
			{
				if (star.minorid == minorid)
				{
					filtereds.push(star);
				}
			}
			else
			{
				if (minorid == '-')
				{
					if (!star.minorid)
					{
						filtereds.push(star);
					}
				}
				else
				{
					filtereds.push(star);
				}
			}
		}
	};
	return filtereds.sort(sortByMinorid);
}


function deepFindInFavorite(name){
	for (var sname in _favorites){
		star = _favorites[sname]
		if (name == star.name || name == star.othername || name == star.enname)
		{
			return star
		}
	}
	return null
}


function find(name){
	var star = deepFindInFavorite(name);
	if (star){
		return {"src":constants.SrcConst.Favorites, "data":star}
	}
	for (var index in _tbds)
	{
		var sname = _tbds[index];
		if (sname == name){
			return {"src":constants.SrcConst.Tbds, "data":name};
		}
	}
	for (var index in _ignores)
	{
		var sname = _ignores[index];
		if (sname == name){
			return {"src":constants.SrcConst.Ignores, "data":name};
		}
	}
	for (var index in _vieweds)
	{
		var sname = _vieweds[index];
		if (sname == name){
			return {"src":constants.SrcConst.Vieweds, "data":name};
		}
	}
	for (var index in _results)
	{
		var sname = _results[index];
		if (sname == name){
			return {"src":constants.SrcConst.Results, "data":name};
		}
	}
	return null
}


function moveFavoriteToViewed(name){
	try{
		success = false
		if (utils.IsInArray(_vieweds, name) == false)
		{
			_vieweds.push(name)
			fs.writeFileSync('./public/configs/vieweds.json', JSON.stringify(_vieweds))
			success = true
		}
		if (utils.isInMap(_favorites, name) == true){
			delete _favorites[name];
			fs.writeFileSync('./public/configs/favorite.json', JSON.stringify(_favorites))
			success = true
		}
		return success
	}
	catch(err)
	{
		console.info(err)
	}
}

function delArt(starName, artName){
	var star = getFavoriteStar(starName);
	if (!star)
		return false
	arts = star.arts;
	if (!arts)
		return false;
	var artCount = arts.length;
	for (var index=0; index<artCount; index++){
		art = arts[index];
		if (art.name == artName)
		{
			arts.splice(index, 1)
			fs.writeFileSync('./public/configs/favorite.json', JSON.stringify(_favorites))
			return true
		}
	}
	return false;
}

function addArt(starName, artName, artCover){
	var star = getFavoriteStar(starName);
	console.info(star)
	if (!star)
		return false
	if (!star.arts)
		star.arts = []
	arts = star.arts;
	arts.push({name:artName, img:artCover})
	fs.writeFileSync('./public/configs/favorite.json', JSON.stringify(_favorites))
	return true;
}

function editStar(name, data){
	var star = getFavoriteStar(name)
	if (!star)
		return false
	star.name = data.name;
	star.enname = data.enname;
	star.birth = data.birth;
	star.height = data.height;
	star.measurements = data.measurements;
	star.cupsize = data.cupsize;
	if (!star.tags)
		star.tags = []
	star.tags[0] = data.tag;
	star.minorid = data.minorid;
	fs.writeFileSync('./public/configs/favorite.json', JSON.stringify(_favorites))
	return true;
}
        

exports.loadData = loadData;
exports.find = find;
exports.addToFavorite = addToFavorite;
exports.getFavorites = getFavorites;
exports.getFavoriteStar = getFavoriteStar;
exports.getFavoritesByTagAndMinor = getFavoritesByTagAndMinor;
exports.moveFavoriteToViewed = moveFavoriteToViewed;
exports.delArt = delArt;
exports.addArt = addArt;
exports.editStar = editStar;