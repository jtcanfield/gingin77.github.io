let webpack = require('webpack');

module.exports = {
    entry: './js/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(svg|gif|png|eot|woff|woff2|ttf)$/,
                loaders: [
                    'url-loader'
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: false, // webpack@1.x
                            disable: false, // webpack@2.x and newer
                        },
                    },
                ],
            }
        ]
    }
}
