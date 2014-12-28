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
