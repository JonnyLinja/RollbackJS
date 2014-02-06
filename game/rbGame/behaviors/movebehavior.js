//==================================================//
// rbGame/behaviors/movebehavior.js
//==================================================//

rbGame.behaviors.moveBehavior = {
	//parameters
	data : ["x", "y", "$changeX"],
	properties : ["maxCount"], //optional
	world : false, //optional

	//private
	hi : 5,

	//function
	run : function(count, data, properties, world) {
		//console.log("maxCount " + properties.maxCount);
		//console.log("hi " + this.hi);

		for(var i=0; i<count; i++) {
			data.x[i] += 1;
			data.y[i] -= 1;
		}
	}
};