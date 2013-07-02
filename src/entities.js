CONQUEST.EntityManager = function (scene) {
	this.scene = scene;

	this.tickQueue = new List();
	this.renderQueue = new List();
	//this.physicsSim = new CONQUEST.Simulator();
};

CONQUEST.EntityManager.prototype.tick = function (delta) {
	for (var i = 0, size = this.tickQueue.size; i < size; i++) {
		var entity = this.tickQueue.poll();
		entity.tick(delta) && this.tickQueue.add(entity);
	}

	//this.physicsSim.simulate(delta);
};

CONQUEST.EntityManager.prototype.render = function (ctx) {
	for (var i = 0, size = this.renderQueue.size; i < size; i++) {
		var entity = this.renderQueue.poll();
		// TODO: Consider transforming entities before rendering (scene graph).
		entity.render(ctx) && this.renderQueue.add(entity);
	}
};


// TODO: Consider generalising.
/* Entity Template */
CONQUEST.Entity = function (scene) {
	
};

CONQUEST.Entity.prototype.init = function() {

};

CONQUEST.Entity.prototype.tick = function(delta) {

};

CONQUEST.Entity.prototype.render = function(ctx) {

};


CONQUEST.Terrain = function (scene, tileMap) {
	this.scene = scene;

	this.tiles = [];
	this.colMap = [];
	var tileImage = new BufferedImage(tileMap);
	for (var x = 0, cols = tileMap.width; x < cols; x++) {
		this.tiles[x] = [];
		this.colMap[x] = [];
		for (var y = 0, rows = tileMap.height; y < rows; y++) {
			this.tiles[x][y] = tileImage.getPixel(x, y).slice(0, 3);
			this.colMap[x][y] = tileImage.getPixel(x, y)[3];
		}
	}
};

CONQUEST.Terrain.prototype.tileSize = 32;

CONQUEST.Terrain.prototype.tileAt = function (x, y) {
	x = (x/this.tileSize)>>0;
	y = (y/this.tileSize)>>0;
	return this.tiles[x][y];
};

CONQUEST.Terrain.prototype.colAt = function (x, y) {
	x = (x/this.tileSize)>>0;
	y = (y/this.tileSize)>>0;
	return this.colMap[x][y];
};

/*
CONQUEST.Terrain.prototype.tick = function (delta) {

};
*/

CONQUEST.Terrain.prototype.render = function (ctx) {
	ctx.save();
	//ctx.scale(1, 0.5);
	for (var x = 0, cols = this.tiles.length; x < cols; x++) {
		for (var y = 0, rows = this.tiles[x].length; y < rows; y++) {
			ctx.fillStyle = 'rgb('+this.tiles[x][y].join(', ')+')';
			ctx.fillRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
		}
	}
	ctx.restore();
	return true;
};


CONQUEST.Tree = function (x, y, scene) {
	this.x = x;
	this.y = y;
	this.scene = scene;
};

CONQUEST.Tree.prototype.render = function(ctx) {
	ctx.drawImage(this.sprite.sheet, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, this.x, this.y, 32, 32);
	return true;
};


CONQUEST.Barrel = function (x, y, scene) {
	this.x = x;
	this.y = y;
	this.scene = scene;
};

CONQUEST.Barrel.prototype.render = function(ctx) {
	ctx.drawImage(this.sprite.sheet, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, this.x, this.y, 32, 32);
	return true;
};