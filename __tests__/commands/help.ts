const helpCommand = require('../../src/commands/help')

test('Snapshot check help command', () => {
  expect(helpCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(helpCommand.description).toBeTruthy()
  expect(helpCommand.run).toBeTruthy()
  expect(typeof helpCommand.run).toBe('function')
})
