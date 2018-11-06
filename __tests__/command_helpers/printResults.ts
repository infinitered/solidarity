import printResults from '../../src/extensions/functions/printResults'
import { SolidarityRunContext, SolidarityReportResults } from '../../src/types'
import { createReport } from '../../src/extensions/functions/solidarityReport'
import { flatten } from 'ramda'

let mockContext: SolidarityRunContext
let reportResults: SolidarityReportResults
describe('reviewRule', () => {
  beforeEach(async () => {
    // fresh mock context
    mockContext = require('mockContext')
    reportResults = await createReport(mockContext)
  })

  test('printResults uses table', () => {
    printResults(reportResults, mockContext)
    // print table was called
    expect(mockContext.print.table).toHaveBeenCalled()
    expect(flatten(mockContext.print.table.mock.calls)).toContain('System Basics')
  })

  test('prints custom tables', () => {
    const justHeaderTable = {
      title: 'No Values Table',
      table: [['PARIS']],
    }
    const customTable = {
      title: 'Custom Value Table',
      table: [['Title'], ['NEW ORLEANS']],
    }
    reportResults.customRules.push(justHeaderTable)
    reportResults.customRules.push(customTable)
    printResults(reportResults, mockContext)
    expect(flatten(mockContext.print.table.mock.calls)).not.toContain('PARIS')
    expect(flatten(mockContext.print.table.mock.calls)).toContain('NEW ORLEANS')
  })
})
