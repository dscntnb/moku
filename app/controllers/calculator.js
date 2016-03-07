var measurement = require('alloy/measurement');

//////////////////////////////////////////////////
// Properties
//////////////////////////////////////////////////
$.selectedView = null;
$.currentLogView = null;
$.positions = ['tl', 'tc', 'tr', 'cl', 'cc', 'cr', 'bl', 'bc', 'br'];
// $.histories = [];

//////////////////////////////////////////////////
// Private methods
//////////////////////////////////////////////////
function createDamageLog(damage) {
	var label;
	label = Ti.UI.createLabel({
		text: damage,
		width: '50dp',
		height: '50dp',
		backgroundColor: 'white',
		borderColor: 'black',
		borderWidth: '1dp',
		color: 'black',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: { fontSize: '20dp' },
		// custom
		isLog: true
	});
	label.addEventListener('click', onSelect);
	return label;
}

function addLog(logView) {
	// スクロールビュー調整
	var len = $.logs.getChildren().length;
	var widthString = '' + logView.getWidth();
	var contentWidthDP = parseInt(widthString.substring(0, widthString.length - 2));
	contentWidthDP = contentWidthDP * (len + 1);
	var platformWidth = Ti.Platform.displayCaps.getPlatformWidth();
	var platformWidthDP = measurement.pxToDP(platformWidth);
	if (platformWidthDP <= contentWidthDP) {
		var currentXDP = measurement.pxToDP($.logs.x);
		var currentDiffDP = contentWidthDP - currentXDP;
		if (currentDiffDP >= platformWidthDP) {
			var xDP = contentWidthDP - platformWidthDP;
			var x = measurement.dpToPX(xDP + 10);
			$.logs.scrollTo(x, 0);
		}
	} else {
		$.logs.scrollTo(0, 0);
	}
	$.logs.add(logView);
}

function saveDamageLog(logView, place) {
	var index = 0;
	if ($.logs.getChildren().length > 0) {
		index = $.logs.getChildren().length;
	}
	logView.index = index;
	logView.place = place;
	logView.setColor('#999');
	logView.setBorderColor('#999');
	addLog(logView);
}

//////////////////////////////////////////////////
// Events
//////////////////////////////////////////////////
function onSelect(e) {
	if (e.source === $.currentLogView) {
		return;
	}
	if ($.selectedView) {
		$.selectedView.setBorderColor('black');
		$.selectedView.setBorderWidth(1);
	}
	$.selectedView = e.source;
	$.selectedView.setBorderColor('#00B6FF');
	$.selectedView.setBorderWidth(5);

	// ログ部分更新
	if ($.selectedView.isLog === false) {
		var currentLogView;
		_.each($.logs.getChildren(), function(child) {
			if (child === $.currentLogView) {
				currentLogView = $.currentLogView
			}
			$.logs.remove(child);
		});
		$.logs.scrollTo(0, 0);
		if ( ! _.isArray($.selectedView.damages)) {
			$.selectedView.damages = [];
		}
		_.each($.selectedView.damages, function(damage) {
			var logView  = createDamageLog(damage);
			saveDamageLog(logView, e.source.id);
		});
		// 現在の最新ログは選択を変更しても取っておく
		if (currentLogView) {
			addLog(currentLogView);
		}
	}
}

// 数字押下時
function onCalcButton(e) {
	var value = '' + e.source.getTitle();
	if ( ! $.currentLogView) {
		// tmpDamageLogViewとして追加
		if (value === '0') {
			return;
		}
		$.currentLogView = createDamageLog(value);
		addLog($.currentLogView);
	} else {
		if (value === '0' && ! $.currentLogView.getText()) {
			return;
		}
		$.currentLogView.setText($.currentLogView.getText() + value);
	}
	$.deleteButton.setEnabled(true);
	$.doneButton.setEnabled(true);
}

// 一文字削除ボタン
$.deleteButton.addEventListener('click', function(e) {
	if ($.currentLogView) {
		var value = $.currentLogView.getText();
		value = value.substring(0, value.length - 1);
		$.currentLogView.setText(value);
	}
});

