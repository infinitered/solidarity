import { SolidarityReportResults } from '../../src/types'
import { createReport } from '../../src/extensions/functions/solidarityReport'

let reportResults: SolidarityReportResults
describe('solidarityReport structure', () => {
  test('the basic function generates the Result object', () => {
    let report = createReport()
    expect(report).toMatchSnapshot()
  })
})
