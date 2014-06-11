CONQUEST.EntityManager = function (scene) {
	this.scene = scene;

	this.tickQueue = new List();
	this.renderQueue = new List();
	this.tangibleList = new List();
};

CONQUEST.EntityManager.prototype.add = function (entity) {
	('tick' in entity) && this.tickQueue.add(entity);
	('render' in entity) && this.renderQueue.add(entity);
	entity.radius && this.tangibleList.push(entity);
};

CONQUEST.EntityManager.prototype.tick = function (delta) {
	for (var i = 0, size = this.tickQueue.size; i < size; i++) {
		var entity = this.tickQueue.poll();
		entity.tick(delta) && this.tickQueue.add(entity);
	}

	for (var node = this.renderQueue.head; node; node = node.next) {
		var entity = node.e;
		var coordsRot = this.scene.transform.applyToCoords(entity.x, entity.y);
		entity.xr = coordsRot[0];
		entity.yr = coordsRot[1];
	}

	var sorted;
	while (!sorted) {
		sorted = true;
		var temp;
		for (var node = this.renderQueue.head; node && node.next; node = node.next) {
			if (node.e.yr>node.next.e.yr) {
				sorted = false;
				temp = node.e;
				node.e = node.next.e;
				node.next.e = temp;
			}
		}
	}
};

CONQUEST.EntityManager.prototype.render = function (ctx) {
	for (var i = 0, size = this.renderQueue.size; i < size; i++) {
		var entity = this.renderQueue.poll();
		// TODO: Consider transforming entities before rendering (scene graph).
		entity.render(ctx) && this.renderQueue.add(entity);
	}
};


CONQUEST.EntityManager.prototype.entityAt = function (x, y) {
	for (var node = this.tangibleList.head; node; node = node.next) {
		//if node.e.contains(x, y);
	}
};




CONQUEST.Entity = function (scene, x, y, w, h) {
	this.scene = scene;
	this.x = x;
	this.y = y;
	this.w = w || 32;
	this.h = h || 32;
};

/*
CONQUEST.Entity.prototype.tick = function(delta) {

};
*/

CONQUEST.Entity.prototype.render = function(ctx) {
	if (CONQUEST.DEBUG && this.radius) {
		ctx.save();
		this.scene.transform.applyToContext(ctx);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'red';
		ctx.stroke();
		ctx.restore();
	}
	if (this.sprite) {
		ctx.drawImage(this.sprite.sheet, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, this.xr-(this.w>>1), this.yr-this.h, this.w, this.h);
		return true;
	}
	return false;
};

CONQUEST.Entity.prototype.collidesWith = function(x, y, r) {
	if (!('radius' in this))
		return false;

	var xd = Math.abs(this.x - x);
	var yd = Math.abs(this.y - y);
	var rs = this.radius + r;
	if (xd >= rs || yd >= rs)
		return false;

	return xd*xd + yd*yd < rs;
};

CONQUEST.Terrain = function (scene, tileMap) {
	CONQUEST.Entity.call(this, scene);

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

CONQUEST.Terrain.prototype = Object.create(CONQUEST.Entity.prototype);

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
	this.scene.transform.applyToContext(ctx);

	for (var x = 0, cols = this.tiles.length; x < cols; x++) {
		for (var y = 0, rows = this.tiles[x].length; y < rows; y++) {
			ctx.fillStyle = 'rgb('+this.tiles[x][y].join(', ')+')';
			ctx.fillRect(x*this.tileSize-1, y*this.tileSize-1, this.tileSize+2, this.tileSize+2);
		}
	}
	ctx.restore();
	return true;
};


CONQUEST.Tree = function (scene, x, y) {
	CONQUEST.Entity.call(this, scene, x, y);
};

CONQUEST.Tree.prototype = Object.create(CONQUEST.Entity.prototype);


CONQUEST.Barrel = function (scene, x, y) {
	CONQUEST.Entity.call(this, scene, x, y);
};

CONQUEST.Barrel.prototype = Object.create(CONQUEST.Entity.prototype);


CONQUEST.Settler = function (scene, x, y) {
	CONQUEST.Entity.call(this, scene, x, y, 16, 16);

	this.dir = new Vec2(Math.random()*2 - 1, Math.random()*2 - 1).normalize().scale(0.1, 0.1);
};

CONQUEST.Settler.prototype = Object.create(CONQUEST.Entity.prototype);

CONQUEST.Settler.prototype.tick = function(delta) {
	var deltaDir = 0.1*(Math.random()*2 - 1);
	this.dir.rotate(deltaDir);
	this.x += this.dir.x;
	this.y += this.dir.y;
	return true;
};


CONQUEST.House = function (scene, x, y) {
	CONQUEST.Entity.call(this, scene, x, y);
};

CONQUEST.House.prototype = Object.create(CONQUEST.Entity.prototype);

CONQUEST.House.prototype.tick = function(delta) {
	if (!this.hi) {
		this.scene.add(new CONQUEST.Settler(this.scene, this.x, this.y));
		this.hi = true;
	}
	return true;
};