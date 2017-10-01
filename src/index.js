const { build } = require('gluegun')

module.exports = async (argv) => {
  // setup the runtime
  build()
    .brand('solidarity')
    .src(__dirname)
    .create()
    .run(argv)
}
