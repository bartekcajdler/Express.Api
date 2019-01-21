const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const OUTPUT = './dist';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('scripts-debug', () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write({ sourceRoot: "../src" }))
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('package', function() {
    return gulp.src(['package.json'])
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('start', ['scripts', 'assets', 'watch'], function (done) {
    nodemon({
        script: 'dist/index.js',
        ext: 'js',
        watch: ['dist'],
        env: { 'NODE_ENV': 'development' },
        done: done
    });
});

gulp.task('start:debug', ['scripts-debug', 'assets', 'watch'], function (done) {
    nodemon({
        script: 'dist/index.js',
        ext: 'js',
        watch: ['dist'],
        env: { 'NODE_ENV': 'development' },
        done: done
    });
});

gulp.task('build', ['scripts', 'assets', 'package']);

