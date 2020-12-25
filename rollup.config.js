// copy from vue-next

import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'

const resolve = p => path.resolve('.', p)
const pkg = require(resolve(`package.json`))

// ensure TS checks only once for each build
let hasTSChecked = false

const name = 'bv3-router'

const outputConfigs = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: `es`,
    },
    'esm-browser': {
        file: resolve(`dist/${name}.esm-browser.js`),
        format: `es`,
    },
    cjs: {
        file: resolve(`dist/${name}.cjs.js`),
        format: `cjs`,
    },
    global: {
        file: resolve(`dist/${name}.global.js`),
        format: `iife`,
    },
}

const globalName = 'Bv3Router'
const formats = ['esm-bundler', 'cjs', 'global', 'esm-browser']
const packageConfigs = []
formats.forEach(format => {
    packageConfigs.push(createConfig(format, outputConfigs[format]))
    if (format === 'cjs') {
        packageConfigs.push(createProductionConfig(format))
    }
    if (/^(global|esm-browser)(-runtime)?/.test(format)) {
        packageConfigs.push(createMinifiedConfig(format))
    }
})

export default packageConfigs

function createConfig(format, output, plugins = []) {
    if (!output) {
        console.log(require('chalk').yellow(`invalid format: "${format}"`))
        process.exit(1)
    }

    output.sourcemap = true
    // Do not generate code to support live bindings
    output.externalLiveBindings = false

    const isProductionBuild =
        process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
    const isBundlerESMBuild = /esm-bundler/.test(format)
    const isBrowserESMBuild = /esm-browser/.test(format)
    const isGlobalBuild = /global/.test(format)

    if (isGlobalBuild) {
        output.name = globalName //packageOptions.name
    }

    const shouldEmitDeclarations = !hasTSChecked

    const tsPlugin = ts({
        check: process.env.NODE_ENV === 'production' && !hasTSChecked,
        tsconfig: path.resolve(__dirname, 'tsconfig.build.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        // if not set, the declaration files will be put in the root of dist
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
            compilerOptions: {
                sourceMap: output.sourcemap,
                declaration: shouldEmitDeclarations,
                declarationDir: 'types',
                declarationMap: shouldEmitDeclarations,
            },
            exclude: ['**/__tests__', 'test-dts', 'src', '__tests__'],
        },
    })
    // we only need to check TS and generate declarations once for each build.
    // it also seems to run into weird issues when checking multiple times
    // during a single build.
    hasTSChecked = true

    const entryFile = resolve('lib/index.ts')

    const external = [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        /@babel\/runtime/,
    ]

    // the browser builds of @vue/compiler-sfc requires postcss to be available
    // as a global (e.g. http://wzrd.in/standalone/postcss)
    // we have no css files
    // output.globals = {
    //     postcss: 'postcss',
    // }

    const nodePlugins =
        format !== 'cjs'
            ? [
                  require('@rollup/plugin-node-resolve').nodeResolve({
                      preferBuiltins: true,
                  }),
                  require('@rollup/plugin-commonjs')({
                      sourceMap: false,
                  }),
                  require('rollup-plugin-node-builtins')(),
                  require('rollup-plugin-node-globals')(),
              ]
            : []

    return {
        input: entryFile,
        // Global and Browser ESM builds inlines everything so that they can be
        // used alone.
        external,
        plugins: [
            // json({
            //   namedExports: false
            // }),
            tsPlugin,
            babel({
                // actually nothing bundled
                babelHelpers: 'bundled',
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            loose: true,
                            targets: {
                                esmodules:
                                    isBrowserESMBuild || isBundlerESMBuild,
                            },
                        },
                    ],
                ],
                plugins: [['@vue/babel-plugin-jsx', { mergeProps: false }]],
                extensions: ['.ts', '.tsx'],
            }),
            replace({
                __DEV__: isBundlerESMBuild
                    ? // preserve to be handled by bundlers
                      `(process.env.NODE_ENV !== 'production')`
                    : // hard coded dev/prod builds
                      !isProductionBuild,
            }),
            ...nodePlugins,
            ...plugins,
        ],
        output,
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg)
            }
        },
        treeshake: {
            moduleSideEffects: false,
        },
    }
}

function createProductionConfig(format) {
    return createConfig(format, {
        file: resolve(`dist/${name}.${format}.prod.js`),
        format: outputConfigs[format].format,
    })
}

function createMinifiedConfig(format) {
    const { terser } = require('rollup-plugin-terser')
    return createConfig(
        format,
        {
            file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
            format: outputConfigs[format].format,
        },
        [
            terser({
                module: /^esm/.test(format),
                compress: {
                    ecma: 2015,
                    pure_getters: true,
                },
                safari10: true,
            }),
        ],
    )
}
