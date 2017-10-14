import test from 'ava'
import helpCommand from '../../dist/commands/help'

test('Snapshot check help command', t => {
  t.snapshot(helpCommand)
})

test('Enforce required properties', t => {
  t.truthy(helpCommand.description)
  t.truthy(helpCommand.run)
  t.is(typeof helpCommand.run, 'function')
})
