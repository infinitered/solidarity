const { build } = require('gluegun')

module.exports = async () => {
  // setup the runtime
  build()
    .brand('solidarity')
    .src(__dirname)
    // It might also be worth checking global
    // `npm config get prefix` returns '/usr/local'
    // global npm is stored /usr/local/lib/node_modules
    .plugins('./node_modules', { matching: 'solidarity-*', hidden: true })
    // for testing - force load a plugin
    // .plugin('../solidarity-react-native')
    .create()
    .run()
}
