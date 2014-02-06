//==================================================//
// rbGame/world.js
//==================================================//

//TODO: error logging if missing expected stuff
//TODO: error logging for $ in front of local variable names

//Pass in types into constructor
rbGame.World = function() {
	//num
	this.numEntityTypes = arguments.length;

	//arrays
	//TODO: calculate the max size instead of defaulting to Uint8, can calculate by getting largest maxCount
	this.counts = new Uint8Array(this.numEntityTypes);
	//TODO: confirm is properties needs to be saved; in theory might be not need to
	this.properties = []; //array (entity types) of property objects
	this.allData = []; //array (entity types) of array (data types) of typed arrays (data and local data), used for facades
	this.data = []; //array (entity types) of array (data types) of typed arrays (data), used for rollbacks and dumps
	this.localData = []; //array (entity types) of array (data types) of typed arrays (data) that aren't synced and should be reset to 0 every game loop
	this.behaviors = []; //array (entity types) of array of behavior objects
	this.behaviorData = []; //array (entity types) of array of behavior data objects
	this.behaviorProperties = []; //array (entity types) of array of behavior property objects
	//TODO: defaults, used by create
	//TODO: collisions
	//TODO: renders
	this.toAddCounts = new Uint8Array(this.numEntityTypes); //TODO: calculate the max size instead of defaulting to Uint8, see this.counts TODO
	this.toRemoveCounts = new Uint8Array(this.numEntityTypes); //TODO: calculate the max size instead of defaulting to Uint8, see this.counts TODO
	this.facades = {}; //dictionary (entity types) of dictionary (index)

	//dictionary
	this.dictionary = {};

	//loop arguments
	for(var i=0; i<this.numEntityTypes; i++) {
		//template
		var template = arguments[i];

		//dictionary
		this.dictionary[template.properties.type] = i;

		//properties
		this.properties.push(template.properties);

		//data strings
		var dataStrings = []; //to guarantee order
		for(var property in template.data) {
    		if(template.data.hasOwnProperty(property)) {
    			dataStrings.push(property);
			}
		}
		dataStrings.sort();

		//data and temp data
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
		this.data.push(data);
		this.localData.push(localData);
		this.allData.push(currentData);

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
			this.behaviors.push(behaviorArray);
			this.behaviorData.push(behaviorDataArray);
			this.behaviorProperties.push(behaviorPropertiesArray);
		}else {
			//no behaviors

			//push empty
			this.behaviors.push(null);
			this.behaviorData.push(null);
			this.behaviorProperties.push(null);
		}
	}
};

//not sure about order yet
//behavior->collision makes sense
//but behaviors has the local variable resolution so...
//TODO: determine how to handle create/remove
rbGame.World.prototype.update = function() {
	//collisions

	//create/destroy objects?
	for(var i=0; i<this.numEntityTypes; i++) {
		if(this.toAddCounts[i] > 0) {
			this.counts[i] += this.toAddCounts[i];
			this.toAddCounts[i] = 0;
		}
	}

	//behaviors
	for(var i=0; i<this.numEntityTypes; i++) {
		//behavior
		var behaviors = this.behaviors[i];

		//valid behavior
		if(behaviors) {
			//count
			var count = this.counts[i];

			//run behaviors
			for(var j=0, length=behaviors.length; j<length; j++) {
				//get parameters
				var data = this.behaviorData[i][j];
				var properties = this.behaviorProperties[i][j];

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
	var entityTypeIndex = this.dictionary[type];

	//facade
	var facade = new rbGame.Facade();

	//index
	facade._index = this.counts[entityTypeIndex] + this.toAddCounts[entityTypeIndex]++;

	//loop data
	var data = this.allData[entityTypeIndex];
	for(var property in data) {
    	if(data.hasOwnProperty(property)) {
    		//add reference to data
    		facade["_"+property] = data[property];

    		//getter and setter
    		eval("Object.defineProperty(facade, \"" + property + "\"," +
    			"{" +
    				"get : function() { return this._" + property + "[this._index]; }," +
    				"set : function(value){ this._" + property + "[this._index] = value; }," +
    				"enumerable : true," +
    				"configurable : true" +
    			"})");
    	}
	}

    //return
	return facade;
};

//TODO: remove this, just need a single create. Assume all tracked and rely on facade.release() instead
rbGame.World.prototype.createAndTrack = function(type) {
	//create facade
	var facade = this.create(type);

	//create datastructure
	if(!this.facades[type]) {
		this.facades[type] = {};
	}

	//save reference
	this.facades[type][facade._index] = facade;

	//return
	return facade;
};

//TODO: determine if want remove function like this, or a remove array. world.remove works with world.create where an array is simpler. behaviors won't need to know type though in theory, though collisions would? not sure
rbGame.World.prototype.remove = function(type, index) {
	//what kind of datastructure should be used?
	//create facades are lookup only, and the loop part using a typed array for counts
	//removes would require storing both the type and index but in a loopable thing
	//so perhaps this.toRemoveType and this.toRemoveIndex? it would duplicate types a few times, but this way uses an array instead of an object and the array is without undefines
};
