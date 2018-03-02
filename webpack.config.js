module.exports = require('./config/webpack.dev.js');

// var webpack = require('webpack');
// var path = require('path');
// var ClosureCompilerPlugin = require('webpack-closure-compiler');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// module.exports = {
//     //devtool: false,
//     resolve: {
//         modules: ['bower_components', 'node_modules']
//     },
//     module: {
//         rules: [{
//                 test: /\.css$/,
//                 use: ExtractTextPlugin.extract({
//                     fallback: "style-loader",
//                     use: "css-loader"
//                 })
//             },
//             {
//                 test: /\.(png|svg|jpg|gif)$/,
//                 use: [
//                     'file-loader'
//                 ]
//             },
//             {
//                 test: /\.(woff|woff2|eot|ttf|otf)$/,
//                 use: [
//                     'file-loader'
//                 ]
//             }, {
//                 test: require.resolve("datatables"),
//                 use: 'exports-loader?$.fn.dataTable=$.fn.dataTable'
//             },
//             {
//                 test: require.resolve("angular-datatables"),
//                 use: 'imports-loader?$.fn.dataTables = $.fn.dataTables'
//             }
//         ]
//     },
//     context: __dirname + '/public',
//     entry: {
//         app: './app.module/app.js',
//         vendor: [
//             'jquery',
//             './assets/js/libs/jquery-ui.js',
//             //'./assets/js/vendor/modernizr-2.8.3.min.js',
//             './assets/js/vendor/bootstrap.min.js',
//             './assets/js/libs/cascadingDivs.js',
//             './assets/js/libs/angular.min.js',
//             './assets/js/libs/angular-resource.min.js',
//             './assets/js/libs/angular-sanitize.min.js',
//             './assets/js/libs/angular-ui-router.min.js',
//             './assets/js/libs/ui-bootstrap-tpls.min.js',
//             //  './assets/js/main.js',
//             './assets/js/libs/ag-grid.js',
//             '../bower_components/angular-simple-logger/dist/angular-simple-logger.js',
//             '../bower_components/lodash/lodash.js',
//             '../bower_components/angular-google-maps/dist/angular-google-maps.js',
//             //'../bower_components/async/dist/async.min.js',
//             '../bower_components/ng-file-upload/ng-file-upload.js',
//             '../bower_components/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
//             '../bower_components/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.js',
//             //'../bower_components/angular-input-masks/angular-input-masks-standalone.min.js',
//             '../bower_components/dragular/dist/dragular.js',
//             // './assets/js/libs/datatables.min.js',
//             // './assets/js/libs/dataTables.responsive.min.js',
//             // './assets/js/libs/buttons.colVis.min.js',
//             // './assets/js/libs/buttons.flash.min.js',
//             // './assets/js/libs/buttons.html5.min.js',
//             // './assets/js/libs/buttons.print.min.js',

//             // './assets/js/libs/dataTables.buttons.min.js',
//             // './assets/js/libs/angular-datatables.buttons.min.js',
//             //'./assets/js/libs/angular-datatables.columnfilter.js',
//             //'./assets/js/libs/angular-datatables.min.js',
//             //'angular-datatables',
//             // './assets/js/libs/date-euro.js',
//             './assets/js/libs/rzslider.js',
//             // './assets/js/libs/vfs_fonts.js',
//             './assets/js/libs/xeditable.js',
//             '../bower_components/angular-spinkit/build/angular-spinkit.min.js',
//             '../bower_components/re-tree/re-tree.js',
//             '../bower_components/ng-device-detector/ng-device-detector.js',
//             '../bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
//             //'./assets/js/libs/ckeditor.js',
//             '../node_modules/angular-ckeditor/angular-ckeditor.js',
//             './assets/js/libs/jquery.flip.min',
//             './assets/js/vendor/ticker.js',
//             //'./assets/js/vendor/zingchart.min.js,'
//             'zingchart',
//             'ag-grid'
//         ]
//     },
//     watch: true,
//     output: {
//         filename: '[name].bundle.js',
//         path: __dirname + '/public/bundles'
//     },
//     plugins: [
//         new webpack.optimize.CommonsChunkPlugin({
//             name: ["app", "vendor"]
//         }),
//         new webpack.optimize.UglifyJsPlugin({
//             test: /\.js$/
//         }),
//         new ExtractTextPlugin("styles.bundle.css"),
//         new OptimizeCssAssetsPlugin({
//             assetNameRegExp: /\.css$/g,
//         }),
//         new webpack.ProvidePlugin({
//             $: 'jquery',
//             jQuery: 'jquery',
//             '$.fn.dataTable': './assets/js/libs/datatables.min.js',
//         })
//     ]
// };