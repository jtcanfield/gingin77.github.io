module.exports = {
    entry: './js/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(svg|gif|png|eot|woff|ttf)$/,
                loaders: [
                    'url-loader'
                ]
            },
            
        ]
    }
}
