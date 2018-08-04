import { SolidarityRunContext, SolidaritySettings } from '../../types'
import { keys } from 'ramda'

namespace buildSpecificRequirement {
  const requiredInputQuestion = async ({ name, message, prompt }) => {
    const result = await prompt.ask({
      name,
      type: 'input',
      message,
    })

    if (!result[name]) return Promise.reject('An input is required')
    return result
  }

  const resolveParameters = async ({ parameters, prompt, ruleHandlers }) => {
    const { first, second } = parameters
    if (second) {
      return Promise.resolve({ whatRule: second })
    }

    const message = `What's the ${first} ${ruleHandlers[first].key} you'd like to add a rule for?`

    return requiredInputQuestion({
      name: 'whatRule',
      message,
      prompt,
    })
  }

  const getRequirementNames = (solidaritySettings: SolidaritySettings): Array<string> =>
    keys(solidaritySettings.requirements)

  const chooseRequirement = async (prompt, solidaritySettings: SolidaritySettings): Promise<String> => {
    const shouldMakeNewRequirement = await prompt.ask({
      name: 'makeNewRequirement',
      type: 'confirm',
      message: 'Would you like to create a new requirement set?',
    })

    let requirementName

    if (shouldMakeNewRequirement.makeNewRequirement) {
      const answer = await requiredInputQuestion({
        name: 'newRequirement',
        message: 'What would you like to call this new requirement?',
        prompt,
      }).catch(error => {
        return Promise.reject(error)
      })
      requirementName = answer.newRequirement
    } else {
      const requirementOptions = getRequirementNames(solidaritySettings)
      const answer = await prompt.ask({
        name: 'selectedRequirement',
        message: 'Which of the above technology snapshots will you use for this project?',
        type: 'list',
        choices: requirementOptions,
      })
      requirementName = answer.selectedRequirement
    }

    return requirementName
  }

  const constructRequirment = async context => {
    const { parameters, prompt, solidarity } = context
    const { getSolidaritySettings, ruleHandlers } = solidarity
    const solidaritySettings = await getSolidaritySettings(context)

    const userAnswer = await prompt.ask({
      name: 'addNewRule',
      type: 'confirm',
      message: `Would you like to add the ${parameters.first} '${parameters.second}' to your Solidarity file?`,
    })

    if (userAnswer.addNewRule) {
      // maybe ask about setting up the new rule w/ a specific version?
      const requirementName = await chooseRequirement(prompt, solidaritySettings)
      return ruleHandlers[parameters.first].callback(context, requirementName)
    } else {
      return Promise.reject('Rule not added.')
    }
  }

  export const run = async (context: SolidarityRunContext) => {
    const { parameters, prompt, solidarity } = context
    const { first } = parameters
    const { ruleHandlers } = solidarity
    const resolvedParam = await resolveParameters({ parameters, prompt, ruleHandlers }).catch(() => {
      return Promise.reject('Missing required parameters.')
    })

    return constructRequirment({
      ...context,
      parameters: {
        ...parameters,
        first,
        second: resolvedParam.whatRule,
      },
    })
  }
}

module.exports = buildSpecificRequirement.run
