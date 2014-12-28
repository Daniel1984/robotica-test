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
