var scene, camera, renderer;
var light;
var grid;
var geometry;
var raycaster;
var mouse = new THREE.Vector2();
var mouseOld = new THREE.Vector2();
var angleX = 0.0;
var angleY = 0.0;

var globalObjects = [];

var middleMouseDown = false;
var rightMouseDown = false;
var leftMouseDown = false;
//bounding box
var boundBox;
var initX;
var initY;
var mouseOffset = 24;
var selectedVertices = [];
var selectedGeometry = null;
var selectedFace = null;


var allObjects = [];


var modeEnum = {
	SELECTION_MODE : "selection_mode",
	EDIT_MODE : "edit_mode",
	EXTRUDE_MODE : "extrude_mode",
};

var transformModeEnum = {
	TRANSLATE_MDOE : "translate_mode",
	SCALE_MODE: "scale_mode",
	ROTATE_MODE: "rotate_mode"
};

var axisModeEnum = {
	X : "X",
	Y : "Y",
	Z : "Z"
};

var CURRENT_MODE = modeEnum.SELECTION_MODE;
var CURRENT_TRANSFORM_MODE = transformModeEnum.TRANSLATE_MODE;
var CURRENT_AXIS = axisModeEnum.X;

init();
render();
onMouseMove(event);

function switchMode( mode )
{
	CURRENT_MODE = mode;
}

function switchTransformMode( mode )
{
	CURRENT_TRANSFORM_MODE = mode;
}

function pickFace()
{
	var intersects = raycaster.intersectObjects(scene.children);
	if(intersects.length > 0)
	{
		selectedFace = intersects[0].face;
		selectedFace.color = new THREE.Color(0xeeff00);
	}
}

