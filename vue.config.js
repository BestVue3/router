/* eslint-disable */

const path = require('path')

module.exports = {
    chainWebpack(chain) {
        chain.module
            .rule('markdown')
            .test(/\.md$/)
            .use('md')
            .loader(path.resolve(__dirname, 'src/webpack/markdown-loader.js'))
    },
}
