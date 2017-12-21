import updateVersions from '../../src/extensions/functions/updateVersions'
const solidarity = {
  getSolidaritySettings: jest.fn(() => ({
    requirements: {
      nachos: [{ rule: 'cli', binary: 'nachos' }],
    },
  })),
  setSolidaritySettings: jest.fn(),
  updateRequirement: jest.fn(async () => [['Setting nachos to 42']]),
}

const mockContext = require('mockContext')

const mockContextWithRules = {
  ...mockContext,
  solidarity,
}

test('updateVersions exists', () => expect(updateVersions).toMatchSnapshot())

test('updateVersions pulls solidarity settings', async () => {
  const theVoid = await updateVersions(mockContext)
  expect(mockContext.solidarity.getSolidaritySettings).toHaveBeenCalled()
  expect(theVoid).toMatchSnapshot()
})

test('updateVersions prints success with no changes', async () => {
  await updateVersions(mockContext)
  expect(mockContext.print.success).toHaveBeenCalled()
  expect(mockContext.print.success.mock.calls[0][0]).toBe('\n No Changes')
})

test('updateVersions prints success with number of changes', async () => {
  await updateVersions(mockContextWithRules)
  expect(mockContextWithRules.print.success).toHaveBeenCalled()
  expect(mockContextWithRules.print.success.mock.calls[2][0]).toBe('\n 1 Rule updated')
})
