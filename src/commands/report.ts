import { GluegunCommand } from 'gluegun'
import { helpers } from 'envinfo'
import { SolidarityRunContext, SolidarityReportResults } from '../types'
import { map, toPairs, isEmpty, flatten, reject, isNil } from 'ramda'

const printResults = (results: SolidarityReportResults, context: SolidarityRunContext) => {
  const { print, printSeparator } = context
  const { info } = print
  const printSpacedTable = (table, header) => {
    info(`### ${header}\n`)
    print.table(table, {format: 'markdown'})
    info('\n')
  }
  const printIfData = (reportItem: Array<Array<string>>, header: string) =>
    (reportItem.length > 1) && printSpacedTable(reportItem, header)

  info('# ⚠️ Environment Report:')
  printSeparator()
  printIfData(results.basicInfo, 'System')
  printIfData(results.cliRules, 'Commands')
  printIfData(results.envRules, 'Environment Variable')
  printIfData(results.filesystemRules, 'Filesystem')
  printSeparator()
}

module.exports = {
  alias: 'r',
  description: 'Report solidarity info about the current machine',
  run: async (context: SolidarityRunContext) => {
    const { print, solidarity, system } = context
    const reportTimer = system.startTimer()
    const { checkRequirement, getSolidaritySettings, reviewRule } = solidarity

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
        print.error(err)
        process.exit(2)
      })

  }
} as GluegunCommand
