import { SolidarityRule, SolidarityRequirementChunk, SolidarityRequirement, SolidarityRunContext } from '../../types'
const checkCLI = require('./checkCLI')
const checkENV = require('./checkENV')
const checkDir = require('./checkDir')
const checkFile = require('./checkFile')
const checkShell = require('./checkShell')
const skipRule = require('./skipRule')
const findPluginInfo = require('./findPluginInfo')

// Have to do this for tests rather than import
const Listr = require('listr')

module.exports = async (
  requirement: SolidarityRequirementChunk,
  context: SolidarityRunContext
): Promise<void | object[]> => {
  const { head, tail, pipe, flatten } = require('ramda')

  const requirementName: string = head(requirement)
  const rules: SolidarityRequirement = pipe(
    tail,
    flatten
  )(requirement)

  const configureSubtask = rule => {
    let subTask: Object = {}
    switch (rule.rule) {
      // Handle CLI rule check
      case 'cli':
        let ruleString = ''
        const semverRequirement = rule.semver || ''
        ruleString = `'${rule.binary}' binary ${semverRequirement}`
        subTask = {
          title: ruleString,
          skip: () => skipRule(rule),
          task: async () => checkCLI(rule, context),
        }
        break
      // Handle ENV rule check
      case 'env':
        subTask = {
          title: `${rule.variable} env`,
          skip: () => skipRule(rule),
          task: async () => checkENV(rule, context),
        }
        break
      // Handle dir rule check
      case 'directory':
      case 'dir':
        subTask = {
          title: `${rule.location} directory exists`,
          skip: () => skipRule(rule),
          task: async () => checkDir(rule, context),
        }
        break
      // Handle file rule check
      case 'file':
        subTask = {
          title: `${rule.location} file exists`,
          skip: () => skipRule(rule),
          task: async () => checkFile(rule, context),
        }
        break
      // Handle the shell rule
      case 'shell':
        subTask = {
          title: `'${rule.command}' matches '${rule.match}'`,
          skip: () => skipRule(rule),
          task: async () => checkShell(rule, context),
        }
        break
      case 'custom':
        const customPluginRule = findPluginInfo(rule, context)
        if (customPluginRule.success) {
          subTask = {
            title: `${requirementName} - custom rule '${rule.plugin}' '${rule.name}'`,
            // takes into account they didn't provide a check
            skip: () => skipRule(rule) || !customPluginRule.plugin.check,
            task: async () => {
              const customResult = await customPluginRule.plugin.check(rule, context)
              if (customResult && customResult.pass) {
                return true
              } else {
                const failMessage =
                  customResult && customResult.message
                    ? customResult.message
                    : `${requirementName} - custom rule '${rule.plugin}' '${rule.name}' failed`
                throw new Error(rule.error || failMessage)
              }
            },
          }
        } else {
          throw new Error(customPluginRule.message)
        }
        break
      default:
        throw new Error('Encountered unknown rule')
    }

    return subTask
  }

  // build Listr of ruleChecks
  const ruleChecks = new Listr(rules.map((rule: SolidarityRule) => configureSubtask(rule)))

  // Run all the rule checks for a requirement
  return ruleChecks
}
