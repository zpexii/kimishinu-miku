/*-----------------------------------------------
 * Scroll Navigaiton [現在地の項目をナビゲーションにカレント]
-------------------------------------------------*/
const NAV_ACTIVE_CLASSNAME = '--is-current';
const navlists = document.querySelectorAll('.js-navlink');
const nav_option = {
	threshold: 0,
	rootMargin: '-10px 0px -65%',
}

navlists.forEach(navlist =>{
	const nav_target = document.querySelector(navlist.getAttribute('data-nav'));
	const nav_observer = new IntersectionObserver(([{isIntersecting}]) => {
		if (isIntersecting) {
			navlists.forEach(el => el.classList.remove(NAV_ACTIVE_CLASSNAME));
			navlist.classList.add(NAV_ACTIVE_CLASSNAME);
		}
	},nav_option);
	nav_observer.observe(nav_target);
})




/*-----------------------------------------------
 * MOVIE - SWIPER
-------------------------------------------------*/
// MovieSwiperを使用するか判定
var isMovieSwiper = true;
let movieSwiper;

if(isMovieSwiper){
	movieSwiper = new Swiper('.js-movieSwiper', {
		slidesPerView: 'auto',
		centeredSlides: true,
		loop: true,
		navigation: {
			nextEl: ".movieSwiper__nav--next",
			prevEl: ".movieSwiper__nav--prev",
		},
		pagination: {
			el: ".movieSwiper__paginations",
			clickable: true,
		},
	});

	movieSwiper.on('slideChangeTransitionEnd', function(){
		updateSlideMedia(movieSwiper);
	});
}else{
	document.querySelector(".movieContArea").classList.add('--noSwiper');
}



/*-----------------------------------------------
 * YouTube API
-------------------------------------------------*/
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

var ytID = [];
var ytNow = 0;
var ytSize = 'large';
var isPlayerReady = false;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('js-yt-autoplay', {
		height: '100%',
		width: '100%',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError':onPlayerError
		},
		playerVars: {
			rel:0,
			controls:0,
			disablekb:1,
			fs:0,
			iv_load_policy:3,
			showinfo:0,
			modestbranding:1,
			playsinline : 1,
			mute: 1,
		}
	});
}
function onPlayerReady(event) {
	isPlayerReady = true;
	if(isMovieSwiper){
		// movieSwiperを使用する場合
		updateSlideMedia(movieSwiper);
	}else{
		updateYTPlayer();
	}
}
function onPlayerStateChange(event) {
	if(event.data == YT.PlayerState.ENDED){
		ytNow++;
		if(ytNow >= ytID.length){
			ytNow = 0;
		}
		if(ytNow < 0){
			ytNow = ytID.length - 1;
		}
		player.clearVideo();
		player.loadVideoById(ytID[ytNow],0,ytSize);
	}
}
function stopVideo() {
	player.stopVideo();
}
function onPlayerError(event){
	console.error('[ytPlayer:ERROR]'+ event);
	if(isMovieSwiper){
		movieSwiper.slideNext();
	}
}


const updateSlideMedia = (swiperInstance) =>{
	let movieSlideActiveEl = movieSwiper.slides[movieSwiper.activeIndex];
	let _thisYTID = movieSlideActiveEl.dataset.ytid;
	if (player && isPlayerReady && typeof player.stopVideo === 'function') {
		player.stopVideo();
		player.clearVideo();
	}
	if (player && isPlayerReady) {
		ytID = [_thisYTID];
		player.loadVideoById({
			videoId:ytID[0],
		});
		player.mute();
		player.playVideo();
	}
};


// NotMovieSwiper
function updateYTPlayer(){
	if (player && isPlayerReady && typeof player.stopVideo === 'function') {
		player.stopVideo();
		player.clearVideo();
	}
	if (player && isPlayerReady) {
		ytID = [_default_ytid];
		player.loadVideoById({
			videoId: ytID[0],
		});
		player.mute();
		player.playVideo();
	}
};




/*-----------------------------------------------
 * BOOKS - SWIPER
-------------------------------------------------*/
let bookSwiper = new Swiper('.js-booksSwiper', {
	slidesPerView: 'auto',
	scrollbar: {
		el: '.js-bookSwiper__scrlbar',
		draggable: true,
	},
});




