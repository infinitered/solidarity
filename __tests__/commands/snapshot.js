const snapshotCommand = require('../../dist/commands/snapshot')

test('Snapshot check snapshot command', () => {
  expect(snapshotCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(snapshotCommand.description).toBeTruthy()
  expect(snapshotCommand.run).toBeTruthy()
  expect(typeof snapshotCommand.run).toBe('function')
})
