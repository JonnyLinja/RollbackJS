//==================================================//
// rbGame/facade.js
//==================================================//

//TODO: recycle facades so don't have to create each time

rbGame.Facade = function() {};

rbGame.Facade.prototype.get = function(property) {
	return this["_"+property][this._index];
};

rbGame.Facade.prototype.set = function(property, value) {
	this["_"+property][this._index] = value;
};

//TODO: may require reference to original world? not sure
rbGame.Facade.prototype.release = function() {

};
