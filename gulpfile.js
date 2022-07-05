import gulp from 'gulp';
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
import BS from 'browser-sync';
import minifyJS from 'gulp-uglify';
import clean from 'gulp-clean';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import concat from 'gulp-concat'
import imagemin from 'gulp-imagemin';

const sass = gulpSass(nodeSass);
const browserSync = BS.create();
const { src, dest, task, watch, series } = gulp;

const clear = () => src('dist/*', {read: false})
    .pipe(clean({force: true}));

const buildCss = () => src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({
        env: ['last 2 versions'],
        cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('dist/styles'));

const buildJs = () => src('/src/scripts/**/*.js')
    .pipe(minifyJS())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('/dist/scripts/'));

const minifyIMG = () => src('src/images/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/images/'));

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    watch('src/**/*').on('all', series(buildCss, buildJs, browserSync.reload));
}

gulp.task('dev', watcher)
gulp.task('build', series(clear, buildCss, buildJs, minifyIMG))
