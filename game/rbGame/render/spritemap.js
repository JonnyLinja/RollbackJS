//==================================================//
// rbGame/render/spritemap.js
//==================================================//

//TODO: allow for an array of images -> offscreen canvas, though hp could make this difficult
//by default, always runs the first animation alphabetically

//factory
rbGame.render.spritemap = function(imagesrc, animations) {
	return new rbGame.render._Spritemap(imagesrc, animations);
};

//constructor
rbGame.render._Spritemap = function(imagesrc, animations) {
	//declare instance variables
	this.imagesrc = imagesrc;
	this.image = null;
	this._stringToId = {};
	this._idToArray = [];

	//parse animation
	this._parseAnimations(animations);
};

//dependencies
rbGame.render._Spritemap.prototype.updateData = ["playAnimation", "$animationID", "$animationPosition"];
rbGame.render._Spritemap.prototype.renderData = ["$x", "$y", "$animationID", "$animationPosition"];
rbGame.render._Spritemap.prototype.renderProperties = ["width", "height"];

//parse
rbGame.render._Spritemap.prototype._parseAnimations = function(animations) {
	//animation strings
	var animStrings = []; //to guarantee order
	for(var property in animations) {
		if(animations.hasOwnProperty(property)) {
			animStrings.push(property);
		}
	}
	animStrings.sort();

	//populate datastructures
	for(var i=0, length=animStrings.length; i<length; i++) {
		//property
		var property = animStrings[i];

		//string to id
		this._stringToId[property] = i;

		//id to array
		var array = animations[property];
		var count = array.length;
		var typedArray = new Int8Array(count); //TODO: calculate size of animation array instead of just using int8
		for(var j=0; j<count; j++) {
			typedArray[j] = array[j];
		}
		this._idToArray.push(typedArray);
	}
};

//preload
rbGame.render._Spritemap.prototype.preload = function(delegate, callback) {
	//TODO: consider to remove duplicate Image() having each string url be unique via global dictionary check in preload itself
	//TODO: on error
	this.image = new Image();
	this.image.onload = function() {
		callback.apply(delegate);
	};
	this.image.src = this.imagesrc;
};

//update
rbGame.render._Spritemap.prototype.update = function(count, data) {
	//loop
	for(var i=0; i<count; i++) {
		//name
		var animationName = data.playAnimation[i];

		if(animationName) {
			//new animation

			//update data
			data.$animationID[i] = this._stringToId[animationName];
			data.$animationPosition[i] = 1;

			//clear
			data.playAnimation[i] = null;
		}else {
			//update animation

			//array
			var array = this._idToArray[data.$animationID[i]];
			var length = array.length;

			//check if animation complete
			if(data.$animationPosition[i] < length) {
				//increment position
				data.$animationPosition[i]++;

				//if last
				if(data.$animationPosition[i] === length) {
					//check for repeat
					if(array[length-1] < 0) {
						//repeat
						data.$animationPosition[i] = 1;
					}
				}
			}
		}
	}
};

//render
//TODO: consider offscreen checks? or does canvas handle it automatically?
rbGame.render._Spritemap.prototype.render = function(ctx, count, data, properties) {
	//columns
	//TODO: consider setting this earlier? perhaps preload can have dependencies?
	if(!this._columns) {
		this._columns = ~~(this.image.width / properties.width);
	}

	//loop
	for(var i=0; i<count; i++) {
		//frame
		var array = this._idToArray[data.$animationID[i]];
		var position = data.$animationPosition[i]-1;

		//calculate offsets
		var offsetX = array[position];
		var offsetY = 0;
		while(offsetX >= this._columns) {
			offsetX -= this._columns;
			offsetY += properties.height;
		}
		offsetX *= properties.width;

		//draw
		ctx.drawImage(this.image, offsetX, offsetY, properties.width, properties.height, ~~(data.$x[i]), ~~(data.$y[i]), properties.width, properties.height);
	}
};
