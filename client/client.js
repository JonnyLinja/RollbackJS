var canvas;
var ctx;
var myWorld = new rbGame.World(shooter.entities.bullet);

window.onload = function() {
	myWorld.preloadResources(this, start);
	canvas = document.getElementById("testCanvas");
	ctx = canvas.getContext("2d");
};

var start = function() {
	//TODO: make sure there's no "this" call
	//or rewrite the preloadResources callback to be able to handle this

	var b1 = myWorld.create("bullet");
	b1.$x = 100;
	b1.$y = 100;
	myWorld.update();
	var b2 = myWorld.create("bullet");
	b2.invalidate();
	var b3 = myWorld.create("bullet");
	b3.invalidate();
	var b4 = myWorld.create("bullet");
	b3.invalidate();
	var b5 = myWorld.create("bullet");
	b5.invalidate();
	myWorld.update();
	b2.invalidate();
	myWorld.remove("bullet", 1);
	myWorld.remove("bullet", 3);
	myWorld.update();

	myWorld.render(ctx, canvas.width, canvas.height);
}