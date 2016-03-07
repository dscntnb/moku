exports.definition = {
    config: {
        columns: {
            title: "TEXT",
            damage: "INTEGER",
            prob: "REAL"
        },
        adapter: {
            type: "sql",
            collection_name: "fireDamage"
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

model = Alloy.M("fireDamage", exports.definition, []);

collection = Alloy.C("fireDamage", exports.definition, model);

exports.Model = model;

exports.Collection = collection;