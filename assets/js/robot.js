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
