<?php

// JSONDBManagerクラスファイルを読み込む
require_once("JSONDBManager.php");

//クライアントから送信されたJSONのキーとJSON文字列を取得する。
$key = $_POST["key"];
$json = $_POST["json"];

// JSONDBManagerのインスタンスを生成する
$jdbm = new JSONDBManager();

//SQLによる例外の対処のためtryブロックで囲む
try {
	// jsonを出力する
	$jdbm->outputJSON($json, $key);
	//SQL例外のcatchブロック
} catch (PDOException $e) {
	// エラーメッセージを表示する
	echo $e->getMessage();
	// プログラムを終了する
}

// 連想配列をjsonに変換して変数に入れる
$jsonOut = json_encode($jdbm->json, JSON_UNESCAPED_UNICODE);
// 作成したJSON文字列を出力する。
print($jsonOut);


