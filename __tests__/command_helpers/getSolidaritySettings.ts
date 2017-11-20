import { solidarity } from '../../src';
import getSolidaritySettings from '../../src/extensions/functions/getSolidaritySettings'

const context = require('gluegun')

describe('getSolidaritySettings', () => {
  describe('w/ success', () => {
    test('getSolidaritySettings exists', () => expect(getSolidaritySettings).toMatchSnapshot())

    test('getSolidaritySettings succeeds', async () => {
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({requirements: {}})
    })

    test('getSolidaritySettings succeeds', async () => {
      process.chdir('__tests__/sandbox/solidarity_json')
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({requirements: {}})
      process.chdir('../../../')
    })
  })

  test('getSolidaritySettings can fail', async () => {
    expect(() => {
      process.chdir('__tests__')
      const resultSettings = getSolidaritySettings(context)
    }).toThrow()
    process.chdir('../')
  })

  test('getSolidaritySettings can warn with missing requirements', async () => {
    expect(() => {
      process.chdir('__tests__/sandbox/solidarity_broken')
      const resultSettings = getSolidaritySettings(context)
    }).toThrowError('ERROR: Found, but no requirements key.  Please validate your solidarity file')
    process.chdir('../../../')
  })
})