function onMouseMove( event )
{
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	if(boundBox) 
	{
		//drawBoundBox(event);
	}

	highlightVertices();

	if(selectedGeometry != null)
	{
		if(CURRENT_MODE == modeEnum.EDIT_MODE)
		{
			if(CURRENT_TRANSFORM_MODE == transformModeEnum.TRANSLATE_MODE)
			{
				if(CURRENT_AXIS == axisModeEnum.X)
				{
					for(var i = 0 ; i < selectedVertices.length; i ++)
					{
						selectedVertices[i].x += 1+(event.clientX - mouseOld.x)*5/window.innerWidth;

					}
					selectedGeometry.verticesNeedUpdate = true;
				}
				else if(CURRENT_AXIS == axisModeEnum.Y)
				{
					for(var i = 0 ; i < selectedVertices.length; i ++)
					{
						selectedVertices[i].y -= 1+(event.clientY - mouseOld.y)*5/window.innerWidth;

					}
					selectedGeometry.verticesNeedUpdate = true;
				}
				else if(CURRENT_AXIS == axisModeEnum.Z)
				{
					for(var i = 0 ; i < selectedVertices.length; i ++)
					{
						selectedVertices[i].z+= 1+(event.clientZ - mouseOld.z)*5/window.innerWidth;

					}
					selectedGeometry.verticesNeedUpdate = true;
				}
			}
			
			else if(CURRENT_TRANSFORM_MODE == transformModeEnum.SCALE_MODE)
			{
				var average = 0;
				var i = 0;
				if(CURRENT_AXIS == axisModeEnum.X)
				{
					for(i = 0; i < selectedVertices.length; i++)
					{
						average += selectedVertices[i].x;
					}
					average /= i;
					for(i = 0; i < selectedVertices.length; i++)
					{
						selectedVertices[i].x -= average;
						selectedVertices[i].x *= 1+(event.clientX - mouseOld.x)*5/window.innerWidth;
						selectedVertices[i].x += average;
					}
				}
				
				if(CURRENT_AXIS == axisModeEnum.Y)
				{
					for(i = 0; i < selectedVertices.length; i++)
					{
						average += selectedVertices[i].y;
					}
					average /= i;
					for(i = 0; i < selectedVertices.length; i++)
					{
						selectedVertices[i].y -= average;
						selectedVertices[i].y *= 1+(event.clientY - mouseOld.y)*5/window.innerWidth;
						selectedVertices[i].y += average;
					}
				}
				
				if(CURRENT_AXIS == axisModeEnum.Z)
				{
					for(i = 0; i < selectedVertices.length; i++)
					{
						average += selectedVertices[i].z;
					}
					average /= i;
					for(i = 0; i < selectedVertices.length; i++)
					{
						selectedVertices[i].z -= average;
						selectedVertices[i].z *= 1+(event.clientZ - mouseOld.z)*5/window.innerWidth;
						selectedVertices[i].z += average;
					}
				}
			}
		}
		else if(CURRENT_MODE == modeEnum.SELECTION_MODE)
		{
			if(leftMouseDown)
			{
				var average = 0;
				var i = 0;
				if(CURRENT_AXIS == axisModeEnum.X)
				{
					if(CURRENT_TRANSFORM_MODE == transformModeEnum.TRANSFORM_MODE)
					{
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							selectedGeometry.geometry.vertices[i].x += 1+(event.clientX - mouseOld.x)*5/window.innerWidth;
						}
					}
					else if(CURRENT_TRANSFORM_MODE == transformModeEnum.SCALE_MODE)
					{
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							average += selectedGeometry.geometry.vertices[i].x;
						}
						average /= i;
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							selectedGeometry.geometry.vertices[i].x -= average;
							selectedGeometry.geometry.vertices[i].x *= 1+(event.clientX - mouseOld.x)*5/window.innerWidth;
							selectedGeometry.geometry.vertices[i].x += average;
						}
					}
					selectedGeometry.geometry.verticesNeedUpdate = true;
					var vect = new THREE.Vector3();
					vect.x = event.clientX - mouseOld.x;
					vect.y = 0;
					vect.z = 0;

 					translatePoints(selectedGeometry.geometry.vertices,vect,allObjects.indexOf(selectedGeometry.geometry));
				}
				else if(CURRENT_AXIS==axisModeEnum.Y)
				{
					if(CURRENT_TRANSFORM_MODE == transformModeEnum.TRANSFORM_MODE)
					{
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							selectedGeometry.geometry.vertices[i].y += 1+(event.clientY - mouseOld.y)*5/window.innerWidth;
						}
					}
					else if(CURRENT_TRANSFORM_MODE == transformModeEnum.SCALE_MODE)
					{
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							average += selectedGeometry.geometry.vertices[i].y;
						}
						average /= i;
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							selectedGeometry.geometry.vertices[i].y -= average;
							selectedGeometry.geometry.vertices[i].y *= 1+(event.clientY - mouseOld.y)*5/window.innerWidth;
							selectedGeometry.geometry.vertices[i].y += average;
						}
					}
					selectedGeometry.geometry.verticesNeedUpdate = true;
					
				}
				else if(CURRENT_AXIS==axisModeEnum.Z)
				{
					if(CURRENT_TRANSFORM_MODE == transformModeEnum.TRANSFORM_MODE)
					{
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							selectedGeometry.geometry.vertices[i].z += (event.clientZ - mouseOld.z)*5/window.innerWidth;
						}
					}
					else if(CURRENT_TRANSFORM_MODE == transformModeEnum.SCALE_MODE)
					{
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							average += selectedGeometry.geometry.vertices[i].z;
						}
						average /= i;
						for(i = 0; i < selectedGeometry.geometry.vertices.length; i++)
						{
							selectedGeometry.geometry.vertices[i].z -= average;
							selectedGeometry.geometry.vertices[i].z *= (event.clientZ - mouseOld.z)*5/window.innerWidth;
							selectedGeometry.geometry.vertices[i].z += average;
						}
					}
					selectedGeometry.geometry.verticesNeedUpdate = true;
				}
			}
		}
		//mouseOld.x = event.clientX;	
		selectedGeometry.verticesNeedUpdate = true;
	}

	if(middleMouseDown)
	{
		

		/*
		var quat = new THREE.Quaternion();
		var direction = new THREE.Vector3(-(event.clientX - mouseOld.x),event.clientY - mouseOld.y,0);
		quat.setFromEuler(camera.rotation);

		var endVect;
		direction.applyQuaternion(quat);
		//camera.position.z -= delta*10;
		camera.position.x = direction.x + camera.position.x;
		camera.position.y = direction.y + camera.position.y;
		camera.position.z = direction.z + camera.position.z;
		mouseOld.x = event.clientX;
		mouseOld.y = event.clientY;*/
	}
	else if(rightMouseDown)
	{
		
		
		/*angleX -= (event.clientX - mouseOld.x)/window.innerWidth;
		angleY -= (event.clientY - mouseOld.y)/window.innerHeight;
		camera.rotation.y = angleX * Math.PI/180;
		camera.rotation.x = angleY * Math.PI/180;*/
		/*
		angleX+= event.clientX - mouseOld.x;
		angleY+= event.clientY - mouseOld.y;
		if(angleX > 360)
			angleX -=360;
		if(angleX < 0)
			angleX +=360;
		if(angleY > 360)
			angleY -= 360;
		if(angleY < 0)
			angleY += 360;
		mouseOld.x = event.clientX;
		mouseOld.y = event.clientY;		
		var X = Math.sin(angleX * Math.PI/180)*1000;
		var Z = Math.cos(angleX * Math.PI/180)*1000;

		camera.position.x = X;
		camera.position.z = Z;
		//camera.lookAt(0,0,0);*/
	}
}

