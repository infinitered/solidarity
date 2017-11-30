import { GluegunCommand } from 'gluegun'
import { helpers } from 'envinfo'
import { SolidarityRunContext, SolidarityReportResults } from '../types'
import { map, toPairs } from 'ramda'

module.exports = {
  alias: 'r',
  description: 'Report solidarity info about the current machine',
  run: async (context: SolidarityRunContext) => {
    const { print, solidarity, system } = context
    const reportTimer = system.startTimer()
    const { getSolidaritySettings, reviewRule, printResults } = solidarity

    const spinner = print.spin('Building Report')

    // get settings or error
    let solidaritySettings
    try {
      solidaritySettings = getSolidaritySettings(context)
    } catch (e) {
      spinner.fail(
        `No valid ${print.colors.success('solidarity')} file was found to report.`
      )
      process.exit(3)
    }

    let results: SolidarityReportResults = {
      basicInfo: [
        ['System Basics', 'Value'],
        ['OS', helpers.getOperatingSystemInfo()],
        ['CPU', helpers.getCPUInfo()]
      ],
      cliRules: [
        ['Binary', 'Location', 'Version', 'Desired']
      ],
      envRules: [
        ['Environment Var', 'Value']
      ],
      filesystemRules: [
        ['Location', 'Type', 'Exists']
      ],
      shellRules: [
        ['Command', 'Pattern', 'Matches']
      ]
    }

    // break all rules into requirements
    const reportCalls = await map(
      async requirement => reviewRule(requirement, results, context),
      toPairs(solidaritySettings.requirements)
    )

    // run the array of promises you just created
    await Promise.all(reportCalls)
      .then(reportResults => {
        results.basicInfo.push([
          'Report Info',
          `${new Date().toLocaleString()} (in ${(reportTimer() / 1000).toFixed(2)}s)`
        ])
        spinner.stop()
        printResults(results, context)
      })
      .catch(err => {
        print.error(`\n\n${err}`)
        process.exit(2)
      })

  }
} as GluegunCommand
