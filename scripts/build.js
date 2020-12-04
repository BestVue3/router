const path = require('path')
const { fileURLToPath } = require('url')
const { execSync } = require('child_process')
const copy = require('copyfiles')

// const dirname = path.dirname(fileURLToPath(import.meta.url))

const config = path.resolve(__dirname, 'rollup.config.js')

// execSync(`rollup -c ${config}`, {
//     env: process.env,
//     stdio: 'inherit',
// })

copy(['.tsc-output/*.d.ts', 'types'], { up: true }, (...args) => {
    console.log(...args)
})
