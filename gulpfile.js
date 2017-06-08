'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// nodemon solution from -> https://gist.github.com/sogko mixed with -> https://gist.github.com/dstroot
var nodemon = require('gulp-nodemon');

// I/O
var scssI = 'src/scss/custom.scss';
var scssO = 'src/css';

// SASS ERRORS
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function() {
    console.log("- - - - CSS change");
    return gulp
        .src(scssI) 
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest(scssO))
        .pipe(reload({stream: true}))
});


gulp.task('js', function() {
    console.log("- - - - JS change");
    return gulp
        .src('src/js/*.js')
        .pipe(reload({stream: true}))
});

gulp.task('html', function() {
    console.log("- - - - HTML change");
    return gulp
        .src('src/*.html')
        .pipe(reload({stream: true}))
});

gulp.task('serve', ['nodemon'], function() {
  
    console.info("- - - - GULP WORKING - - - -");

    browserSync.init(null, {
        proxy: "http://localhost:3000",
        //files: ["app/**/*.*"],
        //browser: "google chrome",
        port: 5000, // Use a different one than the proxy
        notify: true
    });

    // WATCH for scss changes
    gulp.watch('src/scss/*.scss', ['sass']);
    // WATCH for js changes
    gulp.watch('src/js/*.js', ['js']);
    // WATCH for html changes
    gulp.watch('src/**/*.html', ['html']);

});

gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'server.js',
        ignore: [
          'gulpfile.js',
          'node_modules/'
        ]
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

gulp.task('default',['serve']);