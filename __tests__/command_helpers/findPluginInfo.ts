const findPluginInfo = require('../../src/extensions/functions/findPluginInfo')
const examplePlugin = require('examplePlugin')
const mockContext = examplePlugin(require('mockContext'))

describe('findPluginInfo Function', () => {
  test('can fail to find plugins', () => {
    const rule = {
      rule: 'custom',
      plugin: 'FAKE',
      name: 'checkThing'
    }
    const customPluginRule = findPluginInfo(rule, mockContext)
    expect(customPluginRule).toEqual({ message: "Plugin not found 'FAKE'", success: false })
  }

  test('can fail to find plugins', () => {
    const rule = {
      rule: 'custom',
      plugin: 'Example Plugin',
      name: 'FAKE'
    }
    const customPluginRule = findPluginInfo(rule, mockContext)
    expect(customPluginRule.message).toEqual("NOT FOUND: Custom rule from 'Example Plugin' plugin with check function 'FAKE'")
    expect(customPluginRule.success).toBeFalsy()
  }

  test('can find plugins', () => {
    const rule = {
      rule: 'custom',
      plugin: 'Example Plugin',
      name: 'checkThing'
    }
    const customPluginRule = findPluginInfo(rule, mockContext)
    expect(customPluginRule.success).toBeTruthy()
    expect(customPluginRule).toMatchSnapshot()
  }
})
