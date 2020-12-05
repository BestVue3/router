module.exports =
    process.env.NODE_ENV === 'production'
        ? require('./dist/umd/pvue-router.production.min.js')
        : require('./dist/umd/pvue-router.development.js')
