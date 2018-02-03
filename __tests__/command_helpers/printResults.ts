import printResults from '../../src/extensions/functions/printResults'
import { SolidarityRunContext, SolidarityReportResults } from '../../src/types'
import { createReport } from '../../src/extensions/functions/solidarityReport'

let mockContext: SolidarityRunContext
let reportResults: SolidarityReportResults
describe('reviewRule', () => {
  beforeEach(() => {
    // fresh mock context
    mockContext = require('mockContext')
    reportResults = createReport()
  })

  test('printResults uses table', async () => {
    printResults(reportResults, mockContext)
    // print table was called
    expect(mockContext.print.table).toHaveBeenCalled()
  })
})
