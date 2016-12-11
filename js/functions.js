var docElem = window.document.documentElement,
	didScroll,
	scrollPosition;

function noScrollFn() {
	window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
}

function noScroll() {
	window.removeEventListener( 'scroll', scrollHandler );
	window.addEventListener( 'scroll', noScrollFn );
}

function scrollFn() {
	window.addEventListener( 'scroll', scrollHandler );
}

function canScroll() {
	window.removeEventListener( 'scroll', noScrollFn );
	scrollFn();
}

function scrollHandler() {
	if( !didScroll ) {
		didScroll = true;
		setTimeout( function() { scrollPage(); }, 60 );
	}
}

function scrollPage() {
	scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
	didScroll = false;
}

scrollFn();


/**!
 * resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth != currentWidth;
	if(resizeByWidth){
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});
/*resize only width end*/

/**!
 * device detected
 * */
var DESKTOP = device.desktop();
//console.log('DESKTOP: ', DESKTOP);
var MOBILE = device.mobile();
//console.log('MOBILE: ', MOBILE);
var TABLET = device.tablet();
//console.log('MOBILE: ', MOBILE);
/*device detected end*/

/**!
 *  placeholder
 *  */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/*placeholder end*/

/*toggle class for input on focus*/

function inputToggleFocusClass() {
	var $fieldWrap = $('.input-wrap');

	if ($fieldWrap.length) {
		var $inputsAll = $fieldWrap.find( "input, textarea, select" );
		var _classFocus = 'input--focus';

		$inputsAll.focus(function() {
			var $thisField = $(this);

			$thisField
				.closest($fieldWrap)
				.addClass(_classFocus);

		}).blur(function() {
			var $thisField = $(this);

			$thisField
				.closest($fieldWrap)
				.removeClass(_classFocus);
		});
	}
}

function inputHasValueClass() {
	var $fieldWrap = $('.input-wrap');

	if ($fieldWrap.length) {
		var $inputsAll = $fieldWrap.find( "input, textarea, select" );
		var _classHasValue = 'has--value';

		function switchHasValue() {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			$currentFieldWrap.removeClass(_classHasValue);

			//first element of the select must have a value empty ("")
			if ($currentField.val() != '') {
				$currentFieldWrap.addClass(_classHasValue);
			}
		}

		$.each($inputsAll, function () {
			switchHasValue.call(this);
		});

		$inputsAll.on('change', function () {
			switchHasValue.call(this);
		});
	}
}

function inputFilledClass() {
	var $fieldWrap = $('.js-field-effects');

	if ($fieldWrap.length) {
		var $inputsAll = $fieldWrap.find( "input, textarea, select" );
		var _classFilled = 'input--filled';

		$inputsAll.focus(function() {
			var $thisField = $(this);

			$thisField
				.closest($fieldWrap)
				.addClass(_classFilled);

		}).blur(function() {
			var $thisField = $(this);

			if ($thisField.val() == '') {
				$thisField
					.closest($fieldWrap)
					.removeClass(_classFilled);
			}
		});

		function switchHasValue() {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			$currentFieldWrap.removeClass(_classFilled);

			//first element of the select must have a value empty ("")
			if ($currentField.val() != '') {
				$currentFieldWrap.addClass(_classFilled);
			}
		}

		$.each($inputsAll, function () {
			switchHasValue.call(this);
		});

		$inputsAll.on('change', function () {
			switchHasValue.call(this);
		});
	}
}

/*toggle class for input on focus end*/

/**!
 * print
 * */
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}
/*print end*/

/**
 * add class on scroll to top
 * */
function headerShow(){
	// external js:
	// 1) resizeByWidth (resize only width);

	var $page = $('html'),
		minScrollTop = 100;

	var previousScrollTop = $(window).scrollTop();

	$(window).on('load scroll resizeByWidth', function () {
		var currentScrollTop = $(window).scrollTop();

		$page.toggleClass('page-is-scrolled', (currentScrollTop >= minScrollTop));

		var showHeaderPanel = currentScrollTop < previousScrollTop || currentScrollTop <= minScrollTop;
		$page.toggleClass('header-show', showHeaderPanel);
		$page.toggleClass('header-hide', !showHeaderPanel);

		previousScrollTop = currentScrollTop;
	});
}
/*add class on scroll to top end*/

