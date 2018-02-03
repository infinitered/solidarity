import { SolidarityReportResults } from '../../src/types'
import { createReport } from '../../src/extensions/functions/solidarityReport'
const context = require('mockContext')

let reportResults: SolidarityReportResults
describe('solidarityReport structure', () => {
  test('the basic function generates the Result object', () => {
    let report = createReport(context)
    expect(report).toMatchSnapshot()
  })
})
