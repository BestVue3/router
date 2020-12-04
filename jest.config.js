// module.exports = {
//     preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
//     transform: {
//         '^.+\\.vue$': 'vue-jest',
//     },
//     globals: {
//         __DEV__: true,
//     },
// }

module.exports = {
    testMatch: ['**/__tests__/**/*.+(ts|tsx)'],
    transform: {
        // '\\.js$': './jest-transformer.js',
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    globals: {
        __DEV__: true,
        'ts-jest': {
            babelConfig: {
                presets: [['@babel/preset-env']],
                plugins: [
                    'babel-plugin-dev-expression',
                    '@vue/babel-plugin-jsx',
                ],
            },
        },
    },
}
