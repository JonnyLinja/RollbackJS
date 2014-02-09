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
			console.log("sprite preload with source " + this.imagesrc);
			//TODO: on error
			this.image = new Image();
			this.image.onload = function() {
				world.resourceLoaded();
			};
			this.image.src = this.imagesrc;
		},

		//run
		//TODO: consider offscreen checks
		run : function(ctx, count, data, properties) {
			console.log("sprite render");

			for(var i=0; i<count; i++) {
				ctx.drawImage(this.image, data.x[i], data.y[i], properties.width, properties.height);
			}
		}
	};
};