function onMouseDown( event )
{



	if(event.button == 0)
	{
		//left
		leftMouseDown = true;
		mouseOld.x = event.clientX;
		if(CURRENT_MODE == modeEnum.EDIT_MODE)
		{
			boundBox = true;
			selectedVertices.length = 0;
			//get intial x and y coords for bounding box
			var pos = getMousePos(event);
			pos.x -= mouseOffset;
			pos.y += mouseOffset;
			initX = pos.x;
			initY = pos.y;
			startX = event.clientX;
			startY = event.clientY;
		}
		
	}
	else if(event.button == 1)
	{
		//middle
		//camera pan
		middleMouseDown = true;
		mouseOld.x = event.clientX;
		mouseOld.y = event.clientY;

	}
	else if(event.button == 2)
	{
		//right
		//camera rotate
		rightMouseDown = true;
		mouseOld.x = event.clientX;
		mouseOld.y = event.clientY;
	}
} 

function onMouseUp( event )
{

	if(event.button == 0)
	{
		if(CURRENT_MODE == modeEnum.SELECTION_MODE)
		{
			
			var intersects = raycaster.intersectObjects(scene.children);
			if(intersects.length > 0)
			{
				if(intersects[0].object != grid && intersects[0] != light)
				{

					if(intersects[0] != selectedGeometry)
					{
						if(selectedGeometry != null)
						{
							selectedGeometry.material.emissive.setHex(0x999999);
						}
						selectedGeometry = intersects[0].object;
						selectedGeometry.material.emissive.setHex(0xff0000);
					}
				}
			}


		}
		else if(CURRENT_MODE == modeEnum.EDIT_MODE)
		{
			boundBox = false;
			//remove bounding box
			scene.remove( scene.getObjectByName("boundBox") );
			// var pos = getMousePos(event);
			// var endX = pos.x;
			// var endY = pos.y;
			endX = event.clientX;
			endY = event.clientY;
			
			for ( var i = scene.children.length - 1; i >= 0 ; i -- ) {
				
				var obj = scene.children[ i ];
				if ( obj !== camera && obj != light && obj != grid)
				{
					
					for( var j = 0; j < obj.geometry.vertices.length; j++ )
					{
						if(inBox(startX, startY, endX, endY, obj.geometry.vertices[j]))
						{
							selectedVertices.push(obj.geometry.vertices[j]);
							selectedGeometry = obj.geometry;
						}
					}
				}
			}
			//console.log(selectedVertices[0]);
			//console.log(selectedVertices[1]);
			highlightVertices();
		}
		else if(CURRENT_MODE == modeEnum.EXTRUDE_MODE)
		{
			//pick a face
			var intersects = raycaster.intersectObjects(scene.children);
			if(intersects.length > 0)
			{
				console.log("WHAT YEAR IS IT");
				selectedFace = intersects[0].face;
				
				var vertices = intersects[0].object.geometry.vertices;
				var normal = selectedFace.normal;
				normal.multiplyScalar(20);

				var endA = new THREE.Vector3();
				endA.x = vertices[selectedFace.a].x + normal.x;
				endA.y = vertices[selectedFace.a].y + normal.y;
				endA.z = vertices[selectedFace.a].z + normal.z;
				var endB = new THREE.Vector3();
				endB.x = vertices[selectedFace.b].x + normal.x;
				endB.y = vertices[selectedFace.b].y + normal.y;
				endB.z = vertices[selectedFace.b].z + normal.z;
				var endC = new THREE.Vector3();
				endC.x = vertices[selectedFace.c].x + normal.x;
				endC.y = vertices[selectedFace.c].y + normal.y;
				endC.z = vertices[selectedFace.c].z + normal.z;
				var geometry = new THREE.Geometry();
				geometry.vertices.push(
					endA,
					endB,
					endC,
					vertices[selectedFace.a],
					vertices[selectedFace.b],
					vertices[selectedFace.c]);
				
				geometry.faces.push(new THREE.Face3(0,1,2));
				geometry.faces.push(new THREE.Face3(1,0,4));
				geometry.faces.push(new THREE.Face3(4,0,3));
				geometry.faces.push(new THREE.Face3(0,2,3));
				geometry.faces.push(new THREE.Face3(3,2,5));
				geometry.faces.push(new THREE.Face3(2,1,5));
				geometry.faces.push(new THREE.Face3(5,1,4));
				var material = new THREE.MeshLambertMaterial( { color: 0x999999 } );
				material.emissive.setHex(0x999999);
				geometry.computeBoundingSphere();
				
				var mesh = new THREE.Mesh(geometry, material);

				scene.add(mesh);
			}			
		}
		leftMouseDown = false;
	}
	else if(event.button == 1)
	{
		middleMouseDown = false;
	}
	else if(event.button == 2)
	{
		rightMouseDown = false;
	}

}

