var canvas;
var ctx;

var myWorld = new rbGame.World(shooter.entities.bullet);
var b1 = myWorld.create("bullet");
b1.x = 3;
console.log(b1.x);
myWorld.update();
console.log(b1.x);
var b2 = myWorld.create("bullet");
b2.invalidate();
var b3 = myWorld.create("bullet");
b3.invalidate();
var b4 = myWorld.create("bullet");
b3.invalidate();
var b5 = myWorld.create("bullet");
b5.invalidate();
myWorld.update();
console.log(b1.x);
console.log(b2.x);
b2.invalidate();
myWorld.remove("bullet", 1);
myWorld.remove("bullet", 3);
myWorld.update();

window.onload = function() {
	canvas = document.getElementById("testCanvas");
	ctx = canvas.getContext("2d");
	myWorld.render(ctx);
};