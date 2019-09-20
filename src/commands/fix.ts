import { GluegunCommand } from 'gluegun'
import { SolidarityOutputMode, SolidarityRequirementChunk, SolidarityRunContext } from '../types'
import Listr from 'listr'

module.exports = {
  alias: 'f',
  description: 'Applies all specified fixes for rules',
  run: async (context: SolidarityRunContext) => {
    // Node Modules Quirk
    require('../extensions/functions/quirksNodeModules')

    const { toPairs } = require('ramda')
    const { print, solidarity } = context
    const { checkRequirement, getSolidaritySettings, setOutputMode } = solidarity

    // get settings or error
    let solidaritySettings
    try {
      solidaritySettings = await getSolidaritySettings(context)
    } catch (e) {
      print.error(e.message || 'No Solidarity Settings Found')
      print.info(
        `Make sure you are in the correct folder or run ${print.colors.success(
          'solidarity onboard'
        )} to create a .solidarity file for this project.`
      )
      process.exit(3)
    }

    // Merge flags and configs
    context.outputMode = setOutputMode(context.parameters, solidaritySettings)
    // Adjust output depending on mode
    let listrSettings: Object = { concurrent: true, collapse: false, exitOnError: false }
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
        task: async () => checkRequirement(requirement, context, true),
      })),
      listrSettings
    )

    // run the array of promises in Listr
    await checks
      .run()
      .then(results => {
        const silentOutput = context.outputMode === SolidarityOutputMode.SILENT
        // Add empty line between final result if printing rule results
        if (!silentOutput) print.success('')
        if (!silentOutput) print.success(print.checkmark + ' Solidarity checks valid')
      })
      .catch(_err => {
        const silentOutput = context.outputMode === SolidarityOutputMode.SILENT
        // Used to have message in the err, but that goes away with `exitOnError: false` so here's a generic one
        if (!silentOutput) print.error('Solidarity checks failed')
        process.exit(2)
      })
  },
} as GluegunCommand
