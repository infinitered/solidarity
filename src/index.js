const { isNil } = require('ramda')
const minimist = require('minimist')
const { build } = require('gluegun')
const { BRAND, configureRuntime } = require('./runtime')

/**
 * Runs solidarity.
 */
module.exports = async function run (argv) {
  let context // the gluegun execution environment for a command
  let runtime // the gluegun runtime which will execute a command

  // Attempt to setup the runtime.
  // try {
  // setup the runtime
  build()
    // Brand is used for default config files (if any).
    .brand('solidarity')
    // The default plugin is the directory we're in right now, so
    // the commands sub-directory will contain the first right of
    // refusal to handle user's requests.
    .src(__dirname)
    // TODO: maybe there's other places you'd like to load plugins from?
    // .load(`~/.${BRAND}`)

    // These are the magic tokens found inside command js sources
    // which plugin authors use to specify the command users can type
    // as well as the help they see.
    // .token('commandName', `${BRAND}Command`)
    // .token('commandDescription', `${BRAND}Description`)
    // let's build it
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
