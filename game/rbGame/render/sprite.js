//==================================================//
// rbGame/render/sprite.js
//==================================================//

//TODO: consider a prototype class for better performance at the costs of readability

rbGame.render.sprite = function (imagesrc) {
	return {
		//parameters
		data : ["x", "y"],
		properties: ["width", "height"],

		//internal
		imagesrc : imagesrc,
		image : null,

		//preload
		preload : function(world) {
			//TODO: on error
			this.image = new Image();
			this.image.onload = function() {
				world.resourceLoadedCallback();
			};
			this.image.src = this.imagesrc;
		},

		//run
		//TODO: consider offscreen checks? or does canvas handle it automatically?
		run : function(ctx, count, data, properties) {
			for(var i=0; i<count; i++) {
				ctx.drawImage(this.image, data.x[i], data.y[i], properties.width, properties.height);
			}
		}
	};
};
