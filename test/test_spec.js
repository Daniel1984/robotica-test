var assert = require("assert");
var Robot = require('../assets/js/robot');
var asset_loader = require('../assets/js/asset_loader');

describe('ROBOT POSITION TEST', function(){
	var robot;
	beforeEach(function() {
		sinon.stub(asset_loader, 'getImgFromCache').returns({width: 400, height: 400});
		robot = new Robot();
	});
	afterEach(function() {
		asset_loader.getImgFromCache.restore();
		robot = null;
		window.robotica_img_cache = null;
	});

	describe('updateCoordinates()', function() {
  		it('it should set robots alpha to 1', function() {
			robot.updateCoordinates('south', 1, 1);
    			assert.equal(1, robot.alpha);
  		});

		it('should update robots location on the map', function() {
			robot.updateCoordinates('south', 2, 2);
			assert.equal(1, robot.MAP[2][2]);
		});

		it('should turn robot to direction specified in method', function() {
			robot.updateCoordinates('south', 2, 2);
			assert.equal(0, robot.sy);
		});
	});

	describe('turnLeft()', function() {
		beforeEach(function() {
			robot.sy = 0;
			robot.MOVING = false;
		});
		it('source Y should stay 0 if MOVING == true', function() {
			robot.MOVING = true;
			robot.turnLeft();
			assert.equal(0, robot.sy);
		});
		it('if current facing is NORTH and MOVING == false, will result in facing WEST', function() {
      robot.sy = robot.NORTH_FRAME;
			robot.turnLeft();
			assert.equal(robot.WEST_FRAME, robot.sy);
		});
		it('if current facing is WEST and MOVING == false, will result in facing SOUTH', function() {
      robot.sy = robot.WEST_FRAME;
			robot.turnLeft();
			assert.equal(robot.SOUTH_FRAME, robot.sy);
		});
	});

	describe('turnRight()', function() {
		beforeEach(function() {
			robot.sy = 0;
			robot.MOVING = false;
		});
		it('source Y should stay 0 if MOVING == true', function() {
			robot.MOVING = true;
			robot.turnRight();
			assert.equal(0, robot.sy);
		});
		it('if current facing is NORTH and MOVING == false, will result in robot facing EAST', function() {
      robot.sy = robot.NORTH_FRAME;
			robot.turnRight();
			assert.equal(robot.EAST_FRAME, robot.sy);
		});
		it('if current facing is EAST and MOVING == false, will result in robot facing SOUTH', function() {
      robot.sy = robot.EAST_FRAME;
			robot.turnRight();
			assert.equal(robot.SOUTH_FRAME, robot.sy);
		});
	});
	
	describe('move()', function() {
		it('should not call moveInDirection method if MOVING == true', function() {
			var spy = sinon.spy(robot, 'moveInDirection');
			robot.MOVING = true;
			robot.move();
			spy.should.not.be.called;
			spy.restore();
		});
		it('should call moveInDirection method if MOVING == false, alpha != 0 and not hitting wall', function() {
			var spy = sinon.spy(robot, 'moveInDirection');
			robot.MOVING = false;
			robot.alpha = 1;
			robot.move('east');
			spy.should.have.been.calledOnce;
			spy.restore();
		});
	});
});