/**
 * add class on scroll to top
 * */
function navFixed(){
	// external js:
	// 1) resizeByWidth (resize only width);

	var $fixedElement = $('.main-nav');

	if ( $fixedElement.length ) {
		var $page = $('html');

		var minScrollTop = $fixedElement.offset().top;
		var currentScrollTop = $(window).scrollTop();

		$page.toggleClass('nav-fixed', (currentScrollTop > minScrollTop));

		$(window).on('load resizeByWidth scroll', function () {

			minScrollTop = $fixedElement.offset().top;
			currentScrollTop = $(window).scrollTop();

			$page.toggleClass('nav-fixed', (currentScrollTop > minScrollTop));
		})
	}
}
/*add class on scroll to top end*/

/**
 * jquery.toggleHoverClass
 * */
(function ($) {
	var HoverClass = function (settings) {
		var options = $.extend({
			container: 'ul',
			item: 'li',
			drop: 'ul'
		},settings || {});

		var self = this;
		self.options = options;

		var container = $(options.container);
		self.$container = container;
		self.$item = $(options.item, container);
		self.$drop = $(options.drop, container);

		self.modifiers = {
			hover: 'hover'
		};

		self.addClassHover();

		if (!DESKTOP) {
			$(window).on('debouncedresize', function () {
				self.removeClassHover();
			});
		}
	};

	HoverClass.prototype.addClassHover = function () {
		var self = this,
			_hover = this.modifiers.hover,
			$item = self.$item,
			item = self.options.item,
			$container = self.$container;

		if (!DESKTOP) {
			$container.on('click', ''+item+'', function (e) {
				var $currentAnchor = $(this);
				var currentItem = $currentAnchor.closest($item);

				if (!currentItem.has(self.$drop).length){ return; }


				e.stopPropagation();

				if (currentItem.hasClass(_hover)){
					currentItem.removeClass(_hover).find('.'+_hover+'').removeClass(_hover);
					return;
				}

				$('.'+_hover+'').not($currentAnchor.parents('.'+_hover+''))
					.removeClass(_hover)
					.find('.'+_hover+'')
					.removeClass(_hover);
				currentItem.addClass(_hover);

				e.preventDefault();
			});

			$container.on('click', ''+self.options.drop+'', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function () {
				$item.removeClass(_hover);
			});
		} else {
			$container.on('mouseenter', ''+item+'', function () {
				var currentItem = $(this);

				if (currentItem.prop('hoverTimeout')) {
					currentItem.prop('hoverTimeout',
						clearTimeout(currentItem.prop('hoverTimeout')
						)
					);
				}

				currentItem.prop('hoverIntent', setTimeout(function () {
					currentItem.addClass(_hover);
				}, 50));

			});
			$container.on('mouseleave', ''+ item+'', function () {
				var currentItem = $(this);

				if (currentItem.prop('hoverIntent')) {
					currentItem.prop('hoverIntent',
						clearTimeout(currentItem.prop('hoverIntent')
						)
					);
				}

				currentItem.prop('hoverTimeout', setTimeout(function () {
					currentItem.removeClass(_hover);
				}, 50));
			});

		}
	};

	HoverClass.prototype.removeClassHover = function () {
		var self = this;
		self.$item.removeClass(self.modifiers.hover );
	};

	window.HoverClass = HoverClass;

}(jQuery));
/*jquery.toggleHoverClass end*/

/**
 * toggle hover class
 * */
function hoverClassInit(){
	if($('.nav').length){
		new HoverClass({
			container: ('.nav'),
			drop: '.js-nav-drop'
		});
	}
}
/*toggle hover class end*/

/*main navigation*/

