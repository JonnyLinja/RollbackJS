//==================================================//
// rbGame/world.js
//==================================================//

//TODO: store all parameters in a [], use call, just change the appropriate index each time for count
//TODO: pass world only if requested; right now always passing it for testing purposes
//TODO: consider making it so that if something isn't a dependency, don't even pass null, just ignore it

//TODO: consider linked lists instead of arrays for some things. not sure.
//in theory it's faster, but it depends on how arrays are implemented in JS.
//will the interpreter be smart enough to group the objects close to each other in memory? etc.
//see https://github.com/jashkenas/backbone/pull/1284
//see http://www.codeproject.com/Articles/340797/Number-crunching-Why-you-should-never-ever-EVER-us
//see http://www.sitepoint.com/forums/showthread.php?252272-Performance-linked-list-versus-native-array
//for now, going with arrays when possible for clarity; it's a hell of a lot easier to read array code
//will attempt linked lists much later in development and test on the nodejs server, where the speed actually matters

//TODO: consider use prototype for non data; can share it that way, less memory usage. example: the behaviors array can be shared
//TODO: error logging if missing expected stuff
//TODO: error logging for $ in front of synced variable names
//TODO: deletion and rollback of facades, right now assumes no change
//TODO: consider if can get around passing types in? probably not since strings need to be set up after all
//TODO: consider how to attach 2 entites to each other? specifically thinking damage indicators that move w/ the character

