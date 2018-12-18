import { GluegunCommand } from 'gluegun'
import * as Listr from 'listr'
import { SolidarityRequirementChunk, SolidarityOutputMode, SolidaritySettings, SolidarityRunContext } from '../types'

namespace Solidarity {
  const { toPairs } = require('ramda')

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

    const { print, solidarity } = context
    const { checkRequirement, getSolidaritySettings } = solidarity

    // get settings or error
    let solidaritySettings
    try {
      solidaritySettings = await getSolidaritySettings(context)
    } catch (e) {
      print.error(e.message)
      print.info(
        `Make sure you are in the correct folder or run ${print.colors.success(
          'solidarity snapshot'
        )} to take a snapshot of your environment and create a .solidarity file for this project.`
      )
      process.exit(3)
    }

    // Merge flags and configs
    context.outputMode = setOutputMode(context.parameters, solidaritySettings)
    // Adjust output depending on mode
    let listrSettings: Object = { concurrent: true, collapse: false }
    switch (context.outputMode) {
      case SolidarityOutputMode.SILENT:
        listrSettings = { ...listrSettings, renderer: 'silent' }
        break
      case SolidarityOutputMode.MODERATE:
        // have input clear itself
        listrSettings = { ...listrSettings, clearOutput: true }
    }

    // build Listr of checks
    const checks = new Listr(
      await toPairs(solidaritySettings.requirements).map((requirement: SolidarityRequirementChunk) => ({
        title: requirement[0],
        task: async () => checkRequirement(requirement, context),
      })),
      listrSettings
    )

    // run the array of promises in Listr
    await checks.run()
      .then(results => {
        const silentOutput = context.outputMode === SolidarityOutputMode.SILENT
        // Add empty line between final result if printing rule results
        if (!silentOutput) print.success('')
        if (!silentOutput) print.success(print.checkmark + ' Solidarity checks valid')
      })
      .catch(err => {
        const silentOutput = context.outputMode === SolidarityOutputMode.SILENT
        if (!silentOutput) print.error(err.message)
        process.exit(2)
      })
  }
}

// Export command
module.exports = {
  description: 'Check environment against solidarity rules',
  run: Solidarity.run,
} as GluegunCommand
