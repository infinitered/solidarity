import test from 'ava'
import checkCLI from '../../src/extensions/functions/checkCLI'

const doesNotExistCLI = {
  binary: 'no_way_this_should_be_real'
}

const alwaysExistCLI = {
  binary: 'node'
}

const context = require('gluegun')

test('error on missin binary', async t => {
  t.is(await checkCLI(doesNotExistCLI, context), `Binary '${doesNotExistCLI.binary}' not found`)
})

test('fine on existing binary', async t => {
  t.is(await checkCLI(alwaysExistCLI, context), undefined)
})
