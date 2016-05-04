"use strict";

module.exports = function (config) {
    var isCI = process.env['CI'];

    var baseConfig = {
        frameworks: ['mocha', 'sinon', 'chai'],

        files: [
            'tests/**/*.js'
        ],

        preprocessors: {
            'tests/**/*.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel'
                }]
            }
        },

        webpackMiddleware: {
            noInfo: true
        },

        reporters: [
            'dots'
        ],

        // web server port
        port: 8081,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers.
        browsers: [
            'Firefox',
            'Chrome'
        ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 120000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    };

    if (isCI) {
        // Open Sauce config.
        baseConfig.sauceLabs = {
            testName: 'snabbdom-virtualize unit tests',
            recordScreenshots: false
        };
        baseConfig.customLaunchers = {
            'SL_Chrome': {
                base: 'SauceLabs',
                platform: 'OS X 10.11',
                browserName: 'chrome'
            },
            'SL_Firefox': {
                base: 'SauceLabs',
                platform: 'OS X 10.11',
                browserName: 'firefox'
            },
            'SL_Edge': {
                base: 'SauceLabs',
                platform: 'Windows 10',
                browserName: 'microsoftedge'
            },
            'SL_IE_9': {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                version: '9.0',
                platform: 'Windows 7'
            },
            'SL_Safari_9': {
                base: 'SauceLabs',
                browserName: 'safari',
                version: '9.0',
                platform: 'OS X 10.11'
            }
        };
        baseConfig.reporters.push('saucelabs');
        baseConfig.browsers = Object.keys(baseConfig.customLaunchers);
    }

    config.set(baseConfig);
}
