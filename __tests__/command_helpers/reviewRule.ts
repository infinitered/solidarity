import reviewRule from '../../src/extensions/functions/reviewRule'
import { SolidarityRunContext, SolidarityReportResults } from '../../src/types'
let mockContext: SolidarityRunContext
let reportResults: SolidarityReportResults
describe('reviewRule', () => {
  beforeEach(() => {
    // fresh mock context
    mockContext = require('mockContext')
    reportResults = {
      basicInfo: [['System Basics', 'Value'], ['OS', 'tacoOS'], ['CPU', 'hamsters in a wheel']],
      cliRules: [['Binary', 'Location', 'Version', 'Desired']],
      envRules: [['Environment Var', 'Value']],
      filesystemRules: [['Location', 'Type', 'Exists']],
      shellRules: [['Command', 'Pattern', 'Matches']],
    }
  })

  describe('when rule: cli', () => {
    test('rule gets added', async () => {
      const rule = ['NPM', [{ rule: 'cli', binary: 'npm' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.cliRules.length).toBe(2)
    })
  })

  describe('when rule: env', () => {
    test('rule gets added', async () => {
      const rule = ['ANDROID', [{ rule: 'env', value: 'ANDROID_HOME' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.envRules.length).toBe(2)
    })
  })

  describe('when rule: dir', () => {
    test('rule gets added', async () => {
      const rule = ['DIRECTORY', [{ rule: 'dir', binary: 'random' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.filesystemRules.length).toBe(2)
    })
  })

  describe('when rule: file', () => {
    test('rule gets added', async () => {
      const rule = ['FILE', [{ rule: 'file', binary: 'random' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.filesystemRules.length).toBe(2)
    })
  })

  describe('when rule: shell', () => {
    test('rule gets added', async () => {
      const rule = ['SHELL', [{ rule: 'shell', command: 'ls', match: '.+' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // SHELL rule was added
      expect(reportResults.shellRules.length).toBe(2)
    })
  })

  // TODO: Custom rule test
  // describe('when rule: custom', () => {
  //   test('rule gets added', async () => {
  //     const rule = ['CUSTOM', [{ rule: 'custom', plugin: 'plugin', name: 'name' }]]

  //     const result = await reviewRule(rule, reportResults, mockContext)
  //     // CUSTOM rule was added
  //     expect(reportResults.customRules.length).toBe(2)
  //   })
  // })

  describe('when rule: unknown', () => {
    test('rule gets added', async () => {
      const rule = ['UNKNOWN', [{ rule: 'UNKNOWN', command: 'ls', match: '.+' }]]

      const result = await reviewRule(rule, reportResults, mockContext)
      // Failure in a specific rule
      expect(mockContext.print.error.mock.calls.length).toBe(1)
    })
  })
})
