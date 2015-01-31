function controlsText()
{
	this.createBox = function(){};
	this.createCylinder = function(){};
}

function createUI()
{
	this.controlsPanel = new dat.GUI();
	var text = new controlsText();
	this.controlsPanel.add(text, 'createBox');
	this.controlsPanel.add(text, 'createCylinder');
}


