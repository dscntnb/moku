exports.definition = {
	config: {
		columns: {
		    "type": "text",
		    "name": "text",
		    "tl": "integer",
		    "tc": "integer",
		    "tr": "integer",
		    "cl": "integer",
		    "cc": "integer",
		    "cr": "integer",
		    "bl": "integer",
		    "bc": "integer",
		    "br": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "equips"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});
		
		return Collection;
	}
}

