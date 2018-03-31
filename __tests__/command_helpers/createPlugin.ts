const createPlugin: Function = require('../../src/extensions/functions/createPlugin')
const context = require('mockContext')

test('check result shape', () => {
  expect(createPlugin).toMatchSnapshot()
})

test('investigate createPlugin', async () => {
  const result = await createPlugin(context)
  expect(result).toMatchSnapshot()
  expect(context.template.generate).toBeCalled()
  expect(context.prompt.ask).toBeCalled()
  expect(context.prompt.confirm).toBeCalled()
  expect(context.print.success).toBeCalled()
})

describe('checking plugin paths', () => {

  beforeEach(() => {
    const mockedPrompt = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ plugin: 'Nachos' }))
      .mockImplementationOnce(() => Promise.resolve({ pluginDesc: 'das nachos plugin' }))

    context.prompt.ask = mockedPrompt
  })

  test(`Choice 1 - 'I do not want a generated rule file'`, async () => {
    context.prompt.ask.mockImplementationOnce(() => Promise.resolve({
      ruleChoice: 'I do not want a generated rule file'
    }))

    const result = await createPlugin(context)
    expect(result).toMatchSnapshot()
  })

  test(`Choice 2 - 'Just a simple rule template'`, async () => {
    context.prompt.ask.mockImplementationOnce(() => Promise.resolve({
      ruleChoice: 'Just a simple rule template'
    }))

    const result = await createPlugin(context)
    expect(result).toMatchSnapshot()
  })

  test(`Choice 3 - 'Template + optional rules'`, async () => {
    context.prompt.ask.mockImplementationOnce(() => Promise.resolve({
      ruleChoice: 'Template + optional rules'
    }))

    const result = await createPlugin(context)
    expect(result).toMatchSnapshot()
  })

})
