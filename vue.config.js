// vue.config.js
module.exports = {
    devServer: {
        proxy: 'https://mmb.irbbarcelona.org/webdev/slim/3dRS/api/public'
    },
    //publicPath: '/webdev/slim/3dRS/'
    publicPath: process.env.NODE_ENV === 'staging'
        ? '/webdev/slim/3dRS/'
        : '/3dRS/'
}