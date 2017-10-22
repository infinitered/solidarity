import { solidarity } from '../../src';
import getSolidaritySettings from '../../src/extensions/functions/getSolidaritySettings'

const context = require('gluegun')

describe('getSolidaritySettings', () => {
  describe('w/ .solidarity', () => {
    test('getSolidaritySettings exists', () => expect(getSolidaritySettings).toMatchSnapshot())
    
    test('getSolidaritySettings succeeds', async () => {
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({requirements: {}})
    })
  })
  
  test('getSolidaritySettings can fail', async () => {
    expect(() => {
      process.chdir('__tests__')
      const resultSettings = getSolidaritySettings(context)
    }).toThrow()
    process.chdir('../')
  })
})

