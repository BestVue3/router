module.exports = process.env.DISABLE_BABEL
    ? {}
    : {
          presets: ['@vue/cli-plugin-babel/preset'],
          plugins: ['babel-plugin-dev-expression'],
      }
