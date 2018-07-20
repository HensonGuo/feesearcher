function IsInArray(arr,val){ 
　　var testStr=','+arr.join(",")+","; 
　　return testStr.indexOf(","+val+",")!=-1; 
 
}

function isInMap(map, key)
{
	for (var nkey in map)
	{
		if (nkey == key)
			return true;
	}
	return false;
}

exports.IsInArray = IsInArray;
exports.isInMap = isInMap;