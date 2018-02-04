import { SolidarityReportResults } from '../../src/types'
import { createReport } from '../../src/extensions/functions/solidarityReport'
const context = require('mockContext')

let reportResults: SolidarityReportResults
describe('solidarityReport structure', () => {
  test('the basic function generates the Result object', () => {
    let report = createReport(context)
    // Check everything but system stuff against snapshots
    expect(report.addCLI).toMatchSnapshot()
    expect(report.cliRules).toMatchSnapshot()
    expect(report.customRules).toMatchSnapshot()
    expect(report.envRules).toMatchSnapshot()
    expect(report.filesystemRules).toMatchSnapshot()
    expect(report.shellRules).toMatchSnapshot()
  })
})
