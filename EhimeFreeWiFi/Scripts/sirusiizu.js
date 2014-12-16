/*******************************************************************************
名前：しるしーず
説明：googleマップで複数住所を一括表示するライブラリ
　　　windowオブジェクトのプロパティにsirusiizuオブジェクトが追加される。
版　：1.01
更新履歴：
2014/06/06　markingメソッドでaddressオブジェクトの配列が渡された場合の処理を修正。

●sirusiizuオブジェクト
【メンバ変数】
　map:
　callback:markingメソッドの引数で渡したコールバック関数
　address:addressオブジェクト(下記参照)の配列
【メソッド】
　clear:addressプロパティをクリアし、地図上のマーカーを削除する。
　initialize:地図をdivタグに初期表示する。
　　《引数》
　　　id:地図を表示するdivタグのid
　setCenter:指定された住所を地図の中心にする。
　　《引数》
　　　index:中心に置く住所のaddressプロパティのインデックス。
　marking:addressプロパティの住所から位置情報を取得し、地図にマーカーを置く。
　　《引数》
　　　addressList:地図に表示する住所リスト。引数は以下の何れかで渡す。
　　　　・改行区切りの住所の文字列
　　　　・住所の配列
　　　　・ジオコード済のaddressオブジェクト
　　　cb:ジオコード実行後、全ジオコード終了時に渡された関数をコールバックする。
　　　　引数は連想配列で渡す。
　　　　{
　　　　　onGeocoded: １件のジオコード実行後に呼ばれる関数, 
　　　　　onGeocodeCompleted: 全ジオコード終了時に呼ばれる関数
　　　　}
　　　　《onGeocodedの関数に渡される引数》
　　　　　index:ジオコードを実行したaddressプロパティのインデックス。
　　　　　address:ジオコードを実行したaddressオブジェクト。
　　　　《onGeocodeCompletedの関数に渡される引数》
　　　　　address:addressオブジェクトの配列。

●addressオブジェクト
　マーキングに必要な情報がセットされる。
　sirusiizuオブジェクトのaddressプロパティは、当オブジェクトを配列で保持する。
【メンバ変数】
　address:住所
　iconURL:マーカー画像のURL
　index:配列内の自身のインデックス
　title:マーカーのツールチップで表示される文字
　infoHTML:情報ウィンドウに表示するHTML
　↓以下はジオコード時に取得し保持するオブジェクト。
　location
　icon
　marker
*******************************************************************************/
(function () {
var sirusiizu = function () {
	this.map = null;
	this.callback = {};
	this.address = [];
}

sirusiizu.prototype = {
clear: function () {
	for (var i = 0; i < this.address.length; i++) {
		this.address[i].marker.setMap(null);
		this.address[i].marker = null;
		this.address[i].location = null;
	}
	this.address = [];
},

initialize: function (id) {
	var myOptions = {
		zoom: 5,
		center: new google.maps.LatLng(35.6891848, 139.6916481),
		scaleControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	this.map = new google.maps.Map(document.getElementById(id), myOptions);
},

setCenter: function (index) {
	var map = this.map;
	map.setCenter(this.address[index].location);
	this.address[index].infowindow.open(map, this.address[index].marker);
	if (map.zoom < 9) {
		map.setZoom(9);
	}
},

marking: function (addressList, cb) {
	var map = this.map;
	var maxValue = 0;
	this.callback = cb ? cb : {};
	this.clear();
	if ($.isArray(addressList)) {
		if (addressList.length > 0 && $.isPlainObject(addressList[0])) {
			$.extend(this.address, addressList);
			if (this.address.length === 0) return;
			for (var i = 0; i < this.address.length; i++) {
				//latlngオブジェクトを取得し直さないと何故かエラーになる
				if (this.address[i].location) {
					this.address[i].location = new google.maps.LatLng(
						this.address[i].location.lat(), 
						this.address[i].location.lng()
					);
				}
				putMarker(map, this.address[i]);
			}
			fitBounds(map, this.address);
			return;
		}
		addr = addressList;
	} else {
		addr = addressList.split("\n");
	}
	for (var i = 0; i < addr.length; i++) {
		if (addr[i] != "") {
			this.address.push({
				index: i,
				address: addr[i], 
				iconURL: null, 
				infoHTML: null,
				title: null
			});
		}
	}
	if (this.address.length === 0) 
		return;
	codeAddress(map, this.address, 0, this.callback)
	return;

function putMarker(map, addr) {
	var marker = new google.maps.Marker({
		icon: addr.icon,
		title: (
			addr.title ?
				addr.title 
			:
				(addr.index + 1) + ". " + addr.address
		),
		map: map, 
		position: addr.location
	});
	addr.marker = marker;
	if (addr.infoHTML) {
		var infowindow = new google.maps.InfoWindow({
			content: addr.infoHTML
		});
		addr.infowindow = infowindow;
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
		});
	}
}
function codeAddress(map, address, index, callback) {
var geocoder;
	if (!geocoder) {
		geocoder = new google.maps.Geocoder();
	}
	if (geocoder) {
		geocoder.geocode( { 'address': address[index].address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				address[index].location = results[0].geometry.location;

				if ("onGeocoded" in callback) {
					callback["onGeocoded"](index, address[index]);
				}

				if (address[index].iconURL) {
					address[index].icon = new google.maps.MarkerImage(address[index].iconURL);
				} else {
					address[index].icon = null;
				}

				putMarker(map, address[index]);
				index++;
				if (index < address.length) {
					tryCount = 3;
					codeAddress(map, address, index, callback);
				} else {
					if ("onGeocodeCompleted" in callback) {
						callback["onGeocodeCompleted"](address);
					}
					fitBounds(map, address);
				}
			} else {
				if (status == "OVER_QUERY_LIMIT") {
					//	３回トライして、ダメだったら次の住所に移る
					if (tryCount <= 0) {
						address[index].error = status;
						index++;
						tryCount = 3;
						codeAddress(map, address, index, callback);
					} else {
						setTimeout(function(){
							codeAddress(map, address, index, callback);
						}, 350);
						tryCount--;
					}
				} else {
					address[index].error = status;
					index++;
					tryCount = 3;
					codeAddress(map, address, index, callback);
				}
			}
		});
	}
}

function fitBounds(map, address) {
	north = 0;
	east  = 0;
	south = 999;
	west  = 999;
	for(var i = 0; i < address.length; i++) {
		if (address[i].location) {
			west  = Math.min(west , address[i].location.lng());
			north = Math.max(north, address[i].location.lat());
			east  = Math.max(east , address[i].location.lng());
			south = Math.min(south, address[i].location.lat());
		}
	}
	var northeast = new google.maps.LatLng(north, east);
	var southwest = new google.maps.LatLng(south, west);
	map.fitBounds(new google.maps.LatLngBounds(southwest, northeast));
}
}

}	//end prototype

window.sirusiizu = new sirusiizu();
})();
