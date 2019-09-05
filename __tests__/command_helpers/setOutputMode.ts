import { SolidarityOutputMode } from '../../src/types'
import setOutputMode from '../../src/extensions/functions/setOutputMode'

test('default output mode', () => {
  const params = { options: {} }
  const settings = {}
  const result = setOutputMode(params, settings)

  expect(result).toEqual(SolidarityOutputMode.MODERATE)
})

test('settings output mode', () => {
  const params = { options: {} }
  const settings = { config: { output: 'SILENT' } }
  const result = setOutputMode(params, settings)

  expect(result).toEqual(SolidarityOutputMode.SILENT)
})

test('verbose output mode', () => {
  const params = { options: { verbose: true } }
  const settings = {}
  const result = setOutputMode(params, settings)

  expect(result).toEqual(SolidarityOutputMode.VERBOSE)
})

test('silent output mode', () => {
  const params = { options: { silent: true } }
  const settings = {}
  const result = setOutputMode(params, settings)

  expect(result).toEqual(SolidarityOutputMode.SILENT)
})

test('moderate output mode', () => {
  const params = { options: { moderate: true } }
  const settings = {}
  const result = setOutputMode(params, settings)

  expect(result).toEqual(SolidarityOutputMode.MODERATE)
})
