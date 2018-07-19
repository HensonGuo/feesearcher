var fs=require('fs');
var constants = require("./constants");


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
			hasTag = star.tags.indexOf(tag) != -1;
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


exports.loadData = loadData;
exports.getFavorites = getFavorites;
exports.getFavoriteStar = getFavoriteStar;
exports.getFavoritesByTagAndMinor = getFavoritesByTagAndMinor;
exports.find = find;