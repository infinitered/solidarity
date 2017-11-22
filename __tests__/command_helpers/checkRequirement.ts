import { SolidarityRequirement } from '../../dist/types'
import { toPairs } from 'ramda'

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

const context = require('gluegun')

const badRule = toPairs({
  YARN: [{ rule: 'knope', binary: 'yarn' }]
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
      succeed
    }

    solidarityExtension(context)
    context.print = {
      spin: jest.fn(() => spinner),
      error: jest.fn()
    }
  })

  test('there is a spinner message', async () => {
    const result = await checkRequirement(badRule, context)
    expect(context.print.spin.mock.calls).toEqual([
      ['Verifying YARN']
    ])
  })

  test('when an invalid rule is given', async () => {
    const result = await checkRequirement(badRule, context)
    expect(result).toEqual(['Encountered unknown rule'])
  })

  describe('when rule: cli', () => {
    beforeEach(() => checkCLI.mockClear())

    test('sad path', async () => {
      checkCLI.mockImplementation(async () => 'Everything is broken')

      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual(['Everything is broken'])
    })

    test('happy path', async () => {
      checkCLI.mockImplementation(async () => false)

      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual([[]])
    })
  })

  describe('when rule: dir', () => {
    beforeEach(() => checkDir.mockClear())

    test('happy path', async () => {
      checkDir.mockImplementation(() => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'dir', location: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual([[]])
    })

    test('directory alias', async () => {
      checkDir.mockImplementation(() => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'directory', location: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual([[]])
    })

    test('sad path', async () => {
      checkDir.mockImplementation(() => false)

      const rule = toPairs({
        YARN: [{ rule: 'dir', location: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual(["'yarn' directory not found"])
    })
  })

  describe('when rule: env', () => {
    beforeEach(() => checkENV.mockClear())

    test('happy path', async () => {
      checkENV.mockImplementation(async () => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'env', variable: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual([[]])
    })

    test('sad path', async () => {
      checkENV.mockImplementation(async () => undefined)

      const rule = toPairs({
        YARN: [{ rule: 'env', variable: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual(["'$yarn' environment variable not found"])
    })
  })

  describe('when rule: file', () => {
    beforeEach(() => checkFile.mockClear())

    test('happy path', async () => {
      checkFile.mockImplementation(() => 'It worked!')

      const rule = toPairs({
        YARN: [{ rule: 'file', location: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual([[]])
    })

    test('sad path', async () => {
      checkFile.mockImplementation(() => undefined)

      const rule = toPairs({
        YARN: [{ rule: 'file', location: 'yarn' }]
      })[0]
      const result = await checkRequirement(rule, context)
      expect(result).toEqual(["'yarn' file not found"])
    })
  })

  describe('when rule fails with custom error messages', () => {
    const customError = 'customError'

    test('failed CLI rule with custom message', async () => {
      checkCLI.mockClear()
      checkCLI.mockImplementation(() => true)
      const rule = toPairs({
        YARN: [{ rule: 'cli', binary: 'gazorpazorp', error: customError }]
      })[0]

      const result = await checkRequirement(rule, context)
      expect(result).toEqual([customError])
    })

    test('failed ENV rule with custom message', async () => {
      const rule = toPairs({
        YARN: [{ rule: 'env', variable: 'gazorpazorp', error: customError }]
      })[0]

      const result = await checkRequirement(rule, context)
      expect(result).toEqual([customError])
    })

    test('failed DIR rule with custom message', async () => {
      const rule = toPairs({
        YARN: [{ rule: 'dir', location: 'gazorpazorp', error: customError }]
      })[0]

      const result = await checkRequirement(rule, context)
      expect(result).toEqual([customError])
    })

    test('failed FILE rule with custom message', async () => {
      const rule = toPairs({
        YARN: [{ rule: 'file', location: 'gazorpazorp', error: customError }]
      })[0]

      const result = await checkRequirement(rule, context)
      expect(result).toEqual([customError])
    })
  })
})
