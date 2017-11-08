import checkCLIForUpdates from '../../src/extensions/functions/checkCLIForUpdates'

import context from 'gluegun'
const rule = {
  rule: "cli",
  binary: "bananas",
  semver: "1.1.0",
  version: "--version"
}

describe('checkCLIForUpdates', () => {
  describe('with a bad binary', () => {
    it('should return binary not found', async () => {
      const result = await checkCLIForUpdates(rule, context)
      expect(result).toEqual("Binary 'bananas' not found")
    })
  })

  describe('with a good binary', () => {
    beforeEach(() => {
      rule.binary = "yarn"
      context.print = {
        color: {
          green: jest.fn((string) => string)
        }
      }
    })

    it('pads zeros for non-semver versions', async () => {
      context.solidarity = {
        getVersion: jest.fn(() => '1.0')
      }

      const result = await checkCLIForUpdates(rule, context)
      expect(result).toEqual("Setting yarn to '1.0'")
    })
  })
})