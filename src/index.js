const { isNil } = require('ramda')
const minimist = require('minimist')
const { print, printCommands } = require('gluegun')
const { BRAND, configureRuntime } = require('./runtime')

/**
 * Runs solidarity.
 */
module.exports = async function run (argv) {
  let context // the gluegun execution environment for a command
  let runtime // the gluegun runtime which will execute a command

  // Attempt to setup the runtime.
  try {
    // setup the runtime
    runtime = configureRuntime()

    // parse the command line for things gluegun doesn't want to do
    const commandLine = minimist(argv.slice(2))

    // such as --help
    const wantsHelp = commandLine.help || commandLine.h

    // let's run the command 🐇
    context = await runtime.run()

    if (context.error) {
      // something didn't work right in the command
      print.debug(context.error)
    } else if (wantsHelp || isNil(context.plugin) || isNil(context.command)) {
      // we didn't do anything, so let's print some helpful instructions
      print.info(`${BRAND}`)
      printCommands(context)
    } else {
      // we did something and it wasn't an error! hurray for us!
    }
  } catch (e) {
    // o snap, something really bad happened, let's log & die instead
    console.log(e)
  }
}
