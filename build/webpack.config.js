const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const Visualizer = require('webpack-visualizer-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    entry: {
        app: './client/main.js',
        startpage: './client/start.js',
    },
    output: {
        path: path.resolve(__dirname, '../', 'public', 'dist'),
        publicPath: '/public/dist/',
        filename: '[name]-bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {sourceMap: !isProduction},
                    },
                    'less-loader',
                ],
            },
        ],
    },
    optimization: {
        // Automatically include all node_modules in a vendor chunk
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackBuildNotifierPlugin({
            title: 'Canvas',
            suppressSuccess: true,
            successSound: 'Tink',
            failureSound: 'Funk',
        }),
    ],
}

if (isProduction) {
    config.plugins.push(
        new Visualizer({filename: '../stats.html'}),
        new CompressionPlugin({
            filename: '[path].br[query]',
            test: /\.js(\?.*)?$/i,
            algorithm: 'brotliCompress',
            compressionOptions: {level: 11},
        }),
    )
}

module.exports = config
