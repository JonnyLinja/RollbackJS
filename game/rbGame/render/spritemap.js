//==================================================//
// rbGame/render/spritemap.js
//==================================================//

//TODO: consider a prototype class for better performance at the costs of readability

rbGame.render.spritemap = function (imagesrc) {
	return {
		//parameters
		data : ["x", "y"],
		properties: ["width", "height", "animations"],

		//internal
		imagesrc : imagesrc,
		image : null,

		//preload
		preload : function(delegate, callback) {
			//TODO: on error
			this.image = new Image();
			this.image.onload = function() {
				callback.apply(delegate);
			};
			this.image.src = this.imagesrc;
		},

		//apply
		apply : function(count, data, properties) {

		},

		//render
		//TODO: consider offscreen checks? or does canvas handle it automatically?
		render : function(ctx, count, data, properties) {
			for(var i=0; i<count; i++) {
				ctx.drawImage(this.image, data.x[i], data.y[i], properties.width, properties.height);
			}
		}
	};
};