/*-----------------------------------------------
 * FIRSTVIEW - BG [ScrollTrigger]
-------------------------------------------------*/
gsap.to(".js-firstview_bg",{
	scale: 1.15,
	yPercent: -20,
	scrollTrigger: {
		pin: true,
		start: () => 0,
		end: () => `${document.querySelector("#firstview").clientHeight}`,
		scrub: 0.5,
	}
});


/*-----------------------------------------------
 * FIRSTVIEW - DEPTH FIELD
-------------------------------------------------*/
/**
 * The hero is not one flat image.  It is three planes that move against each
 * other, which is what the eye reads as depth:
 *
 *   plate       the png carries the five big defocused forms and, with them,
 *               the whole mid-ground.  It is pinned and eased to scale 1.15 /
 *               yPercent -20 by the ScrollTrigger above.
 *   .js-fvDepthBokeh   re-draws those same five forms and swells / shrinks them
 *               on long unsynchronised cycles, so the defocus itself breathes.
 *   .js-fvDepthPetals  the near-camera specks.  Every one of them sits on a
 *               position measured off the reference plate, orbits that spot,
 *               twinkles, leans with the pointer and lags on scroll -- and
 *               because it rides in .firstviewBg-imgIn it inherits the plate's
 *               pin, so the extra travel reads as genuine near-field parallax.
 *
 * Everything is offset as a *deviation from its own starting phase*, so the
 * very first painted frame is registered on the reference plate pixel for
 * pixel and the motion only ever opens up from there.
 *
 * Miku edition -- the emitter is swapped, not the pigment.  The source lit
 * this layer with daylight, so its five forms were neutral-warm smudges.  Here
 * they are a stage rig: two tall cyan falls of light at the left and right
 * thirds (the light itself carries the tail silhouette) plus one slender
 * magenta form hugging the far right edge, which is the only row allowed to
 * breathe on the rim colour.  Magenta never becomes a fill.
 *
 * Geometry: .firstviewBg-imgIn is 105.3441% wide and the plate goes through
 * object-fit:contain, so the painted plate is 99.147% of the viewport, centred.
 * The canvas sits on exactly that rect (see top.css).
 */
