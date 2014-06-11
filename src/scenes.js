CONQUEST.Scene = function() {
	this.entityManager = new CONQUEST.EntityManager(this);
};

CONQUEST.Scene.prototype.add = function (entity) {
	this.entityManager.add(entity);
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

	// NOTE: Hardcoded canvas dimensions here.
	this.transform = new Transform().translate(-400, -225).scale(1, 0.5).translate(400, 225);

	this.player = {
		selectedBuilding: null,
		mouseX: 0,
		mouseY: 0,
		mouseWorldX: 0,
		mouseWorldY: 0,
		mouseDown: false
	};

	this.camera = {
		x: 0,
		y: 0,
		pitch: 0,
		yaw: 0,
		w: false,
		a: false,
		s: false,
		d: false,
		applyTransform: function (ctx) {
			ctx.translate(-this.x, -this.y);
		},
		worldToScreen: function (vec) {
			// NOTE: Hardcoded canvas dimensions here.
			return new Vec2().copy(vec).translate(-400, -225).rotate(-this.yaw).scale(1, this.pitch*0.5).translate(400, 225);
		},
		screenToWorld: function (vec) {
			// NOTE: Hardcoded canvas dimensions here.
			return new Vec2().copy(vec).translate(this.x-400, this.y-225).scale(1, (1/this.pitch)*2).rotate(this.yaw).translate(400, 225);
		}
	};

	this.terrain = new CONQUEST.Terrain(this, CONQUEST.textures.testmap);
	this.player.mouseWorldXMax = this.terrain.tiles.length*this.terrain.tileSize;
	this.player.mouseWorldYMax = this.terrain.tiles[0].length*this.terrain.tileSize;
	this.add(this.terrain);
};

CONQUEST.SceneCVC.prototype = Object.create(CONQUEST.Scene.prototype);
CONQUEST.SceneCVC.prototype.superClass = CONQUEST.Scene.prototype;

CONQUEST.SceneCVC.prototype.mouseDown = function (x, y, event) {
	this.player.mouseDown = true;
	if (this.player.selectedBuilding) {
		var worldPos = new Transform(this.transform.m.slice(0)).invert().applyToCoords(x, y);
		this.add(new this.player.selectedBuilding(this, worldPos[0], worldPos[1]));
		if (!event.shiftKey)
			this.player.selectedBuilding = null;
	}
};

CONQUEST.SceneCVC.prototype.mouseMove = function (x, y, event) {
	// NOTE: Hardcoded canvas dimensions here.
	this.player.mouseX = x;
	this.player.mouseY = y;
	this.player.mouseWorldX = x+this.camera.x;
	this.player.mouseWorldY = y+this.camera.y;
	if (this.player.mouseDown && !this.player.selectedBuilding) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		// NOTE: Hardcoded canvas dimensions here.
		this.transform.translate(-400, -225).scale(1, 1/(0.5*this.camera.pitch+0.5)).rotate(this.camera.yaw);

		this.camera.yaw += movementX/100;
		this.camera.pitch += movementY/100;
		this.camera.pitch = this.camera.pitch.clamp(0, 1);

		this.transform.rotate(-this.camera.yaw).scale(1, 0.5*this.camera.pitch+0.5).translate(400, 225);
	}
};

CONQUEST.SceneCVC.prototype.mouseUp = function (x, y, event) {
	this.player.mouseDown = false;
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

CONQUEST.SceneCVC.prototype.keyUp = function (code) {
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

	this.transform.translate(this.camera.x, this.camera.y);

	var camSpeed = 4; // Pixels per tick.
	if (this.camera.w) this.camera.y -= camSpeed;
	if (this.camera.a) this.camera.x -= camSpeed;
	if (this.camera.s) this.camera.y += camSpeed;
	if (this.camera.d) this.camera.x += camSpeed;

	if (this.camera.w || this.camera.a || this.camera.s || this.camera.d) {
		this.player.mouseWorldX = this.player.mouseX+this.camera.x;
		this.player.mouseWorldY = this.player.mouseY+this.camera.y;
	}

	this.transform.translate(-this.camera.x, -this.camera.y);
};

CONQUEST.SceneCVC.prototype.render = function (ctx) {
	ctx.save();
	//this.camera.applyTransform(ctx);

	this.superClass.render.call(this, ctx);

	ctx.restore();
};