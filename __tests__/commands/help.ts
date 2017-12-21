import helpCommand from '../../src/commands/help'

const context = {
  print: {
    info: jest.fn(),
    printCommands: jest.fn(),
    success: jest.fn(),
    colors: {
      magenta: jest.fn(),
    },
  },
}

test('Snapshot check help command', () => {
  expect(helpCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(helpCommand.description).toBeTruthy()
  expect(helpCommand.run).toBeTruthy()
  expect(typeof helpCommand.run).toBe('function')
})

test('Calls print items several times', () => {
  expect(context.print.info.mock.calls.length).toBe(0)
  expect(context.print.printCommands.mock.calls.length).toBe(0)
  expect(context.print.success.mock.calls.length).toBe(0)
  expect(context.print.colors.magenta.mock.calls.length).toBe(0)
  helpCommand.run(context)
  expect(context.print.info.mock.calls.length).toBe(6)
  expect(context.print.printCommands.mock.calls.length).toBe(1)
  expect(context.print.success.mock.calls.length).toBe(2)
  expect(context.print.colors.magenta.mock.calls.length).toBe(2)
})
