import { build } from 'gluegun'

module.exports = async (): Promise<void> => {
  // setup the runtime
  build()
    .brand('solidarity')
    .src(__dirname)
    // local installs
    .plugins('./node_modules', { matching: 'solidarity-*', hidden: true })
    // global installs
    .plugins('/usr/local/lib/node_modules', { matching: 'solidarity-*', hidden: true })
    // for testing - force load a local plugin
    // .plugin('../solidarity-react-native')
    .create()
    .run()
}

export * from './types'
