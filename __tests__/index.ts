import baseRuntimeConfiguration from '../src/index'

test('Verify Runtime AND Configuration', () => {
  expect(baseRuntimeConfiguration).toMatchSnapshot()
})