// 決定ボタン
$.doneButton.addEventListener('click', function(e) {
	if ($.currentLogView) {
		if ($.selectedView) {
			if ( ! $.currentLogView.getText()) {
				return;
			}
			// ログ修正
			if ($.selectedView.isLog === true) {
				var oldDamge = $.selectedView.getText();
				var newDamage = $.currentLogView.getText();
				oldDamge = parseInt(oldDamge);
				newDamage = parseInt(newDamage);
				$.selectedView.setText(newDamage);
				$.logs.remove($.currentLogView);
				// ダメージログ修正
				var hpView = $[$.selectedView.place];
				hpView.damages[$.selectedView.index] = newDamage;
				// 見た目修正
				var hp = hpView.getText();
				hpView.setText(hp + oldDamge - newDamage);
			}
			// ダメージ追加
			else {
				// ダメージ追加
				var hp = $.selectedView.getText();
				hp = ! hp ? 0 : parseInt(hp);
				var damage = $.currentLogView.getText();
				damage = ! damage ? 0 : parseInt(damage);
				hp = hp - damage;
				$.selectedView.setText(hp);

				// ダメージログ更新
				$.logs.remove($.currentLogView);
				saveDamageLog($.currentLogView, $.selectedView.id);

				// ダメージログ保存
				$.selectedView.damages.push(damage);
			}
			$.currentLogView = null;
			$.deleteButton.setEnabled(false);
			$.doneButton.setEnabled(false);
		} else {
			alert('ログ記録場所を選んでください');
		}
	}
});

// 装備選択ボタン
$.selectEquip.addEventListener('click', function(e) {
	if ( ! Alloy.Globals.equipType || ! Alloy.Globals.equips) {
		alert('しばらく経ってから再度お試しください');
		return;
	}
	var typeOptions = [];
	Alloy.Globals.equipType.each(function(etype) {
		typeOptions.push(etype.get('name'));
	});
	var typeOptionDialog = Ti.UI.createOptionDialog({
		title: e.source.getTitle(),
		options: typeOptions
	});
	typeOptionDialog.addEventListener('click', function(e) {
		var currentEquipType;
		var options = e.source.getOptions();
		if (e.index >= 0) {
			currentEquipType = options[e.index];
		}
		if ( ! currentEquipType) {
			return;
		}

		var equipOptions = [];
		Alloy.Globals.equips.each(function(equip) {
			if (equip.get('type') === currentEquipType) {
				equipOptions.push(equip.get('name'));
			}
		});
		var equipOptionDialog = Ti.UI.createOptionDialog({
			title: currentEquipType,
			options: equipOptions
		});
		equipOptionDialog.addEventListener('click', function(e) {
			var currentEquipName;
			var options = e.source.getOptions();
			if (e.index >= 0) {
				currentEquipName = options[e.index];
			}
			if ( ! currentEquipName) {
				return;
			}

			onReset();
			var currentEquip = Alloy.Globals.equips.find(function(item) {
				return item.get('name') === currentEquipName;
			});
			$.equipLabel.setText(currentEquipName);
			_.each($.positions, function(position) {
				var hp = currentEquip.get(position);
				$[position].maxHp = hp;
				if (hp > 0) {
					$[position].setText(hp);
				} else {
					$[position].setText(null);
				}
			});
		});
		equipOptionDialog.show();
	});
	typeOptionDialog.show();
});

// リセット
function onReset(hpClearFlag) {
	hpClearFlag = _.isBoolean(hpClearFlag) ? hpClearFlag : false;
	// HPビューお掃除
	_.each($.positions, function(position) {
		$[position].damages = [];
		if (hpClearFlag === true) {
			$[position].setText(null);
		} else {
			var hp = $[position].maxHp;
			if (hp > 0) {
				$[position].setText(hp);
			} else {
				$[position].setText(null);
			}
		}
	});
	// ログビューお掃除
	_.each($.logs.getChildren(), function(child) {
		$.logs.remove(child);
	});
	$.currentLogView = null;
	$.deleteButton.setEnabled(false);
	$.doneButton.setEnabled(false);
}

// リセットボタン
$.reset.addEventListener('click', function(e) {
	var dialog = Ti.UI.createAlertDialog({
		message: 'HPをリセットしますか？（この動作は元に戻せません）',
		buttonNames: ['はい', 'いいえ'],
		cancel: 1
	});
	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			onReset();
		}
	});
	dialog.show();
});

// スクロール位置を保存
$.logs.addEventListener('scroll', function(e) {
	e.source.x = e.x;
	e.source.y = e.y;
});

$.tl.addEventListener('click', onSelect);
$.tc.addEventListener('click', onSelect);
$.tr.addEventListener('click', onSelect);
$.cl.addEventListener('click', onSelect);
$.cc.addEventListener('click', onSelect);
$.cr.addEventListener('click', onSelect);
$.bl.addEventListener('click', onSelect);
$.bc.addEventListener('click', onSelect);
$.br.addEventListener('click', onSelect);
