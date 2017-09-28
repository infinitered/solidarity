import test from 'ava'
import baseRuntimeConfiguration from '../src/index'
import baseRuntime from '../src/runtime'

test('Verify Runtime AND Configuration', t => {
  t.snapshot(baseRuntimeConfiguration)
  t.snapshot(baseRuntime)
})
