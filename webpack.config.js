const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require("autoprefixer");
const globImporter = require('node-sass-glob-importer');
const ImageminPlugin = require("imagemin-webpack");

var webpack = require('webpack');

let fireParams = require('./webpack.fire-config.js');       // Конфигурация сборки
let fireFunc = require('./webpack.fire-template.js');       // Дополнительные функции сборщика
var notAddHash = require('./src/img/not-add-hash');

let entryPoints = {};                                       // все точки входа

// основные точки входа скриптов
let mainEntry = fireFunc.getMainEntry(fireParams);
if(mainEntry){
    Object.assign(entryPoints, mainEntry);
}

// точки входа для страниц
let pagesEntry = fireFunc.getPagesEntry(fireParams);
if(pagesEntry){
    Object.assign(entryPoints, pagesEntry);
}

// Шаблоны страниц. Сейчас отключенны
let htmlPagesPlugins = []; //fireFunc.generateHtmlPlugins(fireParams)

module.exports = {
    entry: entryPoints,
    output: {
        filename: (chunkData) => {
            return 'js/[name].js';
        },
        chunkFilename: 'modules/js/[hash].[name].js',
        path: path.resolve(__dirname, fireParams.distDir),
        publicPath: '/local/assets/dist/',
        pathinfo: true,
    },
    optimization: {
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(png|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: function (file) {
                                let relativeDirectory = file.replace(__dirname,'').replace(fireParams.imageSrcDir,'').replace(/([^\/]*)(\.[a-zA-Z0-9]*)$/,'').replace(/\/img/,'').replace(/^\/src\//,'');
                                if(notAddHash.includes(relativeDirectory))
                                    return relativeDirectory+'[name].[ext]';
                                else
                                    return relativeDirectory+'[name][hash].[ext]';
                            },
                            outputPath: 'img/',
                        },
                    },
                ],
            },
            {
                test: /\.(gif|jpe?g|svg|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: function (file) {
                                let relativeDirectory = file.replace(__dirname,'').replace(fireParams.imageSrcDir,'').replace(/([^\/]*)(\.[a-zA-Z0-9]*)$/,'').replace(/\/img/,'').replace(/^\/src\//,'');
                                if(notAddHash.includes(relativeDirectory))
                                    return relativeDirectory+'[name].[ext]';
                                else
                                    return relativeDirectory+'[name][hash].[ext]';
                            },
                            outputPath: 'img/',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 100
                            },
                            svgo: {
                                enabled: false,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
/*                            webp: {
                                quality: 100
                            }*/
                        }
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer()
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            debug: false,
                            root: path.resolve(__dirname, './src'),
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            //importer: globImporter(),
                            outputStyle: 'compressed',
                            sourceMap: true,
                            includePaths: [
                                './src'
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: ['raw-loader']
            },
            {
                test: /\.twig$/,
                use: [
                    'raw-loader',
                    {
                        loader: 'twig-html-loader',
                        options: {
                            data: {
                                fuck: true,
                                kill: 'y'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.modernizrrc$/,
                loader: 'modernizr-loader!json-loader',
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*'],
            cleanStaleWebpackAssets: false
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'modules/css/[hash].[name].css',
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}],
            },
            canPrint: true
        }),
        new CssoWebpackPlugin({
            restructure: false,
        })
    ].concat(htmlPagesPlugins),
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    resolve: {
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc'),
        }
    }
};