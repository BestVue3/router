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

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const resolvePlugin = resolve({
    mainFields: ['module', 'main', 'jsnext:main', 'browser'],
    extensions,
})

module.exports = function({ watch }) {
    return {
        input: 'lib/index.ts',
        output: {
            file: `dist/index.js`,
            format: 'esm',
            sourcemap: false,
        },
        external: ['history', 'vue'],
        // acornInjectPlugins: [jsx()],
        plugins: [
            // typescript(),
            tsc({ build: true, watch }),
            resolvePlugin,
            babel({
                exclude: /node_modules/,
                presets: [['@babel/preset-env', { loose: true }]],
                plugins: [
                    ['@vue/babel-plugin-jsx', { mergeProps: false }],
                    'babel-plugin-dev-expression',
                ],
            }),
            compiler(),
        ],
    }
}
