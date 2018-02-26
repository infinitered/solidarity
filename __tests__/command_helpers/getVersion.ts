import getVersion from '../../src/extensions/functions/getVersion'

import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun')
const mockContext = require('mockContext')
const path = require('path')
let originalTimeout
solidarityExtension(context)
solidarityExtension(mockContext)

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
    const rule = { rule: 'cli', binary: 'ls' }
    let result

    try {
      await getVersion(rule, context)
    } catch (e) {
      result = e
    }
    expect(result).toEqual(" No version was detected from the output of the binary 'ls'")
  })

  describe('extra magic for node_modules', () => {
    beforeAll(() => {
      mockContext.system.which = jest.fn((name) => `.${path.sep}node_modules${path.sep}.bin${path.sep}${name}`)
    })

    test('assuring we use global over node_modules', async () => {
      const rule = { rule: 'cli', binary: 'yarn', version: '--version' }
      const output = await getVersion(rule, mockContext)
      expect(output).toBe('12')
    })
  })
})
