import { keys, propEq, filter, pipe, merge, findIndex, update } from 'ramda'

const appendNewRequirement = (solidaritySettings, existingRequirementRules, newRequirement, newRequirementKey) => {
  return {
    ...solidaritySettings,
    requirements: {
      ...solidaritySettings.requirements,
      [newRequirementKey]: [...existingRequirementRules, ...newRequirement[newRequirementKey]],
    },
  }
}

const updateExistingRule = (solidaritySettings, updatedRequirementRules, newRequirement, newRequirementKey) => {
  return {
    ...solidaritySettings,
    requirements: {
      ...solidaritySettings.requirements,
      [newRequirementKey]: updatedRequirementRules,
    },
  }
}

module.exports = async (context, newRequirement) => {
  const { solidarity, parameters } = context
  const { getSolidaritySettings, ruleHandlers } = solidarity
  const { first } = parameters

  const solidaritySettings = await getSolidaritySettings(context)

  const newRequirementKey = keys(newRequirement)[0]
  const existingRequirementRules = solidaritySettings.requirements[newRequirementKey] || []

  let existingRule
  let existingRuleIndex = -1

  if (existingRequirementRules.length) {
    const primaryRuleKey = ruleHandlers[first].key
    const filterFunction = pipe(
      obj => propEq('rule', first),
      obj => propEq(primaryRuleKey, newRequirement[newRequirementKey][0][primaryRuleKey])
    )
    // @ts-ignore - filterFunction not playing well with filter.
    existingRule = filter(filterFunction, existingRequirementRules)
    existingRuleIndex = findIndex(
      propEq(primaryRuleKey, newRequirement[newRequirementKey][0][primaryRuleKey]),
      existingRequirementRules
    )
  }

  if (existingRule && existingRule[0] && existingRuleIndex !== -1) {
    const updatedRule = merge(existingRule[existingRuleIndex], newRequirement[newRequirementKey][0])
    const updatedRequirementRules = update(existingRuleIndex, updatedRule)(existingRequirementRules)

    return updateExistingRule(solidaritySettings, updatedRequirementRules, newRequirement, newRequirementKey)
  }

  return appendNewRequirement(solidaritySettings, existingRequirementRules, newRequirement, newRequirementKey)
}
