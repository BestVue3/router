const { spawn } = require('child_process')
const { promises } = require('fs')
const path = require('path')
const { fileURLToPath } = require('url')

const fsp = promises

// const dirname = path.dirname(fileURLToPath(import.meta.url))
// const repoDir = path.resolve(dirname, '../..')
const tscOutputDir = path.resolve(__dirname, '..', '.tsc-output')

function tsc(args = []) {
    return spawn('tsc', [...args, '--project', 'tsconfig.build.json'], {
        stdio: 'inherit',
    })
}

module.exports = function tscPlugin({ build, watch } = {}) {
    let promise = Promise.resolve()

    if (build) {
        promise = new Promise((accept, reject) => {
            tsc().on('exit', code => {
                code === 0 ? accept() : reject(new Error('tsc build failed'))
            })
        })
    }

    if (build && watch) {
        promise.then(() => {
            tsc(['--watch', '--preserveWatchOutput'])
        })
    }

    return {
        name: 'tsc',
        buildStart() {
            // Wait until tsc is finished
            return promise
        },
        async resolveId(id, importer) {
            /**
             * 把入口文件解析到.tsc-output
             */
            if (!importer && /\.tsx?$/.test(id)) {
                // This is an entry point. Get it from .tsc-output
                const jsFile = id
                    .replace(/^lib/, tscOutputDir)
                    .replace(/\.tsx?$/, '.js')

                // try {
                //     // Emit the .d.ts file too (if it exists)...
                //     const dtsFile = jsFile.replace(/\.js$/, '.d.ts')
                //     const fileName = path.basename(dtsFile)
                //     const source = await fsp.readFile(dtsFile, 'utf-8')
                //     this.emitFile({ type: 'asset', fileName, source })
                // } catch (error) {
                //     // No .d.ts file... carry on
                // }

                return jsFile
            }

            return null
        },
        async load(id) {
            if (id.startsWith(tscOutputDir)) {
                try {
                    // Grab the .map too (if it exists)...
                    const map = await fsp.readFile(id + '.map', 'utf-8')
                    const code = await fsp.readFile(id, 'utf-8')
                    return { code, map }
                } catch (error) {
                    // Defer to normal filesystem loader
                    return null
                }
            }

            return null
        },
    }
}
