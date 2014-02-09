//==================================================//
// rbGame/render/sound.js
//==================================================//

//TODO: sound behavior for starting playback and for removing the sound itself
//sound behavior will probably have to do shifting on the soundstartframe to ensure chronological order

//http://www.html5rocks.com/en/tutorials/webaudio/intro/
//http://stackoverflow.com/questions/14666987/pause-web-audio-api-sound-playback

rbGame.render.sound = {
	//parameters
	data : ["soundStartFrame", "$soundRenderedFrame"], //should start frame and actually rendered frame
	properties : ["soundFile1", "soundFile2"], //can do constructor or property, need multiple in case of html5 format issues
	world : true, //going to need world to obtain frame

	//preload
	preload : function(callback, properties) {
		//load soundfile1 or soundfile2
		//where do i store the file?
		//call callback on completed load

		//?can i use one single context?
		//?do i have to create a new source from buffer each time? or can i reuse the source?
	},

	//render
	render : function(ctx, count, data, properties, world) {
		//if rollback happened check???? probably not needed?

		//TODO: will need to research web audio to figure out how to store the actual sound resource

		//TODO: consider, will an actual linked list be worthwhile to have to prevent the shift?
		//shifting is so slow, but it does keep it clean data wise
		//hard to decide

		//loop soundStartFrame vs $soundRenderedFrame
		//make sure loop through ALL of sound rendered frame until it hits 0 / end
		//compare
		//if startframe == renderedframe, do nothing
		//if no startframe but has renderedframe, stop the playback of the sound and remove it from renderedframe (have to do slow shift to remove it?)
		//if startframe but no renderedframe, insert renderedframe (have to do slow shift to add it?) and start playback of sound

		//?how do i stop the sound?
	}
};
