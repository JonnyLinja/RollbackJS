//==================================================//
// entities/bullet.js
//==================================================//

shooter.entities.bullet = {
	data : {
		$x : rbGame.dataTypes.FLOAT32,
		$y : rbGame.dataTypes.FLOAT32,
		changeX : rbGame.dataTypes.FLOAT32_LOCAL,
		changeY : rbGame.dataTypes.FLOAT32_LOCAL,
		$animationID : rbGame.dataTypes.UINT8,
		$animationPosition : rbGame.dataTypes.UINT8,
		playAnimation : rbGame.dataTypes.OBJECT_LOCAL
	},
	properties : {
		type : "bullet",
		maxCount : 15,
		width : 70,
		height : 12,
		//should this be an object or an array where the name is a property?
		//array gives more obvious ids, but I can still set up ids in the spritemap itself so there's no reason to force it
		//wait, there has to be a spritemap behavior, so where would the conversion be?
		//can set all the animation information in the local variables so both the behavior and the renderer can utilize it
		//but that might not be very clear, puts too much burden on the entity
		//alt is to just calculate ids every time (sorting is slow)
		//or just do the calculation once on the behavior and once on the renderer
		animations : {
			spin : {
				frames : [0, 1, 2, 3, 4],
				repeat : true, //can loop be set elsewhere? like the local data var itself? probably should be here though...
				framerate : 1 //every frame, maybe don't need this option? can just default to 1
			}
		}
	},
	behaviors : [
		rbGame.behaviors.moveBehavior,
		//fooBehavior(1009)
	],
	collisions : [
	],

	render : rbGame.render.sprite("images/airball.png")
};
