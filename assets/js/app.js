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
