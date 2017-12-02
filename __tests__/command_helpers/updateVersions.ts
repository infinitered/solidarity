import updateVersions from '../../src/extensions/functions/updateVersions'
const solidarity = {
  getSolidaritySettings: jest.fn(() => ({
    requirements: {
      nachos: [{ rule: 'cli', binary: 'node', semver: '0.0.0'}]
    }
  })),
  setSolidaritySettings: jest.fn(),
  updateRequirement: jest.fn()
}

const mockContext = {
  ...require('mockContext'),
  solidarity
}

test('updateVersions exists', () => expect(updateVersions).toMatchSnapshot())

test('updateVersions pulls solidarity settings', async () => {
  const theVoid = await updateVersions(mockContext)
  expect(solidarity.getSolidaritySettings).toHaveBeenCalled()
  // expect(mockContext.print.success).toHaveBeenCalled()
  expect(theVoid).toMatchSnapshot()
})

test('updateVersions prints success', async () => {
  await updateVersions(mockContext)
  // expect(mockContext.print.success).toHaveBeenCalled()

})
