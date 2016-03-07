function Controller() {
    function setData(item, title, data) {
        if (item.get("title") === title) {
            var obj = {
                damage: {
                    text: "" + item.get("damage")
                },
                prob: {
                    text: Math.round(1e4 * item.get("prob")) / 100 + "%"
                }
            };
            if (item.get("prob") >= .15) {
                obj.prob.color = "blue";
                obj.damage.color = "blue";
            }
            if (item.get("prob") >= .25) {
                obj.prob.color = "red";
                obj.damage.color = "red";
            }
            data.push(obj);
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        id: "win"
    });
    $.__views.tab = Ti.UI.createTab({
        window: $.__views.win,
        id: "tab",
        title: "燃えダメ表",
        icon: "KS_nav_views.png"
    });
    $.__views.tab && $.addTopLevelView($.__views.tab);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.damages = Alloy.createCollection("damage");
    $.defaultSections = [];
    var damageTemplate = {
        childTemplates: [ {
            type: "Ti.UI.Label",
            bindId: "damage",
            properties: {
                color: "black",
                left: "10dp",
                width: "150dp",
                height: "30dp",
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                font: {
                    fontFamily: "Arial",
                    fontSize: "24dp",
                    fontWeight: "bold"
                }
            }
        }, {
            type: "Ti.UI.Label",
            bindId: "prob",
            properties: {
                color: "gray",
                right: "10dp",
                width: "150dp",
                height: "30dp",
                textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                font: {
                    fontFamily: "Arial",
                    fontSize: "20dp"
                }
            }
        } ]
    };
    var settingTemplate = {
        childTemplates: [ {
            type: "Ti.UI.Label",
            bindId: "title",
            properties: {
                color: "black",
                left: "10dp",
                width: "130dp",
                height: "45dp",
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                font: {
                    fontFamily: "Arial",
                    fontSize: "20dp",
                    fontWeight: "bold"
                }
            }
        }, {
            type: "Ti.UI.Label",
            bindId: "subtitle",
            properties: {
                color: "#3C578A",
                right: "10dp",
                width: "130dp",
                height: "45dp",
                textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                font: {
                    fontFamily: "Arial",
                    fontSize: "17dp"
                }
            }
        } ]
    };
    var listView = Ti.UI.createListView({
        templates: {
            template: damageTemplate
        },
        defaultItemTemplate: "template"
    });
    var header = Ti.UI.createView({
        color: "gray",
        height: "90dp",
        borderColor: "black",
        borderWidth: 1
    });
    var clearButton = Ti.UI.createButton({
        title: "Clear",
        right: 0,
        width: "60dp",
        height: "90dp"
    });
    var settingListView = Ti.UI.createListView({
        right: "60dp",
        borderColor: "black",
        borderWidth: 1,
        templates: {
            template: settingTemplate
        },
        defaultItemTemplate: "template"
    });
    var settingSectionItems = [ {
        title: {
            text: "ダメージ検索"
        },
        subtitle: {
            text: "未設定"
        }
    }, {
        title: {
            text: "彫り方検索"
        },
        subtitle: {
            text: "未設定"
        }
    } ];
    var settingSection = Ti.UI.createListSection({
        items: settingSectionItems
    });
    settingListView.setSections([ settingSection ]);
    header.add(clearButton);
    header.add(settingListView);
    $.win.add(header);
    $.win.add(listView);
    $.win.addEventListener("open", function() {
        $.skillTitles = [];
        var fireDamage = {};
        _.each(Alloy.Globals.skills, function(skill) {
            if (skill.isFire) {
                fireDamage = skill;
                return;
            }
            _.each(skill.grains, function(grain, gidx) {
                _.each(skill.coefficients, function(coefficient, cidx) {
                    _.each(skill.damages, function(damage) {
                        var title = "";
                        skill.grainsNames[gidx] && (title += "[" + skill.grainsNames[gidx] + "] ");
                        title += skill.name;
                        skill.coefficientsNames[cidx] && (title += "(" + skill.coefficientsNames[cidx] + ")");
                        var addSkillTitleFlag = true;
                        for (var i = 0, len = $.skillTitles.length; len > i; i++) if ($.skillTitles[i] === title) {
                            addSkillTitleFlag = false;
                            break;
                        }
                        true === addSkillTitleFlag && $.skillTitles.push(title);
                        var insertFlag = true;
                        var calcDamage = Math.ceil(damage * coefficient * grain);
                        $.damages.each(function(item) {
                            if (item.get("title") === title && item.get("damage") === calcDamage) {
                                insertFlag = false;
                                item.set("prob", item.get("prob") + 1 / skill.damages.length);
                            }
                        });
                        true === insertFlag && $.damages.add(Alloy.createModel("damage", {
                            title: title,
                            damage: calcDamage,
                            prob: 1 / skill.damages.length
                        }));
                    });
                });
            });
        });
        $.fireDamages = Alloy.createCollection("fireDamage");
        $.damages.each(function(item) {
            _.each(fireDamage.damages, function(dmg) {
                var insertFlag = true;
                var _dmg = item.get("damage") + dmg;
                var _prob = item.get("prob") * (1 / fireDamage.damages.length);
                $.fireDamages.each(function(fitem) {
                    if (fitem.get("title") === item.get("title") && fitem.get("damage") === _dmg) {
                        insertFlag = false;
                        fitem.set("prob", fitem.get("prob") + _prob);
                    }
                });
                true === insertFlag && $.fireDamages.add(Alloy.createModel("fireDamage", {
                    title: item.get("title"),
                    damage: _dmg,
                    prob: _prob
                }));
            });
        });
        $.skillTitles.push();
        _.each($.skillTitles, function(val) {
            var dataArray = [];
            $.fireDamages.each(function(item) {
                setData(item, val, dataArray);
            });
            $.defaultSections.push(Ti.UI.createListSection({
                headerTitle: val,
                items: dataArray
            }));
        });
        listView.setSections($.defaultSections);
    });
    clearButton.addEventListener("click", function() {
        settingSection.replaceItemsAt(0, settingSectionItems.length, settingSectionItems);
        listView.setSections($.defaultSections);
    });
    settingListView.addEventListener("itemclick", function(e) {
        var idx = e.itemIndex;
        var section = e.section;
        var options = [];
        var sortFunc;
        var searchItem;
        if (0 === idx) {
            searchItem = "damage";
            sortFunc = function(a, b) {
                if (a > b) return 1;
                if (b > a) return -1;
                return 0;
            };
        } else if (1 === idx) {
            searchItem = "title";
            sortFunc = function(a, b) {
                if (b > a) return 1;
                if (a > b) return -1;
                return 0;
            };
        }
        if (searchItem) {
            $.fireDamages.each(function(item) {
                var currentItem = item.get(searchItem);
                var duplicateFlag = false;
                for (var i = 0, len = options.length; len > i; i++) if (options[i] === currentItem) {
                    duplicateFlag = true;
                    break;
                }
                false === duplicateFlag && options.push(item.get(searchItem));
            });
            options = options.sort(sortFunc);
            var dialog = Ti.UI.createOptionDialog({
                options: options
            });
            dialog.addEventListener("click", function(e) {
                var sections = [];
                var searchDamges = $.fireDamages.filter(function(item) {
                    return item.get(searchItem) === options[e.index];
                });
                if ("damage" === searchItem) {
                    var _titles = [];
                    _.each(searchDamges, function(item) {
                        _titles.push(item.get("title"));
                    });
                    _.each(_titles, function(val) {
                        var dataArray = [];
                        $.fireDamages.each(function(item) {
                            setData(item, val, dataArray);
                        });
                        dataArray.length > 0 && sections.push(Ti.UI.createListSection({
                            headerTitle: val,
                            items: dataArray
                        }));
                    });
                } else _.each($.skillTitles, function(val) {
                    var dataArray = [];
                    _.each(searchDamges, function(item) {
                        setData(item, val, dataArray);
                    });
                    dataArray.length > 0 && sections.push(Ti.UI.createListSection({
                        headerTitle: val,
                        items: dataArray
                    }));
                });
                var title = section.getItemAt(idx).title.text;
                section.replaceItemsAt(idx, 1, [ {
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: options[e.index]
                    }
                } ]);
                0 === idx ? section.replaceItemsAt(1, 1, [ settingSectionItems[1] ]) : section.replaceItemsAt(0, 1, [ settingSectionItems[0] ]);
                sections.length > 0 && listView.setSections(sections);
            });
            dialog.show();
        }
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;