(function(){
	var wrap = document.querySelector(".fvDepth");
	var stage = document.querySelector(".c-firstview");
	var cvB = wrap && wrap.querySelector(".js-fvDepthBokeh");
	var cvP = wrap && wrap.querySelector(".js-fvDepthPetals");
	if(!wrap || !stage || !cvB || !cvP) return;

	var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var FINE   = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	var ctxB = cvB.getContext("2d");
	var ctxP = cvP.getContext("2d");

	/* deterministic rng -- the field is laid out the same on every load */
	function mulberry32(a){
		return function(){
			a |= 0; a = a + 0x6D2B79F5 | 0;
			var t = Math.imul(a ^ a >>> 15, 1 | a);
			t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		};
	}
	var rnd = mulberry32(0x4B1D5E1);

	/* ---------------------------------------------
	 * NEAR-FIELD SPECKS
	 * cx%, cy%, w%, h%, peak ink (0-255) -- every row lifted off the reference
	 * plate's alpha channel, so the cluster sits exactly where it belongs.
	 * ------------------------------------------- */
	var SPECK_DATA = [
		[76.87,51.87,0.83,0.99, 18],[75.34,52.03,0.93,1.24, 23],[78.12,53.05,0.73,0.99, 15],
		[79.27,53.43,0.78,0.99, 16],[74.10,53.47,0.98,2.18, 18],[76.69,54.29,0.83,1.06, 20],
		[81.17,54.66,1.27,1.49, 81],[ 6.00,63.46,1.22,1.80, 28],[13.87,64.56,0.98,1.18, 22],
		[15.42,64.77,0.63,0.87,  9],[ 7.02,67.38,2.25,3.67, 49],[ 1.47,67.62,0.98,1.18, 26],
		[19.91,67.89,1.03,1.43, 43],[16.29,70.00,0.88,1.12, 22],[12.93,70.65,0.73,0.87, 11],
		[11.11,70.85,1.81,1.80, 36],[ 1.06,71.34,0.63,0.87,  9],[ 3.20,72.25,0.78,0.99, 15],
		[11.25,72.27,0.78,0.99, 13],[14.07,72.34,0.83,1.06, 17],[ 5.33,72.42,0.73,0.93, 13],
		[12.82,74.11,1.61,2.42,116],[ 1.57,76.32,0.78,0.93, 12],[ 6.04,78.30,0.98,1.43, 15],
		[ 4.72,78.51,1.37,1.68, 38]
	];
	/* ---------------------------------------------
	 * MID-GROUND FORMS (already painted on the plate)
	 * cx%, cy%, w%, h%, peak ink, breath cycle (s), light (0 key / 1 rim)
	 * The two tall ones are the falls of light that carry the tail silhouette;
	 * the last row is the magenta rim, and it is the only one that breathes
	 * on the rim colour -- magenta is never allowed to become a fill.
	 * ------------------------------------------- */
	var FORM_DATA = [
		[ 9.6, 40.0,  7.8, 27.0, 96.0, 34.0, 0],
		[11.3, 88.6,  6.4, 10.4, 46.0, 31.0, 0],
		[86.9, 37.0,  8.6, 29.0, 78.0, 29.0, 0],
		[88.4, 84.0,  6.8,  9.8, 42.0, 24.0, 0],
		[95.5, 50.0,  5.4, 21.0, 58.0, 37.5, 1]
	];

	var specks = SPECK_DATA.map(function(s){
		return {
			cx: s[0], cy: s[1], w: s[2], h: s[3], pk: s[4],
			ax: 0.10 + rnd() * 0.26,              // orbit radius, % of plate width
			ay: 0.08 + rnd() * 0.19,
			cyc: 15 + rnd() * 18,                 // orbit period, s
			ph: rnd() * Math.PI * 2,
			cyc2: 11 + rnd() * 14,
			ph2: rnd() * Math.PI * 2,
			tw: 0.10 + rnd() * 0.14,              // twinkle depth, 0-1
			cyc3: 3.4 + rnd() * 4.6,
			ph3: rnd() * Math.PI * 2,
			dep: 0.55 + rnd() * 0.55              // near-field parallax strength
		};
	});
	var forms = FORM_DATA.map(function(f){
		return { cx: f[0], cy: f[1], w: f[2], h: f[3], pk: f[4],
		         cyc: f[5] * 1000, ph: rnd() * Math.PI * 2, light: f[6] };
	});

	/* ---------------------------------------------
	 * SOFT SPRITES -- pre-rendered, so no per-frame gradients
	 * ------------------------------------------- */
	function sprite(size, colour, curve){
		var c = document.createElement("canvas");
		c.width = c.height = size;
		var x = c.getContext("2d");
		var g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
		for(var i = 0; i <= 32; i++){
			var s = i / 32;
			g.addColorStop(s, "rgba(" + colour + "," + Math.max(0, curve(s)).toFixed(4) + ")");
		}
		x.fillStyle = g;
		x.fillRect(0, 0, size, size);
		return c;
	}
	var CURVE = function(s){ return Math.pow(Math.max(0, 1 - s * s), 1.6); };
	/* near-field grit, cold: the source's specks were warm brown dust, these are
	   beads of the stage light caught out of focus */
	var SPECK = sprite(96, "46,104,112", CURVE);
	/* the breath is mean-neutral: one lobe deepens the defocus, the other
	   bleaches it back, so the form never drifts away from the plate's tone.
	   There is one pair per light, so the rim keeps breathing magenta instead
	   of being washed back to grey by a neutral sprite. */
	var BREATH_DARK  = [sprite(192, "12,44,54", CURVE),  sprite(192, "58,10,36", CURVE)];
	var BREATH_LIGHT = [sprite(192, "228,255,255", CURVE), sprite(192, "255,228,244", CURVE)];
	/* sprite radius that lands the modelled edge on the measured extent */
	var EDGE = 0.564;

	/* ---------------------------------------------
	 * VIEWPORT / SCROLL STATE
	 * ------------------------------------------- */
	var W = 0, H = 0, DPR = 1;
	function fit(){
		var r = wrap.getBoundingClientRect();
		W = Math.max(1, r.width);
		H = Math.max(1, r.height);
		DPR = Math.min(window.devicePixelRatio || 1, 1.5);
		[cvB, cvP].forEach(function(c){
			c.width = Math.round(W * DPR);
			c.height = Math.round(H * DPR);
		});
	}
	fit();

	var p = 0;                                  // 0..1 travel through the hero
	var wind = 0;                               // eased scroll velocity, -1..1
	var leanX = 0, leanY = 0;                   // eased pointer offset, -1..1
	var wantX = 0, wantY = 0;
	var lastY = window.pageYOffset || 0;

	function syncScroll(){
		var y = window.pageYOffset || 0;
		var h = stage.clientHeight || 1;
		p = Math.min(1, Math.max(0, y / h));
		var v = (typeof lenis !== "undefined" && lenis && typeof lenis.velocity === "number")
			? lenis.velocity : (y - lastY) * 6;
		lastY = y;
		wind = Math.max(-1, Math.min(1, v / 42));
	}
	syncScroll();

	if(FINE){
		window.addEventListener("mousemove", function(e){
			wantX = (e.clientX / window.innerWidth) * 2 - 1;
			wantY = (e.clientY / window.innerHeight) * 2 - 1;
		}, {passive: true});
	}

	/* ---------------------------------------------
	 * PAINT
	 * ------------------------------------------- */
	/* the composite is calibrated so that alpha 255 of the sprite ink lands the
	   same depth of tone on the page as the reference did; 92 is the luminance
	   of the cold speck ink, 46/104/112 */
	var INK_LUM = 92;
	function alphaOf(pk){ return Math.min(1, pk / (255 - INK_LUM)); }

	function paintForms(t){
		ctxB.setTransform(DPR, 0, 0, DPR, 0, 0);
		ctxB.clearRect(0, 0, W, H);
		/* the defocus plane as a whole crawls a couple of pixels on a very long
		   cycle; the term is zero at t = 0, so the reference frame is untouched */
		var gx = Math.sin(t / 61000) * 3.2;
		var gy = (Math.cos(t / 83000) - 1) * 2.1;
		for(var i = 0; i < forms.length; i++){
			var f = forms[i];
			/* zero at t=0, so the first frame is the reference frame */
			var a = Math.sin(t / f.cyc * Math.PI * 2 + f.ph) - Math.sin(f.ph);
			var amt = Math.abs(a);
			if(amt < 0.012) continue;
			var grow = 1 + a * 0.075;
			var rx = f.w * EDGE / 100 * W * grow;
			var ry = f.h * EDGE / 100 * H * grow;
			/* a second, faster component so the edge shimmers instead of just swelling */
			var sw = Math.sin(t / f.cyc * Math.PI * 4 + f.ph) - Math.sin(f.ph);
			var x = f.cx / 100 * W + gx + sw * 0.09 / 100 * W;
			var y = f.cy / 100 * H + gy - p * 0.05 * H + wind * 0.010 * H;
			ctxB.globalAlpha = alphaOf(f.pk) * 0.22 * amt;
			ctxB.drawImage((a > 0 ? BREATH_DARK : BREATH_LIGHT)[f.light], x - rx, y - ry, rx * 2, ry * 2);
		}
		ctxB.globalAlpha = 1;
	}

	function paintSpecks(t){
		ctxP.setTransform(DPR, 0, 0, DPR, 0, 0);
		ctxP.clearRect(0, 0, W, H);
		for(var i = 0; i < specks.length; i++){
			var s = specks[i];
			var ph = t / (s.cyc * 1000) * Math.PI * 2;
			var ph2 = t / (s.cyc2 * 1000) * Math.PI * 2;
			var dx = Math.sin(ph + s.ph) - Math.sin(s.ph);
			var dy = Math.cos(ph2 + s.ph2) - Math.cos(s.ph2);
			var x = s.cx / 100 * W + dx * s.ax / 100 * W + leanX * 7 * s.dep;
			var y = s.cy / 100 * H + dy * s.ay / 100 * H
				+ leanY * 5 * s.dep
				- p * 0.45 * s.dep * H * 0.55          // near field travels further than the plate
				+ wind * 0.028 * s.dep * H;            // ...and lags harder when the page is thrown
			var ex = Math.sin(ph * 1.9 + s.ph) - Math.sin(s.ph);   // per-speck focus wobble
			var rx = s.w * EDGE / 100 * W * (1 + ex * 0.13);
			var ry = s.h * EDGE / 100 * H * (1 + ex * 0.13);
			var tw = 1 + s.tw * (Math.sin(t / (s.cyc3 * 1000) * Math.PI * 2 + s.ph3) - Math.sin(s.ph3));
			ctxP.globalAlpha = Math.max(0, Math.min(1, alphaOf(s.pk) * tw));
			ctxP.drawImage(SPECK, x - rx, y - ry, rx * 2, ry * 2);
		}
		ctxP.globalAlpha = 1;
	}

	/* ---------------------------------------------
	 * LOOP -- idle while the hero is off screen
	 * ------------------------------------------- */
	var visible = true;
	if(window.IntersectionObserver){
		new IntersectionObserver(function(en){
			visible = en[0].isIntersecting;
		}, {rootMargin: "20% 0px"}).observe(stage);
	}

	var raf = null, prev = 0;
	function frame(now){
		raf = requestAnimationFrame(frame);
		if(!visible || document.hidden){ prev = now; return; }
		prev = now;
		leanX += (wantX - leanX) * 0.055;
		leanY += (wantY - leanY) * 0.055;
		syncScroll();
		paintForms(now);
		paintSpecks(now);
	}

	function start(){
		if(REDUCE){                             // honour reduced motion: the reference frame, once
			paintForms(0);
			paintSpecks(0);
			return;
		}
		if(!raf) raf = requestAnimationFrame(frame);
	}
	start();

	/* ---------------------------------------------
	 * A gust when the key visual turns, so the field answers the switch.
	 * Watched on the attribute rather than bound to the Swiper instance so this
	 * block stays independent of declaration order further down the file.
	 * ------------------------------------------- */
	if(window.MutationObserver){
		new MutationObserver(function(){
			wind = -0.5;
			for(var i = 0; i < specks.length; i++){
				specks[i].ph += (rnd() - 0.5) * 1.2;
			}
		}).observe(stage, {attributes: true, attributeFilter: ["data-nowvisual"]});
	}

	var rt = null;
	window.addEventListener("resize", function(){
		clearTimeout(rt);
		rt = setTimeout(function(){ fit(); if(REDUCE){ paintForms(0); paintSpecks(0); } }, 160);
	});
})();


