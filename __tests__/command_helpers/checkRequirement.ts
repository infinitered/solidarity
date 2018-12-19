import { toPairs } from 'ramda'
import { strings } from 'gluegun/toolbox'

import checkRequirement from '../../src/extensions/functions/checkRequirement'
import solidarityExtension from '../../src/extensions/solidarity-extension'

// Setup checkCLI
jest.mock('../../src/extensions/functions/checkCLI')
const checkCLI = require('../../src/extensions/functions/checkCLI')

// Setup checkDir
jest.mock('../../src/extensions/functions/checkDir')
const checkDir = require('../../src/extensions/functions/checkDir')

// Setup checkENV
jest.mock('../../src/extensions/functions/checkENV')
const checkENV = require('../../src/extensions/functions/checkENV')

// Setup checkENV
jest.mock('../../src/extensions/functions/checkFile')
const checkFile = require('../../src/extensions/functions/checkFile')

const context = require('gluegun/toolbox')

const badRule = toPairs({
  YARN: [{ rule: 'knope', binary: 'yarn' }],
})[0]

let fail
let stop
let succeed

describe('checkRequirement', () => {
  beforeEach(() => {
    fail = jest.fn()
    stop = jest.fn()
    succeed = jest.fn()
    const spinner = {
      fail,
      stop,
      succeed,
    }

    solidarityExtension(context)
    context.print = {
      spin: jest.fn(() => spinner),
      error: jest.fn(),
    }
    context.strings = strings
    context.system = {
      spawn: jest.fn().mockReturnValue(
        Promise.resolve({
          stdout: 'you did it!',
          status: 0,
        })
      ),
    }
  })

  test('when an invalid rule is given', async () => {
    await expect(checkRequirement(badRule, context)).rejects.toThrow()
  })

  describe('when rule: cli', () => {
    beforeEach(() => checkCLI.mockClear())

    test('sad path', async () => {
      checkCLI.mockImplementation(async () => 'Everything is broken')

      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual('Everything is broken')
    })

    test('happy path', async () => {
      checkCLI.mockImplementation(async () => false)

      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(false)
    })

    test('inject versions', async () => {
      checkCLI.mockImplementation(async () => "Wanted: '~1.5.1', Installed '1.3.2'")

      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual("Wanted: '~1.5.1', Installed '1.3.2'")
    })
  })

  describe('when rule: dir', () => {
    beforeEach(() => checkDir.mockClear())

    test('happy path', async () => {
      checkDir.mockImplementation(() => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'dir', location: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(false)
    })

    test('directory alias', async () => {
      checkDir.mockImplementation(() => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'directory', location: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual('It worked!')
    })

    test('sad path', async () => {
      checkDir.mockImplementation(() => false)

      const rule = toPairs({
        YARN: [{ rule: 'dir', location: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual("'yarn' directory not found")
    })
  })

  describe('when rule: env', () => {
    beforeEach(() => checkENV.mockClear())

    test('happy path', async () => {
      checkENV.mockImplementation(async () => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'env', variable: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual('It worked!')
    })

    test('sad path', async () => {
      checkENV.mockImplementation(async () => undefined)

      const rule = toPairs({
        YARN: [{ rule: 'env', variable: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(undefined)
    })
  })

  describe('when rule: file', () => {
    beforeEach(() => checkFile.mockClear())

    test('happy path', async () => {
      checkFile.mockImplementation(() => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'file', location: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(false)
    })

    test('sad path', async () => {
      checkFile.mockImplementation(() => undefined)

      const rule = toPairs({
        YARN: [{ rule: 'file', location: 'yarn' }],
      })[0]
      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual("'yarn' file not found")
    })
  })

  describe('when rule fails with custom error messages', () => {
    const customError = 'customError'

    test('failed CLI rule with custom message', async () => {
      checkCLI.mockClear()
      checkCLI.mockImplementation(() => customError)
      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'gazorpazorp', error: customError }],
      })[0]

      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(customError)
    })

    test('failed ENV rule with custom message', async () => {
      checkCLI.mockClear()
      checkCLI.mockImplementation(() => true)
      const rule = toPairs({
        BADENV: [{ rule: 'env', variable: 'gazorpazorp', error: customError }],
      })[0]

      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(undefined)
    })

    test('failed DIR rule with custom message', async () => {
      const rule = toPairs({
        YARN: [{ rule: 'dir', location: 'gazorpazorp', error: customError }],
      })[0]

      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(false)
    })

    test('failed FILE rule with custom message', async () => {
      const rule = toPairs({
        YARN: [{ rule: 'file', location: 'gazorpazorp', error: customError }],
      })[0]

      const listrTask = await checkRequirement(rule, context)
      const result = await listrTask.storedInit[0].task()
      expect(result).toEqual(undefined)
    })

    // test('failed SHELL rule with custom message', async () => {
    //   const rule = toPairs({
    //     YARN: [{ rule: 'shell', match: 'hello', command: 'mocked', error: customError }],
    //   })[0]
    //   const listrTask = await checkRequirement(rule, context)
    //   const result = await listrTask.storedInit[0].task()
    //   expect(result).toEqual(customError)
    // })
  })
})
