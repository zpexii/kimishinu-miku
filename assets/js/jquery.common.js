/*-----------------------------------------------
 * Root
-------------------------------------------------*/
let root = $("body").data('root');
let page = $("body").data('page');
const pcOnly = window.matchMedia('(min-width: 768px)');
const spOnly = window.matchMedia('(max-width: 767px)');


/*-----------------------------------------------
 * COMMON
-------------------------------------------------*/
$(function(){

	// Anchor Smooth Scroll
	$('.js-anchor').on('click', function(){
		var speed = 1000;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, speed, 'easeOutQuart');
		return false;
	});

	// Menu
	$('.js-menu').on('click', function(){
		$(this).toggleClass('is-active');

		if($(this).hasClass('is-active')){
			$('.js-header').addClass('is-active');
			$("body").css({'overflow':'hidden'});
		} else {
			$('.js-header').removeClass('is-active');
			$("body").css({'overflow':''});
		}
	});
	$(".headerNavInWrap a,.headerBg.-b").on('click', function(){
		$('.js-header,.js-menu').removeClass('is-active');
		$("body").css({'overflow':''});
	});


	/**
	 * Modal open
	 */
	// Common
	$('.js-modalOpen').on('click', function(){
		var modalID = $(this).data('modal');
		$('#' + modalID).fadeIn(500);
		$('.modalBox').fadeIn(500);
		$('body').css({'overflow':'hidden'});
		lenis.stop();
	});

	// Youtube
	$('.js-youtubePlay').on('click', function(){
		var ytID = $(this).data('ytid');
		var ytURL = 'https://www.youtube.com/embed/'+ytID+'?autoplay=1&rel=0';
		setTimeout(function(){
			$('.js-youtubeIframe').attr('src',ytURL);
		},100);
	});


	/**
	 * Modal close
	 * iframeのsrcをcloseの際に消す
	 */
	var $modalIF = $('.js-youtubeIframe');

	// Close処理
	function modalClose() {
		$('.modalBox, .oneModal').fadeOut(500);
		setTimeout(function(){
			$modalIF.attr('src','');
			$(".modalBox").attr('data-option','');
			$("body").removeClass('--modalOpen');
			lenis.start();
		},500);
		$('body').css({'overflow':''});
	}

	// Closeボタン
	$('.js-modalClose').on('click', function(){
		modalClose();
	});

	// Close エリア外
	$('.js-oneModalIn').on('click touchend', function(e) {
		if (!$(e.target).closest('.js-oneModalIn__cont').length) {
			modalClose();
		}
	});
});


/*-----------------------------------------------
 * ACCESS HISTORY [セッションストレージを使用して初回アクセスか判定するやつ]
----------------------------------------------- */
function accessHistory() {
	const keyName = 'visited';
	const keyValue = true;
	if (!sessionStorage.getItem(keyName)) {
		//FIRST ACCESS
		sessionStorage.setItem(keyName, keyValue);
		return true;
	} else {
		$('body').addClass('is-visited');
		return false;
	}
}
$(document).ready(accessHistory());


/*-----------------------------------------------
 * ScrollAnimation for IntersectionObserver [.js-scrani 要素が見えたら --is-ani をaddclass するやつ]
-------------------------------------------------*/
const set_scrani = () =>{
	const SCRANI_ACTIVE_CLASSNAME = '--is-ani';
	const scrani_callback = (entries) => {
		entries.forEach( (entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add(SCRANI_ACTIVE_CLASSNAME);
			}
		});
	}
	const scrani_option = {
		rootMargin: '-30% 0px',
	}
	const scrani_observer = new IntersectionObserver(scrani_callback, scrani_option);

	const target_scrani = document.querySelectorAll('.js-scrani');
	target_scrani.forEach( (elem) => {
		scrani_observer.observe(elem);
	});
}



/*-----------------------------------------------
 * MOVIE
-------------------------------------------------*/
function movie(_ytid,_option){
	$('#youtubeModal').fadeIn(500);
	if(_option){
		$(".modalBox").attr('data-option',_option);
	}
	$('.modalBox').fadeIn(500);
	$("body").addClass('--modalOpen');
	var ytURL = 'https://www.youtube.com/embed/'+_ytid+'?autoplay=1&rel=0';
	setTimeout(function(){
		$('.js-youtubeIframe').attr('src',ytURL);
	},100);
	$('body').css({'overflow':'hidden'});
	lenis.stop();
}

// YouTube Iframe 二重再生防止 [movie1つのみ]
// NOTE: the original assumes the YouTube IFrame API always loaded.
// Guarded here so the page still works where youtube.com is unreachable.
function ytPlayerGuard(_fn){
	if(typeof player !== 'undefined' && player && typeof player[_fn] === 'function'){
		player[_fn]();
	}
}

$(".js-moviePlay").on('click', function(){
	if(page == 'top'){
		ytPlayerGuard('stopVideo');
	}
	$('body').addClass('--yt-apmov-stop');
	$(".js-modalBox").addClass('js-modalplayClose');
});

$(document).on('click','.js-modalplayClose a.js-modalClose', function(){
	if(page == 'top'){
		ytPlayerGuard('playVideo');
	}
	$(".modalBox").removeClass('js-modalplayClose');
	$('body').removeClass('--yt-apmov-stop');
});

