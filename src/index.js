const { isNil } = require('ramda')
const minimist = require('minimist')
const { build } = require('gluegun')
const { BRAND, configureRuntime } = require('./runtime')

/**
 * Runs solidarity.
 */
module.exports = async function run (argv) {
  // setup the runtime
  build()
    .brand('solidarity')
    .src(__dirname)
    .create()
    .run()

  //   // parse the command line for things gluegun doesn't want to do
  //   const commandLine = minimist(argv.slice(2))

  //   // such as --help
  //   const wantsHelp = commandLine.help || commandLine.h

  //   // let's run the command 🐇
    // context = await runtime.run()

  //   if (context.error) {
  //     // something didn't work right in the command
  //     print.debug(context.error)
  //   } else if (wantsHelp) {
  //     print.info(`${BRAND}`)
  //     printCommands(context)
  //   } else if (isNil(context.plugin) || isNil(context.command)) {
  //     // default option is to run check plugin
  //     runtime.run({
  //       pluginName: 'check'
  //     })
  //     printWtf(runtime)
  //   } else {
  //     // we did something and it wasn't an error! hurray for us!
  //   }
  // } catch (e) {
  //   // o snap, something really bad happened, let's log & die instead
  //   console.log(e)
  // }
}
