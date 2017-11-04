const updateRequirement = require('../../src/extensions/functions/updateRequirement')

const mockContext = {
  print: {
    spin: jest.fn(() => ({
      succeed: jest.fn(),
      stop: jest.fn()
    })),
    error: jest.fn()
  }
}

test('updateRequirement exists', () => expect(updateRequirement).toMatchSnapshot())

test('updateRequirement empty still spins', async () => {
  const theVoid = await updateRequirement([], {}, mockContext)
  expect(theVoid).toMatchSnapshot()
  expect(mockContext.print.spin.mock.calls.length).toBe(1)
})

test('updateRequirement explains missing binary', async () => {
  const requirement = ['Failure', [{ rule: 'cli', binary: 'fakeland', semver: '0.0.0'}]]
  const failesauce = await updateRequirement(requirement, {}, mockContext)
  expect(failesauce).toEqual([ 'Binary \'fakeland\' not found' ])
})