$(document).on('click','.js-modalplayClose .js-oneModalIn', function(e) {
	if(page == 'top'){
		ytPlayerGuard('playVideo');
	}
	$(".modalBox").removeClass('js-modalplayClose');
	$('body').removeClass('--yt-apmov-stop');
});

function ytThumb(){
	$(".js-ytThumb").each(function(){
		var ytid = $(this).data('ytid');
		var imgHtml = '<img src="//img.youtube.com/vi/' + ytid + '/sddefault.jpg" alt="YouTube Thumbnail">';
		$(this).find(".btn_movie-img").html(imgHtml);
	});
}
ytThumb();


/*-----------------------------------------------
 * Scroll Element
-------------------------------------------------*/
gsap.registerPlugin(ScrollTrigger);
let mm = gsap.matchMedia();

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0);


/*-----------------------------------------------
 * ENGLISH TITLE - GSAP[ScrollTrigger]
-------------------------------------------------*/
/**
 * engTitle scrollTrigger
 */
function createEngTitle(_target, _to, _endPoint, _scrub){
	gsap.to(_target,{
		backgroundPositionX: _to + "%",
		scrollTrigger:{
			pin: true,
			start: () => 0,
			end: () => _endPoint,
			scrub: _scrub,
			invalidateOnRefresh: true,
		}
	})
}

if(page !== "top"){
	if($("#js-l_slideTitle_t")[0]){
		createEngTitle("#js-l_slideTitle_t", 50, 8930, 0.5);
	}
}


/*-----------------------------------------------
 * l-LOADING
-------------------------------------------------*/
lenis.stop();
function lLoading(){
	setTimeout(()=>{
		document.body.classList.add('--is-loaded');
		setTimeout(() => {
			let loadAniElement = document.querySelector('.js-loadani');
			loadAniElement.classList.add('--is-ani');
			lenis.start();
			set_scrani();
		}, 200);
	},200);
}
if(page !== "top"){
	lLoading();
}


/*-----------------------------------------------
 * COMMENT - MODAL
-------------------------------------------------*/
function comment(_comment, _cid, _option){
	// // HTML RESET
	$("#js-commentModalCont").html('');
	$("#commentCont").removeClass();

	// commentParts Setting
	let commentParts;
	if(_comment == 'staff'){
		commentParts = staff[_cid];
	}else if(_comment == 'cast'){
		commentParts = cast[_cid];
	}

	// OPTION
	if(_option){
		$(".modalBox").attr('data-option',_option);
	}

	// 名前生成兼キャスト向け要素作成
	let nameElement = '';
	if(_comment == 'cast' && commentParts.castimg){
		let castOther = '';
		if(commentParts.other){
			castOther += '<dl class="commentCont__dl"><dt class="commentCont__dl--dt">他出演作</dt><dd class="commentCont__dl--dd">'+ commentParts.other +'</dd></dl>';
		}
		nameElement += '<div class="commentCastHead"><div class="commentCastImg"><img src="'+root+'assets/img/comment/'+commentParts.castimg+'" alt="'+commentParts.name+'" class="-ndlimg"></div><div class="commentCastHead__cont"><h2 class="commentCont_h2"><span class="commentCont_h2-job">'+commentParts.job+'</span><span class="commentCont_h2-name">'+commentParts.name+'</span></h2>'+ castOther +'</div></div>'
	}else{
		nameElement += '<h2 class="commentCont_h2"><span class="commentCont_h2-job">'+commentParts.job+'</span><span class="commentCont_h2-name">'+commentParts.name+'</span></h2>';
	}

	// COMMENT
	let commentElement = '';
	if(commentParts.comment){
		commentElement += '<dl class="commentCont__dl"><dt class="commentCont__dl--dt -en">COMMENT</dt><dd class="commentCont__dl--dd">'+commentParts.comment+'</dd></dl>';
	}

	// IMG CHACK
	let commentImg = '';
	if(commentParts.img){
		commentImg+='<div class="commentCont__image"><img src="'+root+'assets/img/comment/'+commentParts.img+'" alt="'+commentParts.name+'" class="-ndlimg" onmousedown="return false" oncopy="return false" onselectstart="return false" oncontextmenu="return false"></div>';
	}

	// HTML
	$("#js-commentModalCont").append(nameElement + commentElement + commentImg);

	// MODALOPEN
	$('#commentModal').fadeIn(500);
	$('.modalBox').fadeIn(500);
	$("body").addClass('--modalOpen');
	lenis.stop();
	$('body').css({'overflow':'hidden'});
}



/*-----------------------------------------------
 * imgModal
-------------------------------------------------*/
function imgModal(_file,_option){
	$("#imgModal").attr('data-option','');
	if(_option){
		$("#imgModal").attr('data-option',_option);
	}
	let vimg;
	vimg = `<img src="`+ _file +`" onmousedown="return false" oncopy="return false" onselectstart="return false" oncontextmenu="return false" class="js-oneModalIn__cont">`;
	$(".js-imgModalImage").html(vimg);
	$('#imgModal').fadeIn(500);
	$('.modalBox').fadeIn(500);
	$('body').css({'overflow':'hidden'});
	lenis.stop();
}
