import setSolidaritySettings from '../../src/extensions/functions/setSolidaritySettings'

const goodSettings = {
  requirements: [],
}
const badSettings = {}
const mockContext = {
  print: {
    error: jest.fn(),
  },
  filesystem: {
    write: jest.fn(),
  },
}

test('setSolidaritySettings exists', () => expect(setSolidaritySettings).toMatchSnapshot())

test('check good setSolidarity path', () => {
  const resultVoid = setSolidaritySettings(goodSettings, mockContext)
  expect(resultVoid).toMatchSnapshot()
  expect(mockContext.filesystem.write.mock.calls.length).toBe(1)
})

test('check failed setSolidarity path', () => {
  expect(() => {
    setSolidaritySettings(badSettings, mockContext)
  }).toThrowError('You must have a requirements key to be a valid solidarity file')
})
