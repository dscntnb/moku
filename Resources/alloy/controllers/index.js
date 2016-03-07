function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.__alloyId10 = Alloy.createController("calculator", {
        id: "__alloyId10"
    });
    $.__views.index.addTab($.__views.__alloyId10.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId11 = Alloy.createController("damageTable", {
        id: "__alloyId11"
    });
    $.__views.index.addTab($.__views.__alloyId11.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId12 = Alloy.createController("fireDamageTable", {
        id: "__alloyId12"
    });
    $.__views.index.addTab($.__views.__alloyId12.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId13 = Alloy.createController("registerEquip", {
        id: "__alloyId13"
    });
    $.__views.index.addTab($.__views.__alloyId13.getViewEx({
        recurse: true
    }));
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Cloud = require("ti.cloud");
    Cloud.Objects.query({
        classname: "skills",
        page: 1,
        per_page: 100,
        order: "name"
    }, function(e) {
        e.success ? Alloy.Globals.skills = e.skills : alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
    });
    Cloud.Objects.query({
        classname: "equipType",
        page: 1,
        per_page: 500,
        order: "sort_id"
    }, function(e) {
        if (e.success) {
            Alloy.Globals.equipType = Alloy.createCollection("equipType");
            _.each(e.equipType, function(etype) {
                Alloy.Globals.equipType.add(Alloy.createModel("equipType", {
                    type: etype.type,
                    name: etype.name
                }));
            });
        } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
    });
    Cloud.Objects.query({
        classname: "equips",
        page: 1,
        per_page: 500,
        order: "name"
    }, function(e) {
        if (e.success) {
            Alloy.Globals.equips = Alloy.createCollection("equips");
            _.each(e.equips, function(etype) {
                Alloy.Globals.equips.add(Alloy.createModel("equips", {
                    type: etype.type,
                    name: etype.name,
                    tl: etype.tl,
                    tc: etype.tc,
                    tr: etype.tr,
                    cl: etype.cl,
                    cc: etype.cc,
                    cr: etype.cr,
                    bl: etype.bl,
                    bc: etype.bc,
                    br: etype.br
                }));
            });
        } else alert("Error:\n" + (e.error && e.message || JSON.stringify(e)));
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;