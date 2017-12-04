import { keys, isNil, append, reject } from 'ramda'

module.exports = (solidaritySettings, newRequirement) => {
  const newRequirementKey = keys(newRequirement)

  return {
    ...solidaritySettings,
    requirements: {
      ...solidaritySettings.requirements,
      [newRequirementKey]:
        reject(isNil, append(
          solidaritySettings.requirements[newRequirementKey][0],
          newRequirement[newRequirementKey]
        ))
    }
  }
}
