import updateVersions from '../../src/extensions/functions/updateVersions'
const solidarity = {
  getSolidaritySettings: jest.fn(() => ({
    requirements: {
      nachos: [{ rule: 'cli', binary: 'tacos'}]
    }
  })),
  setSolidaritySettings: jest.fn(),
  updateRequirement: jest.fn()
}

const mockContext = { solidarity, print: jest.fn() }

test('updateVersions exists', () => expect(updateVersions).toMatchSnapshot())

test('updateVersions pulls solidarity settings', () => {
  const theVoid = updateVersions(mockContext)
  expect(theVoid).toMatchSnapshot()
})
