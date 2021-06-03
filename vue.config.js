// vue.config.js
const TerserPlugin = require('terser-webpack-plugin');
const isProd = process.env.NODE_ENV === "staging"
module.exports = {
    devServer: {
        proxy: 'https://mmb.irbbarcelona.org/webdev/slim/3dRS/api/v1'
    },
    configureWebpack: {
        optimization: {
            minimize: true,
            minimizer: isProd ? [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        },
                        output: {
                            comments: false
                        }
                    }
                })
            ] : []
        }
    },
    //publicPath: '/webdev/slim/3dRS/'
    publicPath: process.env.NODE_ENV === 'staging'
        ? '/webdev/slim/3dRS/'
        : '/3dRS/'
}