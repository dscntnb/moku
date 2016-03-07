exports.definition = {
	config: {
		columns: {
		    "type": "text",
		    "name": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "equipType"
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

