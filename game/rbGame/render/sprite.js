//==================================================//
// rbGame/render/sprite.js
//==================================================//

//TODO: consider a prototype class for better performance at the costs of readability

rbGame.render.sprite = function (imagesrc) {
	return {
		//dependencies
		renderData : ["$x", "$y"],
		renderProperties: ["width", "height"],

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

		//render
		//TODO: consider offscreen checks? or does canvas handle it automatically?
		render : function(ctx, count, data, properties) {
			for(var i=0; i<count; i++) {
				ctx.drawImage(this.image, data.$x[i], data.$y[i], properties.width, properties.height);
			}
		}
	};
};
