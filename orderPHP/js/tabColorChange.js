function tabColorChange() {
	// タブをクリックした時の処理
	$('input[name="tab"]:radio').change(function() {
		// チェックが入っているラジオボタンのidを所得する
		var checkedTab = $('.tabRadio:checked').attr('id');
		// 受注タブを選択した時の処理
		if (checkedTab == 'receivedTab') {
			// 発注タブの背景を灰色にする
			$('.tablist .firstTab').css('background', '#eee');
			// 受注タブの背景を白色にする
			$('.tablist .secondTab').css('background', '#fff');
		// 発注タブが選択された時処理
		} else if (checkedTab == 'sendTab') {
			// 発注タブの背景を白色にする
			$('.tablist .firstTab').css('background', '#fff');
			// 発注タブの背景を灰色にする
			$('.tablist .secondTab').css('background', '#eee');
		}
	});
}