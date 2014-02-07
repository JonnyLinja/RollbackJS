//==================================================//
// entities/bullet.js
//==================================================//

shooter.entities.bullet = {
	data : {
		x : rbGame.dataTypes.FLOAT32,
		y : rbGame.dataTypes.FLOAT32,
		$changeX : rbGame.dataTypes.FLOAT32_LOCAL,
		$changeY : rbGame.dataTypes.FLOAT32_LOCAL
	},
	properties : {
		type : "bullet",
		maxCount : 15,
		image : "images/bullet.png"
	},
	behaviors : [
		rbGame.behaviors.moveBehavior,
		//fooBehavior(1009)
	],
	collisions : [
	],
	renders : [
	]
};
