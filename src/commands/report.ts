import { GluegunCommand } from 'gluegun'
import { SolidarityToolbox, SolidarityReportResults } from '../types'
import { map, toPairs } from 'ramda'
import { createReport } from '../extensions/functions/solidarityReport'

module.exports = {
  alias: 'r',
  description: 'Report solidarity info about the current machine',
  run: async (context: SolidarityToolbox) => {
    const { print, solidarity, system } = context
    const reportTimer = system.startTimer()
    const { getSolidaritySettings, reviewRule, printResults } = solidarity
    // Node Modules Quirk
    require('../extensions/functions/quirksNodeModules')

    const spinner = print.spin('Building Report')

    // get settings or error
    let solidaritySettings
    try {
      solidaritySettings = await getSolidaritySettings(context)
    } catch (e) {
      spinner.fail(`No valid ${print.colors.success('solidarity')} file was found to report.`)
      process.exit(3)
    }

    let results: SolidarityReportResults = await createReport(context)

    // break all rules into requirements
    const reportCalls = map(
      async requirement => reviewRule(requirement, results, context),
      toPairs(solidaritySettings.requirements)
    )

    // run the array of promises you just created
    await Promise.all(reportCalls)
      .then(reportResults => {
        results.basicInfo.push([
          'Report Info',
          `${new Date().toLocaleString()} (in ${(reportTimer() / 1000).toFixed(2)}s)`,
        ])
        spinner.stop()
        printResults(results, context)
      })
      .catch(err => {
        print.error(`\n\n${err}`)
        process.exit(2)
      })
  },
} as GluegunCommand
