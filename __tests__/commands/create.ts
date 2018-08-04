import createCommand from '../../src/commands/create'
const mockContext = require('mockContext')

test('Snapshot create command', () => {
  expect(createCommand).toMatchSnapshot()
})

it('enforces required properties', () => {
  expect(createCommand.description).toBeTruthy()
  expect(createCommand.run).toBeTruthy()
  expect(typeof createCommand.run).toBe('function')
})

test('check solidarity create with no parameter', async () => {
  await createCommand.run(mockContext)
  expect(mockContext.print.error.mock.calls).toEqual([['Missing what to create'], ['$ solidarity create <wut?>']])
  expect(mockContext.print.info.mock.calls.length).toBe(1)
})

test('check solidarity create with plugin', async () => {
  const goodContext = {
    ...mockContext,
    parameters: { first: 'plugin' },
    solidarity: { createPlugin: jest.fn() },
  }
  await createCommand.run(goodContext)
  expect(goodContext.solidarity.createPlugin).toBeCalled()

  // now make it fail
  const errorString = 'ER MA GERD ARRAWRS'
  goodContext.solidarity.createPlugin = jest.fn(() => {
    throw Error(errorString)
  })
  await createCommand.run(goodContext)
  expect(goodContext.print.error.mock.calls.slice(-1).toString()).toEqual(`Error: ${errorString}`)
})