//Pass in types into constructor
rbGame.World = function() {
	//num
	this._numEntityTypes = arguments.length;
	this.frame = 0;

	//boolean
	this._hasToAddObject = false; //speed up checking

	//count arrays
	//TODO: calculate the max size instead of defaulting to Uint8, can calculate by getting largest maxCount
	this._counts = new Uint8Array(this._numEntityTypes);
	//TODO: calculate the max size instead of defaulting to Uint8, see this._counts TODO
	this._toAddCounts = new Uint8Array(this._numEntityTypes);
	this._toRemoveCounts = []; //array for to remove, even numbers are the entity type index, odd numbers are the entity index

	//data array
	this._data = []; //array (entity types) of array (data types) of typed arrays (data), used for rollbacks, swaps, and dumps

	//behavior arrays
	//TODO: consider making a behavior container object instead of having 3 arrays
	this._behaviors = []; //array (entity types) of array of behavior objects
	this._behaviorData = []; //array (entity types) of array of behavior data objects
	this._behaviorProperties = []; //array (entity types) of array of behavior property objects

	//TODO: defaults, used by create
	//TODO: collisions

	//render arrays
	//TODO: consider making a render container object instead of having 3 arrays
	this._renders = []; //array of render objects
	this._renderData = []; //array of render data objects
	this._renderProperties = []; //array of render property objects

	//dictionaries
	this._dictionary = {}; //lookup, converts entity type to index
	this._availableFacades = {}; //dictionary (entity types) of array of facades
	this._allData = {}; //dictionary (entity types) of dictionary (data types) of typed arrays (data and local data), used for facades
	//this._trackedFacades = {}; //dictionary (entity types) of dictionary (index) of facades
	this._preserveOrder = {};

	//TODO: may not be necessary
	this._properties = []; //array (entity types) of property objects
	this._localData = []; //array (entity types) of array (data types) of typed arrays (data) that aren't synced and should be reset to 0 every game loop

	//loop arguments
	for(var i=0; i<this._numEntityTypes; i++) {
		//template
		var template = arguments[i];

		//type
		var type = template.properties.type;

		//max count
		var maxCount = template.properties.maxCount;

		//dictionary
		this._dictionary[type] = i;

		//properties
		this._properties.push(template.properties);

		//preserve order option
		if(template.properties.preserveOrder) {
			this._preserveOrder[i] = true;
		}

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
					currentData[string] = new Int8Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT8_LOCAL:
					currentData[string] = new Int8Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT8:
					currentData[string] = new Uint8Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT8_LOCAL:
					currentData[string] = new Uint8Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT16:
					currentData[string] = new Int16Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT16_LOCAL:
					currentData[string] = new Int16Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT16:
					currentData[string] = new Uint16Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT16_LOCAL:
					currentData[string] = new Uint16Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT32:
					currentData[string] = new Int32Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.INT32_LOCAL:
					currentData[string] = new Int32Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT32:
					currentData[string] = new Uint32Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.UINT32_LOCAL:
					currentData[string] = new Uint32Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT32:
					currentData[string] = new Float32Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT32_LOCAL:
					currentData[string] = new Float32Array(maxCount);
					localData.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT64:
					currentData[string] = new Float64Array(maxCount);
					data.push(currentData[string]);
					break;
				case rbGame.dataTypes.FLOAT64_LOCAL:
					currentData[string] = new Float64Array(maxCount);
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

		//render
		if(template.render) {
			//at least one render

			//renders
			var current = template.render;
			this._renders.push(current);

			//data
			if(current.renderData && current.renderData.length>0) {
				//at least one data
				var renderData = {};
				for(var j=0, length=current.renderData.length; j<length; j++) {
					var string = current.renderData[j];
					renderData[string] = currentData[string];
				}
				this._renderData.push(renderData);
			}else {
				//no data
				this._renderData.push(null);
			}

			//properties
			if(current.renderProperties && current.renderProperties.length>0) {
				//at least one property
				var renderProperties = {};
				for(var j=0, length=current.renderProperties.length; j<length; j++) {
					var property = current.renderProperties[j];
					renderProperties[property] = template.properties[property];
				}
				this._renderProperties.push(renderProperties);
			}else {
				//no properties
				this._renderProperties.push(null);
			}

			//update
			if(current.update) {
				//behavior array
				var behaviorArray = this._behaviors[i];
				if(!behaviorArray) {
					behaviorArray = [];
					this._behaviors[i] = behaviorArray;
				}

				//behavior
				behaviorArray.push(current);

				//data array
				var behaviorDataArray = this._behaviorData[i];
				if(!behaviorDataArray) {
					behaviorDataArray = [];
					this._behaviorData[i] = behaviorDataArray;
				}

				//data
				var behaviorData = {};
				for(var j=0, length=current.updateData.length; j<length; j++) {
					var string = current.updateData[j];
					behaviorData[string] = currentData[string];
				}
				behaviorDataArray.push(behaviorData);

				//properties array
				var behaviorPropertiesArray = this._behaviorProperties[i];
				if(!behaviorPropertiesArray) {
					behaviorPropertiesArray = [];
					this._behaviorProperties[i] = behaviorPropertiesArray;
				}

				//properties
				if(current.updateProperties && current.updateProperties.length>0) {
					//at least one property

					var behaviorProperties = {};
					for(var j=0, length=current.updateProperties.length; j<length; j++) {
						var property = current.updateProperties[j];
						behaviorProperties[property] = template.properties[property];
					}
					behaviorPropertiesArray.push(behaviorProperties);
				}else {
					//no properties
					behaviorPropertiesArray.push(null);
				}
			}
		}else {
			//no renders
			this._renders.push(null);
		}

		//facades
		this._availableFacades[type] = [];
		this._availableFacades[type].push(new rbGame.Facade(-1, currentData, this._availableFacades[type]));
		//this._trackedFacades[type] = {};
	}
};

//TODO: already loaded check
rbGame.World.prototype.preloadResources = function(delegate, callback) {
	//declare variables
	this._numResources = 0;
	this._preloadCompleteDelegate = delegate;
	this._preloadCompleteCallback = callback;

	//loop
	for(var i=0, length=this._renders.length; i<length; i++) {
		//current
		var current = this._renders[i];

		//preload
		if(current && current.preload) {
			this._numResources++;
			current.preload(this, this._resourceLoadedCallback);
		}
	}
};

rbGame.World.prototype._resourceLoadedCallback = function() {
	//decrement
	this._numResources--;

	//complete
	if(this._numResources == 0) {
		//callback
		this._preloadCompleteCallback.apply(this._preloadCompleteDelegate);
	}
};

