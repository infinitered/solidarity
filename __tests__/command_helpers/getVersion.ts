import getVersion from '../../src/extensions/functions/getVersion'

import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun')
solidarityExtension(context)

describe('getVersion', () => {
  test('returns version for a given binary if not specified', async () => {
    const rule = { rule: "cli", binary: "yarn" }
    const output = await getVersion(rule, context)

    expect(typeof output).toBe('string')
    expect(output.length).toBeGreaterThan(0)
  })

  test('returns version for a given binary using specified option', async () => {
    const rule = { rule: "cli", binary: "yarn", version: "--version" }
    const output = await getVersion(rule, context)

    expect(typeof output).toBe('string')
    expect(output.length).toBeGreaterThan(0)
  })


  test('throws an error if no version flag works', async() => {
    const rule = { rule: "cli", binary: "ls" }
    let result

    try {
      await getVersion(rule, context)            
    } catch(e) {
      result = e
    }
    expect(result).toEqual( " No version was detected from the output of the binary 'ls'")
  })
})