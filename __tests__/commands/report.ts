jest.mock('envinfo')

import reportCommand from '../../src/commands/report'
import { print as envinfoPrint } from 'envinfo'

test('Snapshot check help command', () => {
  expect(reportCommand).toMatchSnapshot()
})

it('enforces required properties', () => {
  expect(reportCommand.description).toBeTruthy()
  expect(reportCommand.run).toBeTruthy()
  expect(typeof reportCommand.run).toBe('function')
})

// test('check solidarity report', async () => {
//   const result = await reportCommand.run()
//   expect(envinfoPrint.mock.calls.length).toBe(1)
// })