(function ($) {
	// external js:
	// 1) device.js 0.2.7 (widgets.js);
	// 2) resizeByWidth (resize only width);

	var PositionDropMenu = function (settings) {
		var options = $.extend({
			navContainer: null,
			navList: null,
			navMenuItem: 'li',
			navDropMenu: '.js-nav-drop'
		},settings || {});

		this.options = options;

		var container = $(options.navContainer);
		this.$navContainer = container;
		this.$navList = $(options.navList);
		this.$navMenuItem = $(options.navMenuItem, container);     // Пункты навигации.
		this.$navDropMenu = $(options.navDropMenu, container);     // Дроп-меню всех уровней.

		this.modifiers = {
			alignRight: 'align-right'
		};

		this.addAlignDropClass();
		this.removeAlignDropClass();
	};

	PositionDropMenu.prototype.createAlignDropClass = function (item, drop) {
		var self = this,
			alightRightClass = self.modifiers.alignRight,
			$navContainer = self.$navContainer;

		var navContainerPosRight = $navContainer.offset().left + $navContainer.outerWidth();
		var navDropPosRight = drop.offset().left + drop.outerWidth();

		if(navContainerPosRight < navDropPosRight){
			item.addClass(alightRightClass);
		}
	};

	PositionDropMenu.prototype.addAlignDropClass = function () {
		var self = this,
			$navContainer = self.$navContainer,
			navMenuItem = self.options.navMenuItem,
			alightRightClass = self.modifiers.alignRight;

		$navContainer.on('click', ''+navMenuItem+'', function () {
			var $this = $(this);
			var $drop = $this.find(self.$navDropMenu);

			if ( !device.desktop() && $drop.length && !$this.hasClass(alightRightClass)) {
				self.createAlignDropClass($this, $drop);
			}
		});

		$navContainer.on('mouseenter', '' + navMenuItem + '', function () {
			var $this = $(this);
			var $drop = $this.find(self.$navDropMenu);

			if ( device.desktop() && $drop.length && !$this.hasClass(alightRightClass)) {
				self.createAlignDropClass($this, $drop);
			}
		});
	};

	PositionDropMenu.prototype.removeAlignDropClass = function () {
		var self = this;
		$(window).on('resizeByWidth', function () {
			self.$navMenuItem.removeClass(self.modifiers.alignRight );
		});
	};

	window.PositionDropMenu = PositionDropMenu;

}(jQuery));

function addPositionClass(){
	var $nav = $('.nav');

	if($nav.length){
		new PositionDropMenu({
			navContainer: '.nav',
			navList: '.nav__list',
			navMenuItem: 'li',
			navMenuAnchor: 'a',
			navDropMenu: '.js-nav-drop'
		});
	}
}
/*main navigation end*/

/**!
 * main navigation
 * */
