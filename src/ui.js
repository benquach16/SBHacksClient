var configText = function()
{
	this.message = "blowjobs";
}

function createUI()
{
	var gui = new dat.GUI();
	var gui2 = new dat.GUI();
	var text = new configText();
	gui.add(text,'message');
	gui2.add(text,'message');
}


