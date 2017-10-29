import checkCommand from '../../src/commands/solidarity'

const mockContext = {
  print: {
    error: jest.fn(),
    success: jest.fn()
  },
  parameters: {
    options: {}
  },
  solidarity: {
    checkRequirement: jest.fn(),
    getSolidaritySettings: jest.fn(() => ({
      config: {}
    }))
  }
}

test('Snapshot check default command', () => {
  expect(checkCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(checkCommand.description).toBeTruthy()
  expect(checkCommand.run).toBeTruthy()
  expect(typeof checkCommand.run).toBe('function')
})

test('check solidarity run', async () => {
  const result = await checkCommand.run(mockContext)
  expect(result).toMatchSnapshot()
  expect(mockContext.solidarity.getSolidaritySettings.mock.calls.length).toBe(1)
})
