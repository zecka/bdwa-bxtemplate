var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var browserSync = require('browser-sync').create();
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const runSequence = require('run-sequence');

var devUrl = "http://localhost:8888/__FRONTEND/2eme-annee/02-gulp/"
var paths = {
    styles: {
        src: 'assets/dev/scss/**/*.scss',
        dest: './assets/build/css/'
    },
    scripts: {
        src: {
            custom: 'assets/dev/js/custom/**/*.js',
            vendors: 'assets/dev/js/vendors/**/*.js',
        },
        dest: {
            custom: 'assets/build/js/custom',
            vendors:'assets/build/js/vendors',
        }
    },
    icons:{
        src: 'assets/dev/icons/**/*.svg',
        dest: 'assets/build/fonts/icons'
    },
    images: {
        src: 'assets/dev/img/**',
        dest: 'assets/build/img'
    },
};

gulp.task('hello',function(){
    console.log('helloworld');
})

gulp.task('imagemin', () =>
	gulp.src(paths.images.src) // On selectionne les sources
		.pipe($.imagemin()) // On les compresse
		.pipe(gulp.dest(paths.images.dest)) // on les enregistre
);

gulp.task('scss', function () {
    console.log('Run scss tasks');
    return gulp
        .src(paths.styles.src)
        .pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.sourcemaps.write())
        .pipe($.autoprefixer({browsers: ['last 2 versions']}))
        .pipe(
			browserSync.reload({
				stream: true
			})
		)
        .pipe(gulp.dest(paths.styles.dest))
        .pipe($.rename({basename: 'styles'}))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglifycss())
        .pipe(gulp.dest(paths.styles.dest))
        
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts.src.custom)
        .pipe(gulp.dest(paths.scripts.dest.custom + '/custom_separated'))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe($.concat('main.js'))
        .pipe(gulp.dest(paths.scripts.dest.custom))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglify())
        .pipe(gulp.dest(paths.scripts.dest.custom))
        .pipe(
			browserSync.reload({
				stream: true
			})
		)
        .pipe($.debug({ 'title': 'custom scripts done' }))
});

var runTimestamp = Math.round(Date.now()/1000);
var fontName = 'icons';
gulp.task('iconfont', function(){
  return gulp.src([paths.icons.src])
    .pipe(iconfontCss({
      fontName: fontName,
      targetPath: '../../../dev/scss/fonts/_icons.scss',
      fontPath: '../fonts/icons/',
      cssClass: 'icon',
    }))
    .pipe(iconfont({
		fontName: fontName,
		formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
		normalize: true,
		appendCodepoints: true,
		prependUnicode: false,
		fontHeight: 1024,
		timestamp: runTimestamp
     }))
    .pipe(gulp.dest(paths.icons.dest));
});

gulp.task('watch', function() {
    browserSync.init({
        //proxy: devUrl
        server: {
            baseDir: "./"
        }
    });
    
    browserSync.watch('assets/dev/icons/').on('change', gulp.series('iconfont', browserSync.reload));
    browserSync.watch(paths.styles.src).on('change', gulp.series('scss'));
    browserSync.watch(paths.scripts.src.custom).on('change', gulp.series('scripts'));
    browserSync.watch('index.html').on('change', gulp.series(browserSync.reload));
 });

gulp.task('build', gulp.series('scripts', 'iconfont', 'scss', 'imagemin'));