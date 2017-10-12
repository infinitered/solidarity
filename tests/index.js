import test from 'ava'
import baseRuntimeConfiguration from '../dist/index'

test('Verify Runtime AND Configuration', t => {
  t.snapshot(baseRuntimeConfiguration)
})
