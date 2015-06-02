<?php

// JSONDBManagerクラスファイルを読み込む
require_once('php/JSONDBManager.php');

//　jsonDBManagerをインスタンス化する
$jdbm = new JSONDBManager();

// getJsonStringテスト
// ファイルからJSONを読み込み(受発注画面)
$jsonString = file_get_contents("source/order.json");
// file_get_contents("source/order.json")
// キーを空にして定義する
$key = "";

$jdbm->outputJSON($jsonString, $key);


// fig5 getJsonMap
//$jdbm->getJSONMAP($jsonString);
//var_dump($jdbm->json);




// getJsonArrayテスト
// ファイルからJSONを読み込み(jqGrid)
 //$json = file_get_contents("json/sendData.json");
//DBに接続する
//$dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
// $sql = "SELECT od.date AS order_date, od.order_code, og.organization as customer, od.delivery_date, p1.person_name AS scribedby, ot.order_type, p2.person_name AS permiter, SUM(od.price * od. quantity) AS amount FROM Order_ddt AS od, Person as p1, Person as p2, Organization as og, Order_Type as ot WHERE od.custom_organization_code = og.organization_code and od.deliver_organization_code = og.organization_code and od.inputter = p1.person_code and od.submitter = p2.person_code and od.order_type_code = ot.order_type_code AND od.date >='from_date' AND od.date <= 'to_date' GROUP BY order_code;";
// $sql = "SELECT * FROM order_ddt";
// $stmt = $dbh->prepare($sql);
// $stmt->execute();
// var_dump($stmt->fetch(PDO::FETCH_ASSOC));

//DBに接続する
$jdbm->dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
// // データベースをUTF8で設定する
// $jdbm->dbh->query('SET NAMES utf8');
// //JSON文字列を解析して、jdbmのメンバに格納する
// $jdbm->getJSONMap($json);
// $json = $jdbm->json["jqgrid_post"]["purchase"];
// $retArrayString = "";
// //取得したJSON連想配列を走査する
// foreach($json as $keyString => $value) {
// 	//キーの値がオブジェクトであれば
// 	if(is_Array($value)){
// 		//レコードのJSONを作る
// 		$retArrayString += $jdbm->getListJSON($value);
// 		//var_dump($keyString);
// 	}
// }



// //JSON文字列を解析して、jdbmのメンバに格納する
// $jdbm->getJSONMap($json);

// $jdbm->dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
// // データベースをUTF8で設定する
// $jdbm->dbh->query('SET NAMES utf8');
// $json = $jdbm->json["jqgrid_post"]["purchase"]["content"];
// //var_dump($json["content"]);
// $retArrayString = "";
// //取得したJSON連想配列を走査する
// foreach($json as $keyString => $value) {
// 	//キーの値がオブジェクトであれば
// 	if(is_Array($value)){
// 		// レコードのJSONを作る
// 		$retArrayString += $jdbm->getListJSON($value);
// 	}

// }

// // var_dump($jdbm->getListJSON($json));

// //var_dump($jdbm->json);





// fig5 getJsonMapデバッグ
// $jdbm->getJsonMap($json);
// $json = $jdbm->json;
// var_dump($json);


// fig8 のデバッグ
// $dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
// $sql = "SELECT * FROM order_ddt;";
// $stmt = $dbh->prepare($sql);
// $stmt->execute();
//  var_dump($jdbm->checkColumn($stmt, 'date'));

