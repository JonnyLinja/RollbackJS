//==================================================//
// rbGame/world.js
//==================================================//

//TODO: error logging if missing expected stuff
//TODO: error logging for $ in front of local variable names

//Pass in types into constructor
rbGame.World = function() {
	//num
	this._numEntityTypes = arguments.length;

	//arrays
	//TODO: calculate the max size instead of defaulting to Uint8, can calculate by getting largest maxCount
	this._counts = new Uint8Array(this._numEntityTypes);
	this._toAddCounts = new Uint8Array(this._numEntityTypes); //TODO: calculate the max size instead of defaulting to Uint8, see this._counts TODO
	this._toRemoveCounts = new Uint8Array(this._numEntityTypes); //TODO: calculate the max size instead of defaulting to Uint8, see this._counts TODO
	this._data = []; //array (entity types) of array (data types) of typed arrays (data), used for rollbacks and dumps
	this._behaviors = []; //array (entity types) of array of behavior objects
	this._behaviorData = []; //array (entity types) of array of behavior data objects
	this._behaviorProperties = []; //array (entity types) of array of behavior property objects
	//TODO: defaults, used by create
	//TODO: collisions
	//TODO: renders

	//dictionaries
	this._dictionary = {}; //lookup, converts entity type to index
	this._trackedFacades = {}; //dictionary (entity types) of dictionary (index) of facades
	this._availableFacades = {}; //dictionary (entity types) of array of facades
	this._allData = {}; //dictionary (entity types) of dictionary (data types) of typed arrays (data and local data), used for facades

	//TODO: may not be necessary
	this._properties = []; //array (entity types) of property objects
	this._localData = []; //array (entity types) of array (data types) of typed arrays (data) that aren't synced and should be reset to 0 every game loop

	//loop arguments
	for(var i=0; i<this._numEntityTypes; i++) {
		//template
		var template = arguments[i];

		//type
		var type = template.properties.type;

		//dictionary
		this._dictionary[type] = i;

		//properties
		this._properties.push(template.properties);

		//data strings
		var dataStrings = []; //to guarantee order
		for(var property in template.data) {
			if(template.data.hasOwnProperty(property)) {
				dataStrings.push(property);
			}
		}
		dataStrings.sort();

		//data
		var currentData = {};
		var data = [];
		var localData = [];
		for(var j=0, length=dataStrings.length; j<length; j++) {
			var string = dataStrings[j];
			switch(template.data[string]) {
				case rbGame.dataTypes.INT8:
					currentData[string] = new Int8Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT8_LOCAL:
					currentData[string] = new Int8Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT8:
					currentData[string] = new Uint8Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT8_LOCAL:
					currentData[string] = new Uint8Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT16:
					currentData[string] = new Int16Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT16_LOCAL:
					currentData[string] = new Int16Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT16:
					currentData[string] = new Uint16Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT16_LOCAL:
					currentData[string] = new Uint16Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT32:
					currentData[string] = new Int32Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT32_LOCAL:
					currentData[string] = new Int32Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT32:
					currentData[string] = new Uint32Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT32_LOCAL:
					currentData[string] = new Uint32Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT32:
					currentData[string] = new Float32Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT32_LOCAL:
					currentData[string] = new Float32Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT64:
					currentData[string] = new Float64Array(template.properties.maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT64_LOCAL:
					currentData[string] = new Float64Array(template.properties.maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.OBJECT_LOCAL:
					//TODO: consider if need to push nulls into array to keep the count correct
					currentData[string] = [];
					localData.push(currentData[string]);
					break;
			}
		}
		this._data.push(data);
		this._localData.push(localData);
		this._allData[type] = currentData;

		//behaviors
		if(template.behaviors && template.behaviors.length>0) {
			//at least one behavior

			//declare arrays
			var behaviorArray = [];
			var behaviorDataArray = [];
			var behaviorPropertiesArray = [];

			//loop through behaviors
			for(var j=0, length=template.behaviors.length; j<length; j++) {
				//behavior
				var current = template.behaviors[j];
				behaviorArray.push(current);

				//data
				var behaviorData = {};
				for(var k=0, count=current.data.length; k<count; k++) {
					var string = current.data[k];
					behaviorData[string] = currentData[string];
				}
				behaviorDataArray.push(behaviorData);

				//properties
				if(current.properties && current.properties.length>0) {
					//at least one property
					var behaviorProperties = {};
					for(var k=0, count=current.properties.length; k<count; k++) {
						var property = current.properties[k];
						behaviorProperties[property] = template.properties[property];
					}
					behaviorPropertiesArray.push(behaviorProperties);
				}else {
					//no properties
					behaviorPropertiesArray.push(null);
				}
			}

			//push
			this._behaviors.push(behaviorArray);
			this._behaviorData.push(behaviorDataArray);
			this._behaviorProperties.push(behaviorPropertiesArray);
		}else {
			//no behaviors

			//push empty
			this._behaviors.push(null);
			this._behaviorData.push(null);
			this._behaviorProperties.push(null);
		}

		//facades
		this._availableFacades[type] = [new rbGame.Facade(-1, currentData)];
		this._trackedFacades[type] = {};
	}
};

//not sure about order yet
//behavior->collision makes sense
//but behaviors has the local variable resolution so...
//TODO: determine how to handle create/remove
rbGame.World.prototype.update = function() {
	//collisions

	//create/destroy objects?
	for(var i=0; i<this._numEntityTypes; i++) {
		if(this._toAddCounts[i] > 0) {
			this._counts[i] += this._toAddCounts[i];
			this._toAddCounts[i] = 0;
		}
	}

	//behaviors
	for(var i=0; i<this._numEntityTypes; i++) {
		//behavior
		var behaviors = this._behaviors[i];

		//valid behavior
		if(behaviors) {
			//count
			var count = this._counts[i];

			//run behaviors
			for(var j=0, length=behaviors.length; j<length; j++) {
				//get parameters
				var data = this._behaviorData[i][j];
				var properties = this._behaviorProperties[i][j];

				//run
				if(properties) {
					behaviors[j].run(count, data, properties);
				}else {
					behaviors[j].run(count, data);
				}
			}
		}
	}

	//create/destroy objects? but created objects won't be an update this turn for default values...? not sure how this will work
};

//TODO: recycle facades, create 1 of each in the constructor and only create if none are ready for use
//TODO: consider adding properties to facade, but may not be necessary
rbGame.World.prototype.create = function(type) {
	//index
	var entityTypeIndex = this._dictionary[type];
	var index = this._counts[entityTypeIndex] + this._toAddCounts[entityTypeIndex]++;

	//facade
	var pool = this._availableFacades[type];
	var length = pool.length-1;
	if(length >= 0) {
		//reuse existing
		console.log("reuse existing " + type);
		var facade = pool[length];
		facade._index = index;
		pool.length = length;
	}else {
		//create new
		console.log("create new " + type);
		var facade = new rbGame.Facade(index, this._allData[type]);
	}

	//save reference
	this._trackedFacades[type][facade._index] = facade;

	//return
	return facade;
};

//TODO: determine if want remove function like this, or a remove array. world.remove works with world.create where an array is simpler. behaviors won't need to know type though in theory, though collisions would? not sure
rbGame.World.prototype.remove = function(type, index) {
	//what kind of datastructure should be used?
	//create facades are lookup only, and the loop part using a typed array for counts
	//removes would require storing both the type and index but in a loopable thing
	//so perhaps this._toRemoveType and this._toRemoveIndex? it would duplicate types a few times, but this way uses an array instead of an object and the array is without undefines
};
