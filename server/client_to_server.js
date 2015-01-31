//TODO: Make this dynamic
var TABLE_NAME = "exavqxxu3s";
var lastID = 0;

var listCommits;

function checkNewCommits()
{
	recieveCommit(lastID + 1 );
}

function checkOldCommits(newID)
{
	for(var curID = lastID + 1; curID < newID; curID++)
	{
		recieveCommit(curID);
	}
}

function stringToCommit(msg)
{
	return msg.split("&");
}

function removeCommit(ID)
{
	$.ajax({
		url: "http://localhost/SBHacksClient/server/removeRow.php",       
		type: "POST",
		data: {
			id: ID,
			tableName: TABLE_NAME
		}//, 
		//error: Utilities.Logger.displayAjaxError
	}).done(function( msg ) {
		//alert(msg);
		for(var i = listCommits.length - 1; i >= 0; i--)
		{
			if(listCommits[1] == ID)
			{
				listCommits.splice(i, 1);
				alert(listCommits);
				break;
			}
		}
	});
}

function receiveCommit(ID)
{
	$.ajax({
		url: "http://localhost/SBHacksClient/server/pullData.php",       
		type: "POST",
		data: {
			id: ID,
			tableName: TABLE_NAME
		}//, 
		//error: Utilities.Logger.displayAjaxError
	}).done(function( msg ) {
		//alert(msg);
		if(msg)
		{
			listCommits.push( stringToCommit(msg) );
		}
	});
}

function sendCommit(_cmd, _verts1, _verts2, _func){
   $.ajax({
		url: "http://localhost/SBHacksClient/server/array_edit.php",       
		type: "POST",
		data: {
			cmd: _cmd,
			verts1: _verts1,
			verts2: _verts2,
			func: _func,
			tableName: TABLE_NAME
		}//, 
		//error: Utilities.Logger.displayAjaxError
	}).done(function( msg ) {
		alert(msg);
		checkOldCommits(msg);
	});
}


//Function calls
function translatePoints(arrPoints, translation)
{
	var pointsString = "";
	for(var i = 0; i < arrPoints.length; i++)
	{
		pointsString = "" + arrPoints[i] + ',';
	}
	pointsString = pointsString.substr(0,pointsString.length-1);
	alert(arrPoints + ", " + translation);
	var distanceString = "" + translation.getComponent(0) + ',' + translation.getComponent(1) + ',' + distance.getComponent(2);
	
	sendRequest("TRANSLATE_POINTS", pointsString, distanceString, "");
}

function scalePoints(arrPoints, scale, origin)
{
	var pointsString = "";
	for(var i = 0; i < arrPoints.length; i++)
	{
		pointsString = "" + arrPoints[i] + ',';
	}
	pointsString = pointsString.substr(0,pointsString.length-1);
	
	var distanceString = "" + scale.x + ',' + scale.y + ',' + scale.z;
	
	var originString = "" + origin.x + ',' + origin.y + ',' + origin.z;
	
	sendRequest("SCALE_POINTS", pointsString, distanceString, "");
}

function rotatePoints(arrPoints, rotation, origin)
{
	var pointsString = "";
	for(var i = 0; i < arrPoints.length; i++)
	{
		pointsString = "" + arrPoints[i] + ',';
	}
	pointsString = pointsString.substr(0,pointsString.length-1);
	
	var distanceString = "" + rotation.x + ',' + rotation.y + ',' + rotation.z;
	
	var originString = "" + origin.x + ',' + origin.y + ',' + origin.z;
	
	sendRequest("ROTATE_POINTS", pointsString, distanceString, "");
}
