Number.prototype.clamp = function (min, max) {
	return this<min?min:this>max?max:this;
};

Vec2 = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Vec2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
};

Vec2.prototype.copy = function(vec) {
	this.x = vec.x;
	this.y = vec.y;
	return this;
};

Vec2.prototype.translate = function(x, y) {
	this.x += x;
	this.y += y;
	return this;
};

Vec2.prototype.scale = function(x, y) {
	this.x *= x;
	this.y *= y;
	return this;
};

Vec2.prototype.rotate = function(rads) {
	var c = Math.cos(rads);
	var s = Math.sin(rads);
	this.set(c*this.x-s*this.y, s*this.x+c*this.y);
	return this;
};

Vec2.prototype.normalize = function() {
	var mag = Math.sqrt(this.x*this.x + this.y*this.y);
	if (mag > 0) {
		this.x /= mag;
		this.y /= mag;
	}
	return this;
};


Transform = function (matrix) {
	/*
	* 0 2 4
	* 1 3 5
	* x x x
	*/
	this.m = matrix || [ 1, 0, 0, 1, 0, 0 ];
};

Transform.prototype.reset = function() {
	for (var i = this.m.length - 1; i >= 0; i--)
		this.m[i] = 0;
	this.m[0] = this.m[3] = 1;
	return this;
};

Transform.prototype.translate = function(x, y) {
	this.m[4] += x;
	this.m[5] += y;
	return this;
};

Transform.prototype.scale = function(x, y) {
	this.m[0] *= x;
	this.m[2] *= x;
	this.m[4] *= x;
	this.m[1] *= y;
	this.m[3] *= y;
	this.m[5] *= y;
	return this;
};

Transform.prototype.rotate = function(rads) {
	var c = Math.cos(rads);
	var s = Math.sin(rads);
	var m0 = c*this.m[0] - s*this.m[1];
	var m2 = c*this.m[2] - s*this.m[3];
	var m4 = c*this.m[4] - s*this.m[5];
	var m1 = s*this.m[0] + c*this.m[1];
	var m3 = s*this.m[2] + c*this.m[3];
	var m5 = s*this.m[4] + c*this.m[5];
	this.m[0] = m0;
	this.m[1] = m1;
	this.m[2] = m2;
	this.m[3] = m3;
	this.m[4] = m4;
	this.m[5] = m5;
	return this;
};

Transform.prototype.invert = function() {
	var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
	var m0 = d * this.m[3];
	var m1 = -d * this.m[1];
	var m2 = -d * this.m[2];
	var m3 = d * this.m[0];
	var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
	var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
	this.m[0] = m0;
	this.m[1] = m1;
	this.m[2] = m2;
	this.m[3] = m3;
	this.m[4] = m4;
	this.m[5] = m5;
	return this;
};

Transform.prototype.applyToCoords = function(x, y) {
	return [this.m[0]*x + this.m[2]*y + this.m[4], this.m[1]*x + this.m[3]*y + this.m[5]];
};

Transform.prototype.applyToContext = function(ctx) {
	CanvasRenderingContext2D.prototype.transform.apply(ctx, this.m);
};