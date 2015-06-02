<?php

// JSONDBManagerクラスファイルを読み込む
require_once("JSONDBManager.php");

//クライアントから送信されたJSON文字列を取得する。
$json = $_POST["json"];

//JSONDBManagerのインスタンスを生成する
$jdbm = new JSONDBManager();

//SQLによる例外の対処のためtryブロックで囲む
try {
	// データベースに接続する
	$this->dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
	// データベースをUTF8で設定する
	$this->dbh->query('SET NAMES utf8');
	//クライアントから送信されたJSON文字列を連想配列に変換する
	$jdbm->getJSONMap($json);
	//INSERT、またはUPDATE命令を実行する
	$jdbm->executeQuery($jdbm->json, DB_SETQUERY);
	//SQL例外のcatchブロック
} catch (PDOException $e) {
	// エラーメッセージを表示する
	echo $e->getMessage();
	// プログラムをそこで止める
	exit;
//最後に行う処理
} finally{
	//tryブロック
	try {
		//DBとの接続を必ず切る
		$jdbm->dbh = null;
	//DB切断時にエラーが出た場合
	} catch (PDOException $e) {
		// エラーメッセージを表示する
		echo $e->getMessage();
		// プログラムをそこで止める
		exit;
	}
}

//クライアントへ返すメッセージを作成する。
$returnMessage = "{\"message\":\"" . $jdbm->processedRecords . "件のレコードを操作しました。\"}";
// 送信する文字列をjson形式に変換して変数に入れる
$jsonOut = json_encode($returnMessage, JSON_UNESCAPED_UNICODE);

// 作成したJson文字列を出力する
print($jsonOut);

