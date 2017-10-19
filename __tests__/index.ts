const baseRuntimeConfiguration = require('../src/index')

test('Verify Runtime AND Configuration', () => {
  expect(baseRuntimeConfiguration).toMatchSnapshot()
})
