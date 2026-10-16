/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* -------------------- */
// SETTING
//1ページ当たりの記事数
const pageLimit = 30;

//トップページの記事数
const topLimit = 3;

//詳細ページファイル
const detailFile = 'detail.html';

//詳細ページ内容拡張子
const detailPartsExt ='html';


/* -------------------- */

$(function(){
	var rootPath = $('body').data('root');
	$.Deferred().resolve(window.NEWSLIST || []).done(function(data){
		//全ての件数
		var allNum = data.length;
		//ページ総数
		var pageAllNum = Math.ceil(allNum / pageLimit);
		//トップページ表示
		if($('#js-topicsLists')[0]){
			$.each(data,function(i,v){
				if(i >= topLimit){
					return false;
				}
				var detailLink = rootPath+'news/'+v.uniqueId+'.html';
				var target='';
				if(v.directLinkUrl){
					detailLink = v.directLinkUrl;
					if(v.directLinkTarget){
						target=' target="'+v.directLinkTarget+'"';
					}
				}
				$('#js-topicsLists').append('<li class="newsList"><a href="'+detailLink+'"'+target+' class="newsList__link"><time datetime="'+v.datetime+'" class="newsList__date">'+v.date+'</time><p class="newsList__title"><span>'+v.title+'</span></p></a></li>')
			});
		}

		//NEWS一覧
		if($('#js-newsLists')[0]){

			//ページ番号の決定
			var pageNum = 1;
			if(getParam('page')){
				pageNum = Number(getParam('page'));
			}


			//pageitem
			var pageItemNextStart = pageNum * pageLimit
			var pageItemStart = pageItemNextStart - pageLimit;
			for(var k = pageItemStart;k < pageItemNextStart;k++){
				if(!data[k]) {
					continue;
				}
				var detailLink = rootPath+'news/'+data[k].uniqueId+'.html';
				var target='';
				if(data[k].directLinkUrl){
					detailLink = data[k].directLinkUrl;
					if(data[k].directLinkTarget){
						target=' target="'+data[k].directLinkTarget+'"';
					}
				}
				$('#js-newsLists').append('<li class="newsList"><a href="'+detailLink+'"'+target+' class="newsList__link"><time datetime="'+data[k].datetime+'" class="newsList__date">'+data[k].date+'</time><p class="newsList__title"><span>'+data[k].title+'</span></p></a></li>')
			}
		}
	}).fail(function(){
		console.log('GET NEWSLIST ERROR!!');
	})
});



function paging(_all,_now){
	const pView = 5;
	var pAll = Number(_all),
		pNow = Number(_now),
		i;

	// NOW > ALL => REDIRECT
	if(pNow > pAll){
		location.href = './';
		return false;
	}


	//計算① -> new > 規定値より少ない場合
	let calc_a = Math.floor(pView/2+1);

	//計算② -> 通常時
	let calc_b = Math.floor(pView/2-0.5);//new側（切り下げ）
	let calc_c = Math.ceil(pView/2-0.5);//old側（切り上げ）

	//計算③ -> old > 最大値が近い場合
	let calc_d = pAll - calc_c;

	//prev
	if(pNow-1 >= 1){
		var prevlink = pNow - 1;
		$(".wp-pagenavi").append('<a class="previouspostslink" rel="prev" aria-label="Previous Page" href="?page='+ prevlink+'"><span class="comlink_arrow"><span class="comlink_arrow-line"></span><span class="comlink_arrow-circle"></span></span><span class="comlink_txt -en"><span>PREV</span></span></a>');
	}
	//Next
	if(pAll >= pNow+1 ){
		var nextlink = pNow + 1;
		$(".wp-pagenavi").append('<a class="nextpostslink" rel="next" aria-label="Next Page" href="'+ nextlink +'"><span class="comlink_txt -en"><span>NEXT</span></span><span class="comlink_arrow"><span class="comlink_arrow-line"></span><span class="comlink_arrow-circle"></span></span></a>');
	}
}
