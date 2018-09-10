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
			$switcher = $(config.switcher),
			pref = 'jq-spec',
			pluginClasses = {
				initClass: pref + '--initialized',
				panel: pref + '__toolbar',
				switcher: pref + '__switcher'
			},
			path = cssPath || 'css/',
			cookieName = {
				specVersionOn: 'special-version-on',
				specVersionSettings: 'special-version-settings'
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
			// Если для cпец. версии создаются отдельные шаблоны,
			// этот функционал не нужен
			console.log("getCookie(cookieName.specVersionOn): ", getCookie(cookieName.specVersionOn));
			$switcher.on('click', function (e) {
				e.preventDefault();
				$('body').addClass(config.modifiers.hidePage); // first hide content
				// toggle special version cookie
				if(getCookie(cookieName.specVersionOn) === 'true'){
					setCookieMod(cookieName.specVersionOn, "false");
				} else {
					setCookieMod(cookieName.specVersionOn, "true");
				}
				location.reload(); // reload page
			});
		}, changeSettings = function () {
			/**
			 * !Change settings
			 * */
			$(config.btn).on('click', function (e) {
				e.preventDefault();
				var $curBtn = $(this);

				if(!$curBtn.hasClass(config.modifiers.activeClass) || $curBtn.attr('data-toggle') !== undefined) {
					var $curGroup = $curBtn.closest(config.btnGroup),
						modsArr = [];

					// create modifiers class array
					// $.each($curGroup.find(config.btn), function (i, el) {
					// 	modsArr.push($(el).attr('data-mod'));
					// });

					var settings = getCookie(cookieName.specVersionSettings);

					// console.log("settings: ", settings);
					// console.log("settings []: ", settings.split(', '));

					// var testJsonStr = '{"fontSize":"FONTSIZE1","letterSpacing":"LETTERSPACING1"}';
					// var testJsonObj = JSON.parse(testJsonStr);
					// console.log("testJsonObj: ", testJsonObj);
					// // var key;
					// // for (key in testJsonObj) {
					// // 	console.log("key: ", key);
					// // }
					// testJsonObj["fontSize"] = "FONTSIZE2";
					// testJsonObj["imgOn"] = "true";
					// console.log("testJsonObj (new): ", testJsonObj);
					// var testJsonStrNew = JSON.stringify(testJsonObj);
					// console.log("testJsonStrNew: ", testJsonStrNew);


					// var newCookieModsArr = settings ? settings.split(', ') : [];
					//
					// for (var i = 0; i < modsArr.length; i++) {
					// 	for (var j = 0; j < newCookieModsArr.length; j++) {
					// 		if (modsArr[i] === newCookieModsArr[j]) {
					// 			newCookieModsArr.splice(j, 1);
					// 		}
					// 	}
					// }

					if (!$curBtn.hasClass(config.modifiers.activeClass)) {
						// Create settings object
						var settingsObj = settings ? JSON.parse(settings) : {};
						console.log("settingsObj: ", settingsObj);

						// remove modifier classes from html
						for (var key in settingsObj) {
							$html.removeClass(settingsObj[key]);
						}

						// Add or change the setting in settings object
						var modName = $curBtn.attr('data-mod-name'),
							modVal = $curBtn.attr('data-mod-value');

						settingsObj[modName] = modVal;
						console.log("settingsObj (new): ", settingsObj);

						// add modifier classes to html
						for (var newKey in settingsObj) {
							$html.addClass(settingsObj[newKey]);
						}

						// remove active class from buttons
						$element.find('[data-mod-name*=' + modName + ']').removeClass(config.modifiers.activeClass).attr('tabindex', '');

						// add active class on current button
						$element.find('[data-mod-value*=' + modVal + ']').addClass(config.modifiers.activeClass).attr('tabindex', '1');

						if ($curBtn.attr('data-toggle') === undefined){
							$curBtn.attr('tabindex', '-1');
						}
					}
					// else if ($curBtn.attr('data-toggle') !== undefined) {
					// 	// remove active class from current button
					// 	$curBtn.removeClass(config.modifiers.activeClass).attr('tabindex', '');
					// 	// remove active class from a body
					// 	$html.removeClass(modVal);
					// }

					// Save settings in cookie
					setCookieMod(cookieName.specVersionSettings, JSON.stringify(settingsObj));
				}
			});
		}, init = function () {

			$element.addClass(pluginClasses.panel + ' ' + pluginClasses.initClass).addClass(config.modifiers.initClass);

			// Если для cпец. версии создаются отдельные шаблоны,
			// этот функционал не нужен
			/**
			 * !include special css and add special class on a body
			 */
			if (getCookie(cookieName.specVersionOn) === 'true' && !$('#' + config.cssId).length) {
				$('<link/>', {
					id: config.cssId,
					rel: 'stylesheet',
					href: path + 'special-version.css'
				}).appendTo('head');

				$body.addClass(config.modifiers.specOn);
			}

			/**
			 * !add special modifiers class
			 * */
			// var cookieMods = getCookie(cookieName.specVersionSettings);
			// // console.log("cookieMods (after document ready): ", cookieMods);
			// if (cookieMods) {
			// 	$html.addClass(cookieMods.replace(/, /g, ' '));
			// 	$(config.btn).removeClass(config.modifiers.activeClass);
			//
			// 	var cookieModsArr = cookieMods.split(', ');
			// 	for(var i = 0; i < cookieModsArr.length; i++){
			// 		$('[data-mod=' + cookieModsArr[i] + ']').addClass(config.modifiers.activeClass);
			// 	}
			// }

			/**
			 * !switch special version
			 * */
			/* replace title and text in buttons */
			$.each($switcher, function () {
				var $curBtn = $(this),
					$text = $('span', $curBtn);
				if(getCookie(cookieName.specVersionOn) === 'true'){
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
				console.log(2);
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
		switcher: '.spec-btn-switcher-js',
		btn: '.spec-btn-js',
		btnGroup: '.spec-btn-group-js',
		event: 'click',
		cssId: 'special-version',
		modifiers: {
			initClass: null,
			specOn: 'vspec',
			hidePage: 'vspec--hide-page',
			activeClass: 'active' // active class of the buttons
		}
	}

})(jQuery);

$(document).ready(function () {
	var specVersionInit = function() {
		var $specPanel = $('.spec-btn-switcher-js');
		if ($specPanel.length) {
			$('.spec-panel-js').spec({
				specOn: 'vspec',
				hidePage: 'vspec--hide-page',
				activeClass: 'active'
			});
		}

		var $specPanelMob = $('.spec-btn-switcher-js');
		if ($specPanelMob.length) {
			$('.spec-panel-mob-js').spec({
				switcher: '.spec-btn-switcher-mob-js'
			});
		}
	};

	specVersionInit();
});