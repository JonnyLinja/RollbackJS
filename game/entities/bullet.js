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
		width : 14,
		height : 12
	},
	behaviors : [
		rbGame.behaviors.moveBehavior,
		//fooBehavior(1009)
	],
	collisions : [
	],

	render : rbGame.render.spritemap("images/airball.png", {
		spin : [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, -1]
	})
};
