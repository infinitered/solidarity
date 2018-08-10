import { isURI, loadFile, loadWebCheck } from '../../src/extensions/functions/getSolidarityHelpers'

const context = require('mockContext')

describe('Test helper functions', () => {
  describe('isURI', () => {
    test('isURI positive case', () => {
      expect(isURI('http://www.google.com')).toBeTruthy()
      expect(isURI('https://www.google.com')).toBeTruthy()
    })

    test('isURI fail case', () => {
      expect(isURI('nachos')).toBeFalsy()
      expect(isURI('/nachos')).toBeFalsy()
      expect(isURI('./nachos')).toBeFalsy()
    })

  })

  describe('loadFile', () => {
    test('loadFile positive cases', () => {
      expect(loadFile(context, '__tests__/sandbox/solidarity_json')).toBeTruthy()
      expect(loadFile(context, '__tests__/sandbox/solidarity_json/.solidarity.json')).toBeTruthy()
    })

    test('loadFile false cases', () => {
      expect(() => {
        loadFile(context, '__tests__/sandbox/fake_project')
      }).toThrow()
      expect(() => {
        loadFile(context, '__tests__/sandbox/fake_project/nope.solidarity')
      }).toThrow()
    })
  })

  // describe('loadModule', () => {
  // })

  describe('loadWebCheck', () => {
    test('loadWebCheck positive cases', async () => {
      expect(await loadWebCheck(context, 'https://raw.githubusercontent.com/infinitered/solidarity-stacks/master/stacks/react-native.solidarity')).toBeTruthy()
    })

    test('loadWebCheck false cases', async () => {
      await expect(loadWebCheck(context, 'https://raw.githubusercontent.com/infinitered/solidarity-stacks/master/stacks/failsauce'))
      .rejects
      .toThrow()
    })
  })
})
