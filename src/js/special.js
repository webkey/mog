'use strict';

/**
 * !Special Version
 * */
(function($){
	'use strict';

	var Spec = function (element, config) {
		var self,
			$html = $('html'),
			$body = $('body'),
			$element = $(element),
			$specialBtn = $('.spec-btn-switcher-js'),
			pref = 'jq-spec',
			pluginClasses = {
				initClass: pref + '--initialized',
				element: pref + '__switcher',
				complete: pref + '__complete'
			},
			cssId = '#special-version',
			path = cssPath || 'css/',
			cookies = {
				'specVersionOn': 'special-version',
				'specVersionMods': 'special-mods'
			},
			elem = {
				'btn': '.spec-btn-js',
				'btnGroup': '.spec-btn-group-js'
			},
			mod = {
				'specOn': 'vspec',
				'hidePage': 'vspec--hide-page',
				'btnActive': 'active' // active class of the buttons
			};

		var callbacks = function () {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('spec.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		}, setCookie = function (name, value, options) {
			// https://learn.javascript.ru/cookie
			options = options || {};

			var expires = options.expires;

			if (typeof expires === "number" && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}

			value = encodeURIComponent(value);

			var updatedCookie = name + "=" + value;

			for (var propName in options) {
				updatedCookie += "; " + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += "=" + propValue;
				}
			}

			document.cookie = updatedCookie;
		}, getCookie = function (name) {
			// https://learn.javascript.ru/cookie
			var matches = document.cookie.match(new RegExp(
				"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		}, setCookieMod = function (name, val) {
			setCookie(name, val, {
				// expires: expiresValue,
				// domain: "mog.by",
				path: "/"
			});
		}, toggleClass = function (elements) {
			// Первый аргумент функции (elements) - один или несколько ([]) елементов, на которые добуаляется/удаляется класс.
			// Второй аргумент функции указыает удалять класс (false) или добавлять (true - указыать не обязательно).
			// Пример использования: toggleClass([$elem1, $elem2, $('.class', $elem2), $('.class'), '.class'], false);
			if (!elements)
				return;

			var condRemove = (arguments[1] === undefined) ? true : !!arguments[1],
				$elements = (typeof elements === "object") ? elements : $(elements);

			$.each($elements, function () {
				var currentElem = this;
				if ($.isArray(currentElem)) {
					// Если массив, то запускаем функицию повторно
					toggleClass(currentElem, condRemove);
				} else {
					// Если второй аргумент false, то удаляем класс
					// Если второй аргумент НЕ false, то добавляем класс
					$(currentElem).toggleClass(config.modifiers.activeClass, !!condRemove)
				}
			});
		}, toggleSpec = function () {
			/**
			 * !Toggle special version
			 */
			$specialBtn.on('click', function (e) {
				e.preventDefault();
				$('body').addClass(mod.hidePage); // first hide content
				// toggle special version cookie
				if(getCookie(cookies.specVersionOn) === 'true'){
					setCookieMod(cookies.specVersionOn, "false");
				} else {
					setCookieMod(cookies.specVersionOn, "true");
				}
				location.reload(); // reload page
			});
		}, changeSettings = function () {
			/**
			 * !Change settings
			 * */
			$body.on('click', elem.btn, function (e) {
				e.preventDefault();
				var $curBtn = $(this);

				if(!$curBtn.hasClass(mod.btnActive) || $curBtn.attr('data-toggle') !== undefined) {
					var $curGroup = $curBtn.closest(elem.btnGroup),
						modsArr = [],
						_curMod = $curBtn.attr('data-mod');

					// create modifiers class array
					$.each($curGroup.find(elem.btn), function (i, el) {
						modsArr.push($(el).attr('data-mod'));
					});

					// console.log("modsArr: ", modsArr);

					// toggle a cookies
					// for(var i = 0; i < modsArr.length; i++){
					// 	setCookieMod(modsArr[i], 'false');
					// }
					// setCookieMod(_curMod, 'true');

					// console.log("$curBtn.attr('data-toggle'): ", $curBtn.attr('data-toggle') !== undefined);

					var curCookieMods = getCookie(cookies.specVersionMods);
					// console.log("getCookie(cookies.specVersionOn): ", curCookieMods);
					var newCookieModsArr = curCookieMods ? curCookieMods.split(', ') : [];
					// console.log("newCookieModsArr (before change): ", newCookieModsArr);

					for (var i = 0; i < modsArr.length; i++) {
						// console.log("modsArr[i]: ", modsArr[i]);
						for (var j = 0; j < newCookieModsArr.length; j++) {
							// console.log("newCookieModsArr[j]: ", newCookieModsArr[j]);
							if (modsArr[i] === newCookieModsArr[j]) {
								// console.log("newCookieModsArr[j]: ", newCookieModsArr[j]);
								// newModsArr.push(newCookieModsArr[j]);
								// break outer;
								// console.log("j: ", j);
								newCookieModsArr.splice(j, 1);
							}
						}
					}

					if (!$curBtn.hasClass(mod.btnActive)) {
						newCookieModsArr.push(_curMod);

						// remove active class from buttons
						$curGroup.find(elem.btn).removeClass(mod.btnActive).attr('tabindex', '');
						// add active class on current button
						$curBtn.addClass(mod.btnActive);
						if ($curBtn.attr('data-toggle') === undefined){
							$curBtn.attr('tabindex', '-1');
						}

						// remove modifier classes
						$html.removeClass(modsArr.join(' '));
						// add active class
						$html.addClass(_curMod);
					} else if ($curBtn.attr('data-toggle') !== undefined) {
						// remove active class from current button
						$curBtn.removeClass(mod.btnActive).attr('tabindex', '');
						// remove active class from a body
						$html.removeClass(_curMod);
					}

					// console.log("newCookieModsArr (after change): ", newCookieModsArr);
					setCookieMod(cookies.specVersionMods, newCookieModsArr.join(', '));
				}
			});
		}, init = function () {

			$element.addClass(pluginClasses.element + ' ' + pluginClasses.initClass).addClass(config.modifiers.initClass);

			/**
			 * !include special css and add special class on a body
			 */
			if (getCookie(cookies.specVersionOn) === 'true' && !$(cssId).length) {
				$('<link/>', {
					id: cssId.substr(1),
					rel: 'stylesheet',
					href: path + 'special-version.css'
				}).appendTo('head');

				$body.addClass(mod.specOn);
			}

			/**
			 * !add special modifiers class
			 * */
			var cookieMods = getCookie(cookies.specVersionMods);
			// console.log("cookieMods (after document ready): ", cookieMods);
			if (cookieMods) {
				$html.addClass(cookieMods.replace(/, /g, ' '));
				$(elem.btn).removeClass(mod.btnActive);

				var cookieModsArr = cookieMods.split(', ');
				for(var i = 0; i < cookieModsArr.length; i++){
					// console.log(cookieModsArr[i]);
					$('[data-mod=' + cookieModsArr[i] + ']').addClass(mod.btnActive);
				}
			}

			/**
			 * !switch special version
			 * */
			/* replace title and text in buttons */
			$.each($specialBtn, function () {
				var $curBtn = $(this),
					$text = $('span', $curBtn);
				if(getCookie(cookies.specVersionOn) === 'true'){
					var titleOff = $curBtn.attr('data-title-off');
					$curBtn.attr('title', titleOff);
					$text.html(titleOff);
				} else {
					var titleOn = $curBtn.attr('data-title-on');
					$curBtn.attr('title', titleOn);
					$text.html(titleOn);
				}
			});

			$element.trigger('spec.afterInit');
		};

		self = {
			callbacks: callbacks,
			toggleSpec: toggleSpec,
			changeSettings: changeSettings,
			init: init
		};

		return self;
	};

	$.fn.spec = function () {
		var elem = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = elem.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				elem[i].spec = new Spec(elem[i], $.extend(true, {}, $.fn.spec.defaultOptions, opt));
				elem[i].spec.init();
				elem[i].spec.callbacks();
				elem[i].spec.toggleSpec();
				elem[i].spec.changeSettings();
			}
			else {
				ret = elem[i].spec[opt].apply(elem[i].spec, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return elem;
	};

	$.fn.spec.defaultOptions = {
		event: 'click',
		modifiers: {
			initClass: null,
			activeClass: 'active'
		}
	}

})(jQuery);

$(document).ready(function () {
	var specVersionInit = function() {
		var $specPanel = $('.spec-panel-js');

		if ($specPanel.length) {
			$.each($specPanel, function () {
				$(this).spec();
			});
		}
	};

	specVersionInit();
});