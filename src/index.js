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
    // for testing
    .plugins('/Users/gantman/Documents/Projects/rn/node_packages/', { matching: 'solidarity-react-*', hidden: true })
    .plugins('..', { matching: 'solidarity-react-*', hidden: true })
    .create()
    .run()
}
