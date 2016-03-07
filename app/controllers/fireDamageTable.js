// データコレクション
$.damages = Alloy.createCollection('damage');
// Alloy.Collections.instance('damage');

// Sections
$.defaultSections = [];

//////////////////////////////////////////////////
// Create templates
//////////////////////////////////////////////////
// ダメージ表部分
var damageTemplate = {
	childTemplates: [{
		type: 'Ti.UI.Label',
		bindId: 'damage',
		properties: {
			color: 'black',
			left: '10dp',
			width: '150dp',
			height: '30dp',
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			font: { fontFamily:'Arial', fontSize: '24dp', fontWeight:'bold' },
		}
	},{
		type: 'Ti.UI.Label',
		bindId: 'prob',
		properties: {
			color: 'gray',
			right: '10dp',
			width: '150dp',
			height: '30dp',
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			font: { fontFamily:'Arial', fontSize: '20dp' },
		}
	}]
};

// 上部の検索部分
var settingTemplate = {
	childTemplates: [{
		type: 'Ti.UI.Label',
		bindId: 'title',
		properties: {
			color: 'black',
			left: '10dp',
			width: '130dp',
			height: '45dp',
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			font: { fontFamily:'Arial', fontSize: '20dp', fontWeight:'bold' },
		}
	},{
		type: 'Ti.UI.Label',
		bindId: 'subtitle',
		properties: {
			color: '#3C578A',
			right: '10dp',
			width: '130dp',
			height: '45dp',
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			font: { fontFamily:'Arial', fontSize: '17dp' },
		}
	}]
};

//////////////////////////////////////////////////
// Create UI
//////////////////////////////////////////////////
// リストビュー
var listView = Ti.UI.createListView({
    templates: { 'template': damageTemplate },
    defaultItemTemplate: 'template'
});

// ヘッダー
var header = Ti.UI.createView({
	color: 'gray',
	height: '90dp',
	borderColor: 'black',
	borderWidth: 1
});
var clearButton = Ti.UI.createButton({
	title: 'Clear',
	right: 0,
	width: '60dp',
	height: '90dp'
});
var settingListView = Ti.UI.createListView({
	right: '60dp',
	borderColor: 'black',
	borderWidth: 1,
	templates: { 'template': settingTemplate },
    defaultItemTemplate: 'template'
});
var settingSectionItems = [
	{ title: { text: 'ダメージ検索' }, subtitle: { text: '未設定' } },
	{ title: { text: '彫り方検索' }, subtitle: { text: '未設定' } }
];
var settingSection = Ti.UI.createListSection({ items: settingSectionItems});

//////////////////////////////////////////////////
// Add UI
//////////////////////////////////////////////////
// Sections
// listView.setSections($.defaultSections);
settingListView.setSections([ settingSection ]);

// UI
header.add(clearButton);
header.add(settingListView);
$.win.add(header);
$.win.add(listView);

//////////////////////////////////////////////////
// Private methods
//////////////////////////////////////////////////
/**
 * データをセット
 * 指定したタイトルだけを配列に入れる
 * 一定確率以上の特技の表示色を替える
 * 
 * @param {Object} item
 * @param {String} title
 * @param {Object} data
 */
function setData(item, title, data) {
	if (item.get('title') === title) {
		var obj = {
			damage: { text: '' + item.get('damage') },
			prob: { text: Math.round(item.get('prob') * 10000) / 100 + '%' }
		};
		// 確率が高い彫り方の色を変更
		if (item.get('prob') >= 0.15) {
			obj.prob.color = 'blue';
			obj.damage.color = 'blue';
		}
		if (item.get('prob') >= 0.25) {
			obj.prob.color = 'red';
			obj.damage.color = 'red';
		}
		data.push(obj);
	}
};

