import appendSolidaritySettings from '../../src/extensions/functions/appendSolidaritySettings'
import { keys } from 'ramda'

describe('appendSolidaritySettings', () => {
  it('appends the given requirement to the existing settings', () => {
    const solidaritySettings = {
      $schema: './solidaritySchema.json',
      requirements: {
        oneTest: [{ rule: 'env' }],
        twoTest: [{ rule: 'env' }]
      }
    }

    const newRequirement = {
      twoTest: [{ rule: 'cli' }]
    }

    const newSettings = appendSolidaritySettings(solidaritySettings, newRequirement)

    expect(keys(newSettings.requirements).length).toEqual(2)
  })

  it('will append the given requirement to and existing requirement', () => {
    const solidaritySettings = {
      $schema: './solidaritySchema.json',
      requirements: {
        oneTest: [{ rule: 'env' }],
        twoTest: [{ rule: 'env' }]
      }
    }

    const newRequirement = {
      twoTest: [{ rule: 'cli' }]
    }

    let newSettings = appendSolidaritySettings(solidaritySettings, newRequirement)

    expect(keys(newSettings.requirements).length).toEqual(2)
    expect(newSettings.requirements.twoTest.length).toEqual(2)

    expect(Array.isArray(newSettings.requirements.twoTest[0])).toBe(false)
    expect(Array.isArray(newSettings.requirements.twoTest[1])).toBe(false)
  })
})
