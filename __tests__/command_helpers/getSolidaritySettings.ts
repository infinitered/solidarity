import getSolidaritySettings from '../../src/extensions/functions/getSolidaritySettings'

const context = require('mockContext')

describe('basic getSolidaritySettings', () => {
  describe('w/ success', () => {
    test('getSolidaritySettings exists', () => expect(getSolidaritySettings).toMatchSnapshot())

    test('getSolidaritySettings succeeds', () => {
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
    })

    test('getSolidaritySettings succeeds', () => {
      process.chdir('__tests__/sandbox/solidarity_json')
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      process.chdir('../../../')
    })
  })

  describe('w/ failure', () => {
    test('getSolidaritySettings can fail', () => {
      expect(() => {
        process.chdir('__tests__')
        getSolidaritySettings(context)
      }).toThrow()
      process.chdir('../')
    })

    test('getSolidaritySettings can warn with missing requirements', () => {
      expect(() => {
        process.chdir('__tests__/sandbox/solidarity_broken')
        getSolidaritySettings(context)
      }).toThrowError('ERROR: Found, but no requirements key.  Please validate your solidarity file')
      process.chdir('../../../')
    })
  })
})

describe('parameterized getSolidaritySettings', () => {
  test('custom path with -f', () => {
    context.parameters.options = { f: '__tests__/sandbox/solidarity_json' }
    const resultSettings = getSolidaritySettings(context)
    // we got an object with requirements defined
    expect(resultSettings).toMatchObject({ requirements: {} })
    context.parameters.options = {}
  })

  test('custom path with --solidarityFile', () => {
    context.parameters.options = { solidarityFile: '__tests__/sandbox/solidarity_json' }
    const resultSettings = getSolidaritySettings(context)
    // we got an object with requirements defined
    expect(resultSettings).toMatchObject({ requirements: {} })
    context.parameters.options = {}
  })

  test('failing path message', () => {
    // test longhand
    context.parameters.options = { solidarityFile: '__tests__/fake' }
    expect(() => {
      getSolidaritySettings(context)
    }).toThrowError('ERROR: There is no solidarity file at the given path')
    // test shorthand
    context.parameters.options = { f: '__tests__/fake' }
    expect(() => {
      getSolidaritySettings(context)
    }).toThrowError('ERROR: There is no solidarity file at the given path')
    context.parameters.options = {}
  })

  describe('custom module tests', () => {
    beforeAll(() => {
      process.chdir('__tests__/sandbox/fake_project')
    })

    test('can find solidarity file in module with flag -m', () => {
      context.parameters.options = { m: 'mock_module' }
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      context.parameters.options = {}
    })

    test('can find solidarity file in module with flag --module', () => {
      context.parameters.options = { module: 'mock_module' }
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      context.parameters.options = {}
    })

    test('can find solidarity JSON file in module with flag --module', () => {
      context.parameters.options = { module: 'mock_second_module' }
      const resultSettings = getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      context.parameters.options = {}
    })

    test('errors if no solidarity file in module', () => {
      context.parameters.options = { module: 'nope' }
      expect(() => {
        getSolidaritySettings(context)
      }).toThrowError('ERROR: There is no solidarity file found with the given module')
      context.parameters.options = {}
    })

    afterAll(() => {
      process.chdir('../../../')
    })
  })
})
