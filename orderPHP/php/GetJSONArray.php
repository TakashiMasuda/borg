<?php

// JSONDBManagerクラスファイルを読み込む
require_once("JSONDBManager.php");
// クライアントから送信されたJSONのキーとJSON文字列を取得する。
$json = $_POST["json"];
// 返却するJSON配列の文字列を格納する変数を用意する
$retArrayString = "";

//JSONDBManagerのインスタンスを生成する
$jdbm = new JSONDBManager();

//SQLによる例外の対処のためtryブロックで囲む
try {
	//DBに接続する
	$jdbm->dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
	// データベースをUTF8で設定する
	$jdbm->dbh->query('SET NAMES utf8');
	//JSON文字列を解析して、jdbmのメンバに格納する
	$jdbm->getJSONMap($json);
	//取得したJSON連想配列を走査する
	foreach($jdbm->json as $keyString => $value) {
		//キーの値がオブジェクトであれば
		if(is_array($value) && $jdbm->is_hash($value)){
			//レコードのJSONを作る
			$retArrayString .= $jdbm->getListJSON($value);
		}
	}
	//SQL例外のcatchブロック
} catch (PDOException $e) {
	// エラーメッセージを表示する
	echo $e->getMessage();
	// プログラムを終了する
	exit;
}

//作成したJSON文字列を出力する。
print($retArrayString);

