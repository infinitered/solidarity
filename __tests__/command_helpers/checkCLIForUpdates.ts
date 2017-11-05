import checkCLIForUpdates from '../../src/extensions/functions/checkCLIForUpdates'

import context from 'gluegun'
const rule = {
  rule: "cli",
  binary: "bananas",
  version: "1.0"
}

describe('checkCLIForUpdates', () => {
  describe('with a bad binary', () => {
    it('should return binary not found', async () => {
      const result = await checkCLIForUpdates(rule, context)
      expect(result).toEqual("Binary 'bananas' not found")
    })
  })

  describe('with a good binary', () => {

  })
})