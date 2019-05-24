'use strict';

var gulp         = require('gulp');
var watch        = require('gulp-watch');
var concat       = require('gulp-concat');
var sass         = require('gulp-sass');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
	scss: [ 'css/scss/**/*.scss', 'css/' ],
	js: ['js/beflex/**/*.js', 'js/']
};

/** SCSS */
gulp.task( 'build_scss', function() {
	return gulp.src( paths.scss[0] )
		.pipe( sass( { 'outputStyle': 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}) )
		.pipe( gulp.dest( paths.scss[1] ) )
		.pipe( sass({outputStyle: 'compressed'}).on( 'error', sass.logError ) )
		.pipe( rename( './style.min.css' ) )
		.pipe( gulp.dest( paths.scss[1] ) );
});

/** JS */
gulp.task( 'build_js', function() {
	return gulp.src( paths.js[0] )
		.pipe( concat( 'main.js' ) )
		.pipe( gulp.dest( paths.js[1] ) )
		.pipe( rename( 'main.min.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( paths.js[1] ) )
});

/** Watch */
gulp.task( 'default', function() {
	gulp.watch( paths.scss[0], gulp.series('build_scss') );
	gulp.watch( paths.js[0], gulp.series('build_js') );
});
