import { platform } from 'os';
import { toPairs } from 'ramda'
import updateRequirement from '../../src/extensions/functions/updateRequirement'
import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun')
// jest.mock('../../src/functions/skipRule')
// const skipRule = require('../../src/functions/skipRule')

// Seems weird that this is not used from what I can tell
const settings = {}

test('updateRequirement exists', () => expect(updateRequirement).toMatchSnapshot())

describe('updateRequirement', () => {
  beforeAll(() => {
    const spinner = {
      succeed: jest.fn(),
      stop: jest.fn()
    }

    context.print = {
      spin: jest.fn(() => spinner),
      error: jest.fn(),
    }
  })

  describe('given skipRule returns true', () => {
    test('it returns an empty []', async () => {

      const requirement = toPairs({
        Yarn: [{
          "rule": "cli",
          "binary": "yarn",
          "version": "--version"
        }]
      })[0]


      const result = await updateRequirement(requirement, settings, context)
      expect(result).toEqual([[]])
    })
  })
})
