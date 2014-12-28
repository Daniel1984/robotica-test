(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {

	success_count: 0,
	error_count: 0,

	doneLoading: function(asset_count) {
		return asset_count === this.success_count + this.error_count;
	},

	load: function(assets, cb) {
		window.robotica_img_cache = window.robotica_img_cache || {};
		var _this = this;
		var asset_length = assets.length;

		assets.forEach(function(src) {
			var img = new Image();

			img.addEventListener('load', function() {
				_this.success_count += 1;
				// store image in global robotica_img_cache for later use
				robotica_img_cache[src] = this;
				if(_this.doneLoading(asset_length)) cb();
			}, false);

			img.addEventListener('error', function() {
				console.warn('Unabe to load ' + src);
				_this.error_count += 1;
				if(_this.doneLoading(asset_length)) cb();
			}, false);

			img.src = '/img/' + src;
		});
	},

	getImgFromCache: function(src) {
		// src must be name of image: loading.gif
		if(src in robotica_img_cache) {
			return robotica_img_cache[src];
		} else {
			console.warn('No ' + src + ' image found in cache');
		}
	}

};

},{}],2:[function(require,module,exports){
function Sprite(texture, opt) {
	opt = opt || {};
	this.texture = texture;
	this.x = opt.x || 0;
	this.y = opt.y || 0;
	this.width = this.texture.width;
	this.height = this.texture.width; 
	this.alpha = 1;
	
	// s and d below refer to source and destination
	// w and h as short for width and height	
	this.sx = opt.sx || 0;
	this.sy = opt.sy || 0;
	this.dx = opt.dx || 0;
	this.dy = opt.dy || 0;

	this.sw = opt.sw || 120;
	this.sh = opt.sh || 120;
	this.dw = opt.dw || 120;
	this.dh = opt.dh || 120;


	this.ticks_count = 0;
	this.ticks_per_frame = opt.ticks_per_frame || 4;
	this.current_frame = 0;
	this.num_frames = opt.num_frames || 3;
}

Sprite.prototype.animateFrames = function() {
	this.ticks_count += 1;
	if(this.ticks_count > this.ticks_per_frame) {
		this.ticks_count = 0;
		this.sx = this.sw * this.current_frame;
		this.current_frame += 1;
		if(this.current_frame > this.num_frames) this.current_frame = 0;
	}
};

Sprite.prototype.update = function() {

};


module.exports = Sprite;

},{}],3:[function(require,module,exports){
module.exports = function(robot) {
	window.addEventListener('keydown', keyDownHandler, false);
	
	// added these just for being able to control robot with keyboard
	
	function keyDownHandler(e) {
		if(e.keyCode == 65 || e.keyCode == 37) {
			robot.move('west');
		} else if(e.keyCode == 87 || e.keyCode == 38) {
			robot.move('north');
		} else if(e.keyCode == 39 || e.keyCode == 68) {
			robot.move('east');
		} else if(e.keyCode == 40 || e.keyCode == 83) {
			robot.move('south');
		}
	}
};

},{}],4:[function(require,module,exports){
require('./utils/animation_frame_shim');

var asset_loader = require('./asset_loader');
var Ground = require('./ground');
var Robot = require('./robot');

var canvas, ctx, children = [];

window.onload = function() {
	asset_loader.load(['tiles.jpg', 'robot_1.png'], onDoneLoadingAssets);

	function onDoneLoadingAssets() {	
		removeLoader();
		addMenu();
		initCanvas();
		addGameElements();
		animate();	
	}
	
	function removeLoader() {
		document.body.removeChild(document.querySelector('.loading'));	
	}
	
	function addMenu() {
		document.querySelector('.game-controls').style.visibility = 'visible';
	}

	function initCanvas() {
		canvas = document.createElement('canvas');
		canvas.width = 600;
		canvas.height = 600;
		ctx = canvas.getContext('2d');
		document.body.appendChild(canvas);
	}

	function addGameElements() {
		children.push(new Ground());
		children.push(new Robot());
	}

	function animate() {
		requestAnimFrame(animate);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < children.length; i++) {
			var el = children[i];
			el.update();
			ctx.globalAlpha = el.alpha;
			ctx.drawImage(/*draving element*/ el.texture,
				/*source*/ el.sx, el.sy, el.sw, el.sh,
				/*destination*/ el.dx, el.dy, el.dw, el.dh 
			);
		}
	}

};

},{"./asset_loader":1,"./ground":5,"./robot":6,"./utils/animation_frame_shim":8}],5:[function(require,module,exports){
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

},{"./asset_loader":1,"./base/sprite":2}],6:[function(require,module,exports){
var Sprite = require('./base/sprite');
var asset_loader = require('./asset_loader');

function Robot() {
	require('./bonus_robot_controls')(this);
	require('./robot_controls')(this);

	var SOURCE_WIDTH = 64;
	var SOURCE_HEIGHT = 64;
	var DESTINATION_WIDTH = 120;
	var DESTINATION_HEIGHT = 120;
	var ROBOT_ID = 1;
	var MOVING = false;

	var ROBOT_ROW = null;
	var ROBOT_COLUMN = null;

	this.SOUTH_FRAME = SOURCE_HEIGHT * 0;
	this.WEST_FRAME = SOURCE_WIDTH * 1;	
	this.EAST_FRAME = SOURCE_WIDTH * 2;
	this.NORTH_FRAME = SOURCE_HEIGHT * 3;

	Sprite.call(this, asset_loader.getImgFromCache('robot_1.png'), {
		sy: this.EAST_FRAME,
		sw: SOURCE_WIDTH,
		sh: SOURCE_HEIGHT,
		dw: DESTINATION_WIDTH,
		dh: DESTINATION_HEIGHT
	});
	this.alpha = 0;

	this.MAP = [
		[ROBOT_ID,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];
	
	var direction_mapper = {};
	direction_mapper[this.NORTH_FRAME] = 'north';
	direction_mapper[this.EAST_FRAME] = 'east';
	direction_mapper[this.SOUTH_FRAME] = 'south';
	direction_mapper[this.WEST_FRAME] = 'west';

	var ROWS = this.MAP.length;
	var COLUMNS = this.MAP[0].length;

	this.drawMap = function() {
		for(var row = 0; row < ROWS; row++) {
			for(var column = 0; column < COLUMNS; column++) {
				if(this.MAP[row][column] === ROBOT_ID) {	
					ROBOT_ROW = row;
					ROBOT_COLUMN = column;
					this.dx = DESTINATION_WIDTH * column;
					this.dy = DESTINATION_HEIGHT * row;
				}
			}
		}
	};
	this.drawMap();	

	this.onEdge = function(direction) {	
		if(direction == 'east') return ROBOT_COLUMN === COLUMNS - 1;
		else if(direction == 'west') return ROBOT_COLUMN === 0;
		else if(direction == 'north') return ROBOT_ROW === 0;
		else if(direction === 'south') return ROBOT_ROW === ROWS - 1;
	};

	this.updateCoordinates = function(direction, x, y) {
		this.MAP[ROBOT_ROW][ROBOT_COLUMN] = 0;
		this.MAP[y][x] = 1;
		this.sy = this[direction.toUpperCase() + '_FRAME'];	
		this.alpha = 1;
	};

	this.turnLeft = function() {
		if(MOVING) return;
		this.sy = this.WEST_FRAME;
	};

	this.turnRight = function() {
		if(MOVING) return;
		this.sy = this.EAST_FRAME;
	};

	this.move = function(direction) {
		direction = direction || direction_mapper[this.sy];
		if(MOVING || this.onEdge(direction) || this.alpha === 0) return;
		MOVING = true;
		this.moveInDirection(direction);
		this.sy = this[direction.toUpperCase() + '_FRAME'];	
	};
	
	this.moveInDirection = function(direction) {
		this.MAP[ROBOT_ROW][ROBOT_COLUMN] = 0;
		if(direction == 'east') ROBOT_COLUMN += 1;
		else if(direction == 'west') ROBOT_COLUMN -= 1;
		else if(direction == 'north') ROBOT_ROW -= 1;
		else if(direction == 'south') ROBOT_ROW += 1;
		this.MAP[ROBOT_ROW][ROBOT_COLUMN] = 1;
	};

	this.update = function() {
		if(!MOVING) return;
		this.animateFrames(); // method inherited from Sprite
		this.animateMovement();
	};

	this.animateMovement = function() {
		if(this.sy == this.EAST_FRAME) {
			this.dx += 2;
			if(this.dx % DESTINATION_WIDTH === 0) MOVING = false;
		} else if(this.sy == this.SOUTH_FRAME) {
			this.dy += 2;
			if(this.dy % DESTINATION_HEIGHT === 0) MOVING = false;
		} else if(this.sy == this.WEST_FRAME) {
			this.dx -= 2;
			if(this.dx % DESTINATION_WIDTH === 0) MOVING = false;
		} else if(this.sy == this.NORTH_FRAME) {
			this.dy -= 2;
			if(this.dy % DESTINATION_HEIGHT === 0) MOVING = false;
		}
	};

	this.reportLocation = function() {
		if(this.alpha === 0) return;
		alert('x: ' + ROBOT_COLUMN + ', y: ' + ROBOT_ROW + ', facing: ' + direction_mapper[this.sy]);
	};

}

Robot.prototype = Object.create(Sprite.prototype);
Robot.prototype.constructor = Robot;
module.exports = Robot;

},{"./asset_loader":1,"./base/sprite":2,"./bonus_robot_controls":3,"./robot_controls":7}],7:[function(require,module,exports){
module.exports = function(robot) {
	
	var xPos = document.querySelector('.x-pos');
	var yPos = document.querySelector('.y-pos');
	var facing = document.querySelector('.facing');

	document.querySelector('.place-btn').addEventListener('click', onPlaceClick, false);
	document.querySelector('.move-btn').addEventListener('click', onMoveClick, false);
	document.querySelector('.left-btn').addEventListener('click', onLeftClick, false);
	document.querySelector('.right-btn').addEventListener('click', onRightClick, false);
	document.querySelector('.report-btn').addEventListener('click', onReportClick, false);

	function onPlaceClick() {
		robot.updateCoordinates(facing.value, parseInt(xPos.value), parseInt(yPos.value));
		robot.drawMap();
	}

	function onMoveClick() {
		robot.move();
	}

	function onLeftClick() {
		robot.turnLeft();
	}

	function onRightClick() {
		robot.turnRight();
	}

	function onReportClick() {
		robot.reportLocation();
	}
};

},{}],8:[function(require,module,exports){
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame;
})();


},{}]},{},[4])