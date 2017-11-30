import { SolidarityRunContext, SolidarityReportResults } from '../../types'
module.exports = (results: SolidarityReportResults, context: SolidarityRunContext): void => {
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
  printIfData(results.envRules, 'Environment Variables')
  printIfData(results.filesystemRules, 'Filesystem')
  printIfData(results.shellRules, 'Shell Checks')
  printSeparator()
}
