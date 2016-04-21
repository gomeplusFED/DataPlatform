var webpack = require('webpack');
var pwd = __dirname;
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
            pwd + '/src/js/lib/vuex.min.js',
            pwd + '/src/js/lib/jquery.min.js',
            pwd + '/src/js/lib/bootstrap.min.js',
            pwd + '/src/js/lib/metisMenu.min.js',
            pwd + '/src/js/lib/moment.min.js',
            pwd + '/src/js/lib/datePicker.min.js',
            pwd + '/src/js/lib/jquery-table.min.js',
            'echarts/lib/echarts',
            'echarts/lib/chart/bar',
            'echarts/lib/chart/line',
            'echarts/lib/chart/pie',
            'echarts/lib/component/legend',
            'echarts/lib/component/tooltip',
        ]
    },
    output: {
        path: './dist/js',
        filename: '[name].min.js'
    },
    module: {
        loaders: [{
            test: /.js$/,
            loader: 'jsx-loader?harmony'
        }, {
            test: /.vue$/,
            loader: 'vue-loader'
        }]
    },
    plugins: [vendorPlugin],
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            'Vue': pwd + '/src/js/lib/vue.min.js',
            'jQuery': pwd + '/src/js/lib/jquery.min.js',
            '$': pwd + '/src/js/lib/jquery.min.js',
            'utils': pwd + '/src/js/utils/index.js',
            'Vuex': pwd + '/src/js/lib/vuex.min.js'
        }
    },
};

module.exports = webpackConfig;