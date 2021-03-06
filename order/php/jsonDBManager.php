<?php

//JSONのdb_getQueryキーの文字列を定数にセットする
define('DB_GETQUERY', 'db_getQuery');
//JSONのdb_setQueryキーの文字列を定数にセットする
define('DB_SETQUERY', 'db_setQuery');
// JSONのdb_columnキーの文字列を定数にセットする
define('DB_COLUMN', 'db_column');
// JSONのtextキーの文字列を定数にセットする
define('KEY_TEXT', 'text');
// JSONのhtmlキーの文字列を定数にセットする
define('KEY_HTML', 'html');
// JSONのsrcキーの文字列を定数にセットする
define('KEY_SRC', 'src');
// JSONのvalueキーの文字列を定数にセットする
define('KEY_VALUE', 'value');
//JSONの値を入れるノードのキーの文字列リストを配列にセットする
$KEY_LIST = ['text', 'html', 'src'];

// データベースに接続するための値を定数として宣言する
define('DSN', 'mysql:host=localhost;dbname=borg');		// データソースネーム(ホスト名、DB名)
define('DB_USER', 'root');								// データベースユーザ
define('DB_PASSWORD', 'bnp2525');						// データベースパスワード

/*
 * クラス名:DB_ResultTree
 * 概要  :DBの結果セットのツリーのノードクラス
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.
 */
class DB_ResultTree{
	$parent = null;			//このノード(インスタンス)の親
	$db_result = null;		//DBの結果セット
}

