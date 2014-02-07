//==================================================//
// rbGame/facade.js
//==================================================//

//TODO: consider adding properties to facade, but may not be necessary

rbGame.Facade = function(index, data, pool) {
	//index
	//TODO: consider global facade index array to help rollbacks
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

	//pool
	this._pool = pool;
};

//TODO: may require reference to original world? not sure
rbGame.Facade.prototype.invalidate = function() {
	//this._index = -1;
	this._pool.push(this);
};