//////////////////////////////////////////////////
// Events
//////////////////////////////////////////////////
$.win.addEventListener('open', function(e) {
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
					var title = '';
					if (skill.grainsNames[gidx]) {
						title += '[' + skill.grainsNames[gidx] + '] ';
					}
					title += skill.name;
					if (skill.coefficientsNames[cidx]) {
						title += '(' + skill.coefficientsNames[cidx] + ')';
					}

					// タイトル配列
					var addSkillTitleFlag = true;
					for (var i = 0, len = $.skillTitles.length; i < len; i++) {
						if ($.skillTitles[i] === title) {
							addSkillTitleFlag = false;
							break;
						}
					}
					if (addSkillTitleFlag === true) {
						$.skillTitles.push(title);
					}

					// データ追加
					var insertFlag = true;
					var calcDamage = Math.ceil(damage * coefficient * grain);
					$.damages.each(function(item) {
						if (item.get('title') === title && item.get('damage') === calcDamage) {
							insertFlag = false;
							item.set('prob', item.get('prob') + 1 / skill.damages.length);
						}
					});
					if (insertFlag === true) {
						$.damages.add(Alloy.createModel('damage', {
							title: title,
							damage: calcDamage,
							prob: 1 / skill.damages.length
						}));
					}
				});
			});
		});
	});

	// 燃えダメージ作成
	$.fireDamages = Alloy.createCollection('fireDamage');
	$.damages.each(function(item, index) {
		_.each(fireDamage.damages, function(dmg) {
			var insertFlag = true;
			var _dmg = item.get('damage') + dmg;
			var _prob = item.get('prob') * (1 / fireDamage.damages.length);
			$.fireDamages.each(function(fitem) {
				if (fitem.get('title') === item.get('title') && fitem.get('damage') === _dmg) {
					insertFlag = false;
					fitem.set('prob', fitem.get('prob') + _prob);
				} 
			});
			if (insertFlag === true) {
				$.fireDamages.add(Alloy.createModel('fireDamage', {
					title: item.get('title'),
					damage: _dmg,
					prob: _prob
				}));
			}
		});
	});

	// 複合特技
	$.skillTitles.push();
	// hori1: '固め燃え+燃え',
	// hori2: '固め燃え+燃え+燃え',
	// hori3: '固め燃え+燃え+燃え+燃え',
	// hori7: '逆目通常+固め燃え',
	// hori10: '逆目通常+逆目カンナ'
	// hori9: '逆目流星弱+逆目カンナ',
	// hori5: '逆目流星弱+固め燃え',
	// hori4: '逆目カンナ+固め燃え',
	// hori6: '逆目カンナ+逆目カンナ',
	// hori8: '逆目カンナ+固め燃え+燃え',

	// セクション作成
	_.each($.skillTitles, function(val, key) {
		var dataArray = [];
		$.fireDamages.each(function(item, index) {
			setData(item, val, dataArray);
		});
		$.defaultSections.push(Ti.UI.createListSection({ headerTitle: val, items: dataArray }));
	});
	listView.setSections($.defaultSections);
});

// クリアボタン
clearButton.addEventListener('click', function(e) {
	settingSection.replaceItemsAt(0, settingSectionItems.length, settingSectionItems);
	listView.setSections($.defaultSections);
});

// ヘッダー設定リストビュー
settingListView.addEventListener("itemclick", function (e) {
	var idx = e.itemIndex;
    var section = e.section;
	var options = [];
	var sortFunc;
	var searchItem;
	if (idx === 0) {
		searchItem = 'damage';
		sortFunc = function(a, b) {
			if (a > b) return 1;
			if (b > a) return -1;
			return 0; 
		};
	} else if (idx === 1) {
		searchItem = 'title';
		sortFunc = function(a, b) {
			if (a < b) return 1;
			if (b < a) return -1;
			return 0; 
		};
	}
	if (searchItem) {
		$.fireDamages.each(function(item, index) {
			var currentItem = item.get(searchItem);
			var duplicateFlag = false;
			for (var i = 0, len = options.length; i < len; i++) {
				if (options[i] === currentItem) {
					duplicateFlag = true;
					break;
				}
			}
			if (duplicateFlag === false) {
				options.push(item.get(searchItem));
			}
		});
		options = options.sort(sortFunc);
		var dialog = Ti.UI.createOptionDialog({
			options: options
		});
		dialog.addEventListener('click', function(e) {
			// セクション作成
			var sections = [];
			var searchDamges = $.fireDamages.filter(function(item) {
				return item.get(searchItem) === options[e.index];
			});
			if (searchItem === 'damage') {
				var _titles = [];
				_.each(searchDamges, function(item) {
					_titles.push(item.get('title'));
				});
				_.each(_titles, function(val, key) {
					var dataArray = [];
					$.fireDamages.each(function(item, index) {
						setData(item, val, dataArray);
					});
					if (dataArray.length > 0) {
						sections.push(Ti.UI.createListSection({ headerTitle: val, items: dataArray }));
					}
				});
			} else {
				_.each($.skillTitles, function(val, key) {
					var dataArray = [];
					_.each(searchDamges, function(item, index) {
						setData(item, val, dataArray);
					});
					if (dataArray.length > 0) {
						sections.push(Ti.UI.createListSection({ headerTitle: val, items: dataArray }));
					}
				});
			}

			// 設定更新
			// タイトル取得
			var title = section.getItemAt(idx).title.text;
		    // 設定更新
			section.replaceItemsAt(idx, 1, [
				{ title: { text: title }, subtitle: { text: options[e.index] } }
		    ]);
		    // もう片方を未設定に戻す
		    if (idx === 0) {
				section.replaceItemsAt(1, 1, [settingSectionItems[1]]);
		    } else {
				section.replaceItemsAt(0, 1, [settingSectionItems[0]]);
		    }
		    // 一覧更新
		    if (sections.length > 0) {
			    listView.setSections(sections);
		    }
		});
		dialog.show();
	}
});