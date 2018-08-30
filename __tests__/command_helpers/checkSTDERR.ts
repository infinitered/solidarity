const checkSTDERR = require('../../src/extensions/functions/checkSTDERR')
const context = require('mockContext')

describe('checkSTDERR', () => {
  test('returns augmented string', async () => {
    const rule = { rule: 'cli', binary: 'yarn', version: '--version' }
    const normal = `${rule.binary} ${rule.version}`
    const output = await checkSTDERR(rule, context)

    expect(typeof output).toBe('string')
    expect(output.length).toBeGreaterThan(normal.length)
  })
})
