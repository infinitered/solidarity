const test = require('ava')
const baseRuntimeConfiguration = require('../dist/index')

test('Verify Runtime AND Configuration', t => {
  t.snapshot(baseRuntimeConfiguration)
})
