//==================================================//
// rbGame/behaviors/movebehavior.js
//==================================================//

rbGame.behaviors.moveBehavior = {
	//dependencies
	data : ["$x", "$y", "changeX"],
	properties : ["maxCount"],
	world : false,

	//internal
	hi : 5,

	//update
	update : function(count, data, properties, world) {
		//console.log("maxCount " + properties.maxCount);
		//console.log("hi " + this.hi);

		for(var i=0; i<count; i++) {
			data.$x[i] += 1;
			data.$y[i] -= 1;
		}
	}
};
