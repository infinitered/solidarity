import test from 'ava'
import checkCommand from '../../src/commands/check'

test('Snapshot check command check', t => {
  t.snapshot(checkCommand)
})
