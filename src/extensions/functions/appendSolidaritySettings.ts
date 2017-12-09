import { keys } from 'ramda'

module.exports = (solidaritySettings, newRequirement) => {
  const newRequirementKey = keys(newRequirement)
  const existingRequirementRules = solidaritySettings.requirements[newRequirementKey] || []

  return {
    ...solidaritySettings,
    requirements: {
      ...solidaritySettings.requirements,
      [newRequirementKey]: [
        ...existingRequirementRules,
        ...newRequirement[newRequirementKey]
      ]
    }
  }
}
