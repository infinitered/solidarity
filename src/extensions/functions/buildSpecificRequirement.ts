import { SolidarityRunContext, SolidaritySettings } from '../../types'
import { keys } from 'ramda'

namespace buildSpecificRequirement {
  const resolveParameters = async ({ parameters, prompt }) => {
    const { first, second } = parameters
    if (second) { return Promise.resolve(second) }

    const response = await prompt.ask({
      name: 'whatRule',
      type: 'input',
      message: `What's the name of the ${first} you'd like to add a rule for?`
    })

    return response.whatRule
  }

  const buildCliRequirement = async (context, requirementName) => {
    const { parameters, solidarity, prompt, print } = context
    const { getVersion } = solidarity

    const rule = parameters.first
    const binary = parameters.second
    const requirement = {
      [requirementName]: [{
        rule,
        binary
      }]
    }

    const userAnswer = await prompt.ask({
      name: 'enforceVersion',
      type: 'confirm',
      message: 'Would you like to enforce a version requirement?'
    })

    if (userAnswer.enforceVersion) {
      return await getVersion(requirement[requirementName][0], context)
        .then((sysVersion) => {
          print.info(`Your system currently has version ${sysVersion}`)
          print.info(`Semver requirement for '${binary}' binary : ^${sysVersion}`)
          requirement[requirementName][0]['semver'] = sysVersion

          return requirement
        })
        .catch(() => {
          print.error('Seems as though you do not have this binary installed. Please install this binary first')
        })
    }

    return requirement
  }

  const buildEnvRequirement = (context, requirementName) => {
    const { parameters } = context

    const rule = parameters.first
    const variable = parameters.second

    return {
      [requirementName]: [{
        rule,
        variable
      }]
    }
  }

  const buildFileRequirement = (context, requirementName) => {
    const { parameters } = context

    const rule = parameters.first
    const location = parameters.second

    return {
      [requirementName]: [{
        rule,
        location
      }]
    }
  }

  const buildShellRequirement = async (context, requirementName) => {
    const { parameters, prompt } = context

    const rule = parameters.first
    const shellCommand = parameters.second

    if (rule && shellCommand) {
      const response = await prompt.ask({
        name: 'shellMatch',
        type: 'input',
        message: 'What would you like the shell command to match on?'
      })

      return {
        [requirementName]: [{
          rule,
          command: shellCommand,
          match: response.shallMatch
        }]
      }
    }
  }

  const ruleHandlers = {
    cli: buildCliRequirement,
    env: buildEnvRequirement,
    file: buildFileRequirement,
    dir: buildFileRequirement,
    shell: buildShellRequirement
  }

  const getRequirementNames = (solidaritySettings: SolidaritySettings): String => keys(solidaritySettings.requirements)

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
    const { getSolidaritySettings } = solidarity
    const solidaritySettings = getSolidaritySettings(context)

    const userAnswer = await prompt.ask({
      name: 'addNewRule',
      type: 'confirm',
      message: `Would you like to add the ${parameters.first} '${parameters.second}' to your Solidarity file?`
    })

    if (userAnswer.addNewRule) {
      // maybe ask about setting up the new rule w/ a specific version?
      const requirementName = await chooseRequirement(prompt, solidaritySettings)
      return ruleHandlers[parameters.first](context, requirementName)
    } else {
      return Promise.reject('Rule not added.')
    }
  }

  export const run = async (context: SolidarityRunContext) => {
    const { parameters, prompt, solidarity } = context
    const { first } = parameters
    const second = await resolveParameters({ parameters, prompt })

    return await constructRequirment({
      ...context,
      parameters: {
        ...parameters,
        first, second
      }
    })
  }
}

module.exports = buildSpecificRequirement.run
