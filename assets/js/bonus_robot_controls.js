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
