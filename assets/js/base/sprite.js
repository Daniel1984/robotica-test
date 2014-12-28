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
