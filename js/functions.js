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
				}, 100));
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

	// .nav-opened-start .wrapper{ z-index: 99; } // z-index of header must be greater than footer
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
			minWidthItem: 100
		}, settings || {});

		var self = this,
			container = $(options.navContainer),
			_animateSpeed = options.animationSpeed;

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

		self.desktop = device.desktop();

		self.modifiers = {
			active: 'active',
			opened: 'nav-opened',
			openStart: 'nav-opened-start'
		};

		if (self.overlayBoolean) {
			self.createOverlay();
		}
		self.outsideClick();
		self.preparationAnimation();
		self.eventsBtnMenu();
		self.eventsBtnMenuClose();
		self.clearStyles();
	};

	MainNavigation.prototype.navIsOpened = false;

	// init tween animation
	MainNavigation.prototype.overlayTween = new TimelineMax({paused: true});

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
			background: '#000'
		});

		self.overlayTween.to($overlay, self._animateSpeedOverlay / 1000, {autoAlpha: self._overlayAlpha});
	};

	// show/hide overlay
	MainNavigation.prototype.showOverlay = function (close) {
		var self = this,
			overlayTween = self.overlayTween;

		if (close === false) {
			overlayTween.reverse();
			return false;
		}

		if (overlayTween.progress() != 0 && !overlayTween.reversed()) {
			overlayTween.reverse();
			return false;
		}

		overlayTween.play();
	};

	// events btn menu
	MainNavigation.prototype.eventsBtnMenu = function () {
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


	// open nav
	MainNavigation.prototype.openNav = function() {
		console.log("openNav");

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

		var navTween = new TimelineMax();

		navTween
			.to($navContainer, _animationSpeed / 1000, {
				yPercent: 0, onComplete: function () {
					$html.addClass(self.modifiers.opened);
				}, ease:Cubic.easeOut
			});

		TweenMax.staggerTo($staggerItems, 0.85, {
			autoAlpha:1,
			scale:1,
			y: 0,
			ease:Cubic.easeOut
		}, 0.1);


		if (self.overlayBoolean) {
			self.showOverlay();
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
			_animationSpeed = self._animateSpeedOverlay;

		$html.removeClass(self.modifiers.opened);
		$html.removeClass(self.modifiers.openStart);
		$buttonMenu.removeClass(self.modifiers.active);

		if (self.overlayBoolean) {
			self.showOverlay(false);
		}

		TweenMax.to($navContainer, _animationSpeed / 1000, {
			yPercent: 120, onComplete: function () {
				self.preparationAnimation();
			}
		});

		self.navIsOpened = false;
	};

	// preparation element before animation
	MainNavigation.prototype.preparationAnimation = function() {
		var self = this,
			$navContainer = self.$navContainer,
			$staggerItems = self.$staggerItems;

		if (window.innerWidth < 1280) {
			// console.log("preparationAnimation");

			TweenMax.set($navContainer, {
				yPercent: 120,
				onComplete: function () {
					$navContainer.show(0);
				}
			});
			TweenMax.set($staggerItems, {
				autoAlpha: 0,
				scale: 0.6,
				y: 100
			});
		}
	};

	// clearing inline styles
	MainNavigation.prototype.clearStyles = function() {
		var self = this,
			$btnMenu = self.$btnMenu,
			$navContainer = self.$navContainer,
			$staggerItems = self.$staggerItems;

		//clear on horizontal resize
		$(window).on('resizeByWidth', function () {
			if (!$btnMenu.is(':visible')) {
				$navContainer.attr('style', '');
				$staggerItems.attr('style', '');
			} else {
				self.closeNav();
			}
		});
	};

	window.MainNavigation = MainNavigation;

}(jQuery));

/**
 * main navigation for mobile end
 * */
function mainNavigationForMobile(){
	var $container = $('.nav');
	if(!$container.length){ return; }
	new MainNavigation({
		navContainer: '.nav',
		navMenu: '.nav-list',
		btnMenu: '.btn-menu',
		btnMenuClose: '.btn-menu-close',
		navMenuItem: '.nav-list > li',
		overlayAppendTo: '.header',
		animationSpeed: 300,
		overlayAlpha: 0.35
	});
}
/*main navigation for mobile end*/

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

/**!
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
				dots: false,
				arrows: true
			});
		});
	}
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

$(document).ready(function(){
	placeholderInit();
	printShow();
	headerShow();
	navFixed();
	hoverClassInit();
	mainNavigationForMobile();
	if(DESKTOP){
		stickyLayout();
	}
	slidersInit();
	tabsInit();
	imgLazyLoad();

	footerBottom();
});