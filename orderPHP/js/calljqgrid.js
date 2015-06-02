//受注画面(fig2)のjqGridテスト
	colData = {};		//列定義データの配列を格納する。
	colNamesLists = {};		//列名の配列を格納する。
	objRules = {};			//jqGridの設定の連想配列を格納する。
	gridFormOptions = [];	//行の編集ダイアログの設定。
	isCheckbox = false;		//チェックボックスをクリックしたかの判定。

	//0埋めする桁数の定数
	ZERO_PADDING_FIGURE = 6;
	//受注伝票のレコードを追加するクエリ
	ORDER_INSERT_QUERY = "INSERT INTO Order_ddt VALUES ('date', 'order_code', 'stock_code', 'quantity', 'price', (SELECT MAX(organization_code) FROM Organization WHERE organization='custom_organization_code'), (SELECT MAX(organization_code) FROM Organization WHERE organization='deliver_organization_code') ,'delivery_date', 'est_delivery_date', (SELECT MAX(order_type_code) FROM Order_Type WHERE order_type='order_type_code'),(SELECT MAX(person_code) FROM Person WHERE person_name='inputter'), (SELECT MAX(person_code) FROM Person WHERE person_name='submitter'));";
	//受注伝票のレコードを削除するクエリ
	ORDER_DELETE_QUERY = "DELETE FROM Order_ddt WHERE order_code='order_code';";
	//受注伝票のレコードを更新するクエリ
	ORDER_UPDATE_QUERY = "UPDATE Order_ddt SET date='date', stock_code='stock_code', quantity='quantity', price='price', custom_organization_code=(SELECT MAX(organization_code) FROM Organization WHERE organization='custom_organization_code'), delivery_date='delivery_date', est_delivery_date='est_delivery_date', order_type_code=(SELECT MAX(order_type_code) FROM Order_Type WHERE order_type='order_type_code'), inputter=(SELECT MAX(person_code) FROM Person WHERE person_name='inputter'), submitter=(SELECT MAX(person_code) FROM Person WHERE person_name='submitter') WHERE order_code='order_code';";

	
	//行の編集ダイアログの設定その1。
	gridFormOptions[0] = {
			url:location.href,			//編集データの送信先。
			addCaption:'レコード追加',		//追加モード時のタイトル
			editCaption:'レコード編集',	//編集モード時のタイトル
			width: 'auto',				//幅を自動調整する
			bSubmit: '確定',				//確定ボタンのテキスト。
			bCancen: 'キャンセル',			//キャンセルボタンのテキスト。
			modal:true,					//モーダル表示する。
			closeAfterAdd:true,			//追加後に閉じる
			closeAfterEdit:true,		//編集後に閉じる
			recreateForm:true,			//レイアウト崩れ防止のため、毎回フォームを作成し直す。
			//前後ボタンを押した後のイベント。
			onclickPgButtons:function(whichbutton, formid, rowid){
				var rowidNum = parseInt(rowid);	//行番号を整数値に変換する。
				//切り替え先のレコードのチェック状態を確認する。
				isCheck = $('.list:first #' + (whichbutton == 'prev'?rowidNum - 1: rowidNum + 1) + ' input:checkbox:first').prop('checked');
			}
	};

	//受注タブ、列名定義の配列。順番にセットされる。
	colNamesLists['receivedData'] = ['', '受注日', '受注コード', '顧客名', '納品希望日', '入力者', '受注種別', '承認者', '合計金額'];

	//発注タブ、列名定義の配列。順番にセットされる。
	colNamesLists['sendData'] = ['', '発注日', '発注コード', '発注先', '発送指定日', '入力者', '承認者', '合計金額'];

	//受注、新規・編集画面、列名定義の配列。順番にセットされる。
	colNamesLists['receivedDataAddEdit'] = ['', '製造番号', '製品種別', '製品名', '販売価格', '個数', '小計', '発送場所', '発送指定日', '納品指定日'];

	//発注、新規・編集画面、列名定義の配列。順番にセットされる。
	colNamesLists['sendDataAddEdit'] = ['', '製造番号', '製品種別', '製品名', '単価', '個数', '小計', '顧客名', '納品場所'];

	//発注、新規・編集画面、新規登録ダイアログ、列名定義の配列。順番にセットされる。
	colNamesLists['sendDataLessStock'] = ['', '受注日', '発注コード', '製造番号', '製品種別', '製品名', '顧客名', '入力者'];

	//受注タブ 見積・受注機能のリストの列定義。
	//列の設定について、特筆すべき点のみ補足します。
	colData['receivedData'] = [
	        //name:名前 index:ソート時の名前 width:列幅 dataType:データの型 align:セルのテキストの寄せる方向
	        //className:列のクラス名 editable:編集可能にするかどうかの設定。trueかfalseで指定する。
	        //editType:editableが有効な場合のセルの編集方法の指定。ラジオボタン、チェックボックス等を指定する。
	        //editoptions:セレクトメニューでのセル編集時に、選択項目のソースとなる連想配列を指定する。
	        //sortable:ソート可能かどうかの設定。 sorttype:ソートのデータ型を指定する。

			//受注チェックボックス列
			{ name: "received_check", index:"received_check", width: 27, align:"center", className: "received_check", editable: true, sortable:false},
	        //受注日列。dateTypeを日付型にする。
	        { name: "order_date", index:"order_date", width: 91, align:"left", className: "order_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}},
			//受注コード列
	        { name: "order_code", index:"order_code", width: 59, align:"left", className: "order_code", editable: true, sortable:true, sorttype:'text'},
	        //顧客名列
	        { name: "customer", index:"customer", width: 91,  align:"left", className: " customer", editable: true, sortable:true, sorttype:'text'},
	        //納品希望日列
	        { name: "delivery_date", index:"delivery_date", width: 91, align:"left", className: "delivery_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}},
	        //入力者列
	        { name: "scribedby", index:"scribedby", width: 91, align:"left", className: "scribedby", editable: true, sortable:true, sorttype:'text'},
	        //受注種別列
	        { name: "order_type", index:"order_type", width: 59, align:"left", className: "order_type", editable: true, sortable:true, sorttype:'text'},
	        //承認者列
	        { name: "permiter", index:"permiter", width: 91, align:"left", className: "permiter", editable: false, sortable:true, sorttype:'text'},
	        //合計金額列
	        { name: "amount", index:"amount", width: 103, align:"left", className: "amount", editable: false, sortable:true, sorttype:'int'}
	];

	//発注タブ 見積・発注機能のリストの列定義。
	//列の設定について、特筆すべき点のみ補足します。
	colData['sendData'] = [
	        //name:名前 index:ソート時の名前 width:列幅 dataType:データの型 align:セルのテキストの寄せる方向
	        //className:列のクラス名 editable:編集可能にするかどうかの設定。trueかfalseで指定する。
	        //editType:editableが有効な場合のセルの編集方法の指定。ラジオボタン、チェックボックス等を指定する。
	        //editoptions:セレクトメニューでのセル編集時に、選択項目のソースとなる連想配列を指定する。
	        //sortable:ソート可能かどうかの設定。 sorttype:ソートのデータ型を指定する。

	        //発注日チェックボックス列
	        { name: "send_check", index:"send_check", width: 27, align:"center", className: "send_check", editable: true, sortable:false},
	        //発注日列。dateTypeを日付型にする。
	        { name: "order_date", index:"send_date", width: 91, align:"left", className: "send_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}},
			//発注コード列
	        { name: "order_code", index:"send_code", width: 133, align:"left", className: "send_code", editable: true, sortable:true, sorttype:'text'},
	        //発注先列
	        { name: "send_place", index:"send_place", width: 91,  align:"left", className: " send_place", editable: true, sortable:true, sorttype:'text'},
	        //発送指定日列
	        { name: "delivery_date", index:"delivery_date", width: 91, align:"left", className: "delivery_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}},
	        //入力者列
	        { name: "scribedby", index:"scribedby", width: 91, align:"left", className: "scribedby", editable: true, sortable:true, sorttype:'text'},
	        //承認者列
	        { name: "permiter", index:"permiter", width: 91, align:"left", className: "permiter", editable: false, sortable:true, sorttype:'text'},
	        //合計金額列
	        { name: "amount", index:"amount", width: 93, align:"left", className: "amount", editable: false, sortable:true, sorttype:'int'}
	];

	//受注画面、新規編集画面のリストの列定義。
	//列の設定について、特筆すべき点のみ補足します。
	colData['receivedDataAddEdit'] = [
	        //name:名前 index:ソート時の名前 width:列幅 dataType:データの型 align:セルのテキストの寄せる方向
	        //className:列のクラス名 editable:編集可能にするかどうかの設定。trueかfalseで指定する。
	        //editType:editableが有効な場合のセルの編集方法の指定。ラジオボタン、チェックボックス等を指定する。
	        //editoptions:セレクトメニューでのセル編集時に、選択項目のソースとなる連想配列を指定する。
	        //sortable:ソート可能かどうかの設定。 sorttype:ソートのデータ型を指定する。

	        //チェックボックス列
	        { name: "received_check", index:"received_check", width: 27, align:"center", className: "received_check", editable: true, sortable:false},
	        //製品番号列。dateTypeを日付型にする。
	        { name: "productNumber", index:"productNumber", width: 59, align:"left", className: "productNumber", editable: true, sortable:true, sorttype:'int'},
			//製品種別列
	        { name: "productType", index:"productType", width: 59, align:"left", className: "productType", editable: true, sortable:true, sorttype:'text'},
	        //製品名列
	        { name: "productName", index:"productName", width: 155, align:"left", className: " productName", editable: true, sortable:true, sorttype:'text'},
	        //販売価格列
	        { name: "unitPrice", index:"unitPrice", width: 59, align:"left", className: "unitPrice", editable: true, sortable:true, sorttype:'int'},
	        //個数列
	        { name: "number", index:"number", width: 59, align:"left", className: "number", editable: true, sortable:true, sorttype:'int'},
	        //小計列
	        { name: "subtotal", index:"subtotal", width: 59, align:"left", className: "subtotal", editable: false, sortable:true, sorttype:'int'},
	        //発送場所
	        { name: "deliveryPlace", index:"deliveryPlace", width: 59, align:"left", className: "deliveryPlace", editable: false, sortable:true, sorttype:'texts'},
			//発送指定日列
	        { name: "send_date", index:"send_date", width: 91, align:"left", className: "send_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}},
	        //納品指定日列
	        { name: "delivery_date", index:"delivery_date", width: 91, align:"left", className: "delivery_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}}
	];


	//発注画面、新規編集画面のリストの列定義。
	//列の設定について、特筆すべき点のみ補足します。
	colData['sendDataAddEdit'] = [
	        //name:名前 index:ソート時の名前 width:列幅 dataType:データの型 align:セルのテキストの寄せる方向
	        //className:列のクラス名 editable:編集可能にするかどうかの設定。trueかfalseで指定する。
	        //editType:editableが有効な場合のセルの編集方法の指定。ラジオボタン、チェックボックス等を指定する。
	        //editoptions:セレクトメニューでのセル編集時に、選択項目のソースとなる連想配列を指定する。
	        //sortable:ソート可能かどうかの設定。 sorttype:ソートのデータ型を指定する。

	        //チェックボックス列
	        { name: "send_check", index:"send_check", width: 27, align:"center", className: "send_check", editable: true, sortable:false},
	        //製品番号列。dateTypeを日付型にする。
	        { name: "productNumber", index:"productNumber", width: 91, align:"left", className: "productNumber", editable: true, sortable:true, sorttype:'int'},
			//製品種別列
	        { name: "productType", index:"productType", width: 91, align:"left", className: "productType", editable: true, sortable:true, sorttype:'text'},
	        //製品名列
	        { name: "productName", index:"productName", width: 155, align:"left", className: " productName", editable: true, sortable:true, sorttype:'text'},
	        //単価列
	        { name: "unitPrice", index:"unitPrice", width: 59, align:"left", className: "unitPrice", editable: true, sortable:true, sorttype:'int'},
	        //個数列
	        { name: "number", index:"number", width: 59, align:"left", className: "number", editable: true, sortable:true, sorttype:'int'},
	        //小計列
	        { name: "subtotal", index:"subtotal", width: 59, align:"left", className: "subtotal", editable: false, sortable:true, sorttype:'int'},
	        //顧客名列
	        { name: "customer", index:"customer", width: 91, align:"left", className: "customer", editable: false, sortable:true, sorttype:'int'},
	        //納品場所列
	        { name: "deliveryPlace", index:"deliveryPlace", width:91, align:"left", className: "deliveryPlace", editable: false, sortable:true, sorttype:'texts'}
	];

	// 発注画面、新規編集画面、未在庫ダイアログのリストの列定義。
	//列の設定について、特筆すべき点のみ補足します。
	colData['sendDataLessStock'] = [
	        //name:名前 index:ソート時の名前 width:列幅 dataType:データの型 align:セルのテキストの寄せる方向
	        //className:列のクラス名 editable:編集可能にするかどうかの設定。trueかfalseで指定する。
	        //editType:editableが有効な場合のセルの編集方法の指定。ラジオボタン、チェックボックス等を指定する。
	        //editoptions:セレクトメニューでのセル編集時に、選択項目のソースとなる連想配列を指定する。
	        //sortable:ソート可能かどうかの設定。 sorttype:ソートのデータ型を指定する。

	        //チェックボックス列
	        { name: "stock_check", index:"send_check", width: 27, align:"center", className: "send_check", editable: true, sortable:false},
	        //受注日列。dateTypeを日付型にする。
	        { name: "order_date", index:"order_date", width: 91, align:"left", className: "order_date", editable: true, sortable:true, sorttype:'date',datefmt:"yyyy-mm-dd",editrules:{date:true}},
			//受注コード列
	        { name: "order_code", index:"order_code", width: 59, align:"left", className: "order_code", editable: true, sortable:true, sorttype:'text'},
	        //製品番号列。dateTypeを日付型にする。
	        { name: "productNumber", index:"productNumber", width: 59, align:"left", className: "productNumber", editable: true, sortable:true, sorttype:'int'},
			//製品種別列
	        { name: "productType", index:"productType", width: 59, align:"left", className: "productType", editable: true, sortable:true, sorttype:'text'},
	        //製品名列
	        { name: "productName", index:"productName", width: 155, align:"left", className: " productName", editable: true, sortable:true, sorttype:'text'},
	        //顧客名列
	        { name: "customer", index:"customer", width: 59, align:"left", className: "customer", editable: false, sortable:true, sorttype:'int'},
	        //入力者列
	        { name: "scribedby", index:"scribedby", width: 91, align:"left", className: "scribedby", editable: true, sortable:true, sorttype:'text'},
	];

	
	/*
	 * 関数名:zeroPadding
	 * 引数  :int digits:ない桁を0で埋める対象の数値
	 * 　　  :int figure:桁数
	 * 戻り値:String:値を文字列にして返す
	 * 概要  :整数の桁を0で埋める
	 * 作成日 :2015.05.23
	 * 作成者:T.Masuda
	 */
	function zeroPadding(digits, figure){
		var figureString = '';	//桁の数だけ0を並べた文字列を用意する
		//ループでfigureStringの中身を作成する
		for(var i = 0; i < figure; i++){
			figureString+='0';	//figureStringに0の文字列を足していく
		}
		//digitsをfigure桁まで0で埋めて返す
		return ( figureString + digits ).slice( -figure );
	}

	/*
	 * 関数名:createOrderRecord
	 * 引数  :Object rowData:表から取得した行データ
	 * 		:Element grid:表本体
	 * 		:int paddingFigure:コード列の桁数
	 * 戻り値:Object :作成したレコードのデータをを返す
	 * 概要  :受注画面の表のレコードから受注伝票のレコードを作り返す
	 * 作成日 :2015.05.23
	 * 作成者:T.Masuda
	 */
	function createOrderRecord(rowData, grid, paddingFigure, queryType){
		var retMap = {};	//返却用の連想配列を用意する
		//行のデータを走査する
		for(key in rowData){
			if(key == "order_date"){
				//連想配列の当該キーに新たにオブジェクトを挿入する
				retMap["date"] = {value:rowData[key]};
			} else if(key == "order_code"){
				//連想配列の当該キーに新たにオブジェクトを挿入する。
				//INSERT命令なら
				if(queryType == ORDER_INSERT_QUERY){
					//受注コードがかぶらないよう、レコード数を基準に受注コードを生成してセットする
					retMap["order_code"] =
					{value:zeroPadding($(grid).getGridParam("records") + 1, paddingFigure)};
				//UPDATE命令なら
				} else if(queryType == ORDER_UPDATE_QUERY){
					//受注コードをセットする
					retMap["order_code"] = {value:rowData[key]};
				}
			} else if(key == "customer"){
				//連想配列の当該キーに新たにオブジェクトを挿入する
				retMap["custom_organization_code"] = {value:rowData[key]};
				retMap["deliver_organization_code"] = {value:rowData[key]};
			} else if(key == "delivery_date"){
				//連想配列の当該キーに新たにオブジェクトを挿入する
				retMap["delivery_date"] = {value:rowData[key]};
				retMap["est_delivery_date"] = {value:rowData[key]};
			} else if(key == "scribedby"){
				//連想配列の当該キーに新たにオブジェクトを挿入する
				retMap["inputter"] = {value:rowData[key]};
			} else if(key == "permiter"){
				//連想配列の当該キーに新たにオブジェクトを挿入する
				retMap["submitter"] = {value:rowData[key]};
			} else if(key == "order_type"){
				//連想配列の当該キーに新たにオブジェクトを挿入する
				retMap["order_type_code"] = {value:rowData[key]};
			} else if(key == "amount"){
				//連想配列の当該キーに新たにオブジェクトを挿入する。
				//クライアントのデータだけでは決められないデータなので、テストということで仮に固定の値を入力する
				retMap["stock_code"] = {value:"000001"};
				retMap["quantity"] = {value:"1"};
				retMap["price"] = {value:"20000"};
			}
		}
		
		return retMap;	//作成したレコードの連想配列を返す
	}
	
	/*
	 * 関数名:insertOrderRecord
	 * 引数  :int rowid:処理する行の番号
	 * 		:Element grid:表本体
	 * 戻り値:なし
	 * 概要  :DBにレコードのデータを送信してテーブルに追加する
	 * 作成日 :2015.05.23
	 * 作成者:T.Masuda
	 */
	function insertOrderRecord(rowid, grid){
		var rowData= $(grid).getRowData(rowid);		//選択した行を取得する
		//サーバへ送信するデータを作成する
		var sendData = createOrderRecord(rowData, grid, ZERO_PADDING_FIGURE, ORDER_INSERT_QUERY);	
		
		//DB保存用のクエリをセットする
		sendData["db_setQuery"] = ORDER_INSERT_QUERY; 
		
		//AJAX通信でサーバへ保存するレコードを送信する
		$.ajax({
			url:'php/SaveJSONRecord.php',	//JSONでレコードを保存するサーブレットを呼ぶ
			dataType:"json",			//JSONデータを返してもらう
			async:false,				//同期通信を行う
			method:"POST",				//POSTメソッドで通信する
			data:{json:JSON.stringify(sendData)},	//作成したレコードを送信する
			success:function(json, a, b, c){		//成功時の処理
				alert(json.message);				//サーバから帰ってきたメッセージをダイアログに出す
				$(grid).trigger("reloadGrid");		//表を読み込み直す
			},
			error:function(xhr, status, error){			//エラー時の処理
				alert(xhr.responseJSON.message);	//サーバから帰ってきたメッセージをダイアログに出す
			}
		});
	}

	/*
	 * 関数名:updateOrderRecord
	 * 引数  :int rowid:処理する行の番号
	 * 		:Element grid:表本体
	 * 戻り値:なし
	 * 概要  :DBにレコードのデータを送信してレコードを更新する
	 * 作成日 :2015.05.23
	 * 作成者:T.Masuda
	 */
	function updateOrderRecord(rowid, grid){
		var rowData= $(grid).getRowData(rowid);		//選択した行を取得する
		//サーバへ送信するデータを作成する
		var sendData = createOrderRecord(rowData, grid, ZERO_PADDING_FIGURE, ORDER_UPDATE_QUERY);	
		
		//DB保存用のクエリをセットする
		sendData["db_setQuery"] = ORDER_UPDATE_QUERY; 
		
		//AJAX通信でサーバへ保存するレコードを送信する
		$.ajax({
			url:'php/SaveJSONRecord.php',	//JSONでレコードを保存するサーブレットを呼ぶ
			dataType:"json",			//JSONデータを返してもらう
			async:false,				//同期通信を行う
			method:"POST",				//POSTメソッドで通信する
			data:{json:JSON.stringify(sendData)},	//作成したレコードを送信する
			success:function(json, a, b, c){		//成功時の処理
				alert(json.message);				//サーバから帰ってきたメッセージをダイアログに出す
				$(grid).trigger("reloadGrid");		//表を読み込み直す
			},
			error:function(xhr, status, error){			//エラー時の処理
				alert(xhr.responseJSON.message);	//サーバから帰ってきたメッセージをダイアログに出す
			}
		});
	}
	
	/*
	 * 関数名:deleteOrderRecord
	 * 引数  :int rowid:処理する行の番号
	 * 		:Element grid:表本体
	 * 戻り値:なし
	 * 概要  :選択されたレコードを削除する
	 * 作成日 :2015.05.23
	 * 作成者:T.Masuda
	 */
	function deleteOrderRecord(rowid, grid){
		var rowData= $(grid).getRowData(rowid);		//選択した行を取得する
		//サーバへ送信するデータを作成する。対象の受注コードと在庫コードをセットする
		var sendData = {order_code:{value:rowData.order_code}};	
		//テーブルから該当するレコードを削除するクエリをセットする
		sendData["db_setQuery"] = ORDER_DELETE_QUERY;
		
		//AJAX通信でサーバへ保存するレコードを送信する
		$.ajax({
			url:'php/SaveJSONRecord.php',	//JSONでレコードを削除するサーブレットを呼び出す
			dataType:"json",			//結果をJSONデータを返してもらう
			async:false,				//同期通信を行う
			method:"POST",				//POSTメソッドで通信する
			data:{json:JSON.stringify(sendData)},	//作成したレコードを送信する
			success:function(json, a, b, c){		//成功時の処理
				alert(json.message);				//サーバから帰ってきたメッセージをダイアログに出す
				$(grid).trigger("reloadGrid");		//表を読み込み直す
			},
			error:function(xhr, status, error){			//エラー時の処理
				alert(xhr.responseJSON.message);	//サーバから帰ってきたメッセージをダイアログに出す
			}
		});
	}
	
	var lastsel2;
	//receivedDataのjqGridのルールを連想配列に設定する。
	objRules['receivedData'] = { 
		url:'php/GetJSONArray.php',	//サーブレットGetJSONArrayからJSONを取得する
		//JSONデータをデータソースとして利用する。
		datatype:"json",
		mtype:"post",	//POSTメソッドでサーバにデータを送信する
		//基本の幅を指定する。
		width: 748,
		//グリッドのリサイズ時の最大幅、最小幅を指定する。
		gridResize: {minWidth:310, maxWidth:576},
		//表部分の高さを指定する。
		height: 280,
		//列名の表示の配列をセットする。
		colNames: colNamesLists['receivedData'],
		//列定義のデータをセットする。
		colModel: colData['receivedData'],
		caption: '受注リスト'	,	//リストのタイトルを設定する。
		cellEdit: true,    	// セルの編集を無効にする。
		//セルを編集してもサーバとの通信をしないように設定する。
		cellsubmit: 'clientArray',
        sortorder: "desc",	// 降順ソートをする
        shrinkToFit: false,	// 列幅の自動調整を行う。
		//行を選択した後に実行される関数。
		afterEditCell:function(rowid, status, e){
			//確認ウィンドウを出す.
			if(window.confirm(rowid + "番目のレコードを複製します。")){
				insertOrderRecord(rowid, this);	//レコードを複製してDBに保存する
			//キャンセルが選択されたら
			} else {
				//削除するかを問う
				if(window.confirm(rowid + "番目のレコードを削除します。")){
					deleteOrderRecord(rowid, this);	//レコードを削除する
				} 
			}
		},
		//セルを編集したら
		afterSaveCell:function(rowid){
			//確認ウィンドウを出す.
			if(window.confirm(rowid + "番目のレコードを更新します。")){
				updateOrderRecord(rowid, this);
			}
		}
	};

	
						
	//sendData(発注タブ)のjqGridのルールを連想配列に設定する。
	objRules['sendData'] = { 
		//データの取得元を設定する。
		url:'php/GetJSONArray.php',	//サーブレットGetJSONArrayからJSONを取得する
		//JSONデータをデータソースとして利用する。
		datatype:"json",
		mtype:"post",	//POSTメソッドでサーバにデータを送信する
		//基本の幅を指定する。
		width: 748,
		//グリッドのリサイズ時の最大幅、最小幅を指定する。
		gridResize: {minWidth:310, maxWidth:576},
		//表部分の高さを指定する。
		height: 280,
		//列名の表示の配列をセットする。
		colNames: colNamesLists['sendData'],
		//列定義のデータをセットする。
		colModel: colData['sendData'],
		caption: '発注リスト'	,	//リストのタイトルを設定する。
		cellEdit: false,    	// セルの編集を無効にする。
		//セルを編集してもサーバとの通信をしないように設定する。
		cellsubmit: 'clientArray',
        sortorder: "desc",	// 降順ソートをする
        shrinkToFit: false,	// 列幅の自動調整を行う。
		//行を選択する前に実行される関数。
		beforeSelectRow:function(rowid, e){
        	return true;	//onSelectRowイベントへ移行する
		},
		//行を選択した後に実行される関数。
		onSelectRow:function(rowid, status, e){
		}
	};

	//receivedDataAddEditのjqGridのルールを連想配列に設定する。
	objRules['receivedDataAddEdit'] = { 
		//データの取得元を設定する。
		url:'json/receivedDataAddEdit.json',
		//JSONデータをデータソースとして利用する。
		datatype:"json",
		//基本の幅を指定する。
		width: 768,
		//グリッドのリサイズ時の最大幅、最小幅を指定する。
		gridResize: {minWidth:310, maxWidth:576},
		//表部分の高さを指定する。
		height: 280,
		//列名の表示の配列をセットする。
		colNames: colNamesLists['receivedDataAddEdit'],
		//列定義のデータをセットする。
		colModel: colData['receivedDataAddEdit'],
		caption: '製品詳細'	,	//リストのタイトルを設定する。
		cellEdit: false,    	// セルの編集を無効にする。
		//セルを編集してもサーバとの通信をしないように設定する。
		cellsubmit: 'clientArray',
        sortorder: "desc",	// 降順ソートをする
        shrinkToFit: false,	// 列幅の自動調整を行う。
		//行を選択する前に実行される関数。
		beforeSelectRow:function(rowid, e){
        	return true;	//onSelectRowイベントへ移行する
		},
		//行を選択した後に実行される関数。
		onSelectRow:function(rowid, status, e){
		}
	};

	//sendDataAddEditのjqGridのルールを連想配列に設定する。
	objRules['sendDataAddEdit'] = { 
		//データの取得元を設定する。
		url:'json/sendDataAddEdit.json',
		//JSONデータをデータソースとして利用する。
		datatype:"json",
		//基本の幅を指定する。
		width: 768,
		//グリッドのリサイズ時の最大幅、最小幅を指定する。
		gridResize: {minWidth:310, maxWidth:576},
		//表部分の高さを指定する。
		height: 280,
		//列名の表示の配列をセットする。
		colNames: colNamesLists['sendDataAddEdit'],
		//列定義のデータをセットする。
		colModel: colData['sendDataAddEdit'],
		caption: '製品詳細'	,	//リストのタイトルを設定する。
		cellEdit: false,    	// セルの編集を無効にする。
		//セルを編集してもサーバとの通信をしないように設定する。
		cellsubmit: 'clientArray',
        sortorder: "desc",	// 降順ソートをする
        shrinkToFit: false,	// 列幅の自動調整を行う。
		//行を選択する前に実行される関数。
		beforeSelectRow:function(rowid, e){
        	return true;	//onSelectRowイベントへ移行する
		},
		//行を選択した後に実行される関数。
		onSelectRow:function(rowid, status, e){
		}
	};

	//sendDataAddEditのjqGridのルールを連想配列に設定する。
	objRules['sendDataLessStock'] = { 
		//データの取得元を設定する。
		url:'json/sendDataLessStock.json',
		//JSONデータをデータソースとして利用する。
		datatype:"json",
		//基本の幅を指定する。
		width: 315,
		//グリッドのリサイズ時の最大幅、最小幅を指定する。
		gridResize: {minWidth:310, maxWidth:576},
		//表部分の高さを指定する。
		height: 280,
		//列名の表示の配列をセットする。
		colNames: colNamesLists['sendDataLessStock'],
		//列定義のデータをセットする。
		colModel: colData['sendDataLessStock'],
		caption: ''	,	//リストのタイトルを設定する。
		cellEdit: false,    	// セルの編集を無効にする。
		//セルを編集してもサーバとの通信をしないように設定する。
		cellsubmit: 'clientArray',
        sortorder: "desc",	// 降順ソートをする
        shrinkToFit: false,	// 列幅の自動調整を行う。
		//行を選択する前に実行される関数。
		beforeSelectRow:function(rowid, e){
        	return true;	//onSelectRowイベントへ移行する
		},
		//行を選択した後に実行される関数。
		onSelectRow:function(rowid, status, e){
		}
	};

	/*
	 * 関数名:makeGrid
	 * 引数  :string target:テーブルのクラス。
	 * 戻り値:なし
	 * 概要  :jqGridのテーブルを作成する。
	 * 作成日 :2015.01.14
	 * 作成者:T.Masuda
	*/
	function makeGrid(target, postData){
		//サーバに送信するデータがあれば
		if(postData !== void(0)){
			//送信するデータを連想配列にセットする
			var post = {postData:{json:JSON.stringify(postData)}};
			//objRulesに送信するデータ追記してサーバへ一緒に送信するようにする
			$.extend(objRules[target], post, true);
		}
		//設定用の連想配列を使い、jqGridの表を作る。
		$('#' + target).jqGrid(objRules[target]);
	}

	//ドキュメントの配置完了後(= 全てのファイルを読み込んだ後)
//	$(document).ready(function(){
//		makeGrid('receivedData');	//グリッドを作成する
//	});