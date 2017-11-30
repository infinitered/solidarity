
import { GluegunCommand, GluegunRunContext } from 'gluegun'
import { toPairs, flatten, filter, keys, propEq, head } from 'ramda'

import { SolidaritySettings, FriendlyMessages, SolidarityRunContext } from '../types'

namespace Snapshot {
  const runPluginSnapshot = async (runPlugin, context: GluegunRunContext): Promise<void> => {
    if (typeof runPlugin.snapshot === 'string') {
      // Just a file copy
      const { filesystem, system } = context
      filesystem.copy(
        `${runPlugin.templateDirectory}${runPlugin.snapshot}`,
        '.solidarity'
      )
      // force local version update
      await system.run('solidarity snapshot')
    } else {
      // run plugin's snapshot function
      await runPlugin.snapshot(context)
    }
  }

  const createSolidarityFile = async (context: SolidarityRunContext): Promise<void> => {
    const { print, printSeparator } = context
    // list visible plugins
    printSeparator()
    print.info('Available technology plugins:\n')
    if (context._pluginsList.length > 0) {
      const pluginOptions: string[] = [FriendlyMessages.NONE]
      context._pluginsList.map((plugin) => {
        print.info(`   ${plugin.name}:\t ${plugin.description}`)
        pluginOptions.unshift(plugin.name)
      })
      printSeparator()
      const answer = await context.prompt.ask({
        name: 'selectedPlugin',
        message: 'Which of the above technology snapshots will you use for this project?',
        type: 'list',
        choices: pluginOptions
      })

      if (answer.selectedPlugin === FriendlyMessages.NONE) {
        print.info(FriendlyMessages.NOTHING)
      } else {
        const pluginSpinner = print.spin(`Running ${answer.selectedPlugin} Snapshot`)
        // Config for selected plugin only
        const runPlugin = head(filter(propEq('name', answer.selectedPlugin), context._pluginsList))
        // run plugin
        await runPluginSnapshot(runPlugin, context)
        pluginSpinner.succeed('Snapshot complete')
      }
    } else {
      print.error(`No solidarity plugins found!
      Add a plugin for a given technology:
      ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/pluginsList.md')}
      OR write your own plugin for generating rules:
      ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/plugins.md')}
      OR simply create a .solidarity rule-set by hand for this project:
      ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/options.md')}
      `)
      printSeparator()
    }
  }

  const findRule = (requirements, binary) => (
    flatten(toPairs(requirements))
      .filter((x) => x instanceof Object && binary === x.binary)
  )

  const hasRule = (solidaritySettings, parameters) => {
    const { second } = parameters
    const rule = findRule(solidaritySettings.requirements, second)

    return rule.length !== 0
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
          print.error('Seems as though you do not have this binary istalled. Please install this binary first')
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

  const ruleHandlers = {
    cli: buildCliRequirement,
    env: buildEnvRequirement,
    file: buildFileRequirement,
    dir: buildFileRequirement
  }

  const getRequirementNames = (solidaritySettings: SolidaritySettings): String => keys(solidaritySettings.requirements)

  const chooseRequirement = async (prompt, solidaritySettings: SolidaritySettings): Promise<String> => {
    return prompt.ask({
      name: 'makeNewRequirement',
      type: 'confirm',
      message: 'Would you like to create a new requirement set?'
    }).then(async ({ makeNewRequirement }) => {
      let requirementName
      if (makeNewRequirement) {
        const answer = await prompt.ask({
          name: 'newRequirement',
          type: 'question',
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
    })
  }

  const buildSpecifiedRequirment = async (context) => {
    const { parameters, prompt, solidarity } = context
    const { getSolidaritySettings } = solidarity
    const solidaritySettings = getSolidaritySettings(context)

    if (hasRule(solidaritySettings, parameters)) {
      return Promise.reject('This binary already exists')
    } else {
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
  }

  export const run = async function (context: SolidarityRunContext) {
    const { print, prompt, filesystem, solidarity, parameters } = context
    const { first, second } = parameters
    const { getSolidaritySettings, setSolidaritySettings, appendSolidaritySettings } = solidarity

    // check is there an existing .solidarity file?
    if (filesystem.exists('.solidarity')) {
      // load existing file and update rule versions

      if (first && second) {
        await buildSpecifiedRequirment(context)
          .then((newRequirement) => {
            const solidaritySettings = getSolidaritySettings(context)
            const updatedSolidaritySettings = appendSolidaritySettings(solidaritySettings, newRequirement)
            setSolidaritySettings(updatedSolidaritySettings, context)
          })
          .catch(() => {
            print.error('Your new requirement was not added.')
          })
      } else {
        print.info('Now loading latest environment')
        solidarity.updateVersions(context)
      }
    } else {
      // Find out what they wanted
      const userAnswer = await prompt.ask({
        name: 'createFile',
        type: 'confirm',
        message: 'No `.solidarity` file found for this project.  Would you like to create one?'
      })

      if (userAnswer.createFile) {
        await createSolidarityFile(context)
      } else {
        print.info(FriendlyMessages.NOTHING)
      }
    }
  }
}

module.exports = {
  description: 'Take a snapshot of the versions and store in solidarity file',
  alias: 's',
  run: Snapshot.run
} as GluegunCommand
