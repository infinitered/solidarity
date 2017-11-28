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
      ]
    }
  })

  describe('when rule: cli', () => {
    test('rule gets added' async () => {
      const rule = ['NPM', [{ rule: 'cli', binary: 'npm' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.cliRules.length).toBe(2)
    })
  })

  describe('when rule: env', () => {
    test('rule gets added' async () => {
      const rule = ['ANDROID', [{ rule: 'env', value: 'ANDROID_HOME' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.envRules.length).toBe(2)
    })
  })

  describe('when rule: dir', () => {
    test('rule gets added' async () => {
      const rule = ['DIRECTORY', [{ rule: 'dir', binary: 'random' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.filesystemRules.length).toBe(2)
    })
  })

  describe('when rule: file', () => {
    test('rule gets added' async () => {
      const rule = ['FILE', [{ rule: 'file', binary: 'random' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.filesystemRules.length).toBe(2)
    })
  })
})