(function ($) {
	// external js:
	// 1) TweetMax VERSION: 1.19.0 (widgets.js);
	// 2) device.js 0.2.7 (widgets.js);
	// 3) resizeByWidth (resize only width);

	// add css style
	// .nav-opened{
	// 	width: 100%!important;
	// 	height: 100%!important;
	// 	max-width: 100%!important;
	// 	max-height: 100%!important;
	// 	margin: 0!important;
	// 	padding: 0!important;
	// 	overflow: hidden!important;
	// }

	// .nav-opened-before .wrapper{ z-index: 99; } // z-index of header must be greater than footer
	//
	// @media only screen and (min-width: [example: 1280px]){
	// .nav{
	// 		-webkit-transform: translate(0, 0) matrix(1, 0, 0, 1, 0, 0) !important;
	// 		-ms-transform: translate(0, 0) matrix(1, 0, 0, 1, 0, 0) !important;
	// 		transform: translate(0, 0) matrix(1, 0, 0, 1, 0, 0) !important;
	// 	}
	// .nav-list > li{
	// 		-webkit-transform: translate(0, 0) matrix(1, 0, 0, 1, 0, 0) !important;
	// 		-ms-transform: translate(0, 0) matrix(1, 0, 0, 1, 0, 0) !important;
	// 		transform: translate(0, 0) matrix(1, 0, 0, 1, 0, 0) !important;
	// 		opacity: 1 !important;
	// 		visibility: visible !important;
	// 	}
	// }
	var MainNavigation = function (settings) {
		var options = $.extend({
			mainContainer: 'html', // container wrapping all elements
			navContainer: null, // main navigation container
			navMenu: null, // menu
			btnMenu: null, // element which opens or switches menu
			btnMenuClose: null, // element which closes a menu
			navMenuItem: null,
			navMenuAnchor: 'a',
			staggerItems: null,
			overlay: '.nav-overlay', // overlay's class
			overlayAppendTo: 'body', // where to place overlay
			overlayAlpha: 0.8,
			classReturn: null,
			overlayBoolean: true,
			animationSpeed: 300,
			animationSpeedOverlay: null,
			minWidthItem: 100,
			mediaWidth: null,
			closeOnResize: true,
			closeEsc: true // close popup on click Esc
		}, settings || {});

		var container = $(options.navContainer),
			_animateSpeed = options.animationSpeed;

		var self = this;
		self.options = options;
		self.$mainContainer = $(options.mainContainer);            // . по умолчанию <html></html>
		self.$navMenu = $(options.navMenu);
		self.$btnMenu = $(options.btnMenu);
		self.$btnMenuClose = $(options.btnMenuClose);
		self.$navContainer = container;
		self.$navMenuItem = $(options.navMenuItem, container);     // Пункты навигации;
		self.$navMenuAnchor = $(options.navMenuAnchor, container); // Элемент, по которому производится событие (клик);
		self.$staggerItems = options.staggerItems || self.$navMenuItem;  //Элементы в стеке, к которым применяется анимация. По умолчанию navMenuItem;

		self._animateSpeed = _animateSpeed;

		// overlay
		self.overlayBoolean = options.overlayBoolean;
		self.overlayAppendTo = options.overlayAppendTo;
		self.$overlay = $('<div class="' + options.overlay.substring(1) + '"></div>'); // Темплейт оверлея;
		self._overlayAlpha = options.overlayAlpha;
		self._animateSpeedOverlay = options.animationSpeedOverlay || _animateSpeed;
		self._minWidthItem = options.minWidthItem;
		self._mediaWidth = options.mediaWidth;
		self.closeOnResize = options.closeOnResize;
		self.closeEsc = options.closeEsc;

		self.desktop = device.desktop();

		self.modifiers = {
			active: 'active',
			opened: 'nav-opened',
			openStart: 'nav-opened-before'
		};

		self.outsideClick();
		if ( self._mediaWidth === null || window.innerWidth < self._mediaWidth ) {
			self.preparationAnimation();
		}
		self.toggleMenu();
		self.eventsBtnMenuClose();
		self.clearStyles();
		self.closeNavOnEsc();
	};

	MainNavigation.prototype.navIsOpened = false;

	// overlay append to "overlayAppendTo"
	MainNavigation.prototype.createOverlay = function () {
		var self = this,
			$overlay = self.$overlay;

		$overlay.appendTo(self.overlayAppendTo);

		TweenMax.set($overlay, {
			autoAlpha: 0,
			position: 'fixed',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			background: '#000',
			onComplete: function () {
				TweenMax.to($overlay, self._animateSpeedOverlay / 1000, {autoAlpha: self._overlayAlpha});
			}
		});
	};

	// toggle overlay
	MainNavigation.prototype.toggleOverlay = function (close) {
		var self = this,
			$overlay = self.$overlay;

		if (close === false) {
			TweenMax.to($overlay, self._animateSpeedOverlay / 1000, {
				autoAlpha: 0,
				onComplete: function () {
					$overlay.remove();
				}
			});
			return false;
		}

		self.createOverlay();
	};

	// toggle menu
	MainNavigation.prototype.toggleMenu = function () {
		var self = this,
			$buttonMenu = self.$btnMenu;

		$buttonMenu.on('click', function (e) {
			e.preventDefault();

			if (self.navIsOpened) {
				self.closeNav();
			} else {
				self.openNav();
			}

			e.stopPropagation();
		});
	};

	// events btn close menu
	MainNavigation.prototype.eventsBtnMenuClose = function () {

		var self = this;

		self.$btnMenuClose.on('click', function (e) {
			e.preventDefault();

			if ( self.navIsOpened ) {
				self.closeNav();
			}

			e.stopPropagation();
		});
	};

	// click outside menu
	MainNavigation.prototype.outsideClick = function () {
		var self = this;

		$(document).on('click', function () {
			if ( self.navIsOpened ) {
				self.closeNav();
			}
		});

		self.$navContainer.on('click', function (e) {
			if ( self.navIsOpened ) {
				e.stopPropagation();
			}
		})
	};

	// close popup on click to "Esc" key
	MainNavigation.prototype.closeNavOnEsc = function () {
		var self = this;

		$(document).keyup(function(e) {
			if (self.navIsOpened && self.closeEsc && e.keyCode == 27) {
				self.closeNav();
			}
		});
	};

	// open nav
	MainNavigation.prototype.openNav = function() {
		// console.log("openNav");

		var self = this,
			$html = self.$mainContainer,
			$navContainer = self.$navContainer,
			$buttonMenu = self.$btnMenu,
			_animationSpeed = self._animateSpeedOverlay,
			$staggerItems = self.$staggerItems;

		$buttonMenu.addClass(self.modifiers.active);
		$html.addClass(self.modifiers.openStart);

		$navContainer.css({
			'-webkit-transition-duration': '0s',
			'transition-duration': '0s'
		});

		TweenMax.to($navContainer, _animationSpeed / 1000, {
			xPercent: 0,
			autoAlpha: 1,
			ease: Cubic.easeOut,
			onComplete: function () {
				$html.addClass(self.modifiers.opened);

				noScroll();
			}
		});

		TweenMax.staggerTo($staggerItems, 0.85, {
			// autoAlpha:1,
			// scale:1,
			// y: 0,
			ease:Cubic.easeOut
		}, 0.1);


		if (self.overlayBoolean) {
			self.toggleOverlay();
		}

		self.navIsOpened = true;
	};

	// close nav
	MainNavigation.prototype.closeNav = function() {
		// console.log("closeNav");

		var self = this,
			$html = self.$mainContainer,
			$navContainer = self.$navContainer,
			$buttonMenu = self.$btnMenu,
			_animationSpeed = self._animateSpeedOverlay,
			_mediaWidth = self._mediaWidth;

		$html.removeClass(self.modifiers.opened);
		$html.removeClass(self.modifiers.openStart);
		$buttonMenu.removeClass(self.modifiers.active);

		if (self.overlayBoolean) {
			self.toggleOverlay(false);
		}

		TweenMax.to($navContainer, _animationSpeed / 1000, {
			xPercent: -100,
			ease: Cubic.easeOut,
			onComplete: function () {
				if (_mediaWidth === null || window.innerWidth < _mediaWidth) {
					self.preparationAnimation();
				}

				TweenMax.set($navContainer, {
					autoAlpha: 0
				});

				canScroll();
			}
		});

		self.navIsOpened = false;
	};

	// preparation element before animation
	MainNavigation.prototype.preparationAnimation = function() {
		var self = this;

		var $navContainer = self.$navContainer,
			$staggerItems = self.$staggerItems;

		// console.log('preparationAnimation');

		TweenMax.set($navContainer, {
			xPercent: -100,
			autoAlpha: 0,
			onComplete: function () {
				$navContainer.show(0);
			}
		});
		TweenMax.set($staggerItems, {
			// autoAlpha: 0,
			// scale: 0.6,
			// y: 50
		});
	};

	// clearing inline styles
	MainNavigation.prototype.clearStyles = function() {
		var self = this,
			$btnMenu = self.$btnMenu,
			$navContainer = self.$navContainer,
			$staggerItems = self.$staggerItems;

		//clear on horizontal resize
		if (self.closeOnResize === true) {

			$(window).on('resizeByWidth', function () {
				if (self.navIsOpened) {
					if (!$btnMenu.is(':visible')) {
						$navContainer.attr('style', '');
						$staggerItems.attr('style', '');
					} else {
						self.closeNav();
					}
				}
			});

		}
	};

	window.MainNavigation = MainNavigation;

}(jQuery));

