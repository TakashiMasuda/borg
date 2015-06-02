//JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

//createTagコール時の引数として使う定数。
CREATETAG_FIRST = -1;

function createTag(){
	this.json = null;			//JSONデータを格納する変数。
	this.dom = '';				//ひな形のHTMLのDOMを格納する変数。
	this.numbering = '';		//ブログページのナンバリングのJSON連想配列。
	this.formData = {};			//フォームデータを格納する連想配列。
	var own = this;				//自分自身の要素を変数に入れる
	//add T.Masuda 2015/0417 予約ダイアログを作る関数を格納した連想配列を用意する。
	this.reservedDialog = {};	

	/*
	 * 関数名:this.getJsonFile = function(jsonPath,map)
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath:JSONを要求する先。
	 * 		:Object map:サーバへ渡す値の連想配列。
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 * 変更者:T.Masuda
	 * 変更日:2015.03.30
	 * 内容　:サーバへ連想配列を渡せる様に変更しました。
	 */
	this.getJsonFile = function(jsonPath, map){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;
		//mapに何も入力されていなければ、空の連想配列を代入する。
		map = map === undefined ? {"blank":""} : map;
		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: jsonPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'JSON',
			//同期通信を行う。
			async: false,
			//サーバへ連想配列を送信する。
			data: map,
			//キャッシュを無効にする。
			cache:false,
			//通信完了時の処理を記述する。
			success: function(json){
				//クラスのメンバjsonに取得したjsonの連想配列を格納する。
				tmp = json;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});

		//フィールドのメンバのjsonが空であれば
		if(this.json == null){
			//クラスのメンバのjsonにtmpの連想配列を格納する。
			this.json = tmp;
		//既にJSONが格納されていたら
		} else {
			//連想配列を連結する。
			this.json = $.extend(true, this.json, tmp);
		}
	};

	/* 
	 * 関数名:this.getDomFile = function((domPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getDomFile = function(htmlPath){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;
		
		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: htmlPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'HTML',
			//同期通信を行う。
			async: false,
			//キャッシュを無効にする。
			cache:false,
			//通信完了時の処理を記述する。
			success: function(html){
				//クラスのメンバdomに取得したDOMのオブジェクトを格納する。
				tmp = html;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});
		
		//DOMが空であれば
		if(this.dom == ''){
			//クラスのメンバのdomにtmpのHTML文字列をオブジェクトに変換して格納する。
			this.dom = $(tmp);
		//既にDOMがあれば
		} else {
			//DOMを追加する。
			$(this.dom).append($('> *',tmp));
		}
	};

	/* 
	 * 関数名:this.outputTag = function(key, domNodeName, appendTo)
	 * 概要  :キーからパーツを。
	 * 引数  :String key, String domNodeName, String appendTo
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.20
	 */
	this.outputTag = function(key, domNodeName, appendTo){
		//domNodeNameがundefined(未入力)であれば、キー名をdomNodeNameにする。
		domNodeName = domNodeName === undefined ? key : domNodeName;
			
		//JSONの先頭のキーの連想配列と、DOMの先頭を取得する。
		mapNode = this.getMapNode(key);			//マップの先頭を取得する。
		domNode = this.getDomNode(domNodeName);	//DOMの先頭を取得する。

		// createTagでキーに対応したHTMLのパーツを作成し、変数tagに格納する。
		var tag = this.createTag(mapNode, domNode);
		// パーツの作成に成功したならば
		if(tag != null){
			//@mod 2015.03.10 T.Masuda 第三引数appendToに対応しました。
			//appendToが入力されていれば
			if(appendTo != null){
				//appendで、作成したタグをappendToに追加する。
				$(appendTo).append(tag);
			//appendToが空であれば	
			} else {
				//appendで作成したタグをmainに追加する。
				$('.main').append(tag);
			}
			//@mod 2015.03.10 T.Masuda ここまで変更しました。
		// パーツの作成に失敗したならば
		} else{
			//失敗のメッセージダイアログを出す。
			console.log(key + 'の作成に失敗しました。');
		}
	}	
	
	/* 
	 * 関数名:this.createTag = function(curMapNode, curDomNode)
	 * 概要  :JSON連想配列のキーからタグに値を格納する。
	 * 引数  :Object curMapNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 */
	this.createTag = function(curMapNode, curDomNode){
		
		//マップ、DOMが取得できていなかったら
		if(curMapNode == null || !curDomNode.length){
			//処理を終える。
			return null;
		}
				
		//連想配列に子がいる限りループする。
		for(key in curMapNode){
			var mapNode = curMapNode[key];	//mapNodeの内容をcurMapNode内のmapNodeの参照に切り替える。
			var attribute = false;				//属性値を格納する変数
			
			//キーがtextであれば
			if(key == 'text'){
				//curDomにテキストtextメソッドで追加する。
				curDomNode.text(mapNode);
			//キーがHTMLであれば
			} else if(key == 'html'){
				//curDomにテキストをhtmlメソッドで追加する。
				curDomNode.html(mapNode);
			//mapNodeが配列であれば
			} else if($.isArray(mapNode)){
				//キー名でタグを作成し、そのテキストにキー値をセットする。
				this.createTagArray(key, mapNode, curDomNode);
			//mapNodeが子であれば
			} else if(typeof mapNode == 'object'){
				//カレントの子DOMノードからkeyを持つDOMノードを取得する。
				var domNode = this.getDomChild(key, curDomNode);
				//domNodeがnullでなければ
				if(domNode){
					//子ノードへ再帰する。
					this.createTag(mapNode, domNode);
				}
			//curDomNodeのAttribute配列からmapNodeのキー値を持つノードを取得する。
			} else if(attribute = curDomNode[0].getAttributeNode(key)){
				//取得したノードにmapNodeの値をセットする。
				attribute.value = mapNode;
			}
		}
	
		//curDomNodeを返す。
		return curDomNode;
	};
	
	/* 
	 * 関数名:this.getMapNode = function(key)
	 * 概要  :JSON連想配列の最上階層からキーに対応した値を取り出す。
	 * 引数  :String key
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getMapNode = function(key){
		//クラスメンバの連想配列からキーに応じた連想配列を返す。
		return this.json[key];
	};

	/* 
	 * 関数名:this.getDomNode = function(key)
	 * 概要  :キーに対応するHTMLのパーツを返す。
	 * 引数  :String key
	 * 返却値  :jQuery
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 * 内容  :テンプレートのHTMLそのものではなく、コピーを返す様に変更しました。
	 */
	this.getDomNode = function(key){
		//メンバのHTMLからキーに対応した要素をコピーして返す。
		return $($(' > *[class="' + key +'"]', this.dom).clone(false));
	};
	
	/* 
	 * 関数名:this.createTagArray = function(mapNode, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 内容　:本来想定されていた動作に修正されました。
	 */
	this.createTagArray = function(key, mapNode, domNode){
		//domNodeのキーの要素を取得する。
		domNode = this.getDomChild(key, domNode); 
		
		//引数にnullがあれば
		if(key == null || mapNode == null || domNode == null){
			//処理をやめる。
			return;
		}
		
		//不足しているタグの個数を算出する。
		var clones = mapNode.length - 1;
		//domNodeを必要な分コピーする。
		for(var i = 0; i < clones; i++){
			//1個目のmapNodeの後ろに自身のコピーを追加する。
			$(domNode[0]).after($(domNode[0]).clone(false));
		}

		//mapNodeの配列分ループする。
		for(var i = 0; i < mapNode.length; i++){
			//mapNode[i]が配列であれば
			if($.isArray(mapNode[i])){
				//キー名でタグを作成し、そのテキストにキー値をセットする。
				this.createTagArray(key, mapNode, curDomNode);
			//mapNode[i]が子であれば
			} else if(typeof mapNode[i] == 'object'){
				//カレントのDOMノードの子ノードを取得する。子ノードは属性で特定する。
				var childDomNode = this.getDomChild(' > [' + domNode[0].children[0].attributes[0].name + ']', domNode);
				//childDomNodeがnullでなければ
				if(childDomNode){
					//子ノードへ再帰する。
					this.createTag(mapNode[i], childDomNode);
				}
			//ただのテキストであれば
			} else {
				//テキストを書き込む。
				$(domNode).text(mapNode[i]);
			}
			
			//domNodeを次に移動する。
			domNode = $(domNode).next();
		}
	}

	/* 
	 * 関数名:this.getDomChild = function(key, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, jQuery domNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 内容　:タグに対応しました。
	 */
	this.getDomChild = function(key, domNode){
		var domNodeReturn;							//domNodeの返却用変数を作る。
		//子要素の識別子が記述されていなければ
		if(key.indexOf('>') == -1){
			domNodeReturn = $('.' + key, domNode);	//domNodeの子の階層からkeyのクラスを持つノードを取得する。
		//子要素のセレクタであったら
		}else{
			domNodeReturn = $(key, domNode);	//domNodeの子の階層から指定した属性を持つノードを取得する。
		}
		//DOMの取得に失敗したら
		if(domNodeReturn[0] == null){
			//domNodeの子の階層からkeyのタグ名を持つノードを取得する。
			domNodeReturn = $(key, domNode);
		}
		
		//domNodeReturnを返す。
		return domNodeReturn;
	}
	
	/* 
	 * 関数名:this.outputNumberingTag = function(jsonName, startPage, displayPageMax, displayPage, pageNum, targetArea)
	 * 概要  :ナンバリングと、それに応じたブログのページを作る。
	 * 引数  :String jsonName:処理対象となるJSONのキー名。
	 * 		 int startPage:表示する1つ目のナンバリングの数
	 * 		 int displayPageMax:表示するナンバリングの最大数
	 * 		 int displayPage:表示するブログのページ番号
	 * 		 int pageNum:1ページに表示する記事数。
	 * 		 String targetArea:記事の追加先のセレクタ。
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 * 変更者:T.Masuda
	 * 変更日:2015.04.08
	 * 内容　:引数を追加して1ページに複数の記事を表示するのに対応しました。
	 * 変更者:T.Masuda
	 * 変更日:2015.04.09
	 * 内容　:引数に作成した記事の追加先を追加しました。
	 */
	this.outputNumberingTag = function(jsonName, startPage, displayPageMax, displayPage, pageNum, targetArea){
		
		//numberingの内容をクリアする（numberingはクラスのメンバとして宣言する）
		this.numbering = {};		

		//ナンバリング用のJSONを作る。
		this.createNumbering(jsonName, startPage, displayPageMax, displayPage ,pageNum, targetArea);
		
		//記事を消す
		$(targetArea).empty();
		//コンテンツ表示
		outputKeyNumberObject(this.json, jsonName, targetArea, pageNum, displayPage)
		
		//ナンバリングを消す。
		$('.numberingOuter').empty();
		
		// add T.Masuda 2015/0421 ナンバリングが生成されない時にcreateTagのエラーがコンソールに出力されるバグの修正
		// add T.Masuda 2015/0422 numberingオブジェクトが生成されていない状況への対応
		//ナンバリングのオブジェクトがあれば
		if('numbering' in this.json && '1' in this.json.numbering){
			//ナンバリング用Tagを表示する。
			this.outputTag('numbering', 'numbering', '.numberingOuter');
			//現在表示中のページに対応するナンバリングの色を変える。
			this.selectPageNumber(displayPage);
		}
		
		//スクロール位置が低ければ
		if($(window).scrollTop() > $(".main").offset().top){
			//スクロール位置を上に戻す。記事が見えなくならないようにするため、.mainの縦座標を基準に移動する。
			window.scroll(0,$(".main").offset().top);
		}
	}

	/* 
	 * 関数名:this.createNumbering = function(jsonName, startPage, displayNum, pageNum)
	 * 概要  :ブログページのナンバリング(ページャ)を作る。
	 * 引数  :String jsonName:JSON名。
	 * 		 int startPage:表示する1つ目のナンバリングの番号。
	 * 		 int displayPageMax:表示するナンバリングの最大個数。
	 * 		 int pageNum:1ページに表示する記事数。
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 * 変更者:T.Masuda
	 * 変更日:2015.04.08
	 * 内容　:引数pageNumを追加し、1ページに複数の記事を載せることに対応しました。
	 */
	this.createNumbering = function(jsonName, startPage, displayPageMax, displayPage, pageNum, targetArea){
		//ページ数を取得する。
		var pageMax = Math.ceil(this.getJsonObjectNum(jsonName) / pageNum);
		
		//ページ数が1以下ならナンバリングを作成せずに終了する。
		if(pageMax <= 1){
			return;
		}
		
		// <<ボタンを作る。(1ページ前に進める)
		this.createNumberingAround(this.numbering, 'pre', '<<', startPage,
										displayPageMax, displayPage-1, pageMax, jsonName, pageNum, targetArea);

		//ナンバリングの中の最後の数字を算出して変数に格納する。最終ページを超えていれば最終ページに丸める。
		var lastPage = (startPage + displayPageMax) <= pageMax ? (startPage + displayPageMax) : pageMax;
		
		//for文でナンバリングを必要なだけ作る。
		for(var i = startPage; i <= lastPage; i++){
			var indexText = (i - startPage + 1).toString();	//ナンバリングのボタンの連番の数値を文字列にする。
			var map = {};									//ページ数をキーとしたオブジェクトを生成する。
			map[indexText] = {};							//mapにindexTextの値をキーとした連想配列を追加する。
			
			//"text"キーにページ数を設定する。
			map[indexText]['text'] = i;
			//関数実行属性にoutputNumberingTagを設定する。
			map[indexText]['onclick'] = 'creator.outputNumberingTag("' 
				+ jsonName + '",' + startPage + ', ' + displayPageMax + ',' + i + ', ' + pageNum + ',"' + targetArea + '")';
			//numberingオブジェクトの中に、作成したオブジェクトを追加する。
			this.numbering[indexText] = map[indexText];
		}
			
		// <<ボタンを作る。(1ページ後に進める)
		this.createNumberingAround(this.numbering, 'next', '>>', startPage,
										displayPageMax, displayPage+1, pageMax, jsonName, pageNum, targetArea);
			
		//メンバjsonオブジェクトにnumberingオブジェクトを追加する。
		this.json['numbering'] = this.numbering;
		//numberingオブジェクトを返す。
		return this.numbering;
	}
	
	/* 
	 * 関数名:this.createNumberingAround = function(numbering, key, numberingString, startPage, displayPageMax, displayPage, pageMax,, jsonName, pageNum, targetArea)
	 * 概要  :ナンバリングの<<、>>を作る。
	 * 引数  :object numbering:ナンバリングが格納されている連想配列
	 * 		 string key:キー名。'pre'または'next'が入っている。
	 * 		 String numberingString:該当するナンバリングの文字。
	 * 		 int startPage:表示する最初のナンバリングの番号。
	 * 		 int displayPageMax:表示するナンバリングの個数。
	 * 		 int displayPage:現在のページ番号。
	 * 		 int pageMax:全ページ数。
	 * 		String jsonName:JSON名。
	 * 		int pageNum:1ページに表示する記事数。
	 * 		String targetArea:記事の追加先。
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.createNumberingAround = function(numbering, key, numberingString, startPage, displayPageMax, displayPage, pageMax, jsonName, pageNum, targetArea){
		var startAroundPage;
		
		//開始ページを算出する
		//前移動の場合
		if (key === 'pre' && startPage > 1) {
			//開始ページを算出、1ページ以下の場合には1ページに丸める
			startAroundPage = startPage > displayPage ? (startPage-1) : startPage;		
		//後移動の場合
		} else if (key === 'next' && (startPage+displayPageMax) < pageMax) {
			//開始ページを算出、表示ページが最終ページを超えている場合、最終ページから開始ページを逆算する。
			startAroundPage = (startPage+displayPageMax) < displayPage ? startPage+1 : startPage;		
		//上記以外の場合
		} else {
			return;
		}
		
		var keyObj = {};	//keyオブジェクトを生成する。
		keyObj[key] = {};	//keyのキーを持った連想配列を追加する。
		
		//有効属性をONにする。
		keyObj[key]['enable'] = 'on';
		//実際に設定する文字をtextに設定する。
		keyObj[key]['text'] = numberingString;
		
		//関数実行属性をoutputNumberingTagに設定する。
		keyObj[key]['onclick'] = 'creator.outputNumberingTag("' + jsonName +'",'
			+ Math.round(startAroundPage) +','+ displayPageMax + ',' + displayPage +', ' + pageNum + ',"' + targetArea + '")';
		
		//numberingオブジェクトの中に追加する。
		numbering[key] = keyObj[key];
	}

	/* 
	 * 関数名:this.getJsonObjectNum = function(jsonName)
	 * 概要  :jsonの指定キー直下ののキーの数を返す。
	 * 引数  :String jsonName:処理対象のJSONのキー名。
	 * 返却値  :int
	 * 作成者:T.Masuda
	 * 作成日:2015.03.13
	 */
	this.getJsonObjectNum = function(jsonName){
		//返却する値を格納するための変数を宣言、0で初期化する。
		var retNum = 0;

		//jsonのキー走査する。
		for(key in this.json){
			//キーが数字であれば
			if(!(isNaN(key))){
				//retNumに1を足す
				retNum++;
			}
		}
		
		//retNumを返す。
		return retNum;
	}
	
	/* 
	 * 関数名:this.selectPageNumber = function(displayPage)
	 * 概要  :選択中のページナンバーの色を変える。
	 * 引数  :int displayPage:表示中のページ番号。
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.03.13
	 */
	this.selectPageNumber = function(displayPage){
		//全てのページナンバーからselectクラスを除去する。
		$('.numbering li').removeClass('select');
		//選択中のページナンバーのタグにselectクラスを付与して色を変える。
		$('.numbering li:contains(' + displayPage + ')').addClass('select');
	}

	/*
	 * 関数名:this.createElementTag = function(stackKey, curMapNode, topDomNode)
	 * 概要  :JSONのノードに対応したタグを作る。
	 * 引数  :String stackKey:
	 * 　　　:Object curMapNode:
	 * 　　　:Element topDomNode:
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.createElementTag = function(stackKey, curMapNode, topDomNode){
		//curMapNodeがnullであれば
		if(curMapNode == null){
			return;	//処理を終える。
		}
		
		//ノードがある限りループする。
		for(key in curMapNode){
			var mapNode = curMapNode[key];	//ループで走査しているキーの値を取得する。
			var curDomNode = null;			//カレントのDOMノードを格納する変数を宣言、nullで初期化する。
			
			//mapNodeが配列であれば
			if($.isArray(mapNode)){
				//スタックした文字列とテキストの配列からタグ群を作り出す。
				curDomNode = this.createKeysToTagArray(stackKey, mapNode, key);
			//オブジェクトであれば
			} else if(typeof mapNode == "object"){
				stackKey.push(key);			//stackKeyにkeyを追加する。
				this.createElementTag(stackKey, mapNode, topDomNode);	//再帰呼び出しを行う。
				stackKey.pop();				//stackKeyの末尾を削除する。
			//textであれば
			} else if(key == 'text'){
				//スタックしたkey文字列とテキストをタグ化する。
				curDomNode = this.createKeysToTag(stackKey, mapNode, key);
			//htmlであれば
			} else if(key == 'html'){
				//スタックしたkey文字列とテキストをタグ化する。
				curDomNode = this.createKeysToTag(stackKey, mapNode, key);
			}
			//DOMが生成されていたら
			if(curDomNode != null){
				//topDomNodeの最後尾にcurDomNodeを追加する。
				$(topDomNode).append($(curDomNode));
			}
		}
	}	

	/*
	 * 関数名:this.createKeysToTag = function(curStackKey, mapNode, key)
	 * 概要  :スタックからキーのタグ、テキストから編集用のタグを作る。
	 * 引数  :Array curStackKey:キー名のスタック。
	 * 　　　:String mapNode:JSONのテキスト。
	 * 　　　:String key:カレントのキー。
	 * 返却値  :Element
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.createKeysToTag = function(curStackKey, mapNode, key){
		//retDomに外枠となるタグを格納する。
		var retDom = $('<div></div>')
						.addClass('keyAndValue')	//キーと値の組み合わせの意味合いのクラスを枠に付ける。
						.append($('<span></span>')	//キーの要素を格納するタグを生成する。
								.addClass('keys'))
						.append($('<span></span>')	//値の要素を格納するタグを生成する。
								.addClass('values')
						);

		//キーのタグを群を作る。
		var keys = this.createKeyTags(curStackKey);
		//キーのタグをまとめるタグに追加する。
		$('.keys', retDom).append(keys);

		curStackKey.push(key);	//スタックにカレントのキーを加える。
		
		//スタックの文字列を_を区切り文字にして連結する。
		var connectedKey = curStackKey.join('_');
		//編集用テキストエリアのラベルを追加する。
		$('.values', retDom).append($('<label></label>').addClass('valueLabel').text(key));
		//編集用テキストエリアを追加する。name属性には_で区切ったキーを格納する。
		$('.values', retDom).append($('<textarea></textarea>').addClass('editValue').val(mapNode).attr('name', connectedKey));

		curStackKey.pop();	//末尾に加えたキーを消す。
		
		//作成したDOMを返す。
		return retDom;
	}
	
	/*
	 * 関数名:this.createKeysToTagArray = function(curStackKey, mapNode, key)
	 * 概要  :スタックからキーのタグ、テキストから編集用のタグを複数作る。
	 * 引数  :Array curStackKey:キー名のスタック。
	 * 　　　:String mapNode:JSONの文字列配列。
	 * 　　　:String key:カレントのキー。
	 * 返却値  :Element
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.createKeysToTagArray = function(curStackKey, mapNode, key){
		//retDomに外枠となるタグを格納する。
		var retDom = $('<div></div>')
						.addClass('keyAndValue')	//キーと値の組み合わせの意味合いのクラスを枠に付ける。
						.append($('<span></span>')	//キーの要素を格納するタグを生成する。
								.addClass('keys'))
						.append($('<span></span>')	//値の要素を格納するタグを生成する。
								.addClass('values')
						);
	
		curStackKey.push(key);	//スタックにカレントのキーを加える。
		//キーのタグを群を作る。
		var keys = this.createKeyTags(curStackKey);
		//キーのタグをまとめるタグに追加する。
		$('.keys', retDom).append(keys);
		
		//スタックの文字列を_を区切り文字にして連結する。
		var connectedKey = curStackKey.join('_');
		//テキスト編集用のタグを入れるタグのjQueryオブジェクトを生成、保存する。
		var $values = $('.values', retDom);
		//ループのカウント用にmapNodeの要素数を取得する。
		var mapNodeLength = mapNode.length;
		
		//mapNodeを走査する。
		for(var i = 0; i < mapNodeLength; i++){
			//編集用テキストエリアを追加する。name属性には_で区切ったキーを格納する。
			$values.append($('<textarea></textarea>').addClass('editValue').val(mapNode[i]).attr('name', connectedKey));
		}
		
		curStackKey.pop();	//末尾に加えたキーを消す。
		
		//作成したDOMを返す。
		return retDom;		
	}

	/*
	 * 関数名:this.createKeyTags = function(curStackKey)
	 * 概要  :キーのタグ群を作る。
	 * 引数  :Array curStackKey:キーのスタック。
	 * 返却値  :Element
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.createKeyTags = function(curStackKey){
		var retDom = $('<div></div>');	//返却用の変数を宣言、初期化する。仮の枠となるdivタグを生成する。
		//スタックの要素数を取得する。
		var stackLength = curStackKey.length;
		
		//curStackKeyを走査する。
		for(var i = 0; i < stackLength; i++){
			//最後の要素でなければ
			if(i < stackLength - 1){
				//キーのタグをretDomに追加する。
				$(retDom).append($('<span></span>').addClass('key').text(curStackKey[i]));
			//最後の要素なら
			} else {
				//キーのタグをretDomに追加する。
				$(retDom).append($('<span></span>').addClass('key currentKey').text(curStackKey[i]));
			}
		}

		//作成したDOMを返す。
		return $(' > span', retDom);
	}
	
	/*
	 * 関数名:this.updateElementJson = function(topMapNode, topDomNode)
	 * 概要  :タグの内容をJSONに反映させる。
	 * 引数  :Object topMapNode:更新対象のJSONの先頭のノード
	 * 　　　:Element topDomNode:先頭のDOM
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.updateElementJson = function(topMapNode, topDomNode){
		var prevName = "";	//1回前の走査した要素のname属性を保存する変数を用意する。
		//弟DOMがある限りループする。編集用テキストエリアのDOMを走査することで、この処理を実現する。
		$('.editValue', topDomNode).each(function(){
			var thisName = $(this).attr('name');	//現在のDOMのname属性を取得する。
			//前回の走査が配列ノードの2番目以降であればスキップする。
			if(thisName != prevName){
				//テキストエリアのname属性からスタックキーを生成する。
				var stackKey = thisName.split('_');
				//スタックキーからカレントのキーを取り出す。
				var key = stackKey[stackKey.length - 1];
				
				//スタックkeyに一致するノードを返す。
				var mapNode = own.findMapNode(stackKey, topMapNode);
				
				//ノードがtextであれば
				if(key == 'text'){
					//タグの文字列をJSONノードにセットする。
					mapNode[key] = $(this).val();
					//htmlであれば
				} else if(key == 'html'){
					//タグの文字列をJSONノードにセットする。
					mapNode[key] = $(this).val();
					//配列であれば
				} else if($.isArray(mapNode[key])){
					//処理対象となるDOMを全て取得する。
					var $targetArray = $('textarea[name="' + thisName + '"]', topDomNode);
					//DOMの配列の要素数を取得する。
					var arrayLength = $targetArray.length;
					//JSONの配列にリサイズが必要であれば、DOM配列の要素数と一致させる(リサイズする)。
					mapNode[key] = new Array(arrayLength);
					//配列数分ループ
					$targetArray.each(function(i){
						//JSON側の文字列配列にDOM配列の文字列をコピーする。
						mapNode[key][i] = $(this).val();
					});
				}
			}
			
			prevName = thisName;	//前回のname属性を更新する。
		});
	}

	/*
	 * 関数名:this.findMapNode = function(curStackKey, curMapNode)
	 * 概要  :トークン文字列に該当するJSONノードを探し返す。
	 * 引数  :Array curStackKey:スタックされたキーの配列
	 * 　　　:Object curMapNode:カレントの連想配列のノード
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.findMapNode = function(curStackKey, curMapNode){
		//連想配列のノードを返却するための変数を宣言、nullで初期化する。
		var returnMapNode = null;
		
		//引数がnullなら
		if(curStackKey == null || curMapNode == null){
			return;	//処理を終える。
		}
		
		//先頭のトークンを取得する。
		var key = curStackKey[0];
		//keyに一致したNodeがあれば
		if(key in curMapNode){
			//curStackKeyから先頭トークンを取り除く
			curStackKey.shift();
			//keyに該当するノードを取得する。
			var mapNode = curMapNode[key];
			//curStackKeyが空であれば ※完全に空になるまでやるとノードの参照が失われるため、空になる一歩手前までにします。
			if(curStackKey.length == 1){
				//現在のノードを返却用の変数に格納する。
				returnMapNode = mapNode;
			//そうでなければ
			} else {
				//再帰して階層を潜る。
				returnMapNode = own.findMapNode(curStackKey, mapNode);
			}
		}
		
		//ノードを返す。
		return returnMapNode;
	}

	/*
	 * 関数名:this.getJsonForCustomize = function(rootName, jsonPath)
	 * 概要  :編集用にJSONを取得する。
	 * 引数  :String rootName:JSONを格納するキー
	 * 　　  :String jsonPath:JSONファイルのURL
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.04.01
	 */
	this.getJsonForCustomize = function(rootName, jsonPath){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;

		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: jsonPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'JSON',
			//同期通信を行う。
			async: false,
			//キャッシュを無効にする。
			cache:false,
			//通信完了時の処理を記述する。
			success: function(json){
				//クラスのメンバjsonに取得したjsonの連想配列を格納する。
				tmp = json;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});

		//フィールドのメンバのjsonが空であれば
		if(tmp != null){
			//クラスのメンバのjsonにtmpの連想配列を格納する。
			this.json[rootName] = tmp;
		} 
	}
	
	/*
	 * イベント名:$(document).on('click', '#customize .saveButton')
	 * 引数  　 	:string 'click':クリックイベントの文字列
	 * 			:string '#customize .saveButton':カスタマイズタブの保存ボタンのセレクタ。
	 * 戻り値　 :なし
	 * 概要  　 :カスタマイズタブの保存ボタンを押したときのイベント。JSONの保存処理の関数をコールする。
	 * 作成日　　:2015.04.02
	 * 作成者　　:T.Masuda
	 */
	$(document).on('click', '#customize .saveButton', function(){
		//更新ボタンのtarget属性に仕込まれた更新対象のJSONのトップノード名を取得する。
		var topNodeName = $(this).attr('target'); 
		//トップノード名からDOMのトップのIDを指定し、JSONを更新する。
		//thisの中身がボタンなので、ownに保存したクラスのインスタンスで関数を呼び出す。
		own.updateElementJson(own.json[topNodeName], $('#'+topNodeName));
		//JSONを保存用に文字列に変換する。
		var jsonString = JSON.stringify(own.json[topNodeName]);
		
		//Ajax通信でJSONをファイルに保存する。
		$.ajax({
			url:'savetextfile.php',	//保存するプログラムのパスを指定する。
			method:'POST',			//POSTメソッドで送信する。
			//送信するデータを設定する。ファイルのパスとJSON文字列を送信する。
			data:{text:jsonString, path:'source/' + topNodeName + '.json'},
			dataType:'text',		//テキストデータを返してもらう。
			//キャッシュを無効にする。
			cache:false,
			async:false,	//同期通信
			success:function(text){	//通信成功時
				alert(text);	//保存結果のログを出す。
			},
			error:function(){		//通信失敗時
				//通信失敗のログを出す。
				alert('通信に失敗しました。時間をおいて試してください。');
			}
		});
	});
	
	
	/*
	 * 関数名:this.reservedDialog['experience'] = function()
	 * 概要  :体験レッスン予約希望ダイアログのタグを作る。
	 * 引数  :なし
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.04.17
	 */
	this.reservedDialog['experience'] = function(){
		//体験レッスン予約ダイアログ用のJSONを取得する。。
		own.getJsonFile(init['experienceLesson']);
		
		//createTagでダイアログに必要なタグを生成する。
		own.outputTag('specialReservedDialog','specialReservedDialog','body');
		own.outputTag('reservedDate','reservedDate','.specialReservedDialog');
		own.outputTag('reservedSummary','reservedSummary','.specialReservedDialog');
		own.outputTag('radioButtonSpecialConstruct','radioButtonSpecialConstruct','.specialReservedDialog');
		own.outputTag('radioButtonSpecialSchedule','radioButtonSpecialSchedule','.specialReservedDialog');
		own.outputTag('subInfo','subInfo','.specialReservedDialog');
		own.outputTag('personInformation','personInformation','.specialReservedDialog');
		own.outputTag('mailSubject','mailSubject','.specialReservedDialog');
	}

	/*
	 * 関数名:this.reservedDialog['usually'] = function()
	 * 概要  :通常レッスン予約希望ダイアログのタグを作る。
	 * 引数  :なし
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.04.17
	 */
	this.reservedDialog['usually'] = function(){
		//体験レッスン予約ダイアログ用のJSONを取得する。。
		own.getJsonFile(init['usuallyLesson']);
		
		//createTagでダイアログに必要なタグを生成する。
		own.outputTag('specialReservedDialog','specialReservedDialog','body');
		own.outputTag('reservedDate','reservedDate','.specialReservedDialog');
		own.outputTag('reservedSummary','reservedSummary','.specialReservedDialog');
		own.outputTag('radioButtonUsuallyCourse','radioButtonUsuallyCourse','.specialReservedDialog');
		own.outputTag('radioButtonSpecialSchedule','radioButtonSpecialSchedule','.specialReservedDialog');
		own.outputTag('subInfo','subInfo','.specialReservedDialog');
		own.outputTag('memberInformation','memberInformation','.specialReservedDialog');
		own.outputTag('mailSubject','mailSubject','.specialReservedDialog');
		
		//DBから会員情報を取得してpersonInformationの各フォームにデータを格納する。
		getMemberInformation('.specialReservedDialog');
	}
}
	