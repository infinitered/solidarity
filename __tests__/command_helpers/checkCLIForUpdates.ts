import checkCLIForUpdates from '../../src/extensions/functions/checkCLIForUpdates'

const context = require('mockContext')
const rule = {
  rule: 'cli',
  binary: 'bananas',
  semver: '1.1.0',
  version: '--version',
}

const ruleTildeSemver = {
  rule: 'cli',
  binary: 'npm',
  semver: '~5.6.0',
  version: '--version',
}

const ruleNoSemver = {
  rule: 'cli',
  binary: 'yarn',
}

describe('checkCLIForUpdates', () => {
  describe('with a bad binary', () => {
    it('should error with binary not found', async () => {
      await expect(checkCLIForUpdates(rule, context)).rejects.toThrow()
    })
  })

  describe('with a good binary', () => {
    beforeEach(() => {
      rule.binary = 'yarn'
      context.print = {
        colors: {
          green: jest.fn(stringy => stringy),
        },
      }
    })

    it('pads zeros for non-semver versions', async () => {
      context.solidarity = {
        getVersion: jest.fn(() => '1.0'),
      }

      const result = await checkCLIForUpdates(rule, context)
      expect(result).toEqual("Setting yarn to '1.0'")
      expect(context.print.colors.green).toHaveBeenCalled()
    })

    it('does nothing if there was no original semver', async () => {
      context.solidarity = {
        getVersion: jest.fn(() => '1.0'),
      }

      const result = await checkCLIForUpdates(ruleNoSemver, context)
      expect(result).toEqual(undefined)
      expect(ruleNoSemver.semver).toBe(undefined)
    })

    it('copies semver ~ symbol if present', async () => {
      context.solidarity = {
        getVersion: jest.fn(() => '5.8'),
      }

      const result = await checkCLIForUpdates(ruleTildeSemver, context)
      expect(result).toEqual("Setting npm to '~5.8'")
    })
  })
})
