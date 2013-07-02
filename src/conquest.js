var CONQUEST = {};

CONQUEST.main = function () {
	CONQUEST.textures = {};
	CONQUEST.textures.spritesheet = new Image();
	CONQUEST.textures.spritesheet.src = 'res/textures/spritesheet.png';

	// TODO: Create Sprite class with render method.
	CONQUEST.Tree.prototype.sprite = { sheet: CONQUEST.textures.spritesheet, x: 32, y: 0, w: 32, h: 32 };
	CONQUEST.Barrel.prototype.sprite = { sheet: CONQUEST.textures.spritesheet, x: 64, y: 0, w: 32, h: 32 };

	CONQUEST.textures.testmap = new Image();
	CONQUEST.textures.testmap.src = 'res/textures/testmap.png';


	var game = {};

	game.currentScene = new CONQUEST.Scene();
	game.currentGUI = new CONQUEST.GUIMainMenu(game);

	var canvas = document.getElementById('canvas');

	canvas.addEventListener('mousedown', function (event) {
		game.currentGUI.mouseDown(event.offsetX||event.layerX||0, event.offsetY||event.layerY||0, event) ||
			game.currentScene.mouseDown(event.offsetX||event.layerX||0, event.offsetY||event.layerY||0, event);
	}, false);
	canvas.addEventListener('mousemove', function (event) {
		game.currentGUI.mouseMove(event.offsetX||event.layerX||0, event.offsetY||event.layerY||0) ||
			game.currentScene.mouseMove(event.offsetX||event.layerX||0, event.offsetY||event.layerY||0);
	}, false);
	canvas.addEventListener('mouseup', function (event) {
		game.currentGUI.mouseUp(event.offsetX||event.layerX||0, event.offsetY||event.layerY||0, event) ||
			game.currentScene.mouseUp(event.offsetX||event.layerX||0, event.offsetY||event.layerY||0, event);
	}, false);
	document.body.addEventListener('keydown', function (event) {
		game.currentGUI.keyDown(event.keyCode) ||
			game.currentScene.keyDown(event.keyCode);
	});
	document.body.addEventListener('keyup', function (event) {
		game.currentGUI.keyUp(event.keyCode) ||
			game.currentScene.keyUp(event.keyCode);
	});


	const TICK_INTERVAL_MS = 1000.0/60.0;

	function tick () {
		// FIXME: Chrome throttles the interval down to 1s on inactive tabs.
		setTimeout(tick, TICK_INTERVAL_MS);
		
		game.currentScene.tick();
	}

	var ctx = canvas.getContext('2d');

	function render () {
		requestAnimFrame(render);

		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		game.currentScene.render(ctx);
		game.currentGUI.render(ctx);
	}

	setTimeout(tick, TICK_INTERVAL_MS);

	window.requestAnimFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback){
				window.setTimeout(callback, 1000/60);
			};
	requestAnimFrame(render);
};