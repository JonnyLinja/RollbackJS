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
rbGame.render._Sound.prototype.updateWorld = true;
rbGame.render._Sound.prototype.renderData = ["$soundStartFrame"];
rbGame.render._Sound.prototype.renderWorld = true;

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
		//remove
		if(data.$soundStartFrame[i] + duration < world.frame) {
			console.log("remove " + properties.type);
			world.remove(properties.type, i);
		}
	}
};

rbGame.render._Sound.prototype.render = function(ctx, count, data, properties, world) {
	//TODO: implement following logic
	//have a doubly linked list of rendered start times (so easy to pop it and insert new ones) stored in this Sound class
	//simultaneously loop through sound start frame and doubly linked list of rendered start frame until both reach their end
	//if sound start frame exists but no equivalent rendered frame exists, play sound with delay based on frame difference
	//if rendered frame exists but no equivalent sound start frame exists, stop the rendered sound and remove it from the doubly linked list

	//TODO: issue is that framerate NEEDS to be known then in order to play with a frame difference

	//hack play test, change it laters
	if(!this.foobar) {
		this.foobar = 1;

		this.source = this._context.createBufferSource();
		this.source.buffer = this._buffer;
		this.source.connect(this._context.destination);
		this.source.start(0);
		console.log("start");
	}else {
		this.foobar++;
		if(this.foobar === 30) {
			this.source.stop(0);
			console.log("stop");
		}
	}
};
