const gulp = require('gulp')
const stylus = require('gulp-stylus')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require("gulp-uglify")
const concat = require('gulp-concat')
const del = require('del')

const paths = {
    styles: {
        src: 'src/css/**/*.styl',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}


// Создаем задачи

// очищаем папку dist
function clean() {
    return del(['dist'])
}

// Задача для стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(stylus()) // подключаем препроцессор Stylus
        .pipe(cleanCSS()) // очищаем старый css
        .pipe(rename({ // переименовываем в другое название файл
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest)) // сохраняем в папку указываем куда это будет сохраняться
}

//Задача для js
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true,
    })
    .pipe(babel()) // плагин для использования нового стандарта в старых версиях
    .pipe(uglify()) // плагин для минификации
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest)) // сохраняем в папку указываем куда это будет сохраняться
}

// Отслеживание изменений
function watch() {
    gulp.watch(paths.styles.src, styles) // указываем где отслеживаем изменения и какую задачу выполняем
    gulp.watch(paths.scripts.src, scripts) // указываем где отслеживаем изменения и какую задачу выполняем
}

const build = gulp.series(clean, gulp.parallel(styles, scripts ), watch) // выполнение сложной задачи друг за другом


exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build // запуск задачи по умолчанию "gulp"