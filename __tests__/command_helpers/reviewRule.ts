import reviewRule from '../../src/extensions/functions/reviewRule'
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
        ['CPU', 'hampsters in a wheel']
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
  })

  describe('when rule: cli', () => {
    test('happy path' async () => {
      const rule = ['NPM', [{ rule: 'cli', binary: 'npm' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.cliRules.length).toBe(2)
    })
  })

  describe('when rule: env', () => {
    // ADD TEST e.g. expect(true).toBeTruthy()
  })

  describe('when rule: dir', () => {
    // ADD TEST e.g. expect(true).toBeTruthy()
  })

  describe('when rule: file', () => {
    // ADD TEST e.g. expect(true).toBeTruthy()
  })
})
