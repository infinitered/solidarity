import test from 'ava'
import helpers from '../../src/helpers/index'

test('Check helper exports', t => {
  t.snapshot(helpers)
})
