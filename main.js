module.exports =
    process.env.NODE_ENV === 'production'
        ? require('./dist/bv3-router.cjs.prod.js')
        : require('./dist/bv3-router.cjs')
