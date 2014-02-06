var myWorld = new rbGame.World(shooter.entities.bullet);
var b1 = myWorld.create("bullet");
b1.set("x", 3);
console.log(b1.get("x"));
myWorld.update();
console.log(b1.get("x"));
var b2 = myWorld.createAndTrack("bullet");
myWorld.update();
console.log(b1.get("x"));
console.log(b2.get("x"));