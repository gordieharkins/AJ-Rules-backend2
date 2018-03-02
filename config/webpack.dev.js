var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var webpack = require('webpack');

var path = require('path');
var ClosureCompilerPlugin = require('webpack-closure-compiler');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',
    watch: true,
    output: {
        filename: '[name].bundle.js', //filename: '[name].[hash].bundle.js'
        path: __dirname + './../public/bundles'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["app", "vendor"]
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     test: /\.js$/
        // }),
        new ExtractTextPlugin("styles.bundle.css"),
        // new OptimizeCssAssetsPlugin({
        //     assetNameRegExp: /\.css$/g,
        // }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            '$.fn.dataTable': './assets/js/libs/datatables.min.js',
        }),
        new HtmlWebpackPlugin({
            template: './templates/index.template.html',
            inject : false,
            filename: './../index.html',
        })
    ]

});
