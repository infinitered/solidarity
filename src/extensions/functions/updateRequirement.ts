import { SolidarityRequirement, SolidarityRunContext } from '../../types'

module.exports = async (
  requirement: SolidarityRequirement,
  settings: object,
  context: SolidarityRunContext
): Promise<void | object[]> => {
  const findPluginInfo = require('./findPluginInfo')
  const { head, tail, pipe, flatten, map } = require('ramda')
  const checkCLIForUpdates = require('./checkCLIForUpdates')
  const skipRule = require('./skipRule')

  const { print } = context
  const requirementName = head(requirement)
  const rules = pipe(
    tail,
    flatten
  )(requirement)

  let ruleString = ''
  const spinner = print.spin(`Updating ${requirementName}`)

  // check each rule for requirement
  const ruleChecks = await map(async rule => {
    // skip if we can't update
    if (skipRule(rule)) return []
    switch (rule.rule) {
      // Handle CLI rule update
      case 'cli':
        if (!rule.semver) return []
        let updateResult
        try {
          updateResult = await checkCLIForUpdates(rule, context)
        } catch (e) {
          spinner.fail(e)
          return []
        }
        const lineMessage = rule.line ? ` line ${rule.line} at` : ''
        ruleString = `Keep ${rule.binary}${lineMessage} ${rule.semver}`
        if (updateResult) {
          spinner.succeed(updateResult)
          return updateResult
        } else {
          spinner.succeed(ruleString)
          return []
        }
      case 'custom':
        const customPluginRule = findPluginInfo(rule, context)
        if (customPluginRule.success) {
          // if they didn't implement a snapshot, then do nothing
          if (!customPluginRule.plugin.snapshot) return []
          const customResult = await customPluginRule.plugin.snapshot(rule, context)
          const changes = customResult.map(patch => {
            rule[patch.prop] = patch.value
            return `'${patch.prop}' to '${patch.value}'`
          })

          // report changes
          if (changes.length > 0) {
            const message = `Setting ${rule.name} ${changes.join(', ')}`
            spinner.succeed(print.colors.green(message))
            return message
          } else {
            return []
          }
        } else {
          spinner.fail(customPluginRule.message)
          return customPluginRule.message
        }
      default:
        return []
    }
  }, rules)

  // Run all the rule checks for a requirement
  return Promise.all(ruleChecks)
    .then(results => {
      spinner.stop()
      return results
    })
    .catch(err => print.error(err))
}
