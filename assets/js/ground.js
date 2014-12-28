var Sprite = require('./base/sprite');
var asset_loader = require('./asset_loader');

function Ground() {
	var CELL_WIDTH = 120;
	var CELL_HEIGHT = 120;
	var MAP = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];
	var ROWS = MAP.length;
	var COLUMNS = MAP[0].length;

	// offscreen canvas below to make main canvas draving glitch free
	var canvas = document.createElement('canvas');
	canvas.width = CELL_WIDTH * MAP[0].length;
	canvas.height = CELL_HEIGHT * MAP.length;
	var ctx = canvas.getContext('2d');	

	for(var row = 0; row < ROWS; row++) {
		for(var column = 0; column < COLUMNS; column++) {
			ctx.drawImage(
				asset_loader.getImgFromCache('tiles.jpg'),
				0, 0, CELL_WIDTH, CELL_HEIGHT,
				CELL_WIDTH * row, CELL_HEIGHT * column, CELL_WIDTH, CELL_HEIGHT
			);
		}
	}

	Sprite.call(this, canvas, {
		sw: canvas.width,
		sh: canvas.height,
		dw: canvas.width,
		dh: canvas.height
	});
}

Ground.prototype = Object.create(Sprite.prototype);
Ground.prototype.constructor = Ground;
module.exports = Ground;
