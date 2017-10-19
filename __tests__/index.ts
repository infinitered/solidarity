const baseRuntimeConfiguration = require('../dist/index')

test('Verify Runtime AND Configuration', () => {
  expect(baseRuntimeConfiguration).toMatchSnapshot()
})
