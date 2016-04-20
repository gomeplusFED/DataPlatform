var webpack = require('webpack');

var fs = require('fs');
var path = require('path')

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

var webpackConfig = {
    cache: true,
    entry: [
        'webpack/hot/poll?1000',
        './app.js'
    ],
    output: {
        path: path.resolve(__dirname,'build'),
        filename: 'bundle.js'
    },
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    target: 'node',
    externals: nodeModules,
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ],
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015', 'stage-0'],
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.json']
    }
}


module.exports = webpackConfig;
