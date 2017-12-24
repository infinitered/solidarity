import appendSolidaritySettings from '../../src/extensions/functions/appendSolidaritySettings'
import { keys } from 'ramda'
import solidarityExtension from '../../src/extensions/solidarity-extension'
import { solidarity } from '../../src/types'

const context = require('mockContext')

describe('appendSolidaritySettings', () => {
  beforeAll(() => {
    solidarityExtension(context)

    const solidaritySettings = {
      $schema: './solidaritySchema.json',
      requirements: {
        oneTest: [{ rule: 'cli' }, { rule: 'env', variable: 'ANDROID_HOME' }],
        twoTest: [{ rule: 'env' }],
      },
    }

    context.solidarity = {
      ...context.solidarity,
      getSolidaritySettings: jest.fn(() => solidaritySettings),
    }
  })

  it('appends the given requirement to the existing settings', () => {
    const newRequirement = {
      three: [{ rule: 'cli' }],
    }

    context.parameters = {
      first: 'cli',
    }

    const newSettings = appendSolidaritySettings(context, newRequirement)

    expect(keys(newSettings.requirements).length).toEqual(3)
    expect(keys(newSettings.requirements.three).length).toEqual(1)
  })

  it('will append the given requirement to and existing requirement', () => {
    context.parameters = {
      first: 'cli',
      second: 'ruby',
    }

    const newRequirement = {
      twoTest: [{ rule: 'cli', binary: 'ruby' }],
    }

    let newSettings = appendSolidaritySettings(context, newRequirement)

    expect(keys(newSettings.requirements).length).toEqual(2)
    expect(newSettings.requirements.twoTest.length).toEqual(2)

    expect(Array.isArray(newSettings.requirements.twoTest[0])).toBe(false)
    expect(Array.isArray(newSettings.requirements.twoTest[1])).toBe(false)
  })

  describe('given a requirement with a prexisting rule', () => {
    it('should just merge the rule w/ the existing rule', () => {
      context.parameters = {
        first: 'env',
      }

      const newRequirement = {
        oneTest: [
          {
            rule: 'env',
            variable: 'ANDROID_HOME',
            error:
              'The ANDROID_HOME environment variable must be set to your local SDK.  Refer to getting started docs for help.',
          },
        ],
      }

      let newSettings = appendSolidaritySettings(context, newRequirement)

      expect(keys(newSettings.requirements).length).toEqual(2)
      expect(newSettings.requirements.oneTest.length).toEqual(2)
    })
  })
})
