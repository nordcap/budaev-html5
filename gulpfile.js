"use strict";


var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var pagespeed = require('psi');
var browserSync = require('browser-sync').create();
var del = require('del');
var jshint = require('gulp-jshint');
var cache = require('gulp-cache');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var pngquant = require('imagemin-pngquant');
var sitemap = require('gulp-sitemap');
var concat = require('gulp-concat');
var merge = require('merge-stream');
/* for use sprites
 var spritesmith = require('gulp.spritesmith');

 */


var path = {
    dist: {
        html: './dist/',
        js: './dist/js/',
        css: './dist/css/',
        img: './dist/images/',
        fonts: './dist/fonts/'


    },
    app: {
        bower: './app/bower_components/',
        html: './app/*.html',
        js: './app/js/',
        css: './app/css/',
        scss: './app/sass/main.scss',
        img: './app/images/**/*.*',
        fonts: './app/fonts/**/*.*',
        lib: './app/lib/'

    },
    watch: {
        html: './app/**/*.html',
        js: './app/js/**/*.js',
        scss: './app/sass/**/*.scss',
        img: './app/images/**/*.*',
        fonts: './app/fonts/**/*.*'
    }
};


var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];


// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src(path.watch.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


//copy img files and optimize images
gulp.task('images', function () {
    return gulp.src(path.app.img)
        .pipe(plumber())
        // .pipe(cache(imagemin({
        //     progressive: true,
        //     interlaced: true,
        //     use: [pngquant()]
        // })))
        .pipe(gulp.dest(path.dist.img))
        .pipe(size({title: 'images'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
    return gulp.src(path.app.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(size({title: 'fonts'}));
});

//copy jquery in dest
gulp.task('jquery', function () {
    return gulp.src('./app/bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(path.dist.js))
        .pipe(size({title: 'jquery'}));
});


//concat js files => error concat&minify in task 'html'
gulp.task('concat-js', function () {
    var jsVendor = gulp.src([
        path.app.bower + 'bootstrap/dist/js/bootstrap.js',
        path.app.bower + 'wow/dist/wow.js',
        path.app.bower + 'waypoints/lib/jquery.waypoints.js',
        path.app.bower + 'magnific-popup/dist/jquery.magnific-popup.js',
        path.app.bower + 'owl.carousel/dist/owl.carousel.js'

    ])
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.app.js));


    var jsMain = gulp.src([
        path.app.js + 'main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.app.js))
        .pipe(size({title: 'concat-js'}));

    return merge(jsVendor, jsMain);

});


//concat css files => google optimize speed
gulp.task('concat-css', function () {
    var cssVendor = gulp.src([
        path.app.bower + 'bootstrap/dist/css/bootstrap.css',
        path.app.bower + 'animate.css/animate.css',
        path.app.bower + 'magnific-popup/dist/magnific-popup.css',
        path.app.bower + 'owl.carousel/dist/assets/owl.carousel.css',
        path.app.bower + 'owl.carousel/dist/assets/owl.theme.default.css'
    ])
        .pipe(concat('vendor.min.css'))
        //.pipe(minifyCss())
        .pipe(cssnano())
        .pipe(gulp.dest(path.app.css));

    var cssMain = gulp.src(path.app.css + 'main.css')
        .pipe(concat('main.min.css'))
        .pipe(cssnano())
        //.pipe(minifyCss())
        .pipe(gulp.dest(path.app.css));

    return merge(cssVendor, cssMain);

});

// Copy all files at the root level (app) and css and js files
gulp.task('copy', function () {
    var allFiles = gulp.src([
        'app/*.*',
        '!app/*.html',
        'app/.htaccess'
    ], {dot: true})
        .pipe(gulp.dest(path.dist.html));


    var cssFiles = gulp.src([
        path.app.css + 'vendor.min.css',
        path.app.css + 'main.min.css'
    ])
        .pipe(gulp.dest(path.dist.css));

    var jsFiles = gulp.src([
        path.app.js + 'vendor.min.js',
        path.app.js + 'main.min.js'
    ])
        .pipe(gulp.dest(path.dist.js))
        .pipe(size({title: 'copy files'}));


    return merge(allFiles, cssFiles, jsFiles);

});


//assemble html, concat css & js files + minify files
gulp.task('html', function () {

    return gulp.src(path.app.html)
        .pipe(plumber())
        // Minify any HTML
        .pipe(minifyHTML({
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS:true
        }))
        .pipe(gulp.dest(path.dist.html))
        .pipe(size({title: 'html'}));
});



// Clean output directory
gulp.task('clean', del.bind(null, ['dist/**'], {dot: true}));

//Compile and automatically prefix styleheets
gulp.task('sass', function () {
    return gulp.src(path.watch.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.app.css))
        .pipe(size({title: 'sass'}));

});


//compile only main.scss and rename
gulp.task('css-watch', ['sass'], function () {
    return gulp.src(path.app.css + 'main.css')
        .pipe(concat('main.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(path.app.css))
        .pipe(browserSync.stream());
});


// Watch files for changes & reload
gulp.task('watch', function () {

    gulp.watch(path.watch.scss, ['css-watch']);
    gulp.watch(path.watch.html).on('change', browserSync.reload);
    gulp.watch(path.watch.js, ['jshint']).on('change', browserSync.reload);
});

//browser-sync
gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "budaev-html5/app"
    });
});

//default


gulp.task('default', function (callback) {
    runSequence('sass', 'concat-css', 'concat-js', 'browser-sync', 'watch', callback)
});

//build production files
gulp.task('build', function (callback) {
    runSequence('clean',
        'sass', 'concat-css', 'concat-js', ['images', 'copy', 'fonts', 'jquery'],
        'html',
        'sitemap',
        callback);
});


//create sitemap
gulp.task('sitemap', function () {
    return gulp.src('./dist/**/*.html')
        .pipe(sitemap({
            siteUrl: 'http://yuorsite.com',
            priority: '1.0'
        }))
        .pipe(gulp.dest(path.dist.html));
});


//create sprites
gulp.task('sprite', function () {
    var spriteData = gulp.src('./app/images/icon/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: 'sprite.scss',
            algorithm: 'top-down',
            padding: 10,
        }));

    var imgStream = spriteData.img.pipe(gulp.dest('./app/images/'));

    var cssStream = spriteData.css.pipe(gulp.dest('./app/sass/utils/'));

    return merge(imgStream, cssStream);

});


// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
    // Update the below URL to the public URL of your site
    pagespeed.output('yuorsite.com', {
        strategy: 'mobile',
        // By default we use the PageSpeed Insights free (no API key) tier.
        // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
        // key: 'YOUR_API_KEY'
    }, cb);
});