function createVector(x, y, z, camera, width, height) {
	var p = new THREE.Vector3(x, y, z);
	var vector = p.project(camera);

	vector.x = (vector.x + 1) / 2 * width;
	vector.y = -(vector.y - 1) / 2 * height;

	return vector;
}

function inBox(startX, startY, endX, endY, vertex)
{
	/*
	var tmp;
	if(startX > endX) {
		tmp = startX;
		startX = endX;
		endX = tmp;
	}
	if(startY > endY) {
		tmp = startY;
		startY = endY;
		endY = tmp;
	}
	if(vertex.x > startX && vertex.x < endX) {
		if(vertex.y > startY && vertex.y < endY) {
			return true;
		}
		else {
			return false;
		}
	}
	*/
	//project vertex
	//console.log("Start X: " + startX);
	//console.log("Start Y: " + startY);
	var position = createVector(vertex.x, vertex.y, vertex.z, camera, window.innerWidth, window.innerHeight);

	if(position.x > startX && position.x < endX && position.y > startY && position.y < endY)
	{
		return true;
	}
	return false;
}

function onMouseWheel( event )
{
	var delta = 0;

	if ( event.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9

		delta = event.wheelDelta;

	} else if ( event.detail !== undefined ) { // Firefox

		delta = - event.detail;

	}
	var quat = new THREE.Quaternion();
	var direction = new THREE.Vector3(0,0,-10*delta);
	quat.setFromEuler(camera.rotation);

	var endVect;
	direction.applyQuaternion(quat);
	//camera.position.z -= delta*10;
	camera.position.x = direction.x + camera.position.x;
	camera.position.y = direction.y + camera.position.y;
	camera.position.z = direction.z + camera.position.z;
}

function createBox(x,y,z,sizex,sizey,sizez)
{

	var geometry = new THREE.BoxGeometry( sizex, sizey, sizez);
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
	material.emissive.setHex(0x999999);
	var object = new THREE.Mesh(geometry, material);
	object.position.x = x;
	object.position.y = y;
	object.position.z = z;
	scene.add(object);
	allObjects.push(object);
}

function createCylinder(x,y,z,sizex,sizey,sizez)
{

	var geometry = new THREE.BoxGeometry( sizex, sizey, sizez);
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
	material.emissive.setHex(0x999999);
	var object = new THREE.Mesh(geometry, material);
	object.position.x = x;
	object.position.y = y;
	object.position.z = z;
	scene.add(object);
}

function init()
{
	//scene initialization code goes here
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	geometry = new THREE.BoxGeometry( 200, 200, 200 );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
	material.emissive.setHex(0x999999);
	
	distanceX = 0;
	distanceY = 0;
	distanceZ = 0;
	for(var i = 0; i < geometry.vertices.length; i++) {
		geometry.vertices[i].x += distanceX;
		geometry.vertices[i].y += distanceY;
		geometry.vertices[i].z += distanceZ;
	}
	
	geometry.verticesNeedUpdate = true;
	var object = new THREE.Mesh( geometry, material );
	scene.add(object);
	allObjects.push(object);
	light = new THREE.PointLight(0xffffff);
	light.position.set(-100,150,100);
	scene.add(light);
	raycaster = new THREE.Raycaster();
	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x454545 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );
	createUI();
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	//controls.addEventListener('change',render);
	
	//grid
	var size = 500, step = 10;

	var geo = new THREE.Geometry();
	var mat = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } );

	for ( var i = -size; i <= size; i += step ) {

		geo.vertices.push( new THREE.Vector3( -size, 0, i ) );
		geo.vertices.push( new THREE.Vector3(   size, 0, i ) );

		geo.vertices.push( new THREE.Vector3( i, 0, -size ) );
		geo.vertices.push( new THREE.Vector3( i, 0,   size ) );
	}

	grid = new THREE.Line( geo, mat, THREE.LinePieces );
	scene.add( grid );
}

