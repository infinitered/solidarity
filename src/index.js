const { build } = require('gluegun')

module.exports = async () => {
  // setup the runtime
  build()
    .brand('solidarity')
    .src(__dirname)
    .create()
    .run()
}
