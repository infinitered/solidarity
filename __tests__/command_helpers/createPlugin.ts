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
})
