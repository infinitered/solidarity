import test from 'ava'
import baseRuntimeConfiguration from '../src/index'

test('Verify Runtime AND Configuration', t => {
  t.snapshot(baseRuntimeConfiguration)
})
