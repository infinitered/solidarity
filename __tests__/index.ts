jest.mock('gluegun', () => {
  const buildContext = {}
  buildContext.build = jest.fn(() => buildContext)
  buildContext.brand = jest.fn(() => buildContext)
  buildContext.src = jest.fn(() => buildContext)
  buildContext.plugins = jest.fn(() => buildContext)
  buildContext.create = jest.fn(() => buildContext)
  buildContext.run = jest.fn(() => buildContext)
  return buildContext
})
import baseRuntimeConfiguration from '../src/index'
import { build } from 'gluegun'

test('Verify Runtime AND Configuration', () => {
  expect(baseRuntimeConfiguration).toMatchSnapshot()
})

test('ensure build', async () => {
  const result = await baseRuntimeConfiguration()
  expect(result).toMatchSnapshot()
  expect(build.mock.calls.length).toBe(1)
  expect(build().brand.mock.calls.length).toBe(1)
  expect(build().brand.mock.calls[0][0]).toBe('solidarity')
  expect(build().src.mock.calls.length).toBe(1)
  // Check local and globals for Windows/Darwin + Yarn === 4 checks
  expect(build().plugins.mock.calls.length).toBe(4)
  expect(build().create.mock.calls.length).toBe(1)
  expect(build().run.mock.calls.length).toBe(1)
})
