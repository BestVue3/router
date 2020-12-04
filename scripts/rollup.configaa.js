import jsx from 'acorn-jsx'
import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import compiler from '@ampproject/rollup-plugin-closure-compiler'
// import copy from 'rollup-plugin-copy'
import nodeResolve from '@rollup/plugin-node-resolve'
import prettier from 'rollup-plugin-prettier'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'

// import tsc from './tsc-plugin.js'

const PRETTY = !!process.env.PRETTY
const SOURCE_DIR = 'lib'
const OUTPUT_DIR = 'dist'

export default function({ watch }) {
    const input = `${SOURCE_DIR}/index.ts`
    const vjsxPlugin = ['@vue/babel-plugin-jsx', { mergeProps: false }]
    const external = ['history', 'vue']
    const outputName = 'pvue-router'
    const libName = 'PVueRouter'
    const extensions = ['.js', '.jsx', '.ts', '.tsx']
    const resolvePlugin = resolve({
        mainFields: ['module', 'main', 'jsnext:main', 'browser'],
        extensions,
    })

    // JS modules for bundlers
    const modules = [
        {
            input,
            output: {
                file: `${OUTPUT_DIR}/index.js`,
                format: 'esm',
                sourcemap: !PRETTY,
                // dir: 'dist',
            },
            external,
            // acornInjectPlugins: [jsx()],
            plugins: [
                typescript(),
                resolvePlugin,
                babel({
                    exclude: /node_modules/,
                    presets: [['@babel/preset-env', { loose: true }]],
                    plugins: [vjsxPlugin, 'babel-plugin-dev-expression'],
                }),
                compiler(),
            ].concat(PRETTY ? prettier({ parser: 'babel' }) : []),
        },
    ]

    // JS modules for <script type=module>
    const webModules = [
        {
            input,
            output: {
                file: `${OUTPUT_DIR}/${outputName}.development.js`,
                format: 'esm',
                sourcemap: !PRETTY,
                // dir: 'dist',
            },
            external,
            // acornInjectPlugins: [jsx()],
            plugins: [
                typescript(),
                resolvePlugin,
                babel({
                    exclude: /node_modules/,
                    presets: ['@babel/preset-modules'],
                    plugins: [vjsxPlugin, 'babel-plugin-dev-expression'],
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify('development'),
                }),
                compiler(),
            ].concat(PRETTY ? prettier({ parser: 'babel' }) : []),
        },
        {
            input,
            output: {
                file: `${OUTPUT_DIR}/${outputName}.production.min.js`,
                format: 'esm',
                sourcemap: !PRETTY,
                // dir: 'dist',
            },
            // acornInjectPlugins: [jsx()],
            external,
            plugins: [
                typescript(),
                resolvePlugin,
                babel({
                    exclude: /node_modules/,
                    presets: [
                        [
                            '@babel/preset-modules',
                            {
                                // Don't spoof `.name` for Arrow Functions, which breaks when minified anyway.
                                loose: true,
                            },
                        ],
                    ],
                    plugins: [
                        vjsxPlugin,
                        'babel-plugin-dev-expression',
                        // [
                        //     'babel-plugin-transform-remove-imports',
                        //     {
                        //         test: /^prop-types$/,
                        //     },
                        // ],
                    ],
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                }),
                compiler(),
                terser({ ecma: 8, safari10: true }),
            ].concat(PRETTY ? prettier({ parser: 'babel' }) : []),
        },
    ]

    // UMD modules for <script> tags and CommonJS (node)
    const globals = [
        {
            input,
            output: {
                file: `${OUTPUT_DIR}/umd/${outputName}.development.js`,
                format: 'umd',
                sourcemap: !PRETTY,
                globals: { history: 'HistoryLibrary' },
                name: libName,
                // dir: 'dist',
            },
            // acornInjectPlugins: [jsx()],
            external,
            plugins: [
                typescript(),
                resolvePlugin,
                babel({
                    exclude: /node_modules/,
                    presets: [['@babel/preset-env', { loose: true }]],
                    plugins: [vjsxPlugin, 'babel-plugin-dev-expression'],
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify('development'),
                }),
                nodeResolve(), // for prop-types
                commonjs(), // for prop-types
                compiler(),
            ].concat(PRETTY ? prettier({ parser: 'babel' }) : []),
        },
        {
            input,
            output: {
                file: `${OUTPUT_DIR}/umd/${outputName}.production.min.js`,
                format: 'umd',
                sourcemap: !PRETTY,
                globals: { history: 'HistoryLibrary' },
                name: libName,
                // dir: 'dist',
            },
            external,
            // acornInjectPlugins: [jsx()],
            plugins: [
                typescript(),
                resolvePlugin,
                babel({
                    exclude: /node_modules/,
                    presets: [['@babel/preset-env', { loose: true }]],
                    plugins: [
                        vjsxPlugin,
                        'babel-plugin-dev-expression',
                        // [
                        //     'babel-plugin-transform-remove-imports',
                        //     {
                        //         test: /^prop-types$/,
                        //     },
                        // ],
                    ],
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                }),
                compiler(),
                terser(),
            ].concat(PRETTY ? prettier({ parser: 'babel' }) : []),
        },
    ]

    // Node entry points
    // const node = [
    //     {
    //         input: `${SOURCE_DIR}/node-main.js`,
    //         output: {
    //             file: `${OUTPUT_DIR}/main.js`,
    //             format: 'cjs',
    //         },
    //         plugins: [compiler()].concat(
    //             PRETTY ? prettier({ parser: 'babel' }) : [],
    //         ),
    //     },
    // ]

    return [...modules, ...webModules, ...globals]
}