/**
 * main navigation for mobile end
 * */
function mainNavigationForMobile(){
	if($('.main-menu').length){

		new MainNavigation({
			navContainer: '.main-menu',
			navMenu: '.main-menu__list',
			btnMenu: '.js-btn-menu',
			btnMenuClose: '.js-btn-menu-close',
			navMenuItem: '.main-menu__box',
			overlayAppendTo: 'body',
			closeOnResize: true,
			// mediaWidth: 1280,
			animationSpeed: 300,
			overlayAlpha: 0.35
		});

	}
}
/*main navigation for mobile end*/

/**
 * search popup
 * */
function searchPopup(){
	if($('.search-popup').length){

		new MainNavigation({
			navContainer: '.search-popup',
			navMenu: '.main-menu__list',
			btnMenu: '.search-link a',
			btnMenuClose: '.js-btn-menu-close',
			navMenuItem: '.main-menu__box',
			overlayAppendTo: 'body',
			closeOnResize: false,
			// mediaWidth: 1280,
			animationSpeed: 300,
			overlayAlpha: 0.35
		});

	}
}
/*search popup end*/

/**
 * enter popup
 * */
function enterPopup(){
	if($('.enter-popup').length){

		new MainNavigation({
			navContainer: '.enter-popup',
			navMenu: '.main-menu__list',
			btnMenu: '.login-link a',
			btnMenuClose: '.js-btn-menu-close',
			navMenuItem: '.main-menu__box',
			overlayAppendTo: 'body',
			closeOnResize: false,
			// mediaWidth: 1280,
			animationSpeed: 300,
			overlayAlpha: 0.35
		});

	}
}
/*enter popup end*/