/*-----------------------------------------------
 * NEWS - BG [ScrollTrigger]
-------------------------------------------------*/
gsap.to(".js-newsbg",{
	backgroundPositionY: -100 + "%",
	scale: 1.05,
	scrollTrigger: {
		trigger: "#news",
		start: 'top bottom',
		end: 'bottom top',
		scrub: 0.5,
	}
});


/*-----------------------------------------------
 * ENGLISH TITLE - GSAP[ScrollTrigger]
-------------------------------------------------*/
/**
 * engTitle scrollTrigger
 */
createEngTitle(".js-firstView_slide_t", -50, 8930, 0.5);
createEngTitle(".js-firstView_slide_b", 50, 8930, 0.5);
createEngTitle(".js-introSlideText", -50, 8930, 0.5);




/*-----------------------------------------------
 * Introduction - Cloud & Image [ScrollTrigger]
-------------------------------------------------*/
mm.add("(min-width: 769px)", () => {
/**
 * CLOUD
 */
	gsap.to(".js-intro_cloud1",{
		yPercent: 20,
		xPercent: 2,
		scale: 1.05,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});
	gsap.to(".js-intro_cloud2",{
		yPercent: -15,
		xPercent: -15,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});
	gsap.to(".js-intro_cloud3",{
		yPercent: -50,
		xPercent: -2,
		scale: 1.05,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});
	gsap.to(".js-intro_cloud4",{
		yPercent: -50,
		xPercent: 10,
		scale: 1.05,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});

/**
 * IMAGE
 */
	gsap.to(".js-intro_image1",{
		yPercent: -100,
		scale: 1.05,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.4,
		}
	});
	gsap.to(".js-intro_image2",{
		yPercent: 50,
		scale: 0.95,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.4,
		}
	});
	gsap.to(".js-intro_image3",{
		xPercent: -25,
		scale: 0.9,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.4,
		}
	});
	gsap.to(".js-intro_image4",{
		xPercent: 50,
		scale: 1.1,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.4,
		}
	});
});

