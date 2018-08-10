import getSolidaritySettings from '../../src/extensions/functions/getSolidaritySettings'

const context = require('mockContext')

describe('basic getSolidaritySettings', () => {
  describe('w/ success', () => {
    test('getSolidaritySettings exists', () => expect(getSolidaritySettings).toMatchSnapshot())

    test('getSolidaritySettings succeeds', async () => {
      const resultSettings = await getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
    })

    test('getSolidaritySettings succeeds', async () => {
      process.chdir('__tests__/sandbox/solidarity_json')
      const resultSettings = await getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      process.chdir('../../../')
    })
  })

  describe('w/ failure', () => {
    test('getSolidaritySettings can fail', async () => {

      // Original sync style
      // expect(async () => {
      //   process.chdir('__tests__')
      //   getSolidaritySettings(context)
      // }).toThrow()
      // process.chdir('../')

      process.chdir('__tests__')
      await expect(getSolidaritySettings(context))
        .rejects
        .toThrow()
      process.chdir('../')
    })

    test('getSolidaritySettings can warn with missing requirements', async () => {
      process.chdir('__tests__/sandbox/solidarity_broken')
      await expect(getSolidaritySettings(context))
        .rejects
        .toThrow()
      process.chdir('../../../')
    })
  })
})

describe('parameterized getSolidaritySettings', () => {
  test('custom path with -f', async () => {
    context.parameters.options = { f: '__tests__/sandbox/solidarity_json' }
    const resultSettings = await getSolidaritySettings(context)
    // we got an object with requirements defined
    expect(resultSettings).toMatchObject({ requirements: {} })
    context.parameters.options = {}
  })

  test('custom path with --solidarityFile', async () => {
    context.parameters.options = { solidarityFile: '__tests__/sandbox/solidarity_json' }
    const resultSettings = await getSolidaritySettings(context)
    // we got an object with requirements defined
    expect(resultSettings).toMatchObject({ requirements: {} })
    context.parameters.options = {}
  })

  test('failing path message', async () => {
    // test longhand
    context.parameters.options = { solidarityFile: '__tests__/fake' }
    await expect(getSolidaritySettings(context))
        .rejects
        .toThrow('ERROR: There is no solidarity file at the given path')

    // test shorthand
    context.parameters.options = { f: '__tests__/fake' }
    await expect(getSolidaritySettings(context))
        .rejects
        .toThrow('ERROR: There is no solidarity file at the given path')

    context.parameters.options = {}
  })

  describe('custom module tests', () => {
    beforeAll(() => {
      process.chdir('__tests__/sandbox/fake_project')
    })

    test('can find solidarity file in module with flag -m', async () => {
      context.parameters.options = { m: 'mock_module' }
      const resultSettings = await getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      context.parameters.options = {}
    })

    test('can find solidarity file in module with flag --module', async () => {
      context.parameters.options = { module: 'mock_module' }
      const resultSettings = await getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      context.parameters.options = {}
    })

    test('can find solidarity JSON file in module with flag --module', async () => {
      context.parameters.options = { module: 'mock_second_module' }
      const resultSettings = await getSolidaritySettings(context)
      // we got an object with requirements defined
      expect(resultSettings).toMatchObject({ requirements: {} })
      context.parameters.options = {}
    })

    test('errors if no solidarity file in module', async () => {
      context.parameters.options = { module: 'nope' }
      await expect(getSolidaritySettings(context))
        .rejects
        .toThrow('ERROR: There is no solidarity file found with the given module');
      context.parameters.options = {}
    })

    afterAll(() => {
      process.chdir('../../../')
    })
  })
})
