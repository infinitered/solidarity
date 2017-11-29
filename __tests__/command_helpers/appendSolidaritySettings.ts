import appendSolidaritySettings from '../../src/extensions/functions/appendSolidaritySettings'
import { keys } from 'ramda'

describe('appendSolidaritySettings', () => {
  it('appends the given setting to the existing settings', () => {
    const solidaritySettings = {
      $schema: './solidaritySchema.json',
      requirements: {
        ['Some requirement']: [{ rule: 'env' }],
        ['Some other requirement']: [{ rule: 'env' }]
      }
    }

    const newRequirement = {
      ['Some New Requirement']: [{ rule: 'cli' }]
    }

    const newSettings = appendSolidaritySettings(solidaritySettings, newRequirement)
    expect(keys(newSettings.requirements).length).toEqual(3)
  })
})
