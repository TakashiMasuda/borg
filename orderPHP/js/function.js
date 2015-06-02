
/* 
 * 関数名:createDialog
 * 引数  :
 *  dialogName ： ダイアログのセレクタ名
 *  openButton : ダイアログを開くためのボタン
 * 戻り値:なし
 * 概要  :ダイアログを作る
 * 作成日 :2015.01.14
 * 作成者:T.Yamamoto
*/
function createDialog(dialogName, openButton) {
	// 第一引数の要素に対してダイアログの設定をする
	$(dialogName).dialog({
		autoOpen: false,				// 自動で開かない
		width:320,						// ダイアログの幅
		show: "fade",					// 表示時のエフェクト
		hide: "fade",					// 非表示時のエフェクト
		modal:true						// ダイアログをモーダル化する
	});
	// ダイアログを開く設定をする
	$(openButton).click(function(){		// 第二引数の要素がクリックされた時
		$(dialogName).dialog('open');// ダイアログを開く
	});

	$('.okButton').click(function(){	// ダイアログのokボタンがクリックされたら
		$(dialogName).dialog('close');// ダイアログを閉じる
	});
}

/* 
 * 関数名:setOptionValue
 * 引数  :なし
 * 戻り値:なし
 * 概要  :optionタグのvalue属性に値を入れる
 * 作成日 :2015.01.16
 * 作成者:T.Yamamoto
*/
function setOptionValue() {
	// optionタグをループで全て操作する
	$("select option").each(function(i){
		// optionタグの文字列を変数に入れる
		var selectValue = $(this).text();
		// 取得した文字列をvalue属性に入れる
		$(this).val(selectValue);
	});
}

/* 
 * 関数名:setAddButtonLink
 * 引数  :
 *   selector	: addbuttonがあるセレクター名
 *   link  		: href属性の値
 * 戻り値:なし
 * 概要  :追加ボタンのhref属性をセットする
 * 作成日 :2015.01.13
 * 作成者:T.Yamamoto
*/
function setAddButtonLink(selector, link) {
	// 第一引数のセレクターに対してaddButtonクラスを持つ親要素に第二引数の値をhref属性に設定する
	$(selector).find('.addButton').parent().attr('href', link);
}

/* 
 * 関数名:funcTab
 * 引数 :なし
 * 戻り値:なし
 * 概要  :タブ機能を実装する
 * 作成日 :2015.01.13
 * 作成者:T.Yamamoto
*/
function funcTab() {
	// デフォルトのコンテンツを表示するために。selectedクラスを持つタブのname属性を取得する
	var defaultContent = $('.selected').attr('name');
	// デフォルトのタブコンテンツを表示する
	$('#' + defaultContent).css('display', 'block');
	// タブがクリックされた時の処理
	$('.tabOut').on('click', '.tablist a', function() {
		// クリックされた要素のクラス名を取得し、表示するコンテンツのid名として使う
		var displayContent = $(this).attr('name');
		// selectedクラスを全てのリストから取り除く
		$('.tablist a').removeClass('selected');
		// クリックした要素にselectedクラスを付け足す
		$(this).addClass('selected');
		// タブのコンテンツを全て非表示にする
		$('.tabIn .tabcontent').css('display', 'none');
		// クリックした要素に対応するコンテンツを表示する
		$('#' + displayContent).css('display', 'block');
	});
}

/* 
 * 関数名:setCalendar
 * 引数 :なし
 * 戻り値:なし
 * 概要  :カレンダー機能を実装する
 * 作成日 :2015.01.16
 * 作成者:T.Yamamoto
*/
function setCalendar() {
	// dateboxクラスに対してカレンダーを付ける設定をする
	$('.datebox').datepicker({
		dateFormat: 'y/mm/dd',			// フォーマットを14/01/01のようにする
		yearSuffix: '年',				// yearを日本語の「年」で表す
		showMonthAfterYear: true,		// タイトルの年の後ろに月が来るようにする
		// monthの日本語設定
		 monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	});
}

