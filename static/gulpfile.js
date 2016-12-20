'use strict';
var gulp = require('gulp');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var header = require('gulp-header');
var clean = require('gulp-clean');
var gulpIf = require('gulp-if');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minimist = require('minimist');
var gutil = require("gulp-util");
var rev = require('gulp-rev-hash');
var path = require('path');
var plumber = require("gulp-plumber");

var pwd = __dirname;

// gulp --env=pro 压缩代码，直接执行gulp，不压缩代码
var argv = require('minimist')(process.argv.slice(2));
// var config = require('./config.json');

var rootPath = __dirname;

var vendorPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.min.js',
    minChunks: Infinity,
});
var webpackConfig = {
    entry: {
        DataPlatform: './src/js/app.js',
        vendor: [
            pwd + '/src/js/lib/vue.min.js',
            pwd + '/src/js/lib/vue2.min.js',
            pwd + '/src/js/lib/vuex.min.js',
            pwd + '/src/js/lib/jquery.min.js',
            pwd + '/src/js/lib/bootstrap.min.js',
            pwd + '/src/js/lib/metisMenu.min.js',
            pwd + '/src/js/lib/moment.min.js',
            pwd + '/src/js/lib/datePicker.min.js',
            pwd + '/src/js/lib/jquery-table.min.js',
            'vue-router',
            'echarts/lib/echarts',
            'echarts/lib/chart/bar',
            'echarts/lib/chart/line',
            'echarts/lib/chart/pie',
            'echarts/lib/component/legend',
            'echarts/lib/component/tooltip',
        ],
        addModule : "./src/js/app2.js",
        /*vendor2 : [
            pwd + '/src/js/lib/vue2.min.js',
            pwd + '/src/js/lib/vuex.min.js',
            pwd + '/src/js/lib/jquery.min.js',
            pwd + '/src/js/lib/bootstrap.min.js',
        ]*/
    },
    output: {
        filename: '[name].min.js'
    },
    module: {
        loaders: [{
            test: /.js$/,
            loader: 'babel',
            include: path.join(rootPath, './src'),
            exclude: path.join(rootPath, '../node_modules/')
        }, {
            test: /.vue$/,
            loader: 'vue'
        }]
    },
    plugins: [vendorPlugin],
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            'Vue': pwd + '/src/js/lib/vue.min.js',
            'Vue2': pwd + '/src/js/lib/vue2.min.js',
            'jQuery': pwd + '/src/js/lib/jquery.min.js',
            '$': pwd + '/src/js/lib/jquery.min.js',
            'utils': pwd + '/src/js/utils/index.js',
            'Vuex': pwd + '/src/js/lib/vuex.min.js',
            'common': pwd + '/src/js/component/common',
            'store': pwd + '/src/js/store/store.js',
            'actions': pwd + '/src/js/store/actions.js',
            'filter': pwd + '/src/js/filter/index.js'
        }
    },
};

// 公共头部
// var banner = ['/**',
//     ' * <%= config.name %> - <%= config.description %>',
//     ' * @version v<%= config.version %>',
//     ' */',
//     ''
// ].join('\n');

gulp.task('clean', function() {
    return gulp
        .src(['./dist/*'], { read: false })
        .pipe(clean({ force: true }))
});

gulp.task('js', function() {
    if (argv.env === 'pro') {
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));
    }
    return gulp
        .src(['./src/js/app.js' , './src/js/app2.js'])
        .pipe(plumber())
        .pipe(gulpWebpack(webpackConfig))
        // .pipe(gulpIf(argv.env == 'pro', header(banner, { config: config })))
        .pipe(gulp.dest('./dist/js/'))
})

gulp.task('css', function() {
    return gulp
        .src('./src/css/*.css')
        .pipe(concat('all.js'))
        .pipe(gulpIf(argv.env == 'pro', minifyCss()))
        // .pipe(gulpIf(argv.env == 'pro', header(banner, { config: config })))
        .pipe(rename('DataPlatform.min.css'))
        .pipe(gulp.dest('./dist/css/'))
})

gulp.task('img', function() {
    return gulp
        .src('./src/img/*')
        .pipe(gulp.dest('./dist/img/'))
})

gulp.task('font', function() {
    return gulp
        .src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts/'))
})

gulp.task('rev', function() {
    return gulp
        .src(['../views/include/header.html', '../views/include/footer.html' , "../views/include/addModule.html"])
        .pipe(gulpIf(argv.env == 'pro', rev({
            assetsDir: path.join(pwd)
        })))
        .pipe(gulp.dest('../views/include/'));
})

gulp.task('watch', function() {
    if (argv.env != 'pro') {
        webpackConfig.watch = true;
        webpackConfig.devtool = 'inline-source-map';
    }
    gulp.start('js', 'css', 'img', 'font');
    gulp.watch('./src/css/*', ['css']);
    gulp.watch('./src/img/*', ['img']);
})

gulp.task('build', ['js', 'css', 'img', 'font']);

gulp.task('default', ['build'], function() {
    gulp.start('rev');
});
