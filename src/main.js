var scene, camera, renderer;
var geometry;
var raycaster;
var mouse = new THREE.Vector2();
var mouseOld = new THREE.Vector2();
var angleX;
var angleY;

var middleMouseDown = false;
var rightMouseDown = false;

init();
render();
onMouseMove(event);

function onMouseMove( event )
{
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	if(middleMouseDown)
	{
		camera.position.x -= event.clientX - mouseOld.x;
		camera.position.y += event.clientY - mouseOld.y;
		mouseOld.x = event.clientX;
		mouseOld.y = event.clientY;
		
	}
	else if(rightMouseDown)
	{
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
		var X = Math.sin(angleX * Math.PI/180)*100;
		var Z = Math.cos(angleX * Math.PI/180)*100;

		camera.position.x = X;
		camera.position.z = Z;
		camera.lookAt(0,0,0);
	}
}

function onMouseDown( event )
{

	if(event.button == 0)
	{
		//left
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

function onMouseWheel( event )
{
	console.log(event.wheelDelta);
	camera.position.z -= event.wheelDeltaY;
}

function init()
{

	//scene initialization code goes here	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	geometry = new THREE.BoxGeometry( 200, 200, 200 );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
	material.emissive.setHex(0xff0000);


	var object = new THREE.Mesh( geometry, material );


	scene.add( object );


	raycaster = new THREE.Raycaster();
	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );
	createUI();
	var controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change',render);
}

function render()
{
	raycaster.setFromCamera(mouse, camera);
	requestAnimationFrame( render );
	//addEventListener('mousemove', onMouseMove, false);
	//addEventListener('mousedown', onMouseDown, false);
	//addEventListener('mousewheel', onMouseWheel, false);
	//addEventListener('DOMMouseScroll', onMouseWheel, false);
	//addEventListener('mouseup',onMouseUp, false);
	var intersects = raycaster.intersectObjects(scene.children);

	var intersectedObject;
	if ( intersects.length > 0 )
	{
		intersectedObject = intersects[0].object;
		
	}

	
	renderer.render( scene, camera );
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

//select vertices with arrow keys
function selectVertex() {

	var selected = geometry.vertices[0];
	//keyboard handler
	document.onkeydown = function(e) {
		switch (e.keyCode) {
			case 37:
				//left arrow
				
				break;
			case 38:
				//up arrow
				break;
			case 39:
				//right arrow
				break;
			case 40:
				//down arrow
				break;
		}
	};
	//console.log
	
}