/**
 * sticky layout
 * */
function stickyLayout(){
	/*sidebar sticky*/
	var $sidebar = $(".sidebar-holder");

	if ($sidebar.length) {
		$sidebar.css('position','static');

		var resizeTimerMenu;

		$(window).on('load resizeByWidth', function () {
			if(window.innerWidth < 980){
				// $sidebar.trigger("sticky_kit:detach").attr('style','');
				$sidebar.trigger("sticky_kit:detach").css('position','relative');
				return;
			}

			clearTimeout(resizeTimerMenu);
			resizeTimerMenu = setTimeout(function () {
				$sidebar.stick_in_parent({
					parent: '.main-holder',
					offset_top: 100
				});
			}, 100);
		})
	}
}
/*sticky layout end*/

/**
 * sliders
 * */
function slidersInit() {
	//promo slider
	var $promoSliders = $('.promo-slider');

	if($promoSliders.length) {
		$promoSliders.each(function() {
			var $currentSlider = $(this);

			$currentSlider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				autoplaySpeed: 4000,
				dots: false,
				arrows: true
			});
		});
	}

	//info slider
	var $infoSliders = $('.info-center-content');

	if($infoSliders.length) {
		$infoSliders.each(function() {
			var $currentSlider = $(this);

			$currentSlider.find('.info__list').slick({
				infinite: false,
				dots: true,
				arrows: true,
				slidesToShow: 4,
				slidesToScroll: 1,
				responsive: [
					{
						breakpoint: 1376,
						settings: {
							slidesToShow: 3
						}
					},
					{
						breakpoint: 1030,
						settings: {
							slidesToShow: 2
						}
					},
					{
						breakpoint: 700,
						settings: {
							slidesToShow: 1
						}
					}
					// You can unslick at a given breakpoint now by adding:
					// settings: "unslick"
					// instead of a settings object
				]
			});
		});
	}

	/**meter*/
	var meterCounter = $('.meter-counter').jOdometer({
		increment: 1,
		counterStart: '000000',
		speed:1000,
		numbersImage: 'img/jodometer-numbers.png',
		heightNumber: 27,
		widthNumber: 20,
		formatNumber: true,
		spaceNumbers: 1,
		widthDot: 3
	});

	var $meterSlider = $('.meter-slider');
	if($meterSlider.length){

		$meterSlider.each(function () {
			var $currentSlider = $(this);
			var $wrapper = $currentSlider.parent();

			var $currentSlide = $wrapper.find('.slide__curr'),
				$totalSlides = $wrapper.find('.slide__total');



			$currentSlider.on('init', function (event, slick) {

				$totalSlides.text(slick.$slides.length);
				$currentSlide.text(slick.currentSlide + 1);
				changeCounter(slick.$slides[slick.currentSlide]);
				// changeUnit(slick.$slides[slick.currentSlide]);
			});


			$currentSlider.slick({
				fade: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				// initialSlide: 2,
				autoplay: true,
				autoplaySpeed: 6000,
				infinite: true,
				speed: 500,
				dots: false,
				arrows: true,
				swipe: false
			}).on('beforeChange', function (event, slick, currentSlide, nextSlider) {
				changeCounter(slick.$slides[nextSlider]);
				// changeUnit(slick.$slides[nextSlider]);
			}).on('afterChange reInit', function(event, slick, currentSlide, nextSlide) {
				$currentSlide.text(currentSlide + 1);
			});

		});
	}

	function changeCounter(currentSlider){
		var dataCount = $(currentSlider).data('count');
		meterCounter.goToNumber(dataCount);
		var meterImg = $('.meter-counter img');
		meterImg.attr('src','img/jodometer-numbers.png');
		for(var i = 0; i < String(dataCount).length; i++){
			meterImg.eq(i).attr('src','img/jodometer-numbers-color.png');
		}
	}

	// function changeUnit(currentSlider){
	// 	var dataUnit = $(currentSlider).data('unit');
	// 	$('.meter-unit__text').stop().fadeOut('200', function () {
	// 		$(this).text(dataUnit);
	// 	}).delay(100).fadeIn('200');
	// }
	/**meter end*/
}
/*sliders end*/

