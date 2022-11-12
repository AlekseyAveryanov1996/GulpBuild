const gulp = require('gulp')
const stylus = require('gulp-stylus')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const uglify = require("gulp-uglify")
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const fileinclude = require('gulp-file-include')
const browserSync = require('browser-sync').create()
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const svgSprite = require('gulp-svg-sprite');
const del = require('del')


const paths = {
    styles: {
        src: 'src/css/*.styl',
        dest: 'dist/css/',
        warther: 'src/css/**/*.styl'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/images/**',
        dest: 'dist/images/'
    },
    html: {
        src: 'src/*.html',
        watcher: 'src/**/*.html',
        dest: 'dist'
    },
    fonts: {
        src: 'src/fonts/*',
        dest: 'dist/fonts/'
    },
    svg: {
        src: 'src/svg/*.svg',
        dest: 'dist/svg/'
    }
}


// Создаем задачи

// очищаем папку dist
function clean() {
    return del(['dist/*', '!dist/images']) // очищаем все, кроме папки images
}

//Задача для html

function html() {
    return gulp.src(paths.html.src)
    .pipe(fileinclude())
    .pipe(gulp.dest(paths.html.dest)) // сохраняем в папку указываем куда это будет сохраняться
    .pipe(browserSync.stream());
}

// Задача для стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(stylus()) // подключаем препроцессор Stylus
        .pipe(autoprefixer({ // префиксы для разных браузеров
			cascade: false
		})) 
        .pipe(cleanCSS({
            level: 2,
        })) // очищаем старый css
        .pipe(rename({ // переименовываем в другое название файл
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest)) // сохраняем в папку указываем куда это будет сохраняться
        .pipe(browserSync.stream());
}

//Задача для js
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true,
    })
    .pipe(uglify()) // плагин для минификации
    .pipe(webpackStream({
        mode: 'development',
        output: {
            filename: 'main.min.js'
        }
    }))
    //.pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest)) // сохраняем в папку указываем куда это будет сохраняться
    .pipe(browserSync.stream());
}

// Задача для изображение

function img() {
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
        progressive: true,
    }))
    .pipe(gulp.dest(paths.images.dest))
}

function sprite() {
    return gulp.src(paths.svg.src)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"  //sprite file name
                }
            },
        }))
        .pipe(gulp.dest(paths.svg.dest));
}

// Задача для Шрифтов

function fonts() {
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}

// Отслеживание изменений
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/' // указываем в каком месте у нас стартовая дирректория для html
        },
    });
    gulp.watch(paths.html.watcher).on('change', browserSync.reload) // отслеживать html при изменении
    gulp.watch(paths.styles.warther, styles) // указываем где отслеживаем изменения и какую задачу выполняем
    gulp.watch(paths.scripts.src, scripts) // указываем где отслеживаем изменения и какую задачу выполняем
    gulp.watch(paths.images.src, img) // указываем где отслеживаем изменения и какую задачу выполняем
    gulp.watch(paths.html.watcher, html) // указываем где отслеживаем изменения и какую задачу выполняем
    gulp.watch(paths.fonts.src, fonts) // указываем где отслеживаем изменения и какую задачу выполняем
    //gulp.watch(paths.svg.src, sprite) // указываем где отслеживаем изменения и какую задачу выполняем
}

const build = gulp.series(clean, gulp.parallel(html,fonts, styles, scripts, img, sprite), watch) // Финальный билд


exports.clean = clean
exports.img = img
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.html = html
exports.fonts = fonts
exports.build = build
exports.default = build // запуск задачи по умолчанию "gulp"