const test = require('ava')
const binaryExists = require('../../dist/extensions/functions/binaryExists')

const doesNotExistCLI = 'no_way_this_should_be_real'

const alwaysExistCLI = 'node'

const context = require('gluegun')

test('false on missing binary', async t => {
  t.is(await binaryExists(doesNotExistCLI, context), false)
})

test('true on existing binary', async t => {
  t.is(await binaryExists(alwaysExistCLI, context), true)
})
