import test from 'ava'
import checkCommand from '../../dist/commands/solidarity'

test('Snapshot check default command', t => {
  t.snapshot(checkCommand)
})

test('Enforce required properties', t => {
  t.truthy(checkCommand.description)
  t.truthy(checkCommand.run)
  t.is(typeof checkCommand.run, 'function')
})