mm.add("(max-width: 768px)", () => {
/**
 * CLOUD
 */
	gsap.to(".js-intro_cloud1",{
		yPercent: -20,
		xPercent: 10,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});
	gsap.to(".js-intro_cloud2",{
		yPercent: -10,
		xPercent: 10,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});

/**
 * IMAGE
 */
	gsap.from(".js-intro_image1", {
		yPercent: 100,
		scale: 1.1,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.4,
		}
	});
	gsap.from(".js-intro_image2", {
		yPercent: -100,
		scale: 1.1,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top center',
			end: 'bottom center',
			scrub: 0.4,
		}
	});
	gsap.from(".js-intro_image3", {
		xPercent: -100,
		scale: 1.1,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top center',
			end: 'bottom center',
			scrub: 0.4,
		}
	});
	gsap.from(".js-intro_image4", {
		xPercent: 100,
		scale: 1.1,
		scrollTrigger: {
			trigger: ".introductionBg",
			start: 'top center',
			end: 'bottom center',
			scrub: 0.4,
		}
	});
});


/*-----------------------------------------------
 * BOOKS - BG [ScrollTrigger]
-------------------------------------------------*/
mm.add("(min-width: 769px)", () => {
	gsap.to(".js-booksbg",{
		backgroundPositionX: -100 + "%",
		yPercent: -25,
		scrollTrigger: {
			trigger: "#books",
			start: 'top bottom',
			end: 'bottom top',
			scrub: 0.5,
		}
	});
});

