if (!window.requestAnimationFrame ) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
				window.setTimeout( callback, 1000 / 60 );
			};
	})();
}

var canvas;
var ctx;
var myWorld = new rbGame.World(shooter.entities.bullet, shooter.entities.human);

window.onload = function() {
	myWorld.preloadResources(this, start);
	canvas = document.getElementById("testCanvas");
	ctx = canvas.getContext("2d");
};

var start = function() {
	//TODO: make sure there's no "this" call
	//or rewrite the preloadResources callback to be able to handle this

	//add stuff
	var b1 = myWorld.create("bullet");
	b1.$x = 100;
	b1.$y = 100;
	var b2 = myWorld.create("bullet");
	b2.invalidate();
	var b3 = myWorld.create("bullet");
	b3.invalidate();
	var b4 = myWorld.create("bullet");
	b3.invalidate();
	var b5 = myWorld.create("bullet");
	b5.invalidate();
	b2.invalidate();
	myWorld.remove("bullet", 1);
	myWorld.remove("bullet", 3);

	var p1 = myWorld.create("human");
	p1.$x = 200;
	p1.$y = 250;
	p1.playAnimation = "spin";

	//loop
	loop();
}

//update loop
function loop() {
	//request anim frame
    requestAnimationFrame(loop);
    //window.requestAnimFrame(loop);

	//update and render
	myWorld.update();
	myWorld.render(ctx, canvas.width, canvas.height);
}
