import helpCommand from '../../src/commands/help'

let counter = 0
const context = {
  print: {
    info: () => counter++,
    printCommands: () => counter++,
    success: () => counter++,
    colors: {
      magenta: () => counter++
    }
  }
}

test('Snapshot check help command', () => {
  expect(helpCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(helpCommand.description).toBeTruthy()
  expect(helpCommand.run).toBeTruthy()
  expect(typeof helpCommand.run).toBe('function')
})

test('Hash run command printing', () => {
  expect(counter).toBe(0)
  helpCommand.run(context)
  expect(counter).toBe(11)
})
