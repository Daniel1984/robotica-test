var assert = require("assert");
var Robot = require('../assets/js/robot');

describe('ROBOT', function(){
	var robot;
	beforeEach(function() {
		window.robotica_img_cache = {
			getImageFromCache: function() {
				return {
					width: 300,
					height: 300
				}
			}
		};
		robot = new Robot();
	});
	afterEach(function() {
		robot = null;
		window.robotica_img_cache = null;
	});

  it('shoudl set alpha to 1', function() {
		robot('south', 1, 1);
    assert.equal(1, robot.alpha);
    assert.equal(-1, [1,2,3].indexOf(0));
  })
});
