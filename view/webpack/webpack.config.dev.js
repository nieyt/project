var webpack = require('webpack')
var baseConfig = require('./webpack.config.base')
var devConfig = Object.create(baseConfig)

devConfig.debug = true
devConfig.watch = true
devConfig.devtool = 'source-map'

devConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    }),
    new webpack.NoErrorsPlugin()
)

module.exports = devConfig
