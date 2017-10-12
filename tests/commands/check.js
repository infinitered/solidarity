import test from 'ava'
import checkCommand from '../../dist/commands/solidarity'

test('Snapshot check default command', t => {
  t.snapshot(checkCommand)
})
