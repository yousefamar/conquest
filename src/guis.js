CONQUEST.GUIMainMenu = function (game) {
	GUIElement.call(this);

	this.game = game;

	var x = (this.width - 150)/2;
	this.children.push(new CONQUEST.GUIButton(x, 120, 150, 27, this, 0, 'Single Player'));
	this.children.push(new CONQUEST.GUIButton(x, 170, 150, 27, this, 1, 'Join'));
	this.children.push(new CONQUEST.GUIButton(x, 220, 150, 27, this, 2, 'Host'));
	this.children.push(new CONQUEST.GUIButton(x, 270, 150, 27, this, 3, 'Options'));
	this.children.push(new CONQUEST.GUIButton(x, 320, 150, 27, this, 4, 'Bla'));
};

CONQUEST.GUIMainMenu.prototype = Object.create(GUIElement.prototype);

CONQUEST.GUIMainMenu.prototype.elementClicked = function (element) {
	switch (element.id) {
	case 0:
		this.game.currentScene = new CONQUEST.SceneCVC();
		this.game.currentGUI = new CONQUEST.GUICommander(this.game.currentScene);
		break;
	case 1:
		break;
	case 2:
		break;
	case 3:
		break;
	case 4:
		break;
	default:
		break;
	}
};


CONQUEST.GUICommander = function (scene) {
	GUIElement.call(this);

	this.scene = scene;

	this.children.push(new CONQUEST.GUIMinimap(0, this.height-80, 99, 79, this, scene));
	this.children.push(new CONQUEST.GUIBuildBar(99, this.height-80, this.width-100, 79, this, scene));
};

CONQUEST.GUICommander.prototype = Object.create(GUIElement.prototype);


CONQUEST.GUIMinimap = function (x, y, width, height, parent, scene) {
	GUIElement.call(this, x, y, width, height, parent);

	this.scene = scene;
	this.tiles = scene.terrain.tiles;
};

CONQUEST.GUIMinimap.prototype = Object.create(GUIElement.prototype);

CONQUEST.GUIMinimap.prototype.render = function (ctx) {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, this.width, this.height);

	for (var x = 0, cols = this.tiles.length; x < cols; x++) {
		for (var y = 0, rows = this.tiles[x].length; y < rows; y++) {
			ctx.fillStyle = 'rgb('+this.tiles[x][y].join(', ')+')';
			ctx.fillRect(x*2+1, y*2+1, 2, 2);
		}
	}

	ctx.strokeStyle = 'white';
	ctx.strokeRect(0.5, 0.5, this.width, this.height);
};


CONQUEST.GUIBuildBar = function (x, y, width, height, parent, scene) {
	GUIElement.call(this, x, y, width, height, parent);

	this.scene = scene;
	
	this.children.push(new CONQUEST.GUIBuildButton(20, 20, 39, 39, this, scene, CONQUEST.Tree));
	this.children.push(new CONQUEST.GUIBuildButton(80, 20, 39, 39, this, scene, CONQUEST.Barrel));
	this.children.push(new CONQUEST.GUIBuildButton(140, 20, 39, 39, this, scene, CONQUEST.House));
};

CONQUEST.GUIBuildBar.prototype = Object.create(GUIElement.prototype);
CONQUEST.GUIBuildBar.prototype.superClass = GUIElement.prototype;

CONQUEST.GUIBuildBar.prototype.mouseDown = function (button, x, y) {
	if(!this.superClass.mouseDown.call(this, button, x, y))
		this.scene.player.selectedBuilding = null;
	return true;
};

CONQUEST.GUIBuildBar.prototype.mouseMove = function (x, y) {
	this.mouseX = x;
	this.mouseY = y;
	this.superClass.mouseMove.call(this, x, y);
};

CONQUEST.GUIBuildBar.prototype.render = function (ctx) {
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.strokeStyle = '#DDDDDD';
	ctx.strokeRect(0.5, 0.5, this.width, this.height);
	
	this.superClass.render.call(this, ctx);

	if (this.scene.player.selectedBuilding) {
		var sprite = this.scene.player.selectedBuilding.prototype.sprite;
		ctx.globalAlpha = 0.6;
		ctx.drawImage(sprite.sheet, sprite.x, sprite.y, sprite.w, sprite.h, this.mouseX-this.x-16, this.mouseY-this.y-32, 32, 32);
	}
};


CONQUEST.GUIBuildButton = function (x, y, width, height, parent, scene, building) {
	GUIElement.call(this, x, y, width, height, parent);
	this.scene = scene;
	this.building = building;
};

CONQUEST.GUIBuildButton.prototype = Object.create(GUIElement.prototype);

CONQUEST.GUIBuildButton.prototype.mouseDown = function (button, x, y) {
	this.scene.player.selectedBuilding = this.building;
	return true;
};

CONQUEST.GUIBuildButton.prototype.render = function (ctx) {
	ctx.fillStyle = this.mouseOver?'#AAAAAA':'#555555';
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.strokeStyle = '#DDDDDD';
	ctx.strokeRect(0.5, 0.5, this.width, this.height);

	var sprite = this.building.prototype.sprite;
	ctx.drawImage(sprite.sheet, sprite.x, sprite.y, sprite.w, sprite.h, 4, 4, 32, 32);

	/*
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText(this.building, this.width/2, this.height/2);
	*/
};


CONQUEST.GUIButton = function (x, y, width, height, parent, id, text) {
	GUIElement.call(this, x, y, width, height, parent);
	this.id = id;
	this.text = text;
};

CONQUEST.GUIButton.prototype = Object.create(GUIElement.prototype);


CONQUEST.GUIButton.prototype.mouseDown = function (button, x, y) {
	this.parent.elementClicked(this);
	return true;
};

CONQUEST.GUIButton.prototype.render = function (ctx) {
	ctx.fillStyle = this.mouseOver?'#AAAAAA':'#555555';
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.strokeStyle = '#DDDDDD';
	ctx.strokeRect(0, 0, this.width, this.height);

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText(this.text, this.width/2, this.height/2);
};