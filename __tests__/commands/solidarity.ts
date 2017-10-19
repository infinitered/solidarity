const checkCommand = require('../../src/commands/solidarity')

test('Snapshot check default command', () => {
  expect(checkCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(checkCommand.description).toBeTruthy()
  expect(checkCommand.run).toBeTruthy()
  expect(typeof checkCommand.run).toBe('function')
})
