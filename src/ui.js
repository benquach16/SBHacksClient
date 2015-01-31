

function cubePanel()
{
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.SizeX = 200;
	this.SizeY = 200;
	this.SizeZ = 200;
	this.Create = function(){ createBox (this.X,this.Y,this.Z,this.SizeX,this.SizeY,this.SizeZ)};
}


function cylinderPanel()
{
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.SizeX = 0;
	this.SizeY = 0;
	this.SizeZ = 0;
	this.Create = function(){};
}

function viewPanel()
{
}

function createUI()
{
	this.controlsPanel = new dat.GUI();

	//this.viewsPanel = new dat.GUI();
	var ctext = new cubePanel();
	var cube = this.controlsPanel.addFolder('Create Cube');
	cube.add(ctext,'X');
	cube.add(ctext,'Y');
	cube.add(ctext,'Z');
	cube.add(ctext,'SizeX');
	cube.add(ctext,'SizeY');
	cube.add(ctext,'SizeZ');
	cube.add(ctext,'Create');
	var cylinder = this.controlsPanel.addFolder('Create Cylinder');
	var cyltext = new cylinderPanel();
	cylinder.add(cyltext,'X');
	cylinder.add(cyltext,'Y');
	cylinder.add(cyltext,'Z');
	cylinder.add(cyltext,'SizeX');
	cylinder.add(cyltext,'SizeY');
	cylinder.add(cyltext,'SizeZ');
	cylinder.add(cyltext,'Create');
}


