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
rbGame.Facade.prototype.release = function() {

};
