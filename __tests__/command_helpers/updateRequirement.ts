import updateRequirement from '../../src/extensions/functions/updateRequirement'

const requirements = {
  fail: [{ rule: 'cli', binary: 'tacos'}],
  success: [{ rule: 'cli', binary: 'node', semver: '0.0.0'}]
}

const solidarity = {
  getSolidaritySettings: jest.fn(() => ({
    requirements
  })),
  setSolidaritySettings: jest.fn(),
  updateRequirement: jest.fn()
}

const mockContext = {
  solidarity,
  print: {
    spin: jest.fn(),
    error: jest.fn()
  }
}

test('updateRequirement exists', () => expect(updateRequirement).toMatchSnapshot())

test('updateVersions pulls solidarity settings', async () => {
  const theVoid = await updateRequirement({}, {}, mockContext)
  expect(theVoid).toMatchSnapshot()
  expect(mockContext.print.spin.mock.calls.length).toBe(1)
})

test('updateVersions pulls solidarity settings', async () => {
  const theVoid = await updateRequirement(requirements.success, {}, mockContext)
  expect(theVoid).toMatchSnapshot()
  console.log('\n\n\n', theVoid)
})
