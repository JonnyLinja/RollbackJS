var myWorld = new rbGame.World(shooter.entities.bullet);
var b1 = myWorld.create("bullet");
b1.x = 3;
console.log(b1.x);
myWorld.update();
console.log(b1.x);
var b2 = myWorld.create("bullet");
myWorld.update();
console.log(b1.x);
console.log(b2.x);
