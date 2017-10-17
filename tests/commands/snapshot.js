const test = require('ava')
const snapshotCommand = require('../../dist/commands/snapshot')

test('Snapshot check snapshot command', t => {
  t.snapshot(snapshotCommand)
})

test('Enforce required properties', t => {
  t.truthy(snapshotCommand.description)
  t.truthy(snapshotCommand.run)
  t.is(typeof snapshotCommand.run, 'function')
})