// 発注、新規・編集画面画面のname属性の値一覧
var sendAddEdit = {
	'発注日'		:'order_date',
	'発注先'		:'send_place',
	'発送指定日'	:'send_date',
	'納品指定日'	:'delivery_date',
	'入力者'		:'scribedby',
	'承認者'		:'permiter',
	'備考'		:'others',
	'合計金額'	:'amount'
};

// 受注、新規・編集画面画面のname属性の値一覧
var receivedAddEdit = {
	'受注日'			:'order_date',
	'受注コード'		:'order_code',
	'顧客名'			:'custmoer',
	'締日'			:'cutOffDate',
	'支払日'			:'payDate',
	'入力者'			:'scribedby',
	'承認者'			:'permiter',
	'納品場所'		:'deliveryPlace',
	'備考(社内向)'	:'OthersIn',
	'備考(社外向)'	:'OthersOut',
	'合計金額'		:'amount'
};

/* 
 * 関数名:setName
 * 引数 :targetArray : name属性を設定するための値が入っている連想配列
 * 戻り値:なし
 * 概要  :databoxクラスにname属性を設定する
 * 作成日 :2015.01.15
 * 作成者:T.Yamamoto
*/
function setName(targetArray) {
	// .databoxを全て走査する
	$(".databox").each(function(i){
		// .databoxの画面に表示される文字列を取得する
		var label = $(this).text();
		// 取得した文字列を第一引数のkeyとしてname属性に値を入れる
		$(this).attr('name', targetArray[label]);
	});

}

/* 
 * 関数名:setJSONItemValue(createTag)
 * 引数 :createTag createTag : createTagクラスのインスタンス
 * 戻り値:なし
 * 概要  :DBから取得した値をJSONにセットする
 * 作成日 :2015.05.21
 * 作成者:T.Masuda
*/
function setJSONItemValue(createTag){
	//createTagクラスインスタンスのメンバのJSON連想配列を文字列に変換する
	var jsonString = JSON.stringify(createTag.json);
	$.ajax({	//AJAX通信を行う
		url: "php/GetJSONString.php",	//JSON文字列を加工して返すサーブレットと通信する
		type: 'post',	//POSTメソッドでサーバにデータを送信する
		//何かしらのキーとJSON文字列を送信する
		data:{key:"",json:jsonString},
		async:false,				//同期通信を行う
		dataType: 'json',			//JSONをもらう
		success: function(json){	//通信に成功した場合
			createTag.json = json;	//createTagのJSONを更新する
		},
		//通信失敗時
		error:function(xhr, status, error){
			//エラーログをコンソールに出す
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	});
}

/* 
 * 関数名:setJSONItemValuePHP(createTag)
 * 引数 :createTag createTag : createTagクラスのインスタンス
 * 戻り値:なし
 * 概要  :DBから取得した値をJSONにセットする(PHPに値を挿入する)
 * 作成日 :2015.05.21
 * 作成者:T.Masuda
*/
function setJSONItemValuePHP(createTag){
	//createTagクラスインスタンスのメンバのJSON連想配列を文字列に変換する
	var jsonString = JSON.stringify(createTag.json);
	$.ajax({	//AJAX通信を行う
		url: "php/GetJSONString.php",	//JSON文字列を加工して返すサーブレットと通信する
		type: 'post',	//POSTメソッドでサーバにデータを送信する
		//何かしらのキーとJSON文字列を送信する
		data:{key:"",json:jsonString},
		async:false,				//同期通信を行う
		dataType: 'json',			//JSONをもらう
		success: function(json){	//通信に成功した場合
			createTag.json = json;	//createTagのJSONを更新する
		},
		//通信失敗時
		error:function(xhr, status, error){
			//エラーログをコンソールに出す
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	});
}