mm.add("(max-width: 768px)", () => {
	gsap.from(".js-booksbg",{
		yPercent: 25,
		scrollTrigger: {
			trigger: "#books",
			start: 'top center',
			end: 'bottom center',
			scrub: 0.5,
		}
	});
});


/*-----------------------------------------------
 * LOADING
-------------------------------------------------*/
var bodyElement = document.body, htmlElement = document.documentElement, startTime;

function tloading(){
	var urlhash = location.hash;
	bodyElement.style.overflow = "hidden";

	lenis.stop();

	if(!$(urlhash)[0]){
		setTimeout(()=>{
			$('body,html').animate({scrollTop:0}, 100, 'easeOutQuart');
		},1000);
	}

	setTimeout(()=>{
		bodyElement.classList.add('--is-loaded');
		topLoading(urlhash);
	},1200);
}


window.addEventListener("load", tloading());


// TOP用ローディング
function topLoading(_urlhash){
	var $visited = bodyElement.classList.contains('is-visited');
	if($visited || _urlhash){
	//アクセス済み or hashがある
		bodyElement.classList.add('is-visited');
		setTimeout(()=>{
			bodyElement.classList.add('--loadAni-fin');
			setTimeout(()=>{
				$(".tloading").fadeOut(400);
				bodyElement.style.overflow = null;
				lenis.start();
				set_scrani();
				mvImageSwiper.autoplay.start();
			},100);
		},1000);
	}else{
	// 初回アクセス
		setTimeout(()=>{
			bodyElement.classList.add('--loadAni-1');
			setTimeout(()=>{
				bodyElement.classList.add('--loadAni-fin');
				setTimeout(()=>{
					$(".tloading").fadeOut(500);
					bodyElement.style.overflow = null;
					lenis.start();
					set_scrani();
					mvImageSwiper.autoplay.start();
				},100);
			},3000);
		},1950);
	}
}


// TOP用ローディング後のYouTubeモーダル
function topLoading__playYT(_ytid){
	movie(_ytid);
	if(typeof player !== 'undefined' && player && typeof player.stopVideo === 'function'){
		player.stopVideo();
	}
	$('body').addClass('--yt-apmov-stop');
	$(".js-modalBox").addClass('js-modalplayClose');
}




/*-----------------------------------------------
 * Swiper - MVImage
-------------------------------------------------*/
let mvImageSwiper = new Swiper('.js-mvImageSwiper',{
	allowTouchMove: false,
	effect: 'fade',
	autoplay: {
		delay: 5000,
		disableOnInteraction:false,
	},
});
mvImageSwiper.autoplay.stop();

mvImageSwiper.on('slideChange',function(){
	const visualNum = mvImageSwiper.realIndex + 1;
	$(".js-visualChange").removeClass('--is-current');
	$('.js-visualChange[data-visual="'+ visualNum+'"]').addClass('--is-current');
	$(".c-firstview").attr("data-nowvisual",visualNum);
});

$(".js-visualChange").on('click',function(){
	let selectNum = $(this).data('visual'),
		visualNum = Number(selectNum) - 1;
	mvImageSwiper.slideTo(visualNum);
})
