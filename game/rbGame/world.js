//==================================================//
// rbGame/world.js
//==================================================//

//TODO: consider use prototype for non data; can share it that way, less memory usage
//TODO: error logging if missing expected stuff
//TODO: error logging for $ in front of local variable names
//TODO: deletion and rollback of facades

//Pass in types into constructor
rbGame.World = function() {
	//num
	this._numEntityTypes = arguments.length;

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
			if(current.data && current.data.length>0) {
				//at least one data
				var renderData = {};
				for(var j=0, length=current.data.length; j<length; j++) {
					var string = current.data[j];
					renderData[string] = currentData[string];
				}
				this._renderData.push(renderData);
			}else {
				//no data
				this._renderData.push(null);
			}

			//properties
			if(current.properties && current.properties.length>0) {
				//at least one property
				var renderProperties = {};
				for(var j=0, length=current.properties.length; j<length; j++) {
					var property = current.properties[j];
					renderProperties[property] = template.properties[property];
				}
				this._renderProperties.push(renderProperties);
			}else {
				//no properties
				this._renderProperties.push(null);
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

//not sure about order yet
//behavior->collision makes sense
//but behaviors has the local variable resolution so...
//TODO: determine how to handle create/remove
rbGame.World.prototype.update = function() {
	//collisions

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

rbGame.World.prototype.preloadResources = function(callback) {
	//declare variables
	this._numResources = 0;
	this._preloadCompleteCallback = callback;

	//loop
	for(var i=0, length=this._renders.length; i<length; i++) {
		//current
		var current = this._renders[i];

		//preload
		if(current && current.preload) {
			console.log("preload");
			this._numResources++;
			current.preload(this);
		}
	}

	//it's between this or having the entity.properties.image be set to an actual image object
	//it would make World clearer and allow programmers to choose their own preload system
	//but it would mean hacks for the server side as I don't want to have image objects there
	//so using this method, entity.prototypes.image can be set to the string path, so the server is fine

	//however, this preload function can't be aware of that it's an image
	//reason being that images/sounds/whatever should be done by the components in case there's a new resource type that comes up
	//not world's responsibility
	//but in that case, preload has to be somehow super generic to handle all types
	//which means that the components need a preload ability
	//should there be a preload section in the entity itself? this is one way to approach it. it's very heavy (entity already has 5 fields), but clear. not sure.
	//i could also have preload be an optional thing inside the parameters? maybe?

	//oohhh preload be an optional thing inside RENDER components! no need to have them in the other ones since resources will only be used by render
	//thinking of making it a function preload so it can handle the logic
	//in that case, the structure has to be set so there's a callback back to the world when it's complete
	//each behavior can then just preload its own shit however it wants
	//avoids a resource manager singleton and instead delegates the job to the components
	//more composition based!
	//*****need to think through renderers; should it be 1 per obj (new spritemap per obj) or 1 all (1 spritemap obj for all types) as that can change things

	//problem is once preload is considered, must think through sound as well
	//wanted to leave for later but it also utilizes preload
	//sound has to be handled on a macro scale
	//if you try to rollback sound on micro scale, a sound that should never have been played gets removed, swapped, and has no chance to hit render to stop the playing sound
	//so it has to be on a macro scale with like a sound manager
	//sounds are sorted in order of start frame (oh yah, world needs to give frame access)
	//can then check data for start frame against local data of rendered start frame
	//so how does this sound manager work? should each sound render have access to a facade of the manager?
	//but then can't play all sounds
	//so maybe 1 sound manager per type of sound! max count 1 and it's always alive
	//but that doesnt work with data rollback and dump...ugh

	//wait, micro scale might work
	//the macro can be the render object itself, which in dod is given a count anyways
	//since local data isn't wiped, can use that to check against it
	//aka local data is the real checker
	//issue then is how to remove finished sounds? since i want to keep things sorted in order in theory
	//render might be a bit slower in that it has to sort things...might just manually resort each time not sure
	//instead of sorting, assume new ones are always later right?
	//can theoretically do a shift manually of all data, then remove the last one
	//alternatively, consider if can do it without being in order?
};

rbGame.World.prototype.resourceLoaded = function() {
	console.log("preload callback with resources " + this._numResources);

	//decrement
	this._numResources--;

	//complete
	if(this._numResources == 0) {
		//callback
		this._preloadCompleteCallback();
	}
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

		if(render) {
			//parameters
			var data = this._renderData[i];
			var properties = this._renderProperties[i];

			//run
			this._renders[i].run(ctx, count, data, properties);
		}
	}
};
