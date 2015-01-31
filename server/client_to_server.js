//TODO: Make this dynamic
var TABLE_NAME = "exavqxxu3s";

function sendRequest(_cmd, _verts1, _verts2, _func){
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
	});
}

function translatePoints(arrPoints, distance)
{
	var pointsString = "";
	for(var i = 0; i < arrPoints.length; i++)
	{
		pointsString = "" + arrPoints[i] + ',';
	}
	pointsString = pointsString.substr(0,pointsString.length-1);
	alert(arrPoints + ", " + distance);
	var distanceString = "" + distance.getComponent(0) + ',' + distance.getComponent(1) + ',' + distance.getComponent(2);
	
	sendRequest("TRANSLATE_POINTS", pointsString, distanceString, "");
}

function scalePoints(arrPoints, distance, origin)
{
	var pointsString = "";
	for(var i = 0; i < arrPoints.length; i++)
	{
		pointsString = "" + arrPoints[i] + ',';
	}
	pointsString = pointsString.substr(0,pointsString.length-1);
	
	var distanceString = "" + distance.x + ',' + distance.y + ',' + distance.z;
	
	var originString = "" + origin.x + ',' + origin.y + ',' + origin.z;
	
	sendRequest("SCALE_POINTS", pointsString, distanceString, "");
}

function rotatePoints(arrPoints, distance, origin)
{
	var pointsString = "";
	for(var i = 0; i < arrPoints.length; i++)
	{
		pointsString = "" + arrPoints[i] + ',';
	}
	pointsString = pointsString.substr(0,pointsString.length-1);
	
	var distanceString = "" + distance.x + ',' + distance.y + ',' + distance.z;
	
	var originString = "" + origin.x + ',' + origin.y + ',' + origin.z;
	
	sendRequest("ROTATE_POINTS", pointsString, distanceString, "");
}
