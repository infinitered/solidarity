import baseRuntimeConfiguration from '../src/index'

test('Verify Runtime AND Configuration', () => {
  expect(baseRuntimeConfiguration).toMatchSnapshot()
})

test('ensure build', async () => {
  const result = await baseRuntimeConfiguration()
  expect(result).toMatchSnapshot()
})
