import { GluegunCommand } from 'gluegun'
import { helpers } from 'envinfo'
import { SolidarityRunContext } from '../types'

interface SolidarityReportResults {
  basicInfo: Array<Array<string>>
  cliRules: Array<Array<string>>
  envRules: Array<Array<string>>
  filesystemRules: Array<Array<string>>
}

const printResults = (results: SolidarityReportResults, context: SolidarityRunContext) => {
  const { print, printSeparator } = context
  const { info } = print
  const printSpacedTable = (table) => {
    info('')
    print.table(table, {format: 'markdown'})
    info('')
  }
  const printIfData = (reportItem: Array<Array<string>>) =>
    (reportItem.length > 1) && printSpacedTable(reportItem)

  info('# ⚠️ System Report:')
  printSeparator()
  printIfData(results.basicInfo)
  printIfData(results.cliRules)
  printIfData(results.envRules)
  printIfData(results.filesystemRules)
  printSeparator()
}

module.exports = {
  alias: 'r',
  description: 'Report identify info about the current machine',
  run: (context: SolidarityRunContext) => {
    const { print, solidarity } = context
    const { checkRequirement, getSolidaritySettings } = solidarity
    const { info } = print

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
        ['CPU', helpers.getCPUInfo()],
        ['Report Date', new Date().toLocaleString()],
      ],
      cliRules: [
        ['Command', 'Location', 'Version', 'Desired']
      ],
      envRules: [
        ['Environment Var', 'Value']
      ],
      filesystemRules: [
        ['Location', 'Type', 'Exists']
      ]
    }

    spinner.stop()
    printResults(results, context)
  }
} as GluegunCommand
