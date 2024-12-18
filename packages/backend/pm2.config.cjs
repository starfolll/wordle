const process = require('node:process')

module.exports = {
  name: 'wordle-backend',
  script: 'main.ts',

  watch: false,

  interpreter: 'bun',
  env: {
    PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
  },
}