/**
 * responsive tabs
 * */
function tabsInit() {
	var $tabs = $('.js-tabs');

	if ($tabs) {

		$tabs.responsiveTabs({
			active: 0,
			rotate: false,
			startCollapsed: 'accordion',
			collapsible: 'accordion',
			setHash: false,
			animation: 'fade', // slide
			duration: 300, // default 500
			animationQueue: true
		});

	}
}
/* responsive tabs end */

/**
 * image lazy load
 * */
function imgLazyLoad() {
	$('.lazy-load').unveil();
}
/*image lazy load end*/

/**
 * scroll to map
 * */
function scrollToMap() {
	$('.map-link a').on('click', function (e) {
		var $target = $('.branches-section');

		if ($target.length) {
			e.preventDefault();

			var scrollTop = $target.offset().top - $('.nav').outerHeight() - 40;

			TweenMax.to(window, 1, {scrollTo: {y: scrollTop}, ease: Power2.easeInOut});
		}
	})
}
/*scroll to map end*/

/**
 * scroll to top
 * */
function scrollToTop() {
	var $btnToTop = $('.btn-to-top');

	if ($btnToTop.length) {
		var $page = $('html'),
			minScrollTop = 300;

		$(window).on('load scroll resizeByWidth', function () {
			var currentScrollTop = $(window).scrollTop();

			$page.toggleClass('to-top-show', (currentScrollTop >= minScrollTop));
		});

		$btnToTop.on('click', function (e) {
			e.preventDefault();

			TweenMax.to(window, 0.3, {scrollTo: {y: 0}, ease: Power2.easeInOut});
		})
	}
}
/*scroll to map end*/

/**!
 * drop language
 * */
function toggleYears() {

	if ($('.js-choice-wrap').length) {

		$('.js-choice-open').on('click', function (e) {
			e.preventDefault();

			$(this).closest('.js-choice-wrap').toggleClass('years-opened');

			e.stopPropagation();
		});

		$(document).on('click closeDropYears', function () {
			closeDropYears();
		});

		function closeDropYears() {
			$('.js-choice-wrap').removeClass('years-opened');
		}

		$('.js-choice-drop').on('click', 'a', function () {
			$(this).closest('.js-choice-wrap').find('.js-choice-open span').text($(this).find('span').text());
		});
	}

}
/*drop language end*/

/**
 * form success for example
 * */
function formSuccess() {
	if ( $('.subscription-form').length ) {

		$('form', '.subscription-form').submit(function (event) {

			var $form = $(this);
			var $formWrap = $form.parent();

			if ( $("input", $form).val().length ) {
				$formWrap.removeClass('error-form');
				$formWrap.addClass('success-form');

				return;
			}

			$formWrap.removeClass('success-form');
			$formWrap.addClass('error-form');

			event.preventDefault();
		});

	}
}
/* form success for example end */


/**!
 * footer at bottom
 * */
function footerBottom(){
	var $footer = $('.footer');
	if($footer.length){
		var $tplSpacer = $('<div />', {
			class: 'spacer'
		});

		$('.main').after($tplSpacer.clone());

		$(window).on('load resizeByWidth', function () {
			var footerOuterHeight = $footer.outerHeight();
			$footer.css({
				'margin-top': -footerOuterHeight
			});

			$('.spacer').css({
				'height': footerOuterHeight
			});
		});
	}
}
/*footer at bottom end*/

/** ready/load/resize document **/

$(window).on('load', function () {
	$('html').addClass('page-load');
});

$(document).ready(function(){
	placeholderInit();
	// inputToggleFocusClass();
	// inputHasValueClass();
	inputFilledClass();
	printShow();
	headerShow();
	navFixed();
	hoverClassInit();
	addPositionClass();
	mainNavigationForMobile();
	searchPopup();
	enterPopup();
	if(DESKTOP){
		stickyLayout();
	}
	slidersInit();
	tabsInit();
	imgLazyLoad();
	scrollToMap();
	scrollToTop();
	toggleYears();
	formSuccess();

	footerBottom();
});