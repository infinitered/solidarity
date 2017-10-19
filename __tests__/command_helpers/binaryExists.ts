import binaryExists from '../../src/extensions/functions/binaryExists'
import context from 'gluegun'

const doesNotExistCLI = 'no_way_this_should_be_real'
const alwaysExistCLI = 'node'

test('false on missing binary', async () => {
  expect(await binaryExists(doesNotExistCLI, context)).toBe(false)
})

test('true on existing binary', async () => {
  expect(await binaryExists(alwaysExistCLI, context)).toBe(true)
})
