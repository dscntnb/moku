exports.definition = {
    config: {
        columns: {
            type: "text",
            name: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "equipType"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("equipType", exports.definition, []);

collection = Alloy.C("equipType", exports.definition, model);

exports.Model = model;

exports.Collection = collection;