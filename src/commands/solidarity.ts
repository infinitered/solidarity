import { GluegunCommand } from 'gluegun'
import { SolidarityOutputMode, SolidaritySettings, SolidarityRunContext } from '../types'

namespace Solidarity {
  const { map, toPairs, isEmpty, flatten, reject, isNil } = require('ramda')

  const checkForEscapeHatchFlags = async (context: SolidarityRunContext) => {
    const { print, parameters } = context
    const { options } = parameters
    if (!options) return
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
    if (options.verbose || options.a) {
      return SolidarityOutputMode.VERBOSE
    } else if (options.silent || options.s) {
      return SolidarityOutputMode.SILENT
    } else if (options.moderate || options.m) {
      return SolidarityOutputMode.MODERATE
    }

    // Set output mode, set to default on invalid value
    let outputModeString = settings.config ? String(settings.config.output).toUpperCase() : 'MODERATE'
    return SolidarityOutputMode[outputModeString] || SolidarityOutputMode.MODERATE
  }

  export const run = async (context: SolidarityRunContext) => {
    // Node Modules Quirk
    require('../extensions/functions/quirksNodeModules')
    // drop out fast in these situations
    await checkForEscapeHatchFlags(context)

    const { print, solidarity, parameters } = context
    const { options } = parameters
    const { checkRequirement, getSolidaritySettings } = solidarity

    // get settings or error
    let solidaritySettings
    //////////
    // Consider cleaning this up
    const checkOption: string = options ? (options.check || options.c) : null
    if (checkOption) {
      const { http } = context
      const checkSpinner = print.spin(`Running check on ${checkOption}`)
      const api = http.create({
        baseURL: 'https://api.github.com',
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
      try {
        // Load check from web
        const checkURL = `https:\/\/raw.githubusercontent.com/infinitered/solidarity/master/${checkOption}`
        const result = await api.get(checkURL)
        console.log(result)
        if (result.ok) {
          checkSpinner.succeed(checkURL)
          // result.data
        } else {
          checkSpinner.fail(`Unable to find a known check for ${checkOption}`)
          print.info(
            `https://github.com/infinitered/solidarity/checks for options.`
          )
          process.exit(3)
        }
      } catch (e) {
        checkSpinner.fail(e)
        print.info(
          `Check is meant to verify your environment based on known stacks
          solidarity failed to do a proper check for ${print.colors.success(checkOption)}`
        )
        process.exit(3)
      }
      process.exit(1)
    //////////////////////////////////////
    } else {
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
  run: Solidarity.run,
} as GluegunCommand
