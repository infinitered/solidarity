jest.mock('envinfo')

import reportCommand from '../../src/commands/report'
const mockContext = require('mockContext')

test('Snapshot check help command', () => {
  expect(reportCommand).toMatchSnapshot()
})

it('enforces required properties', () => {
  expect(reportCommand.description).toBeTruthy()
  expect(reportCommand.run).toBeTruthy()
  expect(typeof reportCommand.run).toBe('function')
})

test('check solidarity report', async () => {
  const result = await reportCommand.run(mockContext)
  expect(mockContext.print.spin.mock.calls).toEqual([
    ['Building Report']
  ])
})
