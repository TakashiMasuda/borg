<html>
	<head>
		<meta charset="utf-8">
		<!-- viewportの設定により、端末の幅を初期解像度とする -->
		<meta name="viewport" content="width=device-width">
		<!-- タイトル -->
		<title>発注・受注機能</title>
		<!-- CSSファイルを読み込む -->
		<!-- 全体に必要なスタイルシートを読み込む。 -->
		<link rel="stylesheet" type="text/css" href="css/order.css">
		<!-- jQuery UIのCSSを読み込む。 -->
		<link rel="stylesheet" type="text/css" href="css/jquery-ui-1.9.2.custom.min.css">
		<!-- jqGridのCSSを読み込む。 -->
		<link rel="stylesheet" type="text/css" href="css/ui.jqgrid.css">
		
		<!-- JSファイルを読み込む -->
		<!-- jQueryの本体を読み込む -->
		<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
		<!-- 多機能ライブラリ jQuery UIを読み込む -->
		<script type="text/javascript" src="js/jquery-ui-1.9.2.custom.min.js"></script>
		<!-- タグを作成するJSの関数群を読み込む -->
		<script type="text/javascript" src="js/createTag.js"></script>
		<!-- jqGridでテーブルを作る -->
		<script type="text/javascript" src="js/jquery.jqGrid.src.js"></script>
		<!-- セル編集用のプラグインを読み込む -->
		<script type="text/javascript" src="js/grid.celledit.js"></script>
		<!-- インライン編集用のプラグインを読み込む -->
		<script type="text/javascript" src="js/grid.inlinedit.js"></script>
		<!--jqgridの設定jsを読み込む -->
		<script type="text/javascript" src="js/calljqgrid.js"></script>
		<!--タブの色を選択されたら変えるjsを読み込む -->
		<script type="text/javascript" src="js/function.js"></script>
	</head>
	<body>
		<!-- ウィンドウサイズを取得しそれに幅を合わせる -->
		<div id="container">
			<!-- 後に呼ばれる各ページと同じく、main以下をpageで囲む -->
			<div class="page">
				<!-- コンテンツ領域となるdivタグmain -->
				<div class="main"></div>
			</div>
		</div>
		<!-- JavaScriptのコードを記述 -->
		<script type='text/javascript'>
		//読み込み後
		$(document).ready(function(){
			// dom要素を作るためのクラスをインスタンス化する
			creator = new createTag();
			// 受発注画面のdomに配置するデータを取得する
			creator.getJsonFile('source/order.json');
			//JSONにDBから取得したデータを追記する
			setJSONItemValue(creator);

			// 受発注画面に配置するdomを取得する
			creator.getDomFile('source/template.html');
			// ヘッダーを作る
			creator.outputTag('header', 'header', '.main');
			// コンテンツの外枠を作る
			creator.outputTag('mainContent', 'insertdiv', '.main');
			// タブ領域を作る
			creator.outputTag('tabArea','tabArea', '.mainContent');
			// 検索機能領域を作る
			creator.outputTag('searcharea', 'searcharea', '.tabContent');
			// 期間を指定する領域のdomを作る
			creator.outputTag('periodarea', 'periodarea', '.tabContent');
			// 受注種別のプルダウンメニューを作る
			creator.outputTag('choice', 'choice', '#receivedTabContent');
			// 発注画面にボタン一覧(新規ボタンから発送指示ボタンまでを囲むdiv)を作る
			creator.outputTag('sendButtonList', 'insertdiv', '#sendTabContent');
			// 受注画面にボタン一覧(新規ボタンから発送指示ボタンまでを囲むdiv)を作る
			creator.outputTag('receivedButtonlist', 'insertdiv', '#receivedTabContent');
			// 編集ボタン群領域を作る
			creator.outputTag('editButtons', 'editButtons', '.buttonList');
			// 発注画面PDF出力ボタン群領域を作る
			creator.outputTag('sendPDFbutton', 'sideButtonArea', '#sendButtonList');
			// 受注画面PDF出力ボタン群領域を作る
			creator.outputTag('receivedPDFbutton', 'sideButtonArea', '#receivedButtonList');
			// 発注テーブル領域を作る
			creator.outputTag('sendWrapList', 'wrapList', '#sendTabContent');
			// 受注テーブル領域を作る
			creator.outputTag('receivedWrapList', 'wrapList', '#receivedTabContent');

			// タブ機能を実装する
			funcTab();
			
			//jqGridのレコード取得用のJSONファイルを読み込む
			creator.getJsonFile('json/sendData.json');
			creator.getJsonFile('json/receivedData.json');
			
			// optionタグにvalue属性を設定する
			setOptionValue()
			// jqGridでテーブルを作る
			makeGrid('sendData', creator.json["jqgrid_post"]["purchase"]);	// 発注テーブルを作る
			makeGrid('receivedData', creator.json["jqgrid_post"]["order"]);			// 受注テーブルを作る

			// 発注タブの追加ボタンにリンクをセットする
			setAddButtonLink('#sendTabContent', 'sendOrder.html');
			// 受注タブの追加ボタンにリンクをセットする
			setAddButtonLink('#receivedTabContent', 'receivedOrder.html');

			// カレンダーを付ける
			setCalendar();
		});

		//JavaScriptのコード記述を終える
		</script>
	</body>
</html>