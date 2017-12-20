import { SolidarityRequirement, SolidarityRunContext } from '../../types'
module.exports = async (
  requirement: SolidarityRequirement,
  settings: object,
  context: SolidarityRunContext
): Promise<void | object[]> => {
  const { head, tail, pipe, flatten, map } = require('ramda')
  const checkCLIForUpdates = require('./checkCLIForUpdates')
  const skipRule = require('./skipRule')

  const { print } = context
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)

  let ruleString = ''
  const spinner = print.spin(`Updating ${requirementName}`)

  // check each rule for requirement
  const ruleChecks = await map(async rule => {
    // skip if we can't update
    if (skipRule(rule.platform) || !rule.semver) return []
    switch (rule.rule) {
      // Handle CLI rule update
      case 'cli':
        const updateResult = await checkCLIForUpdates(rule, context)
        ruleString = `Keep ${rule.binary} ${rule.semver}`
        if (updateResult) {
          spinner.succeed(updateResult)
          return updateResult
        } else {
          spinner.succeed(ruleString)
          return []
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
