const { src, dest, lastRun, watch, series, parallel } = require('gulp');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssCombo = require('gulp-css-combo');
const autoprefixer = require("autoprefixer");
const fileinclude = require('gulp-file-include');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

// 경로
const path = {
    html: "src/**/*.html",
    css: "src/css/**/*.css",
    scss: "src/scss/**/*.scss",
    js: "src/js/**/*.*",
    img: "src/images/**/*.*",
    fonts: "src/font/**/*.*"
};

// 임시
const tmp = {
    html: "tmp",
    css: "tmp/css",
    scss : "tmp/css/template9/resp",
    js: "tmp/js",
    img: "tmp/images",
    fonts: "tmp/font"
};

// build
const result = {
    html: "dist",
    css: "dist/css/template9/resp",
    js: "dist/js",
    img: "dist/images",
    fonts: "dist/font"
};

// dev
const dev = {
    html: "D:/hilms/hilms/src/main/webapp",
    css: "D:/hilms/hilms/src/main/webapp/css/template9/resp",
    js: "D:/hilms/hilms/src/main/webapp/js",
    img: "D:/hilms/hilms/src/main/webapp/images",
    fonts: "D:/hilms/hilms/src/main/webapp/font"
};

function htmlTask(){
    return src(path.html, { since: lastRun(htmlTask) })
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@root'
    }))
    .pipe(dest(tmp.html));
}

function cssTask(){
    return src(path.css, { since: lastRun(cssTask) })
    // .pipe(concat('scripts.js'))
    .pipe(dest(tmp.css));
}

function scssTask(){
    return src(path.scss, { sourcemaps: true }, { since: lastRun(scssTask) })
    .pipe(sass({outputStyle: 'compact'}))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(tmp.scss, { sourcemaps: './maps' }));
}

function concatJsTask(){
    return src(path.js, { since: lastRun(concatJsTask) })
    // .pipe(concat('scripts.js'))
    .pipe(dest(tmp.js));
}


function imageminTask(){
    return src(path.img)
    .pipe(dest(tmp.img));
}

// build
function htmlBuildTask(){
    return src([path.html, '!src/publish/hihrd/comm/**/*.html'])

    // return src(path.html)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@root'
    }))
    .pipe(dest(result.html));
}

function scssBuildTask(){
    return src(path.scss, { sourcemaps: false })
    .pipe(sass({outputStyle: 'compact'}))
    .pipe(postcss([autoprefixer()]))
    // .pipe(cssCombo())
    .pipe(dest(result.css));
}

// function scssBuildTask(){
//     return src(path.scss, { sourcemaps: false })
//     .pipe(sass())
//     .pipe(cleanCSS({debug: true}, (details) => {
//         console.log(`original ${details.name}: ${details.stats.originalSize}`);
//         console.log(`minified ${details.name}: ${details.stats.minifiedSize}`);
//     }))
//     .pipe(postcss([autoprefixer()]))      
//     .pipe(dest(result.css));
// }

function concatJsBuildTask(){
    return src(path.js)
    .pipe(dest(result.js));
}

function imageminBuildTask(){
    return src(path.img)
    .pipe(dest(result.img));
}

// dev
function htmlDevTask(){
    return src([path.html, '!src/publish/hihrd/comm/**/*.html'])

    // return src(path.html)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@root'
    }))
    .pipe(dest(dev.html));
}

function scssDevTask(){
    return src(path.scss, { sourcemaps: false })
    .pipe(sass({outputStyle: 'compact'}))
    .pipe(postcss([autoprefixer()]))
    // .pipe(cssCombo())
    .pipe(dest(dev.css));
}

function concatJsDevTask(){
    return src(path.js)
    .pipe(dest(dev.js));
}

function imageminDevTask(){
    return src(path.img)
    .pipe(dest(dev.img));
}

function browserSyncServe(cb){
    browserSync.init({
        ui: {
            port: 7000,
        },
        port: 7001,
        server: {
            baseDir: './tmp'
        }
    });

    cb();
}

function browserSyncReload(cb){
    browserSync.reload();

    cb();
}

function watchTask(){
    watch(path.html, series(htmlTask, browserSyncReload));
    watch(path.css, series(cssTask, browserSyncReload));
    watch(path.scss, series(scssTask, browserSyncReload));
    watch(path.js, series(concatJsTask, browserSyncReload));
    watch(path.img, series(imageminTask, browserSyncReload));
}

exports.default = series(
    htmlTask, 
    cssTask,
    scssTask,
    imageminTask,
    concatJsTask, 
    browserSyncServe, 
    watchTask
);

exports.build = series(
    htmlBuildTask, 
    scssBuildTask,
    concatJsBuildTask,
    imageminBuildTask
);

exports.dev = series(
    htmlDevTask, 
    scssDevTask,
    concatJsDevTask,
    imageminDevTask
);