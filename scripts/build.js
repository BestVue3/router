const path = require('path')
const { fileURLToPath } = require('url')
const { execSync } = require('child_process')

// const dirname = path.dirname(fileURLToPath(import.meta.url))

const config = path.resolve(__dirname, 'rollup.config.js')

execSync(`rollup -c ${config}`, {
    env: process.env,
    stdio: 'inherit',
})
