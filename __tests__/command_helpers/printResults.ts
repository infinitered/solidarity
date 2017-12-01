import printResults from '../../src/extensions/functions/printResults'
import { SolidarityRunContext, SolidarityReportResults } from '../../src/types'

let mockContext: SolidarityRunContext
let reportResults: SolidarityReportResults
describe('reviewRule', () => {
  beforeEach(() => {
    // fresh mock context
    mockContext = require('mockContext')
    reportResults = {
      basicInfo: [
        ['System Basics', 'Value'],
        ['OS', 'tacoOS'],
        ['CPU', 'hamsters in a wheel']
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
  })

  test('printResults uses table' async () => {
    const result = await printResults(reportResults, mockContext)
    // print table was called
    expect(mockContext.print.table).toHaveBeenCalled()
  })
})
