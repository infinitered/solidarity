import { GluegunCommand, semver } from 'gluegun'
import { toPairs, flatten, filter } from 'ramda'
import { request } from 'http';

namespace Snapshot {
  const { propEq, filter, head } = require('ramda')
  const NONE = 'None'
  const DO_NOTHING = 'Nothing to do ¯\\_(ツ)_/¯'
  const runPluginSnapshot = async (runPlugin, context) => {
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

  const createSolidarityFile = async (context) => {
    const { print, printSeparator } = context
    // list visible plugins
    printSeparator()
    print.info('Available technology plugins:\n')
    if (context._pluginsList.length > 0) {
      const pluginOptions = [NONE]
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

      if (answer.selectedPlugin === NONE) {
        print.info(DO_NOTHING)
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

  const buildCliRequirement = async (context) => {
    const { parameters, solidarity, prompt, print } = context
    const { getVersion } = solidarity

    const rule = parameters.first
    const binary = parameters.second;
    const requirement = {
      [binary]: {
        rule,
        binary
      }
    }
    let semver;

    const userAnswer = await prompt.ask({
      name: 'enforceVersion',
      type: 'confirm',
      message: 'Would you like to enforce a version requirement?'
    })

    if (userAnswer.enforceVersion) {
      return await getVersion(requirement[binary], context)
        .then((sysVersion) => {
          print.info(`Your system currently has version ${sysVersion}`)
          print.info(`Semver requirement for '${binary}' binary : ^${sysVersion}`)
          requirement[binary]['semver'] = sysVersion

          return requirement
        })
        .catch(() => {
          print.error("Seems as though you do not have this binary istalled. Please install this binary first")
        })
    }

    return requirement
  }

  const buildEnvRequirement = (context) => {
    const { parameters } = context

    const rule = parameters.first
    const variable = parameters.second;

    return {
      [variable]: {
        rule,
        variable
      }
    }
  }

  const buildFileRequirement = (context) => {
    const { parameters } = context

    const rule = parameters.first
    const location = parameters.second;

    return {
      [location]: {
        rule,
        location
      }
    }
  }

  const ruleHandlers = {
    cli: buildCliRequirement,
    env: buildEnvRequirement,
    file: buildFileRequirement,
    dir: buildFileRequirement
  }

  const buildSpecifiedRequirment = async (context) => {
    const { parameters, print, prompt, solidarity } = context
    const { getSolidaritySettings, getVersion } = solidarity
    const solidaritySettings = getSolidaritySettings(context)

    if (hasRule(solidaritySettings, parameters)) {
      return Promise.reject("This binary already exists")
    } else {
      const userAnswer = await prompt.ask({
        name: 'addNewRule',
        type: 'confirm',
        message: `Would you like to add the ${parameters.first} '${parameters.second}' to your Solidarity file?`
      })

      if (userAnswer.addNewRule) {
        // maybe ask about setting up the new rule w/ a specific version?
        return await ruleHandlers[parameters.first](context)
      } else {
        return Promise.reject('Rule not added.')
      }
    }
  }

  const appendSolidaritySettings = (solidaritySettings, newRequirement) => {
    return {
      ...solidaritySettings,
      requirements: {
        ...solidaritySettings.requirements,
        ...newRequirement
      }
    }
  }

  export const run = async function (context) {
    const { print, prompt, filesystem, solidarity, parameters } = context
    const { first, second } = parameters;
    const { getSolidaritySettings, setSolidaritySettings } = solidarity

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
          .catch((error) => {
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
        print.info(DO_NOTHING)
      }
    }
  }
}

module.exports = {
  description: 'Take a snapshot of the versions and store in solidarity file',
  alias: 's',
  run: Snapshot.run
} as GluegunCommand
