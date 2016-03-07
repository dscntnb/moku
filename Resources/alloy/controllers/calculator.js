function Controller() {
    function createDamageLog(damage) {
        var label;
        label = Ti.UI.createLabel({
            text: damage,
            width: "50dp",
            height: "50dp",
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: "1dp",
            color: "black",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            font: {
                fontSize: "20dp"
            },
            isLog: true
        });
        label.addEventListener("click", onSelect);
        return label;
    }
    function addLog(logView) {
        var len = $.logs.getChildren().length;
        var widthString = "" + logView.getWidth();
        var contentWidthDP = parseInt(widthString.substring(0, widthString.length - 2));
        contentWidthDP *= len + 1;
        var platformWidth = Ti.Platform.displayCaps.getPlatformWidth();
        var platformWidthDP = measurement.pxToDP(platformWidth);
        if (contentWidthDP >= platformWidthDP) {
            var currentXDP = measurement.pxToDP($.logs.x);
            var currentDiffDP = contentWidthDP - currentXDP;
            if (currentDiffDP >= platformWidthDP) {
                var xDP = contentWidthDP - platformWidthDP;
                var x = measurement.dpToPX(xDP + 10);
                $.logs.scrollTo(x, 0);
            }
        } else $.logs.scrollTo(0, 0);
        $.logs.add(logView);
    }
    function saveDamageLog(logView, place) {
        var index = 0;
        $.logs.getChildren().length > 0 && (index = $.logs.getChildren().length);
        logView.index = index;
        logView.place = place;
        logView.setColor("#999");
        logView.setBorderColor("#999");
        addLog(logView);
    }
    function onSelect(e) {
        if (e.source === $.currentLogView) return;
        if ($.selectedView) {
            $.selectedView.setBorderColor("black");
            $.selectedView.setBorderWidth(1);
        }
        $.selectedView = e.source;
        $.selectedView.setBorderColor("#00B6FF");
        $.selectedView.setBorderWidth(5);
        if (false === $.selectedView.isLog) {
            var currentLogView;
            _.each($.logs.getChildren(), function(child) {
                child === $.currentLogView && (currentLogView = $.currentLogView);
                $.logs.remove(child);
            });
            $.logs.scrollTo(0, 0);
            _.isArray($.selectedView.damages) || ($.selectedView.damages = []);
            _.each($.selectedView.damages, function(damage) {
                var logView = createDamageLog(damage);
                saveDamageLog(logView, e.source.id);
            });
            currentLogView && addLog(currentLogView);
        }
    }
    function onCalcButton(e) {
        var value = "" + e.source.getTitle();
        if ($.currentLogView) {
            if ("0" === value && !$.currentLogView.getText()) return;
            $.currentLogView.setText($.currentLogView.getText() + value);
        } else {
            if ("0" === value) return;
            $.currentLogView = createDamageLog(value);
            addLog($.currentLogView);
        }
        $.deleteButton.setEnabled(true);
        $.doneButton.setEnabled(true);
    }
    function onReset(hpClearFlag) {
        hpClearFlag = _.isBoolean(hpClearFlag) ? hpClearFlag : false;
        _.each($.positions, function(position) {
            $[position].damages = [];
            if (true === hpClearFlag) $[position].setText(null); else {
                var hp = $[position].maxHp;
                hp > 0 ? $[position].setText(hp) : $[position].setText(null);
            }
        });
        _.each($.logs.getChildren(), function(child) {
            $.logs.remove(child);
        });
        $.currentLogView = null;
        $.deleteButton.setEnabled(false);
        $.doneButton.setEnabled(false);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "win"
    });
    $.__views.header = Ti.UI.createView({
        top: 0,
        height: "50dp",
        layout: "horizontal",
        backgroundColor: "#F8F8F8",
        id: "header"
    });
    $.__views.win.add($.__views.header);
    $.__views.logs = Ti.UI.createScrollView({
        x: 0,
        y: 0,
        contentWidth: "10000dp",
        showHorizontalScrollIndicator: true,
        layout: "horizontal",
        scrollType: "horizontal",
        id: "logs"
    });
    $.__views.header.add($.__views.logs);
    $.__views.body = Ti.UI.createView({
        top: "50dp",
        bottom: "180dp",
        backgroundColor: "#F8F8F8",
        id: "body"
    });
    $.__views.win.add($.__views.body);
    $.__views.toolbar = Ti.UI.createView({
        right: "180dp",
        layout: "vertical",
        id: "toolbar"
    });
    $.__views.body.add($.__views.toolbar);
    $.__views.equipLabel = Ti.UI.createLabel({
        height: "60dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        id: "equipLabel"
    });
    $.__views.toolbar.add($.__views.equipLabel);
    $.__views.selectEquip = Ti.UI.createButton({
        title: "装備選択",
        id: "selectEquip"
    });
    $.__views.toolbar.add($.__views.selectEquip);
    $.__views.reset = Ti.UI.createButton({
        title: "リセット",
        id: "reset"
    });
    $.__views.toolbar.add($.__views.reset);
    $.__views.hps = Ti.UI.createView({
        right: 0,
        width: "180dp",
        layout: "horizontal",
        id: "hps"
    });
    $.__views.body.add($.__views.hps);
    $.__views.tl = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "tl"
    });
    $.__views.hps.add($.__views.tl);
    $.__views.tc = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "tc"
    });
    $.__views.hps.add($.__views.tc);
    $.__views.tr = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "tr"
    });
    $.__views.hps.add($.__views.tr);
    $.__views.cl = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "cl"
    });
    $.__views.hps.add($.__views.cl);
    $.__views.cc = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "cc"
    });
    $.__views.hps.add($.__views.cc);
    $.__views.cr = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "cr"
    });
    $.__views.hps.add($.__views.cr);
    $.__views.bl = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "bl"
    });
    $.__views.hps.add($.__views.bl);
    $.__views.bc = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "bc"
    });
    $.__views.hps.add($.__views.bc);
    $.__views.br = Ti.UI.createLabel({
        width: "60dp",
        height: "60dp",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: "1dp",
        color: "black",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        isLog: false,
        damages: [],
        id: "br"
    });
    $.__views.hps.add($.__views.br);
    $.__views.footer = Ti.UI.createView({
        bottom: 0,
        height: "180dp",
        id: "footer"
    });
    $.__views.win.add($.__views.footer);
    $.__views.numberView = Ti.UI.createView({
        left: "5dp",
        width: "230dp",
        layout: "horizontal",
        id: "numberView"
    });
    $.__views.footer.add($.__views.numberView);
    $.__views.__alloyId0 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "7",
        id: "__alloyId0"
    });
    $.__views.numberView.add($.__views.__alloyId0);
    onCalcButton ? $.__views.__alloyId0.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId0!click!onCalcButton"] = true;
    $.__views.__alloyId1 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "8",
        id: "__alloyId1"
    });
    $.__views.numberView.add($.__views.__alloyId1);
    onCalcButton ? $.__views.__alloyId1.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId1!click!onCalcButton"] = true;
    $.__views.__alloyId2 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "9",
        id: "__alloyId2"
    });
    $.__views.numberView.add($.__views.__alloyId2);
    onCalcButton ? $.__views.__alloyId2.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId2!click!onCalcButton"] = true;
    $.__views.__alloyId3 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "4",
        id: "__alloyId3"
    });
    $.__views.numberView.add($.__views.__alloyId3);
    onCalcButton ? $.__views.__alloyId3.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId3!click!onCalcButton"] = true;
    $.__views.__alloyId4 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "5",
        id: "__alloyId4"
    });
    $.__views.numberView.add($.__views.__alloyId4);
    onCalcButton ? $.__views.__alloyId4.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId4!click!onCalcButton"] = true;
    $.__views.__alloyId5 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "6",
        id: "__alloyId5"
    });
    $.__views.numberView.add($.__views.__alloyId5);
    onCalcButton ? $.__views.__alloyId5.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId5!click!onCalcButton"] = true;
    $.__views.__alloyId6 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "1",
        id: "__alloyId6"
    });
    $.__views.numberView.add($.__views.__alloyId6);
    onCalcButton ? $.__views.__alloyId6.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId6!click!onCalcButton"] = true;
    $.__views.__alloyId7 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "2",
        id: "__alloyId7"
    });
    $.__views.numberView.add($.__views.__alloyId7);
    onCalcButton ? $.__views.__alloyId7.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId7!click!onCalcButton"] = true;
    $.__views.__alloyId8 = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        title: "3",
        id: "__alloyId8"
    });
    $.__views.numberView.add($.__views.__alloyId8);
    onCalcButton ? $.__views.__alloyId8.addEventListener("click", onCalcButton) : __defers["$.__views.__alloyId8!click!onCalcButton"] = true;
    $.__views.zeroButton = Ti.UI.createButton({
        width: "150dp",
        height: "45dp",
        title: "0",
        id: "zeroButton"
    });
    $.__views.numberView.add($.__views.zeroButton);
    onCalcButton ? $.__views.zeroButton.addEventListener("click", onCalcButton) : __defers["$.__views.zeroButton!click!onCalcButton"] = true;
    $.__views.actionView = Ti.UI.createView({
        left: "235dp",
        layout: "horizontal",
        id: "actionView"
    });
    $.__views.footer.add($.__views.actionView);
    $.__views.deleteButton = Ti.UI.createButton({
        width: "75dp",
        height: "45dp",
        enabled: false,
        title: "DEL",
        id: "deleteButton"
    });
    $.__views.actionView.add($.__views.deleteButton);
    $.__views.doneButton = Ti.UI.createButton({
        width: "75dp",
        height: "135dp",
        enabled: false,
        title: "決定",
        id: "doneButton"
    });
    $.__views.actionView.add($.__views.doneButton);
    $.__views.tab = Ti.UI.createTab({
        window: $.__views.win,
        id: "tab",
        title: "計算機",
        icon: "KS_nav_ui.png"
    });
    $.__views.tab && $.addTopLevelView($.__views.tab);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var measurement = require("alloy/measurement");
    $.selectedView = null;
    $.currentLogView = null;
    $.positions = [ "tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br" ];
    $.deleteButton.addEventListener("click", function() {
        if ($.currentLogView) {
            var value = $.currentLogView.getText();
            value = value.substring(0, value.length - 1);
            $.currentLogView.setText(value);
        }
    });
    $.doneButton.addEventListener("click", function() {
        if ($.currentLogView) if ($.selectedView) {
            if (!$.currentLogView.getText()) return;
            if (true === $.selectedView.isLog) {
                var oldDamge = $.selectedView.getText();
                var newDamage = $.currentLogView.getText();
                oldDamge = parseInt(oldDamge);
                newDamage = parseInt(newDamage);
                $.selectedView.setText(newDamage);
                $.logs.remove($.currentLogView);
                var hpView = $[$.selectedView.place];
                hpView.damages[$.selectedView.index] = newDamage;
                var hp = hpView.getText();
                hpView.setText(hp + oldDamge - newDamage);
            } else {
                var hp = $.selectedView.getText();
                hp = hp ? parseInt(hp) : 0;
                var damage = $.currentLogView.getText();
                damage = damage ? parseInt(damage) : 0;
                hp -= damage;
                $.selectedView.setText(hp);
                $.logs.remove($.currentLogView);
                saveDamageLog($.currentLogView, $.selectedView.id);
                $.selectedView.damages.push(damage);
            }
            $.currentLogView = null;
            $.deleteButton.setEnabled(false);
            $.doneButton.setEnabled(false);
        } else alert("ログ記録場所を選んでください");
    });
    $.selectEquip.addEventListener("click", function(e) {
        if (!Alloy.Globals.equipType || !Alloy.Globals.equips) {
            alert("しばらく経ってから再度お試しください");
            return;
        }
        var typeOptions = [];
        Alloy.Globals.equipType.each(function(etype) {
            typeOptions.push(etype.get("name"));
        });
        var typeOptionDialog = Ti.UI.createOptionDialog({
            title: e.source.getTitle(),
            options: typeOptions
        });
        typeOptionDialog.addEventListener("click", function(e) {
            var currentEquipType;
            var options = e.source.getOptions();
            e.index >= 0 && (currentEquipType = options[e.index]);
            if (!currentEquipType) return;
            var equipOptions = [];
            Alloy.Globals.equips.each(function(equip) {
                equip.get("type") === currentEquipType && equipOptions.push(equip.get("name"));
            });
            var equipOptionDialog = Ti.UI.createOptionDialog({
                title: currentEquipType,
                options: equipOptions
            });
            equipOptionDialog.addEventListener("click", function(e) {
                var currentEquipName;
                var options = e.source.getOptions();
                e.index >= 0 && (currentEquipName = options[e.index]);
                if (!currentEquipName) return;
                onReset();
                var currentEquip = Alloy.Globals.equips.find(function(item) {
                    return item.get("name") === currentEquipName;
                });
                $.equipLabel.setText(currentEquipName);
                _.each($.positions, function(position) {
                    var hp = currentEquip.get(position);
                    $[position].maxHp = hp;
                    hp > 0 ? $[position].setText(hp) : $[position].setText(null);
                });
            });
            equipOptionDialog.show();
        });
        typeOptionDialog.show();
    });
    $.reset.addEventListener("click", function() {
        var dialog = Ti.UI.createAlertDialog({
            message: "HPをリセットしますか？（この動作は元に戻せません）",
            buttonNames: [ "はい", "いいえ" ],
            cancel: 1
        });
        dialog.addEventListener("click", function(e) {
            0 === e.index && onReset();
        });
        dialog.show();
    });
    $.logs.addEventListener("scroll", function(e) {
        e.source.x = e.x;
        e.source.y = e.y;
    });
    $.tl.addEventListener("click", onSelect);
    $.tc.addEventListener("click", onSelect);
    $.tr.addEventListener("click", onSelect);
    $.cl.addEventListener("click", onSelect);
    $.cc.addEventListener("click", onSelect);
    $.cr.addEventListener("click", onSelect);
    $.bl.addEventListener("click", onSelect);
    $.bc.addEventListener("click", onSelect);
    $.br.addEventListener("click", onSelect);
    __defers["$.__views.__alloyId0!click!onCalcButton"] && $.__views.__alloyId0.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId1!click!onCalcButton"] && $.__views.__alloyId1.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId2!click!onCalcButton"] && $.__views.__alloyId2.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId3!click!onCalcButton"] && $.__views.__alloyId3.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId4!click!onCalcButton"] && $.__views.__alloyId4.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId5!click!onCalcButton"] && $.__views.__alloyId5.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId6!click!onCalcButton"] && $.__views.__alloyId6.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId7!click!onCalcButton"] && $.__views.__alloyId7.addEventListener("click", onCalcButton);
    __defers["$.__views.__alloyId8!click!onCalcButton"] && $.__views.__alloyId8.addEventListener("click", onCalcButton);
    __defers["$.__views.zeroButton!click!onCalcButton"] && $.__views.zeroButton.addEventListener("click", onCalcButton);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;