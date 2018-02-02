import checkRequirement from '../../src/extensions/functions/checkRequirement'
import { toPairs } from 'ramda'
const examplePlugin = require('examplePlugin')
const mockContext = examplePlugin(require('mockContext'))

describe('checkRequirement Plugins', () => {
  test('successful CUSTOM rule check', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkThing' }],
    })[0]
    const result = await checkRequirement(rule, mockContext)
    expect(result).toEqual([[]])
  })

  test('failed CUSTOM rule check', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkSecondThing' }],
    })[0]
    const result = await checkRequirement(rule, mockContext)
    expect(result).toEqual(['Boooo failed check'])
  })

  test('failed to find plugin', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'I do not exist', name: 'checkSecondThing' }],
    })[0]
    const result = await checkRequirement(rule, mockContext)
    expect(result).toEqual(["Plugin not found 'I do not exist'"])
  })

  test('failed to find check function', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'notRealName' }],
    })[0]
    const result = await checkRequirement(rule, mockContext)
    expect(result).toEqual(["NOT FOUND: Custom rule from 'Example Plugin' plugin with check function 'notRealName'"])
  })

  test('failed CUSTOM rule with custom message', async () => {
    const error = 'CUSTOM ERROR'
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkSecondThing', error }],
    })[0]
    const result = await checkRequirement(rule, mockContext)
    expect(result).toEqual([error])
  })
})
