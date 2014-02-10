//==================================================//
// rbGame/render/sound.js
//==================================================//

//TODO: multiple sound files as backup; for initial implementation going with a single file with assumed success

//http://www.html5rocks.com/en/tutorials/webaudio/intro/
//http://stackoverflow.com/questions/14666987/pause-web-audio-api-sound-playback

//factory
rbGame.render.sound = function(soundFile) {
	return new rbGame.render._Sound(soundFile);
};

//constructor
rbGame.render._Sound = function(soundFile) {
	this.file = soundFile;
};

//dependencies
rbGame.render._Sound.prototype.updateData = ["$soundStartFrame"];
rbGame.render._Sound.prototype.updateProperties = ["type"];
rbGame.render._Sound.prototype.updateWorld = true; //going to need world to obtain frame
rbGame.render._Sound.prototype.renderData = ["$soundStartFrame", "soundRenderedFrame"]; //should start frame and actually rendered frame
rbGame.render._Sound.prototype.renderWorld = true; //going to need world to obtain frame

rbGame.render._Sound.prototype.preload = function(delegate, callback) {
	//context
	if(!this._context) {
    	var AudioContext = window.AudioContext || window.webkitAudioContext;
    	rbGame.render._Sound.prototype._context = new AudioContext();
	}

    //self
    var self = this;

    //request
    //TODO: request error
	var request = new XMLHttpRequest();
	request.open('GET', this.file, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		self._context.decodeAudioData(
			request.response,
			function(buffer) {
				self._buffer = buffer;
				callback.apply(delegate);
			},
			function(e) {
				//TODO: decode error
			}
		);
	}
	request.send();
};

rbGame.render._Sound.prototype.update = function(count, data, properties, world) {
	//TODO: true calculated length, either through duration*framerate or preset duration
	var duration = 120;

	//loop
	for(var i=0; i<count; i++) {
		if(data.$soundStartFrame[i] + duration < world.frame) {
			//remove
			console.log("remove " + properties);
			world.remove(properties.type, i);
		}
	}
};

rbGame.render._Sound.prototype.render = function(ctx, count, data, properties, world) {
	//hack play test, change it laters
	if(!this.foobar) {
		this.foobar = "sup";

		var source = this._context.createBufferSource();
		source.buffer = this._buffer;
		source.connect(this._context.destination);
		source.start(0);
	}
};
