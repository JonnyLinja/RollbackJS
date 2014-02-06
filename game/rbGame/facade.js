//==================================================//
// rbGame/facade.js
//==================================================//

//TODO: recycle facades so don't have to create each time

rbGame.Facade = function(index, data) {
	//index
	this._index = index;

	//loop data
	for(var property in data) {
		if(data.hasOwnProperty(property)) {
			//add reference to data
			this["_"+property] = data[property];

			//TODO: consider if statement check for -1 invalid
			//getter and setter
			eval("Object.defineProperty(this, \"" + property + "\"," +
				"{" +
					"get : function() { return this._" + property + "[this._index]; }," +
					"set : function(value){ this._" + property + "[this._index] = value; }," +
					"enumerable : true," +
					"configurable : true" +
				"})");
		}
	}
};

//TODO: may require reference to original world? not sure
//name options: release, drop, untrack, forget, invalidate, deprecate, free, finish
rbGame.Facade.prototype.invalidate = function() {
	this._index = -1;
};
