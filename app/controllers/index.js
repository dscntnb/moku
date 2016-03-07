// データ取得
var Cloud = require('ti.cloud');

// 特技取得
Cloud.Objects.query({
    classname: 'skills',
    page: 1,
    per_page: 100,
    order: 'name'
}, function (e) {
    if (e.success) {
        Alloy.Globals.skills = e.skills;
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});

// 装備種別取得
Cloud.Objects.query({
    classname: 'equipType',
    page: 1,
    per_page: 500,
    order: 'sort_id'
}, function (e) {
    if (e.success) {
    	Alloy.Globals.equipType = Alloy.createCollection('equipType');
    	_.each(e.equipType, function(etype) {
    		Alloy.Globals.equipType.add(Alloy.createModel('equipType', {
    			type: etype.type,
    			name: etype.name
    		}));
    	});
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});

// 装備取得
Cloud.Objects.query({
    classname: 'equips',
    page: 1,
    per_page: 500,
    order: 'name'
}, function (e) {
    if (e.success) {
        Alloy.Globals.equips = Alloy.createCollection('equips');
    	_.each(e.equips, function(etype) {
    		Alloy.Globals.equips.add(Alloy.createModel('equips', {
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
    } else {
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});

// アプリを開く
$.index.open();