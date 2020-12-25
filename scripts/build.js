/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "dom":
yarn build dom

# specify the format to output
yarn build core --formats cjs
```
*/

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

const args = require('minimist')(process.argv.slice(2))
// const targets = args._
const formats = args.formats || args.f
const isRelease = true // args.release
// const buildTypes = args.t || args.types || isRelease
// const buildAllMatching = args.all || args.a
// const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

run()

async function run() {
    if (isRelease) {
        // remove build cache for release builds to avoid outdated enum values
        await fs.remove(path.resolve(__dirname, '../node_modules/.rts2_cache'))
    }
    await build()
    console.log()
    checkSize()
    console.log()
}

async function build() {
    const root = path.join(__dirname, '..')
    const pkg = require(`${root}/package.json`)

    // only build published packages for release
    if (isRelease && pkg.private) {
        return
    }

    await fs.remove(`${root}/dist`)
    await fs.remove(`${root}/types`)

    const env = 'production'
    await execa(
        'rollup',
        [
            '-c',
            '--environment',
            [
                // `COMMIT:${commit}`,
                `NODE_ENV:${env}`,
                // `TARGET:${target}`,
                // formats ? `FORMATS:${formats}` : ``,
                // buildTypes ? `TYPES:true` : ``, // always build types
                // prodOnly ? `PROD_ONLY:true` : ``, // always build every version
                // sourceMap ? `SOURCE_MAP:true` : ``, // always build source map
            ]
                .filter(Boolean)
                .join(','),
        ],
        { stdio: 'inherit' },
    )
}

function checkSize() {
    // const pkgDir = path.resolve(`packages/${target}`)
    checkFileSize(`dist/bv3-router.global.prod.js`)
}

function checkFileSize(filePath) {
    if (!fs.existsSync(filePath)) {
        return
    }
    const file = fs.readFileSync(filePath)
    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
    const compressed = compress(file)
    const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
    console.log(
        `${chalk.gray(
            chalk.bold(path.basename(filePath)),
        )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`,
    )
}
