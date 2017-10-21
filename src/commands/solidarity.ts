import { GluegunCommand } from 'gluegun'

namespace Solidarity {
  const { map, toPairs, isEmpty, flatten, reject, isNil } = require('ramda')

  const checkForEscapeHatchFlags = async(context) => {
    const { print, parameters } = context
    const { options } = parameters
    if (options.help || options.h) {
      // Just looking for help
      print.printCommands(context)
      process.exit(0)
    } else if (options.version || options.v) {
      // Just looking for version
      print.info(require('../../package.json').version)
      process.exit(0)
    }
  }

  export const run = async (context) => {
    // drop out fast in these situations
    checkForEscapeHatchFlags(context)

    const { print, solidarity } = context
    const { checkRequirement, getSolidaritySettings } = solidarity

    // get settings or error
    let solidaritySettings
    try {
      solidaritySettings = getSolidaritySettings(context)
    } catch (e) {
      print.error(e)
      print.info(
        `Make sure you are in the correct folder or run ${print.colors.success(
          'solidarity snapshot'
        )} to take a snapshot of your environment and create a .solidarity file for this project.`
      )
      process.exit(3)
    }

    // build map of checks to perform
    const checks = await map(
      async requirement => checkRequirement(requirement, context),
      toPairs(solidaritySettings.requirements)
    )

    // run the array of promises you just created
    await Promise.all(checks)
      .then(results => {
        const errors = reject(isNil, flatten(results))
        if (isEmpty(errors)) {
          print.success('\n Environment Checks Valid')
        } else {
          print.error('\nSolidarity Checks Failed:\n')
          print.error(errors.join('\n'))
          process.exit(1)
        }
      })
      .catch(err => {
        print.error(err)
        process.exit(2)
      })
  }
}

// Export command
module.exports = {
  description: 'Check environment rules',
  run: Solidarity.run
} as GluegunCommand
