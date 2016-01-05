var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    jade = require('gulp-jade'),
    sassdoc = require('sassdoc'),
    reload = browserSync.reload;

var src = {
    base: './',
    app: 'public',
    main: 'public/**/*.html',
    docs: 'public/dist/docs/*.html',
    scss: 'public/sass/**/*.scss',
    jade: 'public/jade/**/*.jade'
};

// Compiles Sass files into CSS
gulp.task('test', ['sassdoc','sass:compiles','sass:watch','resource','jade']);
gulp.task('min_build', ['sassdoc','sass:build','resource','jade']);

gulp.task('jade', function() {
    return gulp.src('./public/jade/**/*.jade')
        .pipe(jade({
            pretty: true
        })) // pip to jade plugin
        .pipe(gulp.dest('./public/dist/html')) // tell gulp our output folder
        .pipe(reload({ stream:true }));
});

// test Compiles sass
gulp.task('sass:compiles', function() {
    return gulp.src(['./public/sass/stylesheet.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/dist/css'))
        .pipe(reload({ stream:true }));
});
gulp.task('resource', function() {
    gulp.src('./public/sass/resource/**')
        .pipe(gulp.dest('./public/dist/resource'));
});
gulp.task('sass:watch', function () {
    browserSync({
        port: 80,
        server: {
            baseDir: [src.base, src.app]
        }
    });
    gulp.watch(src.jade, ['jade','resource']);
    gulp.watch(src.main).on('change', reload);
    gulp.watch(src.docs).on('change', reload);
    gulp.watch(src.scss, ['sass:compiles','resource','sassdoc']);
});

// build Compiles sass
gulp.task('sass:build', function() {
    return gulp.src(['./public/sass/stylesheet.scss'])
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/dist/css'))
});

// build Compiles jade
gulp.task('jade', function() {
    return gulp.src('./public/jade/**/*.jade')
        .pipe(jade({
            pretty: true
        })) // pip to jade plugin
        .pipe(gulp.dest('./public/dist/html')) // tell gulp our output folder
        .pipe(reload({ stream:true }));
});

// build sass doc
gulp.task('sassdoc', function () {

    var options = {
        dest: './public/dist/docs',
        verbose: true,
        display: {
            access: ["private","public"],
            alias: true,
            watermark: true
        },
        package: "./package.json",
        groups: {
            'undefined': 'general'
        },
        basePath: 'https://github.com/changgyun/template/tree/master/public/sass'
    };

    return gulp.src('./public/sass/**/*.scss')
        .pipe(sassdoc(options))
});