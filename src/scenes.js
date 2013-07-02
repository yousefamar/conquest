CONQUEST.Scene = function() {
	this.entityManager = new CONQUEST.EntityManager(this);
};

CONQUEST.Scene.prototype.add = function (entity) {
	('tick' in entity) && this.entityManager.tickQueue.add(entity);
	('render' in entity) && this.entityManager.renderQueue.add(entity);
};

CONQUEST.Scene.prototype.mouseDown = function (x, y, event) {
};

CONQUEST.Scene.prototype.mouseMove = function (x, y) {
};

CONQUEST.Scene.prototype.mouseUp = function (x, y, event) {
};

CONQUEST.Scene.prototype.keyDown = function (code) {
};

CONQUEST.Scene.prototype.keyUp = function (code) {
};

CONQUEST.Scene.prototype.tick = function (delta) {
	this.entityManager.tick(delta);
};

CONQUEST.Scene.prototype.render = function (ctx) {
	this.entityManager.render(ctx);
};


CONQUEST.SceneCVC = function() {
	CONQUEST.Scene.call(this);

	this.player = {
		selectedBuilding: null,
		mouseX: 0,
		mouseY: 0,
		mouseWorldX: 0,
		mouseWorldY: 0
	};

	this.camera = {
		x: 0,
		y: 0,
		w: false,
		a: false,
		s: false,
		d: false
	};

	this.terrain = new CONQUEST.Terrain(this, CONQUEST.textures.testmap);
	this.player.mouseWorldXMax = this.terrain.tiles.length*this.terrain.tileSize;
	this.player.mouseWorldYMax = this.terrain.tiles[0].length*this.terrain.tileSize;
	this.add(this.terrain);
};

CONQUEST.SceneCVC.prototype = Object.create(CONQUEST.Scene.prototype);
CONQUEST.SceneCVC.prototype.superClass = CONQUEST.Scene.prototype;

CONQUEST.SceneCVC.prototype.tileAtMouse = function () {
	return [((this.player.mouseWorldX/this.terrain.tileSize)>>0), ((this.player.mouseWorldY/this.terrain.tileSize)>>0)];
};

CONQUEST.SceneCVC.prototype.mouseDown = function (x, y, event) {
	if (this.player.selectedBuilding) {
		if (!this.terrain.colAt(this.player.mouseWorldX, this.player.mouseWorldY))
			return;
		var tileSize = this.terrain.tileSize;
		var tileCoords = this.tileAtMouse();
		x = tileCoords[0];
		y = tileCoords[1];
		this.terrain.colMap[x][y] = 0;
		this.add(new this.player.selectedBuilding(x*tileSize, y*tileSize, this));
		if (!event.shiftKey)
			this.player.selectedBuilding = null;
	}
};

CONQUEST.SceneCVC.prototype.mouseMove = function (x, y) {
	// NOTE: Hardcoded canvas dimensions here.
	this.player.mouseX = x;
	this.player.mouseY = y;
	this.player.mouseWorldX = x+this.camera.x;
	this.player.mouseWorldY = y+this.camera.y;
};

CONQUEST.SceneCVC.prototype.keyDown = function (code) {
	if (code === 65)
		this.camera.a = true;
	else if (code === 68)
		this.camera.d = true;
	else if (code === 87)
		this.camera.w = true;
	else if (code === 83)
		this.camera.s = true;
};

CONQUEST.Scene.prototype.keyUp = function (code) {
	if (code === 65)
		this.camera.a = false;
	else if (code === 68)
		this.camera.d = false;
	else if (code === 87)
		this.camera.w = false;
	else if (code === 83)
		this.camera.s = false;
};

CONQUEST.SceneCVC.prototype.tick = function (delta) {
	this.superClass.tick.call(this, delta);

	var camSpeed = 4; // Pixels per tick.
	if (this.camera.w) this.camera.y -= camSpeed;
	if (this.camera.a) this.camera.x -= camSpeed;
	if (this.camera.s) this.camera.y += camSpeed;
	if (this.camera.d) this.camera.x += camSpeed;

	if (this.camera.w || this.camera.a || this.camera.s || this.camera.d) {
		// NOTE: Hardcoded canvas dimensions here.
		this.camera.x = this.camera.x.clamp(0, this.terrain.tiles.length*this.terrain.tileSize-800);
		this.camera.y = this.camera.y.clamp(0, this.terrain.tiles[0].length*this.terrain.tileSize-450+80);
		this.player.mouseWorldX = this.player.mouseX+this.camera.x;
		this.player.mouseWorldY = this.player.mouseY+this.camera.y;
	}
};

CONQUEST.SceneCVC.prototype.render = function (ctx) {
	ctx.save();
	ctx.translate(-this.camera.x, -this.camera.y);

	this.superClass.render.call(this, ctx);

	if (this.player.selectedBuilding) {
		var sprite = this.player.selectedBuilding.prototype.sprite;
		var tileSize = this.terrain.tileSize;
		ctx.globalAlpha = 0.6;
		ctx.drawImage(sprite.sheet, sprite.x, sprite.y, sprite.w, sprite.h, ((this.player.mouseWorldX/tileSize)>>0)*tileSize, ((this.player.mouseWorldY/tileSize)>>0)*tileSize, 32, 32);
	}

	ctx.restore();
};