var scene, camera, renderer;
var geometry, material, mesh;


init();
render();
function init()
{
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	geometry = new THREE.BoxGeometry( 200, 200, 200 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
	//wireframe for testing
    material.wireframe = true;
	
	//move vertices
	move(0,500,0);
	
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

}

function render()
{
	requestAnimationFrame( render );

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