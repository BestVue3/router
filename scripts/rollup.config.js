const jsx = require('acorn-jsx')
const babel = require('rollup-plugin-babel')
const typescript = require('@rollup/plugin-typescript')
const commonjs = require('@rollup/plugin-commonjs')
const compiler = require('@ampproject/rollup-plugin-closure-compiler')
// const copy = require('rollup-plugin-copy')
const nodeResolve = require('@rollup/plugin-node-resolve')
const prettier = require('rollup-plugin-prettier')
const replace = require('@rollup/plugin-replace')
const { terser } = require('rollup-plugin-terser')
const resolve = require('rollup-plugin-node-resolve')
const tsc = require('./tsc-plugin')

const PRETTY = !!process.env.PRETTY
const OUTPUT_DIR = 'dist'
const OUTPUT_NAME = 'pvue-router'
const LIB_NAME = 'PVueRouter'

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const resolvePlugin = resolve({
    mainFields: ['module', 'main', 'jsnext:main', 'browser'],
    extensions,
})

module.exports = function({ watch }) {
    function createRollupConfig({
        format = 'esm',
        external = ['history', 'vue'],
        babelPresets = [['@babel/preset-env', { loose: true }]],
        babelPlugins = [
            ['@vue/babel-plugin-jsx', { mergeProps: false }],
            'babel-plugin-dev-expression',
        ],
        replacePlugin = null,
        terserPlugin = false,
        output = null,
        file = `${OUTPUT_DIR}/index.js`,
    }) {
        return {
            input: 'lib/index.ts',
            output: {
                file,
                format,
                sourcemap: !PRETTY,
                ...output,
            },
            external,
            // acornInjectPlugins: [jsx()],
            plugins: [
                // typescript(),
                tsc({ build: true, watch }),
                resolvePlugin,
                babel({
                    exclude: /node_modules/,
                    presets: babelPresets,
                    plugins: babelPlugins,
                }),
                ...(replacePlugin ? [replacePlugin] : []),
                compiler(),
                ...(terserPlugin ? [terser({ ecma: 8, safari10: true })] : []),
            ].concat(PRETTY ? prettier({ parser: 'babel' }) : []),
        }
    }

    return [
        // esm
        createRollupConfig({}),
        // web module development
        createRollupConfig({
            file: `${OUTPUT_DIR}/${OUTPUT_NAME}.development.js`,
            babelPresets: ['@babel/preset-modules'],
            replacePlugin: replace({
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
        }),
        // web module production
        createRollupConfig({
            file: `${OUTPUT_DIR}/${OUTPUT_NAME}.production.js`,
            babelPresets: [
                [
                    '@babel/preset-modules',
                    {
                        // Don't spoof `.name` for Arrow Functions, which breaks when minified anyway.
                        loose: true,
                    },
                ],
            ],
            replacePlugin: replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            terserPlugin: true,
        }),
        // umd development
        // createRollupConfig({
        //     file: `${OUTPUT_DIR}/umd/${OUTPUT_NAME}.development.js`,
        //     format: 'umd',
        //     output: {
        //         globals: { history: 'HistoryLibrary' },
        //         name: LIB_NAME,
        //     },
        // }),
    ]
}
