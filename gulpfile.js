'use strict';

var gulp = require('gulp'), // Подключаем Gulp
	sass = require('gulp-sass'), // Подключаем Sass пакет https://github.com/dlmanning/gulp-sass
	browserSync = require('browser-sync').create(), // Подключаем Browser Sync
	reload = browserSync.reload,
	concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	concatCss = require('gulp-concat-css'),
	rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
	sourcemaps = require('gulp-sourcemaps'), // Подключаем Source Map для дебагинга sass-файлов https://github.com/floridoo/gulp-sourcemaps
	fileinclude = require('gulp-file-include'),
	markdown = require('markdown'),
	htmlbeautify = require('gulp-html-beautify'), // Причесываем
	fs = require('fs'), // For compiling modernizr.min.js
	modernizr = require('modernizr'), // For compiling modernizr.min.js
	config = require('./modernizr-config'), // Path to modernizr-config.json
	replace = require('gulp-string-replace'),
	strip = require('gulp-strip-comments'), // Удалить комментарии
	stripCssComments = require('gulp-strip-css-comments'), // Удалить комментарии (css)
	removeEmptyLines = require('gulp-remove-empty-lines'), // Удалить пустые строки
	revts = require('gulp-rev-timestamp'), // Дабавить версии к подключаемым файлам
	beautify = require('gulp-beautify'), // Причесать js
	svgSprite = require("gulp-svg-sprites") // Сгенерировать svg-спрайт
;

var path = {
	'dist': '1'
};

gulp.task('sprites', function () {
	return gulp.src('src/img/logo/*.svg')
		.pipe(svgSprite({
			baseSize: 16,
			padding: 20
		}))
		.pipe(gulp.dest("src/img/logo/sprite"));
});

gulp.task('htmlCompilation', function () { // Таск формирования ДОМ страниц
	return gulp.src(['src/__*.html'])
		.pipe(fileinclude({
			filters: {
				markdown: markdown.parse
			}
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.substr(2);
		}))
		.pipe(htmlbeautify({
			"indent_with_tabs": true,
			"max_preserve_newlines": 0
		}))
		.pipe(gulp.dest('./src/'));
});

gulp.task('sassCompilation', function () { // Создаем таск для компиляции sass файлов
	return gulp.src('src/sass/**/*.+(scss|sass)') // Берем источник
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded', // nested (default), expanded, compact, compressed
			indentType: 'tab',
			indentWidth: 1,
			precision: 3,
			linefeed: 'lf' // cr, crlf, lf or lfcr
		}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(replace('../../', '../')) /// в css файлах меняем пути к файлам с ../../ на ../
		.pipe(replace('@charset "UTF-8";', ''))
		.pipe(autoprefixer([
			'last 5 versions', '> 1%', 'ie >= 9', 'and_chr >= 2.3' //, 'ie 8', 'ie 7'
		], {
			cascade: true
		})) // Создаем префиксы
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./src/css')) // Выгружаем результата в папку src/css
		.pipe(browserSync.reload({
			stream: true
		})); // Обновляем CSS на странице при изменении
});

gulp.task('browserSync', function (done) { // Таск browserSync
	browserSync.init({
		server: {
			baseDir: "./src"
		},
		notify: false // Отключаем уведомления
	});
	browserSync.watch(['src/*.html', 'src/js/**/*.js', 'src/includes/**/*.json', 'src/includes/**/*.svg']).on("change", browserSync.reload);
	done();
});

gulp.task('watch', ['browserSync', 'htmlCompilation', 'sassCompilation'], function () {
	gulp.watch(['src/_tpl_*.html', 'src/__*.html', 'src/includes/**/*.json', 'src/includes/**/*.svg'], ['htmlCompilation']); // Наблюдение за tpl
	// файлами в папке include
	gulp.watch('src/sass/**/*.+(scss|sass)', ['sassCompilation']); // Наблюдение за sass файлами в папке sass
});

gulp.task('default', ['watch']); // Назначаем таск watch дефолтным

/************************************************************
 * Create Distribution folder and move files to it
 ************************************************************/

gulp.task('copyImgToDist', function () {
	return gulp.src('src/img/**/*')
		.pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			optimizationLevel: 7, //степень сжатия от 0 до 7
			use: [pngquant()]
		})))
		.pipe(gulp.dest(path.dist + '/img')); // Выгружаем на продакшен
});

gulp.task('buildDist', ['cleanDist', 'htmlCompilation', 'copyImgToDist', 'sassCompilation'], function () {

	gulp.src(['src/ajax/**/*'])
		.pipe(gulp.dest(path.dist + '/ajax')); // Переносим ajax-файлы в продакшен

	gulp.src(['src/video/**/*']) // Переносим видеофайлы в продакшен
		.pipe(gulp.dest(path.dist + '/video'));

	// Переносим стили в продакшен с форматированием
	gulp.src(['src/css/special-version-base.css', 'src/css/special-version.css'])
		.pipe(removeEmptyLines()) // Удаляем пустые строки
		.pipe(gulp.dest(path.dist + '/css'));

	// Переносим остальные стили в продакшен без изменений
	gulp.src(['!src/css/_temp_*.css', '!src/css/special-version-base.css', '!src/css/special-version.css', 'src/css/*.css'])
		.pipe(gulp.dest(path.dist + '/css'));

	gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
		.pipe(gulp.dest(path.dist + '/fonts'));

	gulp.src('src/js/special.js') // Переносим special.js в продакшен
		.pipe(strip({
			safe: true,
			ignore: /\/\*\*\s*\n([^\*]*(\*[^\/])?)*\*\//g // Не удалять /**...*/
		}))
		.pipe(removeEmptyLines())  // Удаляем пустые строки
		.pipe(beautify({  // Причесываем код
			"indent_with_tabs": true,
			"space_after_anon_function": true,
			"max_preserve_newlines": 2
		}))
		.pipe(gulp.dest(path.dist + '/js'));

	gulp.src(['!src/js/temp/**/*.js', '!src/js/**/_temp_*.js', '!src/js/special.js', 'src/js/*.js']) // Переносим остальные скрипты в продакшен
		.pipe(gulp.dest(path.dist + '/js'));

	gulp.src('src/assets/**/*') // Переносим дополнительные файлы в продакшен
		.pipe(gulp.dest(path.dist + '/assets'));

	gulp.src(['!src/__*.html', '!src/_tpl_*.html', '!src/_temp_*.html', 'src/*.html']) // Переносим HTML в продакшен
		.pipe(revts()) // Добавить версии подключаемых файлов. В html добавить ключ ?rev=@@hash в место добавления версии
		.pipe(gulp.dest(path.dist));

	gulp.src(['src/*.png', 'src/*.ico', 'src/.htaccess']) // Переносим favicon и др. файлы в продакшин
		.pipe(gulp.dest(path.dist));

});

gulp.task('cleanDist', function () {
	return del.sync([path.dist + '/']); // Удаляем папку dist
});

gulp.task('clearCache', function () { // Создаем такс для очистки кэша
	return cache.clearAll();
});