var scene, camera, renderer;
var geometry, material, mesh;
var raycaster;
var mouse;

init();
render();
onMouseMove(event);

function onMouseMove( event )
{
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
}

function onMouseDown( event )
{
	var intersects = raycaster.intersectObjects(scene.children);
	for( var i in intersects)
	{
		if(intersects.length > 0)
		{

		}
	}	
}

function init()
{
	//scene initialization code goes here
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	geometry = new THREE.BoxGeometry( 200, 200, 200 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000} );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

}


function render()
{
	raycaster.setFromCamera(mouse, camera);
	requestAnimationFrame( render );
	addEventListener('mousemove', onMouseMove, false);
	addEventListener('mousedown', onMouseDown, false);
	var intersects = raycaster.intersectObjects(scene.children);
	for( var i = 0 ; i < intersects.length; i ++)
	{

	}
	renderer.render( scene, camera );
}
