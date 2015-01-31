var scene, camera, renderer;
var raycaster;
var mouse = new THREE.Vector2();

//bounding box
var boundBox;
var startX;
var startY;
var mouseOffset = 24;
var selectedVertices = [];

init();
render();
onMouseMove(event);

function onMouseMove( event )
{
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	if(boundBox) {
		drawBoundBox(event);
	}
}

function onMouseDown( event )
{
	boundBox = true;
	selectedVertices.length = 0;
	//get intial x and y coords for bounding box
	var pos = getMousePos(event);
	pos.x -= mouseOffset;
	pos.y += mouseOffset;
	startX = pos.x;
	startY = pos.y;
	startX = event.clientX;
	startY = event.clientY;
	var intersects = raycaster.intersectObjects(scene.children);
	for( var i in intersects)
	{
		if(intersects.length > 0)
		{

		}
	}	
} 

function onMouseUp( event )
{
	boundBox = false;
	//remove bounding box
	scene.remove( scene.getObjectByName("boundBox") );
	var pos = getMousePos(event);
	var endX = pos.x;
	var endY = pos.y;
	endX = event.clientX;
	endY = event.clientY;
	for ( var i = scene.children.length - 1; i >= 0 ; i -- ) {
	
		var obj = scene.children[ i ];
		if ( obj !== camera) {
			for( var j = 0; j < obj.geometry.vertices.length; j++ ) {
				if(inBox(startX, startY, endX, endY, obj.geometry.vertices[j])) {
					selectedVertices.push(obj.geometry.vertices[j]);
				}
			}
		}
	}
	//console.log(selectedVertices[0]);
	//console.log(selectedVertices[1]);
	//highlightVertices();
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
		console.log("fuck me five ways till friday");
	}
}

function init()
{
	//scene initialization code goes here
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;


	var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff} );
	material.emissive.setHex(0xff0000);
	
	distanceX = 500;
	distanceY = 0;
	distanceZ = 0;
	for(var i = 0; i < geometry.vertices.length; i++) {
		geometry.vertices[i].x += distanceX;
		geometry.vertices[i].y += distanceY;
		geometry.vertices[i].z += distanceZ;
	}
	
	geometry.verticesNeedUpdate = true;
	var object = new THREE.Mesh( geometry, material );
	scene.add( object );


	raycaster = new THREE.Raycaster();
	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

}

function render()
{
	raycaster.setFromCamera(mouse, camera);
	requestAnimationFrame( render );
	addEventListener('mousemove', onMouseMove, false);
	addEventListener('mousedown', onMouseDown, false);
	addEventListener('mouseup', onMouseUp, false);
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
	 
	geo.vertices.push(new THREE.Vector3(startX, startY, 0));
	geo.vertices.push(new THREE.Vector3(startX, pos.y, 0));
	geo.vertices.push(new THREE.Vector3(pos.x, pos.y, 0));
	geo.vertices.push(new THREE.Vector3(pos.x, startY, 0));
	geo.vertices.push(new THREE.Vector3(startX, startY, 0));
	
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

//select vertices with arrow keys
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
	particles = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 20
    });
	for(var i = 0; i < selectedVertices.length; i++ ) {
		
	}
	
}
