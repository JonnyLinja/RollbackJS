//==================================================//
// entities/human.js
//==================================================//

shooter.entities.human = {
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
		type : "human",
		maxCount : 15,
		width : 34,
		height : 33
	},
	behaviors : [
		//rbGame.behaviors.moveBehavior,
		//fooBehavior(1009)
	],
	collisions : [
	],

	render : rbGame.render.spritemap("images/humangun.png", {
		a : [9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, -1],
		spin : [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, -1]
	})
};
