module.exports =
    process.env.NODE_ENV === 'production'
        ? require('./dist/umd/react-router.production.min.js')
        : require('./dist/umd/react-router.development.js')
