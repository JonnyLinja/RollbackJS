//==================================================//
// entities/success.js
//==================================================//

shooter.entities.success = {
	data : {
		$soundStartFrame : rbGame.dataTypes.UINT32
	},
	properties : {
		type : "success",
		maxCount : 15,
		preserveOrder : true
	},
	behaviors : [
	],
	collisions : [
	],
	render : rbGame.render.sound("sounds/success.wav")
};
