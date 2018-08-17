import getVersion from '../../src/extensions/functions/getVersion'

import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun/toolbox')
let originalTimeout
solidarityExtension(context)

describe('getVersion', () => {
  beforeAll(() => {
    // These can be slow on CI
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
  })

  afterAll(function() {
    // Fix timeout change
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  test('returns version for a given binary if not specified', async () => {
    const rule = { rule: 'cli', binary: 'yarn' }
    const output = await getVersion(rule, context)

    expect(typeof output).toBe('string')
    expect(output.length).toBeGreaterThan(0)
  })

  test('returns version for a given binary using specified option', async () => {
    const rule = { rule: 'cli', binary: 'yarn', version: '--version' }
    const output = await getVersion(rule, context)

    expect(typeof output).toBe('string')
    expect(output.length).toBeGreaterThan(0)
  })

  test('throws an error if no version flag works', async () => {
    const rule = { rule: 'cli', binary: 'cd' }
    let result

    try {
      await getVersion(rule, context)
    } catch (e) {
      result = e
    }
    expect(result).toEqual("No version identifier flag for this binary was found")
  })
})
