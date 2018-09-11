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
			$btn = $element.find(config.btn),
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
		}, setActiveState = function ($btn) {
			/**
			 * !Set active state to the button
			 */

			// Add active class
			// Add tabindex="-1". For pass focus
			// Add aria-checked="true". See: http://prgssr.ru/development/ispolzovanie-aria-v-html5.html
			$btn
				.addClass(config.modifiers.activeClass)
				.attr('tabindex', '-1')
				.attr('aria-checked', 'true');

		}, setInactiveState = function ($btn) {
			/**
			 * !Set inactive state to the button
			 */

			// Remove active class
			// Reset tabindex
			// Add aria-checked="false". See: http://prgssr.ru/development/ispolzovanie-aria-v-html5.html
			$btn
				.removeClass(config.modifiers.activeClass)
				.attr('tabindex', '')
				.attr('aria-checked', 'false');

		}, changeSettings = function (initialObj, currentObj) {
			/**
			 * !Change setting of a special version
			 */
			var keyRemove, keyAdd;
			
			// Remove special classes from html
			for (keyRemove in initialObj) {
				$html.removeClass(initialObj[keyRemove]);
			}

			// Reset state for all buttons
			setInactiveState($btn);

			// Merge current object of settings into initial object of settings
			$.extend(true, initialObj, currentObj);
			// console.log("mergeSettings: ", initialObj);
			// console.log('===========================');

			// For the merged object of default settings
			for (keyAdd in initialObj) {
				// Add modifier classes to html
				$html.addClass(initialObj[keyAdd]);
				// console.log("newKey: ", defaultSettingObj[keyAdd]);

				// Reset all buttons in group
				var $allBtnInGroup = $element.find('[data-mod-name*=' + keyAdd + ']');
				setInactiveState($allBtnInGroup);

				// Set active state for active buttons
				var $activeBtn = $element.find('[data-mod-value*=' + initialObj[keyAdd] + ']');
				setActiveState($activeBtn);
			}

			// Save settings in cookie
			setCookieMod(cookieName.specVersionSettings, JSON.stringify(initialObj));

			return false;
		}, settingsByDefault = function () {
			/**
			 * !Activate setting buttons by default
			 * todo: В идеале, этот этап нужно сделать на php
			 * */

			// Create object from default active buttons
			var defaultSettingsObj = {},
				$btnByDefaultActive = $btn.filter('[data-default=true]');

			$.each($btnByDefaultActive, function () {
				var $this = $(this);
				defaultSettingsObj[$this.attr('data-mod-name')] = $this.attr('data-mod-value');
			});
			// console.log("defaultSettingsObj: ", defaultSettingsObj);

			// Take saved settings object or create new one
			var savedSettingsStr = getCookie(cookieName.specVersionSettings),
				savedSettingsObj = savedSettingsStr ? JSON.parse(savedSettingsStr) : {};
			// console.log("savedSettingsObj: ", savedSettingsObj);

			changeSettings(defaultSettingsObj, savedSettingsObj);

		}, selectSetting = function () {
			/**
			 * !Select setting for special version
			 * */
			$btn.on('click', function (e) {
				var $curBtn = $(this),
					settingsStr = getCookie(cookieName.specVersionSettings),
					modName = $curBtn.attr('data-mod-name'),
					modVal = $curBtn.attr('data-mod-value');

				// Create object of current setting
				var currentSettingsObj = {};
				currentSettingsObj[modName] = modVal;
				// console.log("currentSettingsObj: ", currentSettingsObj);

				// Take saved settings object or create new one
				var saveSettingsObj = settingsStr ? JSON.parse(settingsStr) : {};
				// console.log("saveSettingsObj: ", saveSettingsObj);

				// If the button is checkbox-type
				if ($curBtn.attr('data-toggle') !== undefined && $curBtn.hasClass(config.modifiers.activeClass)) {
					currentSettingsObj[modName] = null;
				}

				changeSettings(saveSettingsObj, currentSettingsObj);

				e.preventDefault();
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
			settingsByDefault: settingsByDefault,
			toggleSpec: toggleSpec,
			selectSetting: selectSetting,
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
				elem[i].spec.settingsByDefault();
				elem[i].spec.toggleSpec();
				elem[i].spec.selectSetting();
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
		settings: {
			"spacing":"vspec-mod_spacing_lg"
		},
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

			$('.spec-panel-mob-js').spec({
				switcher: '.spec-btn-switcher-mob-js'
			});
		}
	};

	specVersionInit();
});