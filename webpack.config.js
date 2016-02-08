"use strict";

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        library: 'index.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    externals: [
        'snabbdom/h',
        'snabbdom/vnode'
    ]
};