rbGame.World.prototype._createAndRemoveObjects = function() {
	//create objects
	if(this._hasToAddObject) {
		//reset boolean
		this._hasToAddObject = false;

		//loop
		for(var i=0; i<this._numEntityTypes; i++) {
			if(this._toAddCounts[i] > 0) {
				this._counts[i] += this._toAddCounts[i];
				this._toAddCounts[i] = 0;
			}
		}
	}

	//remove objects
	for(var i=0, length=this._toRemoveCounts.length; i<length; i+=2) {
		//get index values
		var entityTypeIndex = this._toRemoveCounts[i];
		var entityIndex = this._toRemoveCounts[i+1];
		var lastIndex = --this._counts[entityTypeIndex];

		//TODO: handle preserve order types
		if(this._preserveOrder[entityTypeIndex]) {
			console.log("TODO: REMOVING SHOULD DO SHIFT, NOT SWAP");

			var shiftCount = 1;
			//assuming indices in sorted order and remove is done by type
			//for loop starting from the first index+1
			//if this position is not in the to remove list
			//set all data values to current index position - shift count
			//else if this position is in the to remove list
			//increment shift count
		}

		//swap
		var data = this._data[entityTypeIndex];
		for(var j=0, count=data.length; j<count; j++) {
			//get property
			var property = data[j];

			//swap data
			property[entityIndex] = property[lastIndex];

			//reset data
			property[lastIndex] = 0;
		}
	}
	this._toRemoveCounts.length = 0;
};

//not sure about order yet
//behavior->collision makes sense
//but behaviors has the local variable resolution so...
//TODO: determine how to handle create/remove
rbGame.World.prototype.update = function() {
	//collisions

	//create and remove
	this._createAndRemoveObjects();

	//behaviors
	for(var i=0; i<this._numEntityTypes; i++) {
		//behavior
		var behaviors = this._behaviors[i];

		//valid behavior
		if(behaviors) {
			//count
			var count = this._counts[i];

			//update behaviors
			if(count > 0) {
				for(var j=0, length=behaviors.length; j<length; j++) {
					//get parameters
					var data = this._behaviorData[i][j];
					var properties = this._behaviorProperties[i][j];

					//update
					behaviors[j].update(count, data, properties, this);
				}
			}
		}
	}

	//create/destroy objects? but created objects won't be an update this turn for default values...? not sure how this will work

	//increment frame
	this.frame++;
};

rbGame.World.prototype.create = function(type) {
	//boolean
	this._hasToAddObject = true;

	//index
	var entityTypeIndex = this._dictionary[type];
	var index = this._counts[entityTypeIndex] + this._toAddCounts[entityTypeIndex]++;

	//facade
	var pool = this._availableFacades[type];
	var length = pool.length-1;
	if(length >= 0) {
		//reuse existing
		var facade = pool[length];
		facade._index = index;
		pool.length = length;
	}else {
		//create new
		var facade = new rbGame.Facade(index, this._allData[type], pool);
	}

	//track
	//this._trackedFacades[type][facade._index] = facade;

	//return
	return facade;
};

//TODO: consider create with no facade return

rbGame.World.prototype.remove = function(type, index) {
	//TODO: use alternate storage system for preserveOrder = YES
	//that one needs to have remove indices in chronological order

	//TODO: ensure no duplicates
	this._toRemoveCounts.push(this._dictionary[type]);
	this._toRemoveCounts.push(index);
};

//TODO: consider offscreen checks? or does canvas handle it automatically?
rbGame.World.prototype.render = function(ctx, w, h) {
	//clear
	ctx.clearRect(0, 0, w, h);

	//loop
	for(var i=0; i<this._numEntityTypes; i++) {
		//render
		var render = this._renders[i];
		var count = this._counts[i];

		if(render && count>0) {
			//parameters
			var data = this._renderData[i];
			var properties = this._renderProperties[i];

			//render
			this._renders[i].render(ctx, count, data, properties, this);
		}
	}
};
