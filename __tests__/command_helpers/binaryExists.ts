import binaryExists from '../../src/extensions/functions/binaryExists'
import * as context from 'gluegun/toolbox'

const doesNotExistCLI = 'no_way_this_should_be_real'
const alwaysExistCLI = 'node'

test('error on missing binary', async () => {
  expect(binaryExists(doesNotExistCLI, context)).toBeFalsy()
})

test('true on existing binary', () => {
  expect(binaryExists(alwaysExistCLI, context)).toBe(true)
})
