exports.definition = {
    config: {
        columns: {
            type: "text",
            name: "text",
            tl: "integer",
            tc: "integer",
            tr: "integer",
            cl: "integer",
            cc: "integer",
            cr: "integer",
            bl: "integer",
            bc: "integer",
            br: "integer"
        },
        adapter: {
            type: "sql",
            collection_name: "equips"
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

model = Alloy.M("equips", exports.definition, []);

collection = Alloy.C("equips", exports.definition, model);

exports.Model = model;

exports.Collection = collection;