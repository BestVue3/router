/**
 * default test will use built files
 */

const usingSorce = !!process.env.SOURCE
const __DEV__ = process.env.__DEV__ === false ? false : true

module.exports = {
    testMatch: ['**/__tests__/**/*.+(ts|tsx)'],
    transform: {
        // '\\.js$': './jest-transformer.js',
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@$': !usingSorce ? '<rootDir>' : '<rootDir>/lib',
    },
    globals: {
        __DEV__,
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
