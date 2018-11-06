import reviewRule from '../../src/extensions/functions/reviewRule'
import { SolidarityRunContext, SolidarityReportResults } from '../../src/types'
import { createReport } from '../../src/extensions/functions/solidarityReport'
const examplePlugin = require('examplePlugin')
let mockContext: SolidarityRunContext
let reportResults: SolidarityReportResults
describe('reviewRule', () => {
  beforeEach(async () => {
    // fresh mock context
    mockContext = examplePlugin(require('mockContext'))
    reportResults = await createReport(mockContext)
  })

  describe('when rule: cli', () => {
    test('rule gets added', async () => {
      const rule = ['NPM', [{ rule: 'cli', binary: 'npm' }]]

      await reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.cliRules.length).toBe(2)
    })
  })

  describe('when rule: env', () => {
    test('rule gets added', async () => {
      const rule = ['ANDROID', [{ rule: 'env', value: 'ANDROID_HOME' }]]

      reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.envRules.length).toBe(2)
    })
  })

  describe('when rule: dir', () => {
    test('rule gets added', async () => {
      const rule = ['DIRECTORY', [{ rule: 'dir', binary: 'random' }]]

      reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.filesystemRules.length).toBe(2)
    })
  })

  describe('when rule: file', () => {
    test('rule gets added', async () => {
      const rule = ['FILE', [{ rule: 'file', binary: 'random' }]]

      reviewRule(rule, reportResults, mockContext)
      // CLI rule was added
      expect(reportResults.filesystemRules.length).toBe(2)
    })
  })

  describe('when rule: shell', () => {
    test('rule gets added', async () => {
      const rule = ['SHELL', [{ rule: 'shell', command: 'ls', match: '.+' }]]

      reviewRule(rule, reportResults, mockContext)
      // SHELL rule was added
      expect(reportResults.shellRules.length).toBe(1)
    })
  })

  // Custom rule test
  describe('when rule: custom', () => {
    test('rule gets added', async () => {
      const rule = ['CUSTOM', [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkThing' }]]

      expect(reportResults.cliRules.length).toBe(1)
      await reviewRule(rule, reportResults, mockContext)
      // CUSTOM rule (which adds CLI report) was added
      expect(reportResults.cliRules.length).toBe(2)
    })

    test('does nothing when no report exists', async () => {
      const rule = ['CUSTOM', [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkSecondThing' }]]

      expect(reportResults.cliRules.length).toBe(1)
      await reviewRule(rule, reportResults, mockContext)
      // should not change rules
      expect(reportResults.cliRules.length).toBe(1)
    })

    test('Errors when plugin doesn not exist', async () => {
      const rule = ['CUSTOM', [{ rule: 'custom', plugin: 'FAKE', name: 'checkSecondThing' }]]

      // Async error snapshots (not simple)
      try {
        await reviewRule(rule, reportResults, mockContext)
        fail('Unknown rule should have errored')
      } catch (e) {
        expect(e).toMatchSnapshot()
      }
    })
  })

  describe('when rule: unknown', () => {
    test('rule gets added', async () => {
      const rule = ['UNKNOWN', [{ rule: 'UNKNOWN', command: 'ls', match: '.+' }]]

      // Async error snapshots (not simple)
      try {
        await reviewRule(rule, reportResults, mockContext)
        fail('Unknown rule should have errored')
      } catch (e) {
        expect(e).toMatchSnapshot()
      }
    })
  })
})
