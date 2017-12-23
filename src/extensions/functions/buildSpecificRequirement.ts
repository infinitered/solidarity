import { SolidarityRunContext, SolidaritySettings } from '../../types'
import { keys } from 'ramda'

namespace buildSpecificRequirement {
  const resolveParameters = async ({ parameters, prompt, ruleHandlers }) => {
    const { first, second } = parameters
    if (second) { return Promise.resolve(second) }

    const response = await prompt.ask({
      name: 'whatRule',
      type: 'input',
      message: `What's the ${first} ${ruleHandlers[first].key} you'd like to add a rule for?`
    })

    return response.whatRule
  }

  const getRequirementNames = (solidaritySettings: SolidaritySettings): Array<string> => keys(solidaritySettings.requirements)

  const chooseRequirement = async (prompt, solidaritySettings: SolidaritySettings): Promise<String> => {

    const shouldMakeNewRequirement = await prompt.ask({
      name: 'makeNewRequirement',
      type: 'confirm',
      message: 'Would you like to create a new requirement set?'
    })

    let requirementName

    if (shouldMakeNewRequirement.makeNewRequirement) {
      const answer = await prompt.ask({
        name: 'newRequirement',
        type: 'input',
        message: 'What would you like to call this new requirement?'
      })
      requirementName = answer.newRequirement
    } else {
      const requirementOptions = getRequirementNames(solidaritySettings)
      const answer = await prompt.ask({
        name: 'selectedRequirement',
        message: 'Which of the above technology snapshots will you use for this project?',
        type: 'list',
        choices: requirementOptions
      })
      requirementName = answer.selectedRequirement
    }

    return requirementName
  }

  const constructRequirment = async (context) => {
    const { parameters, prompt, solidarity } = context
    const { getSolidaritySettings, ruleHandlers } = solidarity
    const solidaritySettings = getSolidaritySettings(context)

    const userAnswer = await prompt.ask({
      name: 'addNewRule',
      type: 'confirm',
      message: `Would you like to add the ${parameters.first} '${parameters.second}' to your Solidarity file?`
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
    const second = await resolveParameters({ parameters, prompt, ruleHandlers })

    return constructRequirment({
      ...context,
      parameters: {
        ...parameters,
        first, second
      }
    })
  }
}

module.exports = buildSpecificRequirement.run
