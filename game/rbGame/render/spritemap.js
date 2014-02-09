//==================================================//
// rbGame/render/spritemap.js
//==================================================//

//TODO: consider a prototype class for better performance at the costs of readability

rbGame.render.spritemap = function (imagesrc, animations) {
	//parse animations into something usable

	return {
		//dependencies
		updateData : ["playAnimation", "$animationID", "$animationPosition"],
		renderData : ["$x", "$y", "$animationID", "$animationPosition"],
		renderProperties : ["width", "height"],

		//internal
		imagesrc : imagesrc,
		image : null,
		animations : null, //need to parse the animations in constructor and set it here

		//preload
		preload : function(delegate, callback) {
			//TODO: on error
			this.image = new Image();
			this.image.onload = function() {
				callback.apply(delegate);
			};
			this.image.src = this.imagesrc;
		},

		//update
		update : function(count, data) {

		},

		//render
		//TODO: consider offscreen checks? or does canvas handle it automatically?
		render : function(ctx, count, data, properties) {
			for(var i=0; i<count; i++) {
				ctx.drawImage(this.image, data.$x[i], data.$y[i], properties.width, properties.height);
			}
		}
	};
};
