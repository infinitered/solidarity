const binaryExists = require('../../dist/extensions/functions/binaryExists')

const doesNotExistCLI = 'no_way_this_should_be_real'

const alwaysExistCLI = 'node'

const context = require('gluegun')

test('false on missing binary', async () => {
  expect(await binaryExists(doesNotExistCLI, context)).toBe(false)
})

test('true on existing binary', async () => {
  expect(await binaryExists(alwaysExistCLI, context)).toBe(true)
})
