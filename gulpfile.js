// Array of script for concating in order  ['./js/script1.js', './js/script2.js', './js/script3.js']
var scripts = [
      './js/plugins.js',
      './js/main.js'
    ],
    scss_source = './sass/**/*.scss',
    css_dest = './css',
    js_src = './js',
    js_dest = './js',
    concat_script_name = 'scripts.js'
    minify_suffix = '.min';

var gulp = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    watch = require( 'gulp-watch' ),
    //livereload = require( 'gulp-livereload' ),
    cssnano = require('gulp-cssnano'),
    jshint = require( 'gulp-jshint' ),
    stylish = require( 'jshint-stylish' ),
    gulpconcat = require('gulp-concat'),
    uglify = require( 'gulp-uglify' ),
    rename = require( 'gulp-rename' ),
    //notify = require( 'gulp-notify' ),
    //include = require( 'gulp-include' ),
    sass = require( 'gulp-sass' ),
    gcmq = require('gulp-group-css-media-queries'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer-core'),
    browserSync = require('browser-sync').create();

var onError = function( err ) {
  console.log( 'An error occurred:', err.message );
  this.emit( 'end' );
};

gulp.task( 'scss', function() {
  return gulp.src( scss_source )
    .pipe( plumber( { errorHandler: onError } ) )
    .pipe( sass() )
    // clean up media queries
    .pipe( gcmq() )
    .pipe( postcss([ autoprefixer({ browsers: ['last 5 versions'] }) ]) )
    .pipe( sourcemaps.init())
    .pipe( cssnano() )
    .pipe( rename( { suffix: minify_suffix } ) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest( css_dest ) )
    .pipe( browserSync.stream() );
    //.pipe( livereload() );
} );

gulp.task('scripts', function() {
  return gulp.src(scripts)
    .pipe( jshint() )
    .pipe( jshint.reporter(stylish) )
    .pipe( gulpconcat( concat_script_name ) )
    .pipe( gulp.dest( js_dest ) )
    .pipe( rename({suffix: minify_suffix}) )
    .pipe( uglify())
    .pipe( gulp.dest( js_dest ) )
    .pipe( browserSync.stream() );
    //.pipe( livereload() );
});

gulp.task( 'watch', function() {

  browserSync.init({
      server: "./",
      //proxy: "localhost:8888/site-name"
  });

  //livereload.listen();

  gulp.watch( scss_source, [ 'scss' ] );
  gulp.watch( js_src + '/**/*.js', [ 'scripts' ] );
  gulp.watch( './**/*.php' ).on( 'change', function( file ) {
    //livereload.changed( file );
    browserSync.reload
  } );
  gulp.watch( './**/*.html' ).on( 'change', function( file ) {
    //livereload.changed( file );
    browserSync.reload
  } );
} );

gulp.task( 'default', [ 'scss', 'watch' ], function() {
	console.log('running');
} );
