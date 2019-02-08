import { build } from 'gluegun'

module.exports = async (): Promise<void> => {
  const os = require('os')
  // setup the runtime
  const cli = build()
    .brand('solidarity')
    .src(__dirname)
    // local installs
    .plugins('./node_modules', { matching: 'solidarity-*', hidden: true })
    // global installs
    .plugins('/usr/local/lib/node_modules', { matching: 'solidarity-*', hidden: true }) // Darwin
    .plugins(`${os.homedir()}/.config/yarn/global/node_modules`, { matching: 'solidarity-*', hidden: true }) // Yarn/Darwin
    .plugins(`${process.env.appdata}/npm/node_modules`, { matching: 'solidarity-*', hidden: true }) // Windows
  // for testing - force load a local plugin
  // .plugin('../solidarity-react-native')

  // when a module parameter is passed we take the plugins from there, too
  const parsedArgs = require('yargs-parser')(process.argv.slice(2))
  const moduleName = parsedArgs.m || parsedArgs.module
  if (moduleName) cli.plugins(`./node_modules/${moduleName}/node_modules`, { matching: 'solidarity-*', hidden: true })

  cli.create().run()
}

export * from './types'