controls.addEventListener('change', render);
function render()
{
	raycaster.setFromCamera(mouse, camera);
	requestAnimationFrame( render );
	addEventListener('mousemove', onMouseMove, false);
	addEventListener('mousedown', onMouseDown, false);
	addEventListener('mousewheel', onMouseWheel, false);
	addEventListener('DOMMouseScroll', onMouseWheel, false);
	addEventListener('mouseup',onMouseUp, false);
	var intersects = raycaster.intersectObjects(scene.children);

	var intersectedObject;
	if ( intersects.length > 0 )
	{
		intersectedObject = intersects[0].object;
		
	}

	
	renderer.render( scene, camera );
}
//get mouse position
function getMousePos ( event ) {
	//calculate position of mouse
		var vector = new THREE.Vector3();

		vector.set(
			( event.clientX / window.innerWidth ) * 2 - 1,
			- ( event.clientY / window.innerHeight ) * 2 + 1,
			0.5 );

		vector.unproject( camera );

		var dir = vector.sub( camera.position ).normalize();

		var distance = - camera.position.z / dir.z;
		
		//position under mouse
		var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
		return pos;
}
//draw bounding box
function drawBoundBox( event ) {
	
	//calculate position of mouse
	var pos = getMousePos(event);
	pos.x -= mouseOffset;
	pos.y += mouseOffset;
	
	//draw lines for box
	var mat = new THREE.LineBasicMaterial({
		color: 0x00ff00
	});
	 var geo = new THREE.Geometry();
	 
	geo.vertices.push(new THREE.Vector3(initX, initY, 0));
	geo.vertices.push(new THREE.Vector3(initX, pos.y, 0));
	geo.vertices.push(new THREE.Vector3(pos.x, pos.y, 0));
	geo.vertices.push(new THREE.Vector3(pos.x, initY, 0));
	geo.vertices.push(new THREE.Vector3(initX, initY, 0));
	
	//console.log("x " + event.clientX);
	//console.log(event.clientY);
	
	//remove bounding box before adding a new one
	scene.remove( scene.getObjectByName("boundBox") );
	
	//add bounding box to scene
	var box = new THREE.Line(geo, mat);
	box.name = "boundBox";
	scene.add(box);
}
//move all vertices
function move(distanceX,distanceY,distanceZ) {

	for(var i = 0; i < geometry.vertices.length; i++) {
		geometry.vertices[i].x += distanceX;
		geometry.vertices[i].y += distanceY;
		geometry.vertices[i].z += distanceZ;
	}
	
	//move single vertex
	//geometry.vertices[0].x += distanceX;
	//geometry.verticesNeedUpdate = true;
	//geometry.normalsNeedUpdate = true;
	
	//output vertices for testing
	for(var i = 0; i < geometry.vertices.length; i++) {
		//console.log(geometry.vertices[i]);
	}
}

//selected vertices highlighted
function highlightVertices() {

	//var selected = geometry.vertices[0];
	//keyboard handler
	// document.onkeydown = function(e) {
		// switch (e.keyCode) {
			// case 37:
				//left arrow
				
				// break;
			// case 38:
				//up arrow
				// break;
			// case 39:
				//right arrow
				// break;
			// case 40:
				//down arrow
				// break;
		// }
	// };
	//console.log
	var pGeometry = new THREE.Geometry();
    var pMaterial = new THREE.PointCloudMaterial({
      color: 0x0000ff,
      size: 40
    });
	
	for(var i = 0; i < selectedVertices.length; i++ ) {
	
		// var radius   = 100,
			// segments = 64,
			// material = new THREE.LineBasicMaterial( { color: 0x0000ff } ),
			// geometry = new THREE.CircleGeometry( radius, segments );
		pGeometry.vertices.push(selectedVertices[i]);

		// Remove center vertex
		// geometry.vertices.shift();
		// var obj = new THREE.Line( geometry, material )
		// obj.position.x = selectedVertices[i].x;
		// obj.position.y = selectedVertices[i].y;
		// obj.position.z = selectedVertices[i].z;
		// scene.add(obj  );
	}
	scene.remove( scene.getObjectByName("selected") );
	var selected = new THREE.PointCloud( pGeometry, pMaterial);
	selected.name = "selected";
	scene.add(selected);
	
}