class JSONDBMnager {
	/*
	 * Fig0
	 * 関数名：createJSON
	 * 概要  :DBからデータを取得してJSONを作る
	 * 引数  :Map<String, Object> json:カレントのJSON
	 * String key:JSONのキー
	 * DBResultTree:dbrt_parent:DBから取得したデータを格納してツリー構造を作るためのクラスのインスタンス
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function createJSON($json, $key, $dbrt_parent) {
		// DBの結果から構築したツリーを構成するクラスのインスタンスを生成する
		$db_resultTree = new DB_ResultTree();

		// fig1 データベースから当該レコード群を取得する
		$db_resultTree->$dbresult = this->executeQuery($json, DB_GETQUERY);

		// DB_ResultTreeの親子関係を構築する
		$db_resultTree->$parent = $dbrt_parent

		// fig2 db_resultTreeから”key”に該当するデータを取得する
		$column = this->getDBColumn($key, $db_resultTree);

		// jsonについて最下層の要素にたどり着くまでループしてデータを取り出す
		foreach($json as $key => $value) {
			// $valueに子供がある時の処理($valueの型がオブジェクトの時の処理)
			if (is_object($value)) {
				// fig0 再帰的にcreateJSONメソッドをコールする
				createJSON($value, $keystring, $db_resultTree);
			// columnがnullでなく、jsonの子のキーがtextかhtml、srcであれば
			} else if($column != null && $keyString == KEY_TEXT || $keyString == KEY_HTML || $keyString == KEY_SRC) {
				$value = $column;	//該当するキーの値をcolumnで上書きする
			}
		}
	}

	/*
	 * Fig1
	 * 関数名：executeQuery
	 * 概要  :クエリを実行してDBから結果セットを取得する。
	 * 引数  :Map<String, Object> json:カレントのJSON連想配列
	 *		 String queryKey:実行するクエリのベースとなる文字列
	 * 戻り値:ResultSet rs:DBから取得した結果セットを返す。
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function executeQuery($json, $queryKey) {
		// 返却する結果セットの変数を作成する
		$retRS = null;

		// jsonを連想配列に展開する
		$jsonData = json_decode($json, true);
		// json連想配列のキー名がqueryKeyのとき
		if(key($jsonData == $queryKey)) {
			// 変数queryにjsonのキーに対応した値を入れる
			$query = $jsonData[$queryKey];
		}
		// queryに正しい値が入っていれば
		if($query != null && strlen($query) >=1) {
		// jsonについて最下層の要素にたどり着くまでループしてデータを取り出す
			foreach($json as $key => $value) {
				// $valueに子供がある時の処理($valueの型がオブジェクトの時の処理)
				if (is_object($value)) {
					// 子オブジェクトを取得する
					$childObject = $value;
					// 子オブジェクトがvalueのキーを持っている
					if (key($childObject) == KEY_VALUE) {
						// 子オブジェクトの"text"キーの値をquery内の"db_column"の値と置換する
						$query = str_replace(“'” + key($key) + “'”, “'”  + $value + “'”, $query);
					}
				}
			}
			// ステートメントを生成する
			$stmt = $dbh->prepare($query);
			//SELECT命令であれば
			if($queryKey == (DB_GETQUERY)){
				$retRS = $stmt.executeQuery($query);				//クエリを実行して結果セットを取得する
				//結果セットをレコードが取得できるポインタに進める。レコードが取得できていない場合にはnullを返すようにする
				$retRS = $retRS.next()? $retRS: null;				
			//UPDATEかINSERTであれば
			} else if ($queryKey == (DB_SETQUERY)){
				//クエリを実行して更新処理を行う。処理を行ったレコード数を返してメンバに保存する
				$processedRecords = $stmt.executeUpdate($query);
			}
		}
		// 結果セットを返す
		return $retRS;
	}

	/*
	 * Fig2
	 * 関数名：getDBColumn
	 * 概要  :指定したkey(列)の値を結果セットから取得して返す。
	 * 引数  :String key:JSONのオブジェクトのキー
	 * 		  DBResultTree dbrTree:DBから取得した結果をツリー構造にするクラスのインスタンス
	 * 戻り値:String column:取得した列の値を返す
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function getDBColumn($key, $dbrTree) {
		// 戻り値を格納する変数を初期化する
		$column = null;
		// 親がなくなるまでDBレコードツリーを操作する
		while($dbrtree != null) {
			// レコードの列名リストが生成できた&&keyに該当するcolumnがある
			if($dbrTree->db_result != null && checkColumn($dbrTree->db_result, $key)) {
				// columnに値をセットする
				$column = $checkRecord[$key];
				break;
			} else {
				// 親をセットする
				$dbrtree = $dbrtree->parent
			}
		}
		// columnを返す
		return $column;
	}



	/*
	 * Fig3
	 * 関数名：getListJSON
	 * 概要  :リスト形式のJSONを作成して返す
	 * 引数  :Map<String, Object> json:JSONのオブジェクト。
	 * 戻り値 :String strAll:JSONの文字列配列を文字列で返す
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function getListJSON($json) {
		// 返却する文字列を作成するための変数を3つ宣言、初期化する
		$strAll = "";
		$strBlock = "";
		$strLine = "";
		// fig1 データベースから当該レコード群を取得する
		$rs = executeQuery($json, DB_GETQUERY)
		// 結果セットの列数を取得する。
		$ccount = $stmt->rowCount();
		// 後判定で結果セットをループさせる
		do {
			// レコードの文字列を初期化する
			$strLine = "";
			while($rec = $stmt->fetch(PDO::FETCH_ASSOC)) {
				// 列名を取得する
				$sColName = key($rec);
				// 文字列の行単位の変数が空でなければ
				if($strLine != "") {
					// 行の文字列をカンマで区切る
					$strLine += ",";
				}
				//1列分のデータを文字列に追加する
				$strLine .= "\"" . $sColName . "\":\"" . $rec[$sColName] . "\"";
			}
			//行に文字列が入っていたら、カンマで区切る
			$strBlock .= $strBlock != "" ? "," : "";
			
			$strBlock .= "{" + $strLine + "}";	//作成した行の文字列をブロックの文字列に追加する
		// 結果セットのポインタを次に進める次がなければループを抜ける
		} while(next($rs));

		// 作成した全ブロックを配列の括弧で囲む
		$strAll = "["+$strBlock+"]";

		// 作成した文字列を返す
		return $strAll;
	}


	/*
	 * Fig4
	 * 関数名：outputJSON
	 * 概要  :DBから取得したレコードでJSONを作る。
	 * 引数  :String jsonString:クライアントから受け取ったJSON文字列
			 :String key:JSONのトップのノードのキー。2015.0521時点では空文字が渡されている
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function outputJSON($jsonString, $key) {
		// fig5 引数のJSON文字列を変換して、JSONの連想配列を取得してクラスのオブジェクトのメンバに格納する
		this->getJSONMap($jsonString);
		// 例外に備える
		try{
			// データベースに接続する
			this->$dbh = new PDO(DSN, DB_USER, DB_PASSWORD);
			// データベースをUTF8で設定する
			$dbh->query('SET NAMES utf8');
			//JSON文字列の作成を行う。
			this->createJSON(this->json ,$key, null);

		} catch (PDOException $e) {
			// エラーメッセージを表示する
			echo $e->getMessage();
			// プログラムをそこで止める
			exit;
		//最後に必ず行う
		} finally {
			// 最後に必ずDBとの接続を切る
			this->$dbh = null;
		}

	}

	/*
	 * Fig5
	 * 関数名：getJSONMap
	 * 概要  :JSON文字列から連想配列を生成する。
	 * 引数  :String jsonString:変換するJSON文字列
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function getJSONMap($jsonString) {
		// JSON文字列を連想配列に変換する
		$map = json_decode($jsonString, true);
		// Mapに変換されたJSONをJSONDBManagerクラスのメンバに格納する
		this->json = $map;
	}

	/*
	 * Fig8
	 * 関数名：checkColumn
	 * 概要  :結果セットに指定した列名を持つ列があるかをチェックする
	 * 引数  :ResultSet rs:指定した列があるかをチェックする対象の結果セット
			 String columnName:チェック対象の列名
	 * 戻り値:boolean:列の存在を判定して返す
	 * 設計者:H.Kaneko
	 * 作成者:T.Yamamoto
	 * 作成日:2015.
	 */
	function checkColumn($rs, $columnName) {
		// 返却用の真理値の変数を宣言、falseで初期化する
		$retBoo = false;
		// 結果セットの列の数を取得する
		$ccount = $stmt->rowCount();
		// 結果セットの列を走査する
		while($record = $stmt->fetch(PDO_::ASSOC)) {
			// 結果セットの列に指定した列名の列が存在する
			if(isset($checkRecord[$columnName])) {
				// 返す変数にtrueを格納する
				$retBoo = true;
				global $checkRecord[$columnName];
				// ループを終了する
				break;
			}
		}
		// 判定を返す
		return $retBoo;
	}

}
