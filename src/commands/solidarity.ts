import { GluegunCommand } from 'gluegun'
import { SolidarityOutputMode, SolidaritySettings } from '../types'

namespace Solidarity {
  const { map, toPairs, isEmpty, flatten, reject, isNil } = require('ramda')

  const checkForEscapeHatchFlags = async (context) => {
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

  const setOutputMode = (parameters, settings: SolidaritySettings): SolidarityOutputMode => {
    const { options } = parameters
    // CLI flags override config
    // const outputMode = settings.config && String(settings.config.output).toUpperCase()
    if (options.verbose || options.a) {
      return SolidarityOutputMode.VERBOSE
    } else if (options.silent || options.s) {
      return SolidarityOutputMode.SILENT
    } else if (options.moderate || options.m) {
      return SolidarityOutputMode.MODERATE
    }

    // Set output mode, set to default on invalid value
    let outputModeString = settings.config ? String(settings.config.output).toUpperCase() : SolidarityOutputMode.MODERATE
    return SolidarityOutputMode[outputModeString]
  }

  export const run = async (context) => {
    // drop out fast in these situations
    await checkForEscapeHatchFlags(context)

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

    context.outputMode = setOutputMode(context.parameters, solidaritySettings)

    // build map of checks to perform
    const checks = await map(
      async requirement => checkRequirement(requirement, context),
      toPairs(solidaritySettings.requirements)
    )

    // run the array of promises you just created
    await Promise.all(checks)
      .then(results => {
        const errors = reject(isNil, flatten(results))
        const silentOutput = context.outputMode === SolidarityOutputMode.SILENT
        // Add empty line between final result if printing rule results
        if (!silentOutput) print.success('')

        if (isEmpty(errors)) {
          if (!silentOutput) print.success(print.checkmark + ' Solidarity checks valid')
        } else {
          if (!silentOutput) print.error('Solidarity checks failed.')
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
  description: 'Check environment against solidarity rules',
  run: Solidarity.run
} as GluegunCommand